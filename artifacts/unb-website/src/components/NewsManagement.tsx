import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSettings } from "@/contexts/SettingsContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Pencil, Plus, Save, Trash2, Upload, ArrowUp, ArrowDown } from "lucide-react";
import { DEFAULT_NEWS_CONTENT, type NewsBlock, type NewsContent, type NewsPost } from "@/tabs/NewsTab";

const makeId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now());

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const readAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("File read failed"));
    reader.readAsDataURL(file);
  });

const uploadOrDataUrl = async (file: File) => {
  try {
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/site-settings/upload", { method: "POST", body });
    if (!res.ok) throw new Error();
    const data = await res.json();
    if (data?.url && typeof data.url === "string") return data.url as string;
    throw new Error();
  } catch {
    return await readAsDataUrl(file);
  }
};

export default function NewsManagement() {
  const { toast } = useToast();
  const { settings, updateSettings, isLoading: isSettingsLoading } = useSettings();
  const [isSaving, setIsSaving] = useState(false);

  const [activeTab, setActiveTab] = useState<"posts" | "categories">("posts");
  const [newsContent, setNewsContent] = useState<NewsContent>(DEFAULT_NEWS_CONTENT);

  const [newCategory, setNewCategory] = useState("");

  const [editingPost, setEditingPost] = useState<NewsPost | null>(null);
  const [isAddingPost, setIsAddingPost] = useState(false);
  const [newPost, setNewPost] = useState<NewsPost>({
    id: "",
    title: "",
    slug: "",
    excerpt: "",
    category: DEFAULT_NEWS_CONTENT.categories[0] ?? "Umum",
    bannerUrl: "",
    author: "",
    publishedAt: new Date().toISOString().slice(0, 10),
    blocks: [{ id: "block-1", type: "paragraph", text: "" }],
  });

  const bannerFileRef = useRef<HTMLInputElement | null>(null);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  const blockImageFileRef = useRef<HTMLInputElement | null>(null);
  const [uploadTargetBlockId, setUploadTargetBlockId] = useState<string | null>(null);
  const [isUploadingBlockImage, setIsUploadingBlockImage] = useState(false);

  const normalized = useMemo<NewsContent>(() => {
    const raw = (settings as any).newsContent;
    if (!raw || typeof raw !== "object") return DEFAULT_NEWS_CONTENT;
    const categories = Array.isArray(raw.categories) ? raw.categories.filter((x: any) => typeof x === "string" && x.trim()) : DEFAULT_NEWS_CONTENT.categories;
    const posts = Array.isArray(raw.posts) ? raw.posts : DEFAULT_NEWS_CONTENT.posts;
    return { categories: categories.length ? categories : DEFAULT_NEWS_CONTENT.categories, posts };
  }, [settings]);

  useEffect(() => {
    setNewsContent(normalized);
  }, [normalized]);

  const handleSaveAll = async () => {
    try {
      setIsSaving(true);
      await updateSettings("newsContent", newsContent);
      toast({ title: "Berhasil", description: "Berita tersimpan." });
    } catch (error) {
      toast({ variant: "destructive", title: "Gagal menyimpan", description: "Terjadi kesalahan pada server." });
    } finally {
      setIsSaving(false);
    }
  };

  const addCategory = () => {
    const value = newCategory.trim();
    if (!value) return;
    if (newsContent.categories.some((c) => c.toLowerCase() === value.toLowerCase())) {
      setNewCategory("");
      return;
    }
    setNewsContent({ ...newsContent, categories: [...newsContent.categories, value] });
    setNewCategory("");
  };

  const deleteCategory = (value: string) => {
    if (!confirm("Yakin ingin menghapus kategori ini?")) return;
    const nextCategories = newsContent.categories.filter((c) => c !== value);
    const fallback = nextCategories[0] ?? "Umum";
    const nextPosts = newsContent.posts.map((p) => (p.category === value ? { ...p, category: fallback } : p));
    setNewsContent({ categories: nextCategories.length ? nextCategories : ["Umum"], posts: nextPosts });
  };

  const openAddPost = () => {
    const category = newsContent.categories[0] ?? "Umum";
    setNewPost({
      id: makeId(),
      title: "",
      slug: "",
      excerpt: "",
      category,
      bannerUrl: "",
      author: "",
      publishedAt: new Date().toISOString().slice(0, 10),
      blocks: [{ id: makeId(), type: "paragraph", text: "" }],
    });
    setIsAddingPost(true);
  };

  const openEditPost = (post: NewsPost) => {
    setEditingPost(post);
  };

  const deletePost = (id: string) => {
    if (!confirm("Yakin ingin menghapus berita ini?")) return;
    setNewsContent({ ...newsContent, posts: newsContent.posts.filter((p) => p.id !== id) });
    toast({ title: "Berhasil", description: "Berita dihapus. Klik Simpan Perubahan." });
  };

  const upsertPost = (post: NewsPost) => {
    const exists = newsContent.posts.some((p) => p.id === post.id);
    const slug = post.slug?.trim() ? post.slug.trim() : slugify(post.title);
    const normalizedPost = { ...post, slug };
    if (!exists) {
      setNewsContent({ ...newsContent, posts: [normalizedPost, ...newsContent.posts] });
      return;
    }
    setNewsContent({ ...newsContent, posts: newsContent.posts.map((p) => (p.id === post.id ? normalizedPost : p)) });
  };

  const updateDraft = (setter: (next: NewsPost) => void) => {
    if (isAddingPost) setter(newPost);
    else if (editingPost) setter(editingPost);
  };

  const setDraft = (next: NewsPost) => {
    if (isAddingPost) setNewPost(next);
    else setEditingPost(next);
  };

  const handlePickBannerFile = () => {
    bannerFileRef.current?.click();
  };

  const handleBannerFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      setIsUploadingBanner(true);
      const url = await uploadOrDataUrl(file);
      updateDraft((draft) => setDraft({ ...draft, bannerUrl: url }));
      toast({ title: "Berhasil", description: "Banner berhasil diupload." });
    } catch (error) {
      toast({ variant: "destructive", title: "Gagal upload", description: "Upload banner gagal." });
    } finally {
      setIsUploadingBanner(false);
    }
  };

  const addBlock = (type: NewsBlock["type"]) => {
    const id = makeId();
    const base: any = { id, type };
    if (type === "link") base.label = "Buka Link", base.url = "";
    if (type === "image") base.url = "", base.caption = "";
    if (type === "heading" || type === "subheading" || type === "paragraph") base.text = "";
    updateDraft((draft) => setDraft({ ...draft, blocks: [...draft.blocks, base as NewsBlock] }));
  };

  const updateBlock = (blockId: string, patch: Partial<NewsBlock>) => {
    updateDraft((draft) => setDraft({ ...draft, blocks: draft.blocks.map((b) => (b.id === blockId ? ({ ...b, ...patch } as any) : b)) }));
  };

  const deleteBlock = (blockId: string) => {
    updateDraft((draft) => setDraft({ ...draft, blocks: draft.blocks.filter((b) => b.id !== blockId) }));
  };

  const moveBlock = (blockId: string, dir: -1 | 1) => {
    updateDraft((draft) => {
      const idx = draft.blocks.findIndex((b) => b.id === blockId);
      const nextIdx = idx + dir;
      if (idx < 0 || nextIdx < 0 || nextIdx >= draft.blocks.length) return;
      const next = [...draft.blocks];
      const temp = next[idx];
      next[idx] = next[nextIdx];
      next[nextIdx] = temp;
      setDraft({ ...draft, blocks: next });
    });
  };

  const openUploadForImageBlock = (blockId: string) => {
    setUploadTargetBlockId(blockId);
    blockImageFileRef.current?.click();
  };

  const handleBlockImageFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!uploadTargetBlockId) return;
    try {
      setIsUploadingBlockImage(true);
      const url = await uploadOrDataUrl(file);
      updateBlock(uploadTargetBlockId, { url } as any);
      toast({ title: "Berhasil", description: "Gambar berhasil diupload." });
    } catch (error) {
      toast({ variant: "destructive", title: "Gagal upload", description: "Upload gambar gagal." });
    } finally {
      setIsUploadingBlockImage(false);
      setUploadTargetBlockId(null);
    }
  };

  const closeEditor = () => {
    setIsAddingPost(false);
    setEditingPost(null);
  };

  const submitEditor = () => {
    const draft = isAddingPost ? newPost : editingPost;
    if (!draft) return;
    if (!draft.title.trim()) {
      toast({ variant: "destructive", title: "Judul wajib diisi" });
      return;
    }
    upsertPost(draft);
    closeEditor();
    toast({ title: "Berhasil", description: "Draft tersimpan. Klik Simpan Perubahan." });
  };

  if (isSettingsLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  const postsSorted = [...newsContent.posts].sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Kelola Berita</h2>
          <p className="text-slate-500 mt-1">Tambah, edit, dan publikasikan berita kampus.</p>
        </div>
        <Button
          onClick={handleSaveAll}
          disabled={isSaving}
          className="bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 rounded-xl px-6 h-11 gap-2"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Simpan Perubahan
        </Button>
      </div>

      <input ref={bannerFileRef} type="file" accept="image/*" className="hidden" onChange={handleBannerFileChange} />
      <input ref={blockImageFileRef} type="file" accept="image/*" className="hidden" onChange={handleBlockImageFileChange} />

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="bg-white dark:bg-[#1a1a1a] p-1 rounded-2xl border border-emerald-50 dark:border-emerald-900/10 mb-8 h-14">
          <TabsTrigger value="posts" className="rounded-xl data-[state=active]:bg-emerald-500 data-[state=active]:text-white h-full px-6 gap-2">
            Berita
          </TabsTrigger>
          <TabsTrigger value="categories" className="rounded-xl data-[state=active]:bg-emerald-500 data-[state=active]:text-white h-full px-6 gap-2">
            Kategori
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold">Daftar Berita</h3>
              <p className="text-sm text-slate-500">Klik edit untuk mengubah konten berita.</p>
            </div>
            <Button onClick={openAddPost} className="bg-emerald-500 hover:bg-emerald-600 gap-2 rounded-xl">
              <Plus className="w-4 h-4" /> Tambah
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {postsSorted.map((p) => (
              <Card key={p.id} className="border-none shadow-sm bg-white dark:bg-[#1a1a1a] rounded-3xl overflow-hidden group">
                <div className="aspect-[16/10] bg-slate-200 relative">
                  {p.bannerUrl ? <img src={p.bannerUrl} className="w-full h-full object-cover" alt="" /> : null}
                  <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                    {p.category}
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button onClick={() => openEditPost(p)} size="icon" className="bg-white/90 hover:bg-white text-slate-800 rounded-lg h-8 w-8">
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button onClick={() => deletePost(p.id)} size="icon" className="bg-red-500/90 hover:bg-red-500 text-white rounded-lg h-8 w-8">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-5 space-y-1">
                  <div className="font-bold text-base line-clamp-2">{p.title}</div>
                  <div className="text-xs text-slate-500">{p.publishedAt} · {p.author || "—"}</div>
                  <div className="text-xs text-slate-500 line-clamp-2">{p.excerpt}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card className="border-none shadow-sm bg-white dark:bg-[#1a1a1a] rounded-3xl">
            <CardHeader>
              <CardTitle className="text-lg">Kategori</CardTitle>
              <CardDescription>Tambah kategori seperti Prestasi, Konferensi, Fakultas, Prodi, dll.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl" placeholder="Nama kategori" />
                <Button onClick={addCategory} className="bg-emerald-500 hover:bg-emerald-600 rounded-xl">Tambah</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {newsContent.categories.map((c) => (
                  <div key={c} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#252525]">
                    <div className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">{c}</div>
                    <button type="button" className="text-red-500 text-xs font-bold" onClick={() => deleteCategory(c)}>
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {(isAddingPost || editingPost) && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-4xl border-none shadow-2xl bg-white dark:bg-[#1a1a1a] rounded-3xl overflow-hidden">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle>{isAddingPost ? "Tambah Berita" : "Edit Berita"}</CardTitle>
                <CardDescription>Isi judul, banner, penulis, kategori, dan konten blok.</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button onClick={closeEditor} variant="ghost" className="rounded-xl">Batal</Button>
                <Button onClick={submitEditor} className="bg-emerald-500 hover:bg-emerald-600 rounded-xl">Simpan</Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6 max-h-[80vh] overflow-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Judul</label>
                  <Input
                    value={(isAddingPost ? newPost.title : (editingPost?.title ?? ""))}
                    onChange={(e) =>
                      updateDraft((draft) => {
                        const nextTitle = e.target.value;
                        const nextSlug = draft.slug?.trim() ? draft.slug : slugify(nextTitle);
                        setDraft({ ...draft, title: nextTitle, slug: nextSlug });
                      })
                    }
                    className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Slug</label>
                  <Input
                    value={(isAddingPost ? newPost.slug : (editingPost?.slug ?? ""))}
                    onChange={(e) => updateDraft((draft) => setDraft({ ...draft, slug: e.target.value }))}
                    className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Kategori</label>
                  <select
                    className="w-full bg-slate-50 dark:bg-[#252525] border-none rounded-xl px-3 h-11 text-sm"
                    value={isAddingPost ? newPost.category : (editingPost?.category ?? "")}
                    onChange={(e) => updateDraft((draft) => setDraft({ ...draft, category: e.target.value }))}
                  >
                    {newsContent.categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Penulis</label>
                  <Input
                    value={isAddingPost ? newPost.author : (editingPost?.author ?? "")}
                    onChange={(e) => updateDraft((draft) => setDraft({ ...draft, author: e.target.value }))}
                    className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tanggal</label>
                  <Input
                    type="date"
                    value={isAddingPost ? newPost.publishedAt : (editingPost?.publishedAt ?? "")}
                    onChange={(e) => updateDraft((draft) => setDraft({ ...draft, publishedAt: e.target.value }))}
                    className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Banner URL</label>
                <div className="flex gap-2">
                  <Input
                    value={isAddingPost ? newPost.bannerUrl : (editingPost?.bannerUrl ?? "")}
                    onChange={(e) => updateDraft((draft) => setDraft({ ...draft, bannerUrl: e.target.value }))}
                    className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl flex-1"
                    placeholder="https://..."
                  />
                  <Button onClick={handlePickBannerFile} disabled={isUploadingBanner} variant="outline" className="rounded-xl gap-2">
                    {isUploadingBanner ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    Upload
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ringkasan</label>
                <Textarea
                  value={isAddingPost ? newPost.excerpt : (editingPost?.excerpt ?? "")}
                  onChange={(e) => updateDraft((draft) => setDraft({ ...draft, excerpt: e.target.value }))}
                  className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl min-h-[100px]"
                />
              </div>

              <Card className="border border-black/5 dark:border-white/10 rounded-3xl bg-white dark:bg-white/5">
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg">Konten Berita</CardTitle>
                    <CardDescription>Tambah blok: Text Judul, Sub Judul, Keterangan, Link, Gambar.</CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-end">
                    <Button type="button" onClick={() => addBlock("heading")} variant="outline" className="rounded-xl">Text Judul</Button>
                    <Button type="button" onClick={() => addBlock("subheading")} variant="outline" className="rounded-xl">Sub Judul</Button>
                    <Button type="button" onClick={() => addBlock("paragraph")} variant="outline" className="rounded-xl">Keterangan</Button>
                    <Button type="button" onClick={() => addBlock("link")} variant="outline" className="rounded-xl">Link</Button>
                    <Button type="button" onClick={() => addBlock("image")} variant="outline" className="rounded-xl">Gambar</Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(isAddingPost ? newPost.blocks : (editingPost?.blocks ?? [])).map((block, index) => (
                    <div key={block.id} className="rounded-2xl border border-black/5 dark:border-white/10 bg-slate-50 dark:bg-[#252525] p-4 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
                          {block.type} · {index + 1}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button type="button" size="icon" variant="outline" className="rounded-xl h-9 w-9" onClick={() => moveBlock(block.id, -1)} disabled={index === 0}>
                            <ArrowUp className="w-4 h-4" />
                          </Button>
                          <Button type="button" size="icon" variant="outline" className="rounded-xl h-9 w-9" onClick={() => moveBlock(block.id, 1)} disabled={index === (isAddingPost ? newPost.blocks.length : (editingPost?.blocks.length ?? 0)) - 1}>
                            <ArrowDown className="w-4 h-4" />
                          </Button>
                          <Button type="button" size="icon" variant="destructive" className="rounded-xl h-9 w-9" onClick={() => deleteBlock(block.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {(block.type === "heading" || block.type === "subheading" || block.type === "paragraph") && (
                        <Textarea
                          value={(block as any).text ?? ""}
                          onChange={(e) => updateBlock(block.id, { text: e.target.value } as any)}
                          className="bg-white/70 dark:bg-black/10 border-none rounded-xl min-h-[90px]"
                          placeholder={block.type === "paragraph" ? "Keterangan..." : "Teks..."}
                        />
                      )}

                      {block.type === "link" && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                          <Input
                            value={(block as any).label ?? ""}
                            onChange={(e) => updateBlock(block.id, { label: e.target.value } as any)}
                            className="bg-white/70 dark:bg-black/10 border-none rounded-xl"
                            placeholder="Label link"
                          />
                          <Input
                            value={(block as any).url ?? ""}
                            onChange={(e) => updateBlock(block.id, { url: e.target.value } as any)}
                            className="bg-white/70 dark:bg-black/10 border-none rounded-xl"
                            placeholder="https://..."
                          />
                        </div>
                      )}

                      {block.type === "image" && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-2">
                            <Input
                              value={(block as any).url ?? ""}
                              onChange={(e) => updateBlock(block.id, { url: e.target.value } as any)}
                              className="bg-white/70 dark:bg-black/10 border-none rounded-xl"
                              placeholder="URL gambar"
                            />
                            <Button
                              type="button"
                              onClick={() => openUploadForImageBlock(block.id)}
                              disabled={isUploadingBlockImage && uploadTargetBlockId === block.id}
                              variant="outline"
                              className="rounded-xl gap-2"
                            >
                              {isUploadingBlockImage && uploadTargetBlockId === block.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Upload className="w-4 h-4" />
                              )}
                              Upload
                            </Button>
                          </div>
                          <Input
                            value={(block as any).caption ?? ""}
                            onChange={(e) => updateBlock(block.id, { caption: e.target.value } as any)}
                            className="bg-white/70 dark:bg-black/10 border-none rounded-xl"
                            placeholder="Caption (opsional)"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

