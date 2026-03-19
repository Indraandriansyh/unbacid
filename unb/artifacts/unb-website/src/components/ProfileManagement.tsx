import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  History, 
  Target, 
  Building2, 
  Plus, 
  Trash2, 
  Upload,
  Loader2,
  Save,
  PlusCircle,
  Pencil,
  Image as ImageIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/contexts/SettingsContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface Facility {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export default function ProfileManagement() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const { settings, updateSettings, isLoading: isSettingsLoading } = useSettings();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingSideImage, setIsUploadingSideImage] = useState(false);
  const sideImageFileInputRef = useRef<HTMLInputElement | null>(null);
  
  const defaultProfileContent = {
    title: t.about.title,
    subtitle: t.about.subtitle,
    historyText: t.about.historyText,
    visionText: t.about.visionText,
    missions: [t.about.m1, t.about.m2, t.about.m3].filter(Boolean),
    sideImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop",
    sideTitle: "Kampus UNB Bogor",
    sideSubtitle: "Jl. KH. Sholeh Iskandar KM.4",
    facilities: [
      {
        id: "fac-1",
        title: t.about.fac1,
        description: t.about.fac1desc,
        imageUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=600&auto=format&fit=crop",
      },
      {
        id: "fac-2",
        title: t.about.fac2,
        description: t.about.fac2desc,
        imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=600&auto=format&fit=crop",
      },
      {
        id: "fac-3",
        title: t.about.fac3,
        description: t.about.fac3desc,
        imageUrl: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=600&auto=format&fit=crop",
      },
    ],
  };

  const [profileContent, setProfileContent] = useState<any>(defaultProfileContent);
  const [isAddingFacility, setIsAddingFacility] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [newFacility, setNewFacility] = useState<Omit<Facility, "id">>({ title: "", description: "", imageUrl: "" });

  const normalizeFacilities = (facilities: any): Facility[] => {
    if (!Array.isArray(facilities)) return [];
    return facilities
      .filter((f) => f && typeof f === "object")
      .map((f) => {
        const id =
          typeof f.id === "string"
            ? f.id
            : typeof crypto !== "undefined" && "randomUUID" in crypto
              ? crypto.randomUUID()
              : String(Date.now());
        return {
          id,
          title: typeof f.title === "string" ? f.title : "",
          description: typeof f.description === "string" ? f.description : "",
          imageUrl: typeof f.imageUrl === "string" ? f.imageUrl : "",
        };
      });
  };

  const normalizeProfileContent = (raw: any) => {
    if (!raw || typeof raw !== "object") return defaultProfileContent;

    if ("about" in raw || "visionMission" in raw) {
      return {
        ...defaultProfileContent,
        ...raw,
        title: raw.about?.title ?? defaultProfileContent.title,
        subtitle: raw.about?.subtitle ?? defaultProfileContent.subtitle,
        historyText: raw.history?.subtitle ?? raw.historyText ?? defaultProfileContent.historyText,
        visionText: raw.visionMission?.vision ?? raw.visionText ?? defaultProfileContent.visionText,
        missions: Array.isArray(raw.visionMission?.missions)
          ? raw.visionMission.missions
          : Array.isArray(raw.missions)
            ? raw.missions
            : defaultProfileContent.missions,
        sideImage: raw.visionMission?.sideImage ?? raw.sideImage ?? defaultProfileContent.sideImage,
        sideTitle: raw.visionMission?.sideTitle ?? raw.sideTitle ?? defaultProfileContent.sideTitle,
        sideSubtitle: raw.visionMission?.sideSubtitle ?? raw.sideSubtitle ?? defaultProfileContent.sideSubtitle,
        facilities: normalizeFacilities(raw.facilities).length ? normalizeFacilities(raw.facilities) : defaultProfileContent.facilities,
      };
    }

    const facilities = normalizeFacilities(raw.facilities);
    return {
      ...defaultProfileContent,
      ...raw,
      missions: Array.isArray(raw.missions) ? raw.missions : defaultProfileContent.missions,
      facilities: facilities.length ? facilities : defaultProfileContent.facilities,
    };
  };

  useEffect(() => {
    setIsLoading(true);
    const data = settings.profileContent ? normalizeProfileContent(settings.profileContent) : defaultProfileContent;
    setProfileContent(data);
    setIsLoading(false);
  }, [settings.profileContent, t.about]);

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      await updateSettings("profileContent", profileContent);
      toast({ title: "Berhasil", description: "Konten profil telah diperbarui." });
    } catch (error) {
      toast({ variant: "destructive", title: "Gagal menyimpan", description: "Terjadi kesalahan pada server." });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePickSideImageFile = () => {
    sideImageFileInputRef.current?.click();
  };

  const handleSideImageFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      setIsUploadingSideImage(true);
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/site-settings/upload", {
        method: "POST",
        body,
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProfileContent({ ...profileContent, sideImage: data.url });
      toast({ title: "Berhasil", description: "Gambar berhasil diupload. Klik Simpan Perubahan." });
    } catch (error) {
      try {
        const reader = new FileReader();
        const dataUrl = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(String(reader.result ?? ""));
          reader.onerror = () => reject(new Error("File read failed"));
          reader.readAsDataURL(file);
        });
        setProfileContent({ ...profileContent, sideImage: dataUrl });
        toast({ title: "Berhasil", description: "Gambar dipakai sebagai data lokal. Klik Simpan Perubahan." });
      } catch {
        toast({ variant: "destructive", title: "Gagal upload", description: "Upload gambar gagal." });
      }
    } finally {
      setIsUploadingSideImage(false);
    }
  };

  const handleAddMission = () => {
    setProfileContent({
      ...profileContent,
      missions: [...(profileContent.missions ?? []), ""],
    });
  };

  const handleUpdateMission = (index: number, value: string) => {
    const newMissions = [...(profileContent.missions ?? [])];
    newMissions[index] = value;
    setProfileContent({
      ...profileContent,
      missions: newMissions,
    });
  };

  const handleRemoveMission = (index: number) => {
    const newMissions = (profileContent.missions ?? []).filter((_: any, i: number) => i !== index);
    setProfileContent({
      ...profileContent,
      missions: newMissions,
    });
  };

  const handleAddFacility = () => {
    const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now());
    const next: Facility = { id, ...newFacility };
    setProfileContent({
      ...profileContent,
      facilities: [...(profileContent.facilities ?? []), next],
    });
    setNewFacility({ title: "", description: "", imageUrl: "" });
    setIsAddingFacility(false);
    toast({ title: "Berhasil", description: "Fasilitas baru ditambahkan. Klik Simpan Perubahan." });
  };

  const handleUpdateFacility = () => {
    if (!editingFacility) return;
    const updatedFacilities = (profileContent.facilities ?? []).map((f: Facility) =>
      f.id === editingFacility.id ? editingFacility : f,
    );
    setProfileContent({ ...profileContent, facilities: updatedFacilities });
    setEditingFacility(null);
    toast({ title: "Berhasil", description: "Fasilitas diperbarui. Klik Simpan Perubahan." });
  };

  const handleDeleteFacility = (id: string) => {
    if (!confirm("Yakin ingin menghapus fasilitas ini?")) return;
    setProfileContent({
      ...profileContent,
      facilities: (profileContent.facilities ?? []).filter((f: Facility) => f.id !== id),
    });
    toast({ title: "Berhasil", description: "Fasilitas dihapus. Klik Simpan Perubahan." });
  };

  if (isLoading || isSettingsLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Kelola Halaman Profil</h2>
          <p className="text-slate-500 mt-1">Sesuaikan konten yang tampil di halaman profil (Tentang Kami, Visi Misi, dll).</p>
        </div>
        <Button 
          onClick={handleSaveProfile}
          disabled={isSaving}
          className="bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 rounded-xl px-6 h-11 gap-2"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Simpan Perubahan
        </Button>
      </div>

      <Tabs defaultValue="about" className="w-full">
        <TabsList className="bg-white dark:bg-[#1a1a1a] p-1 rounded-2xl border border-emerald-50 dark:border-emerald-900/10 mb-8 h-14">
          <TabsTrigger value="about" className="rounded-xl data-[state=active]:bg-emerald-500 data-[state=active]:text-white h-full px-6 gap-2">
            <FileText className="w-4 h-4" /> Tentang Kami
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-xl data-[state=active]:bg-emerald-500 data-[state=active]:text-white h-full px-6 gap-2">
            <History className="w-4 h-4" /> Sejarah
          </TabsTrigger>
          <TabsTrigger value="vision" className="rounded-xl data-[state=active]:bg-emerald-500 data-[state=active]:text-white h-full px-6 gap-2">
            <Target className="w-4 h-4" /> Visi & Misi
          </TabsTrigger>
          <TabsTrigger value="facilities" className="rounded-xl data-[state=active]:bg-emerald-500 data-[state=active]:text-white h-full px-6 gap-2">
            <Building2 className="w-4 h-4" /> Fasilitas
          </TabsTrigger>
        </TabsList>

        {/* ABOUT TAB */}
        <TabsContent value="about" className="space-y-6">
          <Card className="border-none shadow-sm bg-white dark:bg-[#1a1a1a] rounded-3xl">
            <CardHeader>
              <CardTitle>Bagian Tentang Kami</CardTitle>
              <CardDescription>Ubah judul utama dan deskripsi singkat di halaman profil.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Judul</label>
                <Input 
                  value={profileContent.title ?? ""}
                  onChange={(e) => setProfileContent({ ...profileContent, title: e.target.value })}
                  className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl"
                  placeholder="Contoh: TENTANG KAMI"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sub-judul / Deskripsi</label>
                <Textarea 
                  value={profileContent.subtitle ?? ""}
                  onChange={(e) => setProfileContent({ ...profileContent, subtitle: e.target.value })}
                  className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl min-h-[100px]"
                  placeholder="Masukkan deskripsi tentang kampus..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* HISTORY TAB */}
        <TabsContent value="history" className="space-y-6">
          <Card className="border-none shadow-sm bg-white dark:bg-[#1a1a1a] rounded-3xl">
            <CardHeader>
              <CardTitle>Bagian Sejarah</CardTitle>
              <CardDescription>Ubah teks pengantar untuk sejarah kampus.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Teks Sejarah</label>
                <Textarea 
                  value={profileContent.historyText ?? ""}
                  onChange={(e) => setProfileContent({ ...profileContent, historyText: e.target.value })}
                  className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl min-h-[140px]"
                  placeholder="Masukkan teks pengantar sejarah..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* VISION & MISSION TAB */}
        <TabsContent value="vision" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-none shadow-sm bg-white dark:bg-[#1a1a1a] rounded-3xl">
              <CardHeader>
                <CardTitle>Visi & Misi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Visi Kami</label>
                  <Textarea 
                    value={profileContent.visionText ?? ""}
                    onChange={(e) => setProfileContent({ ...profileContent, visionText: e.target.value })}
                    className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl min-h-[80px]"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Poin-poin Misi</label>
                    <Button onClick={handleAddMission} size="sm" variant="ghost" className="text-emerald-500 hover:text-emerald-600 gap-1">
                      <PlusCircle className="w-4 h-4" /> Tambah Misi
                    </Button>
                  </div>
                  {(profileContent.missions ?? []).map((mission: string, idx: number) => (
                    <div key={idx} className="flex gap-2">
                      <Input 
                        value={mission}
                        onChange={(e) => handleUpdateMission(idx, e.target.value)}
                        className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl"
                        placeholder={`Misi ${idx + 1}`}
                      />
                      <Button onClick={() => handleRemoveMission(idx)} size="icon" variant="ghost" className="text-red-500 shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white dark:bg-[#1a1a1a] rounded-3xl">
              <CardHeader>
                <CardTitle>Konten Samping Visi Misi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Gambar Samping</label>
                  <input
                    ref={sideImageFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleSideImageFileChange}
                  />
                  <div className="aspect-video rounded-xl bg-slate-100 overflow-hidden mb-2">
                    {profileContent.sideImage ? (
                      <img src={profileContent.sideImage} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400"><ImageIcon className="w-8 h-8" /></div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input 
                      value={profileContent.sideImage ?? ""}
                      onChange={(e) => setProfileContent({ ...profileContent, sideImage: e.target.value })}
                      className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl text-xs flex-1"
                      placeholder="URL Gambar"
                    />
                    <Button
                      type="button"
                      onClick={handlePickSideImageFile}
                      disabled={isUploadingSideImage}
                      variant="outline"
                      className="rounded-xl gap-2"
                    >
                      {isUploadingSideImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      Upload
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Text (KAMPUS UNB BOGOR)</label>
                  <Input 
                    value={profileContent.sideTitle ?? ""}
                    onChange={(e) => setProfileContent({ ...profileContent, sideTitle: e.target.value })}
                    className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sub-judul Samping</label>
                  <Input 
                    value={profileContent.sideSubtitle ?? ""}
                    onChange={(e) => setProfileContent({ ...profileContent, sideSubtitle: e.target.value })}
                    className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* FACILITIES TAB */}
        <TabsContent value="facilities" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-bold">Kartu Fasilitas</h3>
              <p className="text-sm text-slate-500">Tambah, edit, atau hapus kartu fasilitas kami.</p>
            </div>
            <Button onClick={() => setIsAddingFacility(true)} className="bg-emerald-500 hover:bg-emerald-600 gap-2 rounded-xl">
              <Plus className="w-4 h-4" /> Tambah Fasilitas
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(profileContent.facilities ?? []).map((facility: Facility) => (
              <Card key={facility.id} className="border-none shadow-sm bg-white dark:bg-[#1a1a1a] rounded-3xl overflow-hidden group">
                <div className="aspect-video bg-slate-200 relative">
                  <img src={facility.imageUrl} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button onClick={() => setEditingFacility(facility)} size="icon" className="bg-white/90 hover:bg-white text-slate-800 rounded-lg h-8 w-8">
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button onClick={() => handleDeleteFacility(facility.id)} size="icon" className="bg-red-500/90 hover:bg-red-500 text-white rounded-lg h-8 w-8">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-5">
                  <h4 className="font-bold text-lg mb-1">{facility.title}</h4>
                  <p className="text-sm text-slate-500 line-clamp-2">{facility.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Modal/Overlay Tambah Fasilitas */}
          {(isAddingFacility || editingFacility) && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
              <Card className="w-full max-w-md border-none shadow-2xl bg-white dark:bg-[#1a1a1a] rounded-3xl">
                <CardHeader>
                  <CardTitle>{isAddingFacility ? "Tambah Fasilitas" : "Edit Fasilitas"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Judul Fasilitas</label>
                    <Input 
                      value={isAddingFacility ? newFacility.title : (editingFacility?.title ?? "")}
                      onChange={(e) => isAddingFacility ? setNewFacility({...newFacility, title: e.target.value}) : setEditingFacility({...(editingFacility as Facility), title: e.target.value})}
                      className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Deskripsi</label>
                    <Textarea 
                      value={isAddingFacility ? newFacility.description : (editingFacility?.description ?? "")}
                      onChange={(e) => isAddingFacility ? setNewFacility({...newFacility, description: e.target.value}) : setEditingFacility({...(editingFacility as Facility), description: e.target.value})}
                      className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl min-h-[80px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">URL Gambar</label>
                    <Input 
                      value={isAddingFacility ? newFacility.imageUrl : (editingFacility?.imageUrl ?? "")}
                      onChange={(e) => isAddingFacility ? setNewFacility({...newFacility, imageUrl: e.target.value}) : setEditingFacility({...(editingFacility as Facility), imageUrl: e.target.value})}
                      className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button onClick={() => isAddingFacility ? setIsAddingFacility(false) : setEditingFacility(null)} variant="ghost" className="flex-1 rounded-xl">Batal</Button>
                    <Button onClick={isAddingFacility ? handleAddFacility : handleUpdateFacility} className="flex-1 bg-emerald-500 hover:bg-emerald-600 rounded-xl">Simpan</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
