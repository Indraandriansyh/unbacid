import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSettings } from "@/contexts/SettingsContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Pencil, Plus, Save, Trash2, Upload } from "lucide-react";
import { ATAS_PIMPINAN_UNIVERSITAS, DEKAN, KEPALA_BIRO, PIMPINAN_DOSEN, PIMPINAN_UNIVERSITAS_INTI, STRUKTURAL } from "@/tabs/AboutTab";
import { DEFAULT_PUSDI_AGRATARU_CONTENT, type PusdiAgrataruContent, type PusdiAgrataruTenagaAhli } from "@/tabs/PusatStudiAgrataruTab";

type Person = {
  id: string;
  nama: string;
  fakultas: string;
  prodi: string;
  role: string;
  nidn: string;
  email?: string;
  photoUrl?: string;
};

type OrgItem = {
  id: string;
  jabatan: string;
  nama: string;
  icon: string;
  sub?: string;
  emerald?: boolean;
};

type OrgLabel = {
  id: string;
  label: string;
  icon: string;
};

type OrgStructure = {
  atasPimpinan: OrgLabel[];
  pimpinanInti: OrgItem[];
  wakilRektor: OrgItem[];
  dekan: OrgItem[];
  kepalaBiro: OrgItem[];
};

type BannerItem = { type: "image"; url: string };

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

const makeId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now());

export default function DataDosenManagement() {
  const { toast } = useToast();
  const { settings, updateSettings, isLoading: isSettingsLoading } = useSettings();
  const [isSaving, setIsSaving] = useState(false);

  const [activeTab, setActiveTab] = useState<"people" | "structure" | "pusdi">("people");
  const [people, setPeople] = useState<Person[]>([]);
  const [org, setOrg] = useState<OrgStructure>({
    atasPimpinan: [],
    pimpinanInti: [],
    wakilRektor: [],
    dekan: [],
    kepalaBiro: [],
  });
  const [pusdi, setPusdi] = useState<PusdiAgrataruContent>(DEFAULT_PUSDI_AGRATARU_CONTENT);

  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [isAddingPerson, setIsAddingPerson] = useState(false);
  const [newPerson, setNewPerson] = useState<Omit<Person, "id">>({
    nama: "",
    fakultas: "",
    prodi: "",
    role: "",
    nidn: "",
    email: "",
    photoUrl: "",
  });

  const [editingOrgItem, setEditingOrgItem] = useState<{ group: keyof OrgStructure; item: OrgItem } | null>(null);
  const [isAddingOrgItem, setIsAddingOrgItem] = useState<keyof OrgStructure | null>(null);
  const [newOrgItem, setNewOrgItem] = useState<Omit<OrgItem, "id">>({
    jabatan: "",
    nama: "",
    icon: "🎓",
    sub: "",
    emerald: false,
  });

  const personFileRef = useRef<HTMLInputElement | null>(null);
  const [uploadTargetPersonId, setUploadTargetPersonId] = useState<string | null>(null);
  const [isUploadingPersonPhoto, setIsUploadingPersonPhoto] = useState(false);

  const [isUploadingPusdiBanner, setIsUploadingPusdiBanner] = useState(false);
  const pusdiBannerFileRef = useRef<HTMLInputElement | null>(null);
  const [uploadTargetBannerIndex, setUploadTargetBannerIndex] = useState<number | null>(null);

  const [isUploadingTenagaAhliPhoto, setIsUploadingTenagaAhliPhoto] = useState(false);
  const tenagaAhliFileRef = useRef<HTMLInputElement | null>(null);
  const [uploadTargetTenagaAhliId, setUploadTargetTenagaAhliId] = useState<string | null>(null);

  const [editingTenagaAhli, setEditingTenagaAhli] = useState<PusdiAgrataruTenagaAhli | null>(null);
  const [isAddingTenagaAhli, setIsAddingTenagaAhli] = useState(false);
  const [newTenagaAhli, setNewTenagaAhli] = useState<Omit<PusdiAgrataruTenagaAhli, "id">>({ nama: "", bio: "", photoUrl: "" });

  const defaultPeopleAndOrg = useMemo(() => {
    const defaultPeople: Person[] = PIMPINAN_DOSEN.map((p, idx) => ({
      id: `p-${idx + 1}`,
      nama: p.nama,
      fakultas: p.fakultas,
      prodi: p.prodi,
      role: p.role,
      nidn: p.nidn,
      email: p.email ?? "",
      photoUrl: p.photoUrl ?? "",
    }));

    const defaultOrg: OrgStructure = {
      atasPimpinan: ATAS_PIMPINAN_UNIVERSITAS.map((x, idx) => ({ id: `top-${idx + 1}`, label: x.label, icon: x.icon })),
      pimpinanInti: PIMPINAN_UNIVERSITAS_INTI.map((x: any, idx: number) => ({ id: `core-${idx + 1}`, ...x })),
      wakilRektor: STRUKTURAL.slice(1).map((x: any, idx: number) => ({ id: `wr-${idx + 1}`, ...x })),
      dekan: DEKAN.map((x: any, idx: number) => ({ id: `dekan-${idx + 1}`, ...x })),
      kepalaBiro: KEPALA_BIRO.map((x: any, idx: number) => ({ id: `biro-${idx + 1}`, ...x })),
    };

    const profileContent = settings.profileContent ?? {};
    const mergedPeople = Array.isArray(profileContent.people) ? profileContent.people : defaultPeople;
    const mergedOrg = profileContent.orgStructure && typeof profileContent.orgStructure === "object" ? profileContent.orgStructure : defaultOrg;
    const mergedPusdi =
      profileContent.pusdiAgrataru && typeof profileContent.pusdiAgrataru === "object"
        ? profileContent.pusdiAgrataru
        : DEFAULT_PUSDI_AGRATARU_CONTENT;

    const normalizedPeople: Person[] = (mergedPeople as any[]).map((p) => ({
      id: typeof p.id === "string" ? p.id : makeId(),
      nama: typeof p.nama === "string" ? p.nama : "",
      fakultas: typeof p.fakultas === "string" ? p.fakultas : "",
      prodi: typeof p.prodi === "string" ? p.prodi : "",
      role: typeof p.role === "string" ? p.role : "",
      nidn: typeof p.nidn === "string" ? p.nidn : "",
      email: typeof p.email === "string" ? p.email : "",
      photoUrl: typeof p.photoUrl === "string" ? p.photoUrl : "",
    }));

    const normalizeOrgItem = (item: any): OrgItem => ({
      id: typeof item.id === "string" ? item.id : makeId(),
      jabatan: typeof item.jabatan === "string" ? item.jabatan : "",
      nama: typeof item.nama === "string" ? item.nama : "",
      icon: typeof item.icon === "string" ? item.icon : "🎓",
      sub: typeof item.sub === "string" ? item.sub : "",
      emerald: typeof item.emerald === "boolean" ? item.emerald : false,
    });

    const normalizeOrgLabel = (item: any): OrgLabel => ({
      id: typeof item.id === "string" ? item.id : makeId(),
      label: typeof item.label === "string" ? item.label : "",
      icon: typeof item.icon === "string" ? item.icon : "🏛️",
    });

    const normalizedOrg: OrgStructure = {
      atasPimpinan: Array.isArray((mergedOrg as any).atasPimpinan) ? (mergedOrg as any).atasPimpinan.map(normalizeOrgLabel) : defaultOrg.atasPimpinan,
      pimpinanInti: Array.isArray((mergedOrg as any).pimpinanInti) ? (mergedOrg as any).pimpinanInti.map(normalizeOrgItem) : defaultOrg.pimpinanInti,
      wakilRektor: Array.isArray((mergedOrg as any).wakilRektor) ? (mergedOrg as any).wakilRektor.map(normalizeOrgItem) : defaultOrg.wakilRektor,
      dekan: Array.isArray((mergedOrg as any).dekan) ? (mergedOrg as any).dekan.map(normalizeOrgItem) : defaultOrg.dekan,
      kepalaBiro: Array.isArray((mergedOrg as any).kepalaBiro) ? (mergedOrg as any).kepalaBiro.map(normalizeOrgItem) : defaultOrg.kepalaBiro,
    };

    const normalizedPusdi: PusdiAgrataruContent = {
      ...DEFAULT_PUSDI_AGRATARU_CONTENT,
      ...(mergedPusdi as any),
      bannerItems: Array.isArray((mergedPusdi as any).bannerItems) ? (mergedPusdi as any).bannerItems : DEFAULT_PUSDI_AGRATARU_CONTENT.bannerItems,
      kataPengantar: Array.isArray((mergedPusdi as any).kataPengantar) ? (mergedPusdi as any).kataPengantar : DEFAULT_PUSDI_AGRATARU_CONTENT.kataPengantar,
      tujuan: Array.isArray((mergedPusdi as any).tujuan) ? (mergedPusdi as any).tujuan : DEFAULT_PUSDI_AGRATARU_CONTENT.tujuan,
      fungsi: Array.isArray((mergedPusdi as any).fungsi) ? (mergedPusdi as any).fungsi : DEFAULT_PUSDI_AGRATARU_CONTENT.fungsi,
      bidangKegiatan: Array.isArray((mergedPusdi as any).bidangKegiatan) ? (mergedPusdi as any).bidangKegiatan : DEFAULT_PUSDI_AGRATARU_CONTENT.bidangKegiatan,
      mitraKerja: Array.isArray((mergedPusdi as any).mitraKerja) ? (mergedPusdi as any).mitraKerja : DEFAULT_PUSDI_AGRATARU_CONTENT.mitraKerja,
      stafPendukung: Array.isArray((mergedPusdi as any).stafPendukung) ? (mergedPusdi as any).stafPendukung : DEFAULT_PUSDI_AGRATARU_CONTENT.stafPendukung,
      pengalamanPakar: {
        ...DEFAULT_PUSDI_AGRATARU_CONTENT.pengalamanPakar,
        ...((mergedPusdi as any).pengalamanPakar || {}),
        agrariaPertanahan: Array.isArray((mergedPusdi as any).pengalamanPakar?.agrariaPertanahan)
          ? (mergedPusdi as any).pengalamanPakar.agrariaPertanahan
          : DEFAULT_PUSDI_AGRATARU_CONTENT.pengalamanPakar.agrariaPertanahan,
        tataruangPengembangan: Array.isArray((mergedPusdi as any).pengalamanPakar?.tataruangPengembangan)
          ? (mergedPusdi as any).pengalamanPakar.tataruangPengembangan
          : DEFAULT_PUSDI_AGRATARU_CONTENT.pengalamanPakar.tataruangPengembangan,
        pengembanganKelembagaan: Array.isArray((mergedPusdi as any).pengalamanPakar?.pengembanganKelembagaan)
          ? (mergedPusdi as any).pengalamanPakar.pengembanganKelembagaan
          : DEFAULT_PUSDI_AGRATARU_CONTENT.pengalamanPakar.pengembanganKelembagaan,
        penyelenggaraanPendidikan: Array.isArray((mergedPusdi as any).pengalamanPakar?.penyelenggaraanPendidikan)
          ? (mergedPusdi as any).pengalamanPakar.penyelenggaraanPendidikan
          : DEFAULT_PUSDI_AGRATARU_CONTENT.pengalamanPakar.penyelenggaraanPendidikan,
      },
      tenagaAhli: Array.isArray((mergedPusdi as any).tenagaAhli) ? (mergedPusdi as any).tenagaAhli : DEFAULT_PUSDI_AGRATARU_CONTENT.tenagaAhli,
    };

    return { normalizedPeople, normalizedOrg, normalizedPusdi };
  }, [settings.profileContent]);

  useEffect(() => {
    setPeople(defaultPeopleAndOrg.normalizedPeople);
    setOrg(defaultPeopleAndOrg.normalizedOrg);
    setPusdi(defaultPeopleAndOrg.normalizedPusdi);
  }, [defaultPeopleAndOrg]);

  const handleSaveAll = async () => {
    try {
      setIsSaving(true);
      const current = settings.profileContent ?? {};
      await updateSettings("profileContent", {
        ...current,
        people,
        orgStructure: org,
        pusdiAgrataru: pusdi,
      });
      toast({ title: "Berhasil", description: "Perubahan tersimpan." });
    } catch (error) {
      toast({ variant: "destructive", title: "Gagal menyimpan", description: "Terjadi kesalahan pada server." });
    } finally {
      setIsSaving(false);
    }
  };

  const openUploadForPerson = (id: string) => {
    setUploadTargetPersonId(id);
    personFileRef.current?.click();
  };

  const handlePersonFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!uploadTargetPersonId) return;
    try {
      setIsUploadingPersonPhoto(true);
      const url = await uploadOrDataUrl(file);
      setPeople((prev) => prev.map((p) => (p.id === uploadTargetPersonId ? { ...p, photoUrl: url } : p)));
      toast({ title: "Berhasil", description: "Foto berhasil diubah. Klik Simpan Perubahan." });
    } catch (error) {
      toast({ variant: "destructive", title: "Gagal upload", description: "Upload foto gagal." });
    } finally {
      setIsUploadingPersonPhoto(false);
      setUploadTargetPersonId(null);
    }
  };

  const handleAddPerson = () => {
    const id = makeId();
    setPeople((prev) => [...prev, { id, ...newPerson }]);
    setNewPerson({ nama: "", fakultas: "", prodi: "", role: "", nidn: "", email: "", photoUrl: "" });
    setIsAddingPerson(false);
    toast({ title: "Berhasil", description: "Data ditambahkan. Klik Simpan Perubahan." });
  };

  const handleUpdatePerson = () => {
    if (!editingPerson) return;
    setPeople((prev) => prev.map((p) => (p.id === editingPerson.id ? editingPerson : p)));
    setEditingPerson(null);
    toast({ title: "Berhasil", description: "Data diperbarui. Klik Simpan Perubahan." });
  };

  const handleDeletePerson = (id: string) => {
    if (!confirm("Yakin ingin menghapus data ini?")) return;
    setPeople((prev) => prev.filter((p) => p.id !== id));
    toast({ title: "Berhasil", description: "Data dihapus. Klik Simpan Perubahan." });
  };

  const handleAddOrgItem = () => {
    if (!isAddingOrgItem) return;
    const id = makeId();
    const next: OrgItem = { id, ...newOrgItem };
    setOrg((prev) => ({
      ...prev,
      [isAddingOrgItem]: [...(prev[isAddingOrgItem] as OrgItem[]), next] as any,
    }));
    setIsAddingOrgItem(null);
    setNewOrgItem({ jabatan: "", nama: "", icon: "🎓", sub: "", emerald: false });
    toast({ title: "Berhasil", description: "Item struktur ditambahkan. Klik Simpan Perubahan." });
  };

  const handleUpdateOrgItem = () => {
    if (!editingOrgItem) return;
    const { group, item } = editingOrgItem;
    setOrg((prev) => ({
      ...prev,
      [group]: (prev[group] as OrgItem[]).map((x) => (x.id === item.id ? item : x)) as any,
    }));
    setEditingOrgItem(null);
    toast({ title: "Berhasil", description: "Item struktur diperbarui. Klik Simpan Perubahan." });
  };

  const handleDeleteOrgItem = (group: keyof OrgStructure, id: string) => {
    if (!confirm("Yakin ingin menghapus item ini?")) return;
    setOrg((prev) => ({
      ...prev,
      [group]: (prev[group] as OrgItem[]).filter((x) => x.id !== id) as any,
    }));
    toast({ title: "Berhasil", description: "Item struktur dihapus. Klik Simpan Perubahan." });
  };

  const splitLines = (value: string) =>
    value
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);

  const splitParagraphs = (value: string) =>
    value
      .split(/\n\s*\n/g)
      .map((x) => x.trim())
      .filter(Boolean);

  const updateBannerUrl = (index: number, url: string) => {
    const next = [...pusdi.bannerItems];
    next[index] = { type: "image", url };
    setPusdi({ ...pusdi, bannerItems: next });
  };

  const addBannerItem = () => {
    setPusdi({ ...pusdi, bannerItems: [...pusdi.bannerItems, { type: "image", url: "" }] });
  };

  const removeBannerItem = (index: number) => {
    if (!confirm("Yakin ingin menghapus banner ini?")) return;
    setPusdi({ ...pusdi, bannerItems: pusdi.bannerItems.filter((_, i) => i !== index) });
  };

  const openUploadForBanner = (index: number) => {
    setUploadTargetBannerIndex(index);
    pusdiBannerFileRef.current?.click();
  };

  const handlePusdiBannerFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (uploadTargetBannerIndex === null) return;
    try {
      setIsUploadingPusdiBanner(true);
      const url = await uploadOrDataUrl(file);
      updateBannerUrl(uploadTargetBannerIndex, url);
      toast({ title: "Berhasil", description: "Banner berhasil diubah. Klik Simpan Perubahan." });
    } catch (error) {
      toast({ variant: "destructive", title: "Gagal upload", description: "Upload banner gagal." });
    } finally {
      setIsUploadingPusdiBanner(false);
      setUploadTargetBannerIndex(null);
    }
  };

  const openUploadForTenagaAhli = (id: string) => {
    setUploadTargetTenagaAhliId(id);
    tenagaAhliFileRef.current?.click();
  };

  const handleTenagaAhliFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!uploadTargetTenagaAhliId) return;
    try {
      setIsUploadingTenagaAhliPhoto(true);
      const url = await uploadOrDataUrl(file);
      setPusdi((prev) => ({
        ...prev,
        tenagaAhli: prev.tenagaAhli.map((x) => (x.id === uploadTargetTenagaAhliId ? { ...x, photoUrl: url } : x)),
      }));
      toast({ title: "Berhasil", description: "Foto tenaga ahli diubah. Klik Simpan Perubahan." });
    } catch (error) {
      toast({ variant: "destructive", title: "Gagal upload", description: "Upload foto gagal." });
    } finally {
      setIsUploadingTenagaAhliPhoto(false);
      setUploadTargetTenagaAhliId(null);
    }
  };

  const handleAddTenagaAhli = () => {
    const id = makeId();
    setPusdi((prev) => ({ ...prev, tenagaAhli: [...prev.tenagaAhli, { id, ...newTenagaAhli }] }));
    setNewTenagaAhli({ nama: "", bio: "", photoUrl: "" });
    setIsAddingTenagaAhli(false);
    toast({ title: "Berhasil", description: "Tenaga ahli ditambahkan. Klik Simpan Perubahan." });
  };

  const handleUpdateTenagaAhli = () => {
    if (!editingTenagaAhli) return;
    setPusdi((prev) => ({
      ...prev,
      tenagaAhli: prev.tenagaAhli.map((x) => (x.id === editingTenagaAhli.id ? editingTenagaAhli : x)),
    }));
    setEditingTenagaAhli(null);
    toast({ title: "Berhasil", description: "Tenaga ahli diperbarui. Klik Simpan Perubahan." });
  };

  const handleDeleteTenagaAhli = (id: string) => {
    if (!confirm("Yakin ingin menghapus tenaga ahli ini?")) return;
    setPusdi((prev) => ({ ...prev, tenagaAhli: prev.tenagaAhli.filter((x) => x.id !== id) }));
    toast({ title: "Berhasil", description: "Tenaga ahli dihapus. Klik Simpan Perubahan." });
  };

  if (isSettingsLoading) {
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
          <h2 className="text-3xl font-extrabold tracking-tight">Kelola Data Dosen</h2>
          <p className="text-slate-500 mt-1">Kelola Daftar Pimpinan & Dosen serta Struktur Organisasi.</p>
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

      <input ref={personFileRef} type="file" accept="image/*" className="hidden" onChange={handlePersonFileChange} />
      <input ref={pusdiBannerFileRef} type="file" accept="image/*" className="hidden" onChange={handlePusdiBannerFileChange} />
      <input ref={tenagaAhliFileRef} type="file" accept="image/*" className="hidden" onChange={handleTenagaAhliFileChange} />

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="bg-white dark:bg-[#1a1a1a] p-1 rounded-2xl border border-emerald-50 dark:border-emerald-900/10 mb-8 h-14">
          <TabsTrigger value="people" className="rounded-xl data-[state=active]:bg-emerald-500 data-[state=active]:text-white h-full px-6 gap-2">
            Daftar Pimpinan & Dosen
          </TabsTrigger>
          <TabsTrigger value="structure" className="rounded-xl data-[state=active]:bg-emerald-500 data-[state=active]:text-white h-full px-6 gap-2">
            Struktur Organisasi
          </TabsTrigger>
          <TabsTrigger value="pusdi" className="rounded-xl data-[state=active]:bg-emerald-500 data-[state=active]:text-white h-full px-6 gap-2">
            PUSDI AGRATARU
          </TabsTrigger>
        </TabsList>

        <TabsContent value="people" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold">Daftar Pimpinan & Dosen</h3>
              <p className="text-sm text-slate-500">Tambah, edit, hapus, dan ubah foto.</p>
            </div>
            <Button onClick={() => setIsAddingPerson(true)} className="bg-emerald-500 hover:bg-emerald-600 gap-2 rounded-xl">
              <Plus className="w-4 h-4" /> Tambah
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {people.map((p) => (
              <Card key={p.id} className="border-none shadow-sm bg-white dark:bg-[#1a1a1a] rounded-3xl overflow-hidden group">
                <div className="aspect-[16/10] bg-slate-200 relative">
                  {p.photoUrl ? (
                    <img src={p.photoUrl} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">Tidak ada foto</div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      type="button"
                      onClick={() => openUploadForPerson(p.id)}
                      size="icon"
                      className="bg-white/90 hover:bg-white text-slate-800 rounded-lg h-8 w-8"
                      disabled={isUploadingPersonPhoto && uploadTargetPersonId === p.id}
                    >
                      {isUploadingPersonPhoto && uploadTargetPersonId === p.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                    </Button>
                    <Button onClick={() => setEditingPerson(p)} size="icon" className="bg-white/90 hover:bg-white text-slate-800 rounded-lg h-8 w-8">
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button onClick={() => handleDeletePerson(p.id)} size="icon" className="bg-red-500/90 hover:bg-red-500 text-white rounded-lg h-8 w-8">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-5 space-y-1">
                  <div className="font-bold text-base">{p.nama}</div>
                  <div className="text-xs text-slate-500">{p.role}</div>
                  <div className="text-xs text-slate-500">{p.fakultas} · {p.prodi}</div>
                  <div className="text-xs text-slate-500">NIDN: {p.nidn}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {(isAddingPerson || editingPerson) && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
              <Card className="w-full max-w-lg border-none shadow-2xl bg-white dark:bg-[#1a1a1a] rounded-3xl">
                <CardHeader>
                  <CardTitle>{isAddingPerson ? "Tambah Data" : "Edit Data"}</CardTitle>
                  <CardDescription>Foto bisa via URL atau upload.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nama</label>
                    <Input
                      value={isAddingPerson ? newPerson.nama : (editingPerson?.nama ?? "")}
                      onChange={(e) =>
                        isAddingPerson
                          ? setNewPerson({ ...newPerson, nama: e.target.value })
                          : setEditingPerson({ ...(editingPerson as Person), nama: e.target.value })
                      }
                      className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Role</label>
                      <Input
                        value={isAddingPerson ? newPerson.role : (editingPerson?.role ?? "")}
                        onChange={(e) =>
                          isAddingPerson
                            ? setNewPerson({ ...newPerson, role: e.target.value })
                            : setEditingPerson({ ...(editingPerson as Person), role: e.target.value })
                        }
                        className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">NIDN</label>
                      <Input
                        value={isAddingPerson ? newPerson.nidn : (editingPerson?.nidn ?? "")}
                        onChange={(e) =>
                          isAddingPerson
                            ? setNewPerson({ ...newPerson, nidn: e.target.value })
                            : setEditingPerson({ ...(editingPerson as Person), nidn: e.target.value })
                        }
                        className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fakultas</label>
                      <Input
                        value={isAddingPerson ? newPerson.fakultas : (editingPerson?.fakultas ?? "")}
                        onChange={(e) =>
                          isAddingPerson
                            ? setNewPerson({ ...newPerson, fakultas: e.target.value })
                            : setEditingPerson({ ...(editingPerson as Person), fakultas: e.target.value })
                        }
                        className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Prodi</label>
                      <Input
                        value={isAddingPerson ? newPerson.prodi : (editingPerson?.prodi ?? "")}
                        onChange={(e) =>
                          isAddingPerson
                            ? setNewPerson({ ...newPerson, prodi: e.target.value })
                            : setEditingPerson({ ...(editingPerson as Person), prodi: e.target.value })
                        }
                        className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email</label>
                    <Input
                      value={isAddingPerson ? (newPerson.email ?? "") : (editingPerson?.email ?? "")}
                      onChange={(e) =>
                        isAddingPerson
                          ? setNewPerson({ ...newPerson, email: e.target.value })
                          : setEditingPerson({ ...(editingPerson as Person), email: e.target.value })
                      }
                      className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">URL Foto</label>
                    <Input
                      value={isAddingPerson ? (newPerson.photoUrl ?? "") : (editingPerson?.photoUrl ?? "")}
                      onChange={(e) =>
                        isAddingPerson
                          ? setNewPerson({ ...newPerson, photoUrl: e.target.value })
                          : setEditingPerson({ ...(editingPerson as Person), photoUrl: e.target.value })
                      }
                      className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={() => {
                        setIsAddingPerson(false);
                        setEditingPerson(null);
                      }}
                      variant="ghost"
                      className="flex-1 rounded-xl"
                    >
                      Batal
                    </Button>
                    <Button
                      onClick={isAddingPerson ? handleAddPerson : handleUpdatePerson}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 rounded-xl"
                    >
                      Simpan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="structure" className="space-y-6">
          <div className="space-y-6">
            <OrgSection
              title="Pimpinan Universitas"
              description="Kelola item pimpinan inti universitas."
              items={org.pimpinanInti}
              onAdd={() => setIsAddingOrgItem("pimpinanInti")}
              onEdit={(item) => setEditingOrgItem({ group: "pimpinanInti", item })}
              onDelete={(id) => handleDeleteOrgItem("pimpinanInti", id)}
            />
            <OrgSection
              title="Wakil Rektor"
              description="Kelola item wakil rektor."
              items={org.wakilRektor}
              onAdd={() => setIsAddingOrgItem("wakilRektor")}
              onEdit={(item) => setEditingOrgItem({ group: "wakilRektor", item })}
              onDelete={(id) => handleDeleteOrgItem("wakilRektor", id)}
            />
            <OrgSection
              title="Dekan Fakultas"
              description="Kelola item dekan fakultas."
              items={org.dekan}
              onAdd={() => setIsAddingOrgItem("dekan")}
              onEdit={(item) => setEditingOrgItem({ group: "dekan", item })}
              onDelete={(id) => handleDeleteOrgItem("dekan", id)}
            />
            <OrgSection
              title="Kepala Biro & Lembaga"
              description="Kelola item kepala biro dan lembaga."
              items={org.kepalaBiro}
              onAdd={() => setIsAddingOrgItem("kepalaBiro")}
              onEdit={(item) => setEditingOrgItem({ group: "kepalaBiro", item })}
              onDelete={(id) => handleDeleteOrgItem("kepalaBiro", id)}
            />
          </div>

          {(isAddingOrgItem || editingOrgItem) && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
              <Card className="w-full max-w-lg border-none shadow-2xl bg-white dark:bg-[#1a1a1a] rounded-3xl">
                <CardHeader>
                  <CardTitle>{isAddingOrgItem ? "Tambah Item Struktur" : "Edit Item Struktur"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Jabatan</label>
                      <Input
                        value={isAddingOrgItem ? newOrgItem.jabatan : (editingOrgItem?.item.jabatan ?? "")}
                        onChange={(e) =>
                          isAddingOrgItem
                            ? setNewOrgItem({ ...newOrgItem, jabatan: e.target.value })
                            : setEditingOrgItem({ ...(editingOrgItem as any), item: { ...editingOrgItem!.item, jabatan: e.target.value } })
                        }
                        className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Icon (emoji)</label>
                      <Input
                        value={isAddingOrgItem ? newOrgItem.icon : (editingOrgItem?.item.icon ?? "")}
                        onChange={(e) =>
                          isAddingOrgItem
                            ? setNewOrgItem({ ...newOrgItem, icon: e.target.value })
                            : setEditingOrgItem({ ...(editingOrgItem as any), item: { ...editingOrgItem!.item, icon: e.target.value } })
                        }
                        className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nama</label>
                    <Input
                      value={isAddingOrgItem ? newOrgItem.nama : (editingOrgItem?.item.nama ?? "")}
                      onChange={(e) =>
                        isAddingOrgItem
                          ? setNewOrgItem({ ...newOrgItem, nama: e.target.value })
                          : setEditingOrgItem({ ...(editingOrgItem as any), item: { ...editingOrgItem!.item, nama: e.target.value } })
                      }
                      className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sub (opsional)</label>
                    <Textarea
                      value={isAddingOrgItem ? (newOrgItem.sub ?? "") : (editingOrgItem?.item.sub ?? "")}
                      onChange={(e) =>
                        isAddingOrgItem
                          ? setNewOrgItem({ ...newOrgItem, sub: e.target.value })
                          : setEditingOrgItem({ ...(editingOrgItem as any), item: { ...editingOrgItem!.item, sub: e.target.value } })
                      }
                      className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl min-h-[80px]"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={() => {
                        setIsAddingOrgItem(null);
                        setEditingOrgItem(null);
                      }}
                      variant="ghost"
                      className="flex-1 rounded-xl"
                    >
                      Batal
                    </Button>
                    <Button
                      onClick={isAddingOrgItem ? handleAddOrgItem : handleUpdateOrgItem}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 rounded-xl"
                    >
                      Simpan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="pusdi" className="space-y-6">
          <div className="space-y-6">
            <Card className="border-none shadow-sm bg-white dark:bg-[#1a1a1a] rounded-3xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Banner PUSDI</CardTitle>
                  <CardDescription>Ganti gambar banner (URL atau upload).</CardDescription>
                </div>
                <Button onClick={addBannerItem} className="bg-emerald-500 hover:bg-emerald-600 gap-2 rounded-xl">
                  <Plus className="w-4 h-4" /> Tambah Banner
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {pusdi.bannerItems.map((item: BannerItem, idx: number) => (
                  <div key={idx} className="grid grid-cols-1 lg:grid-cols-[220px_1fr_auto_auto] gap-3 items-center">
                    <div className="aspect-video rounded-2xl bg-slate-100 overflow-hidden border border-black/5 dark:border-white/10">
                      {item.url ? <img src={item.url} className="w-full h-full object-cover" alt="" /> : null}
                    </div>
                    <Input
                      value={item.url}
                      onChange={(e) => updateBannerUrl(idx, e.target.value)}
                      className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl"
                      placeholder="URL banner"
                    />
                    <Button
                      type="button"
                      onClick={() => openUploadForBanner(idx)}
                      disabled={isUploadingPusdiBanner && uploadTargetBannerIndex === idx}
                      variant="outline"
                      className="rounded-xl gap-2"
                    >
                      {isUploadingPusdiBanner && uploadTargetBannerIndex === idx ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      Upload
                    </Button>
                    <Button
                      type="button"
                      onClick={() => removeBannerItem(idx)}
                      variant="destructive"
                      className="rounded-xl"
                      disabled={pusdi.bannerItems.length <= 1}
                    >
                      Hapus
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white dark:bg-[#1a1a1a] rounded-3xl">
              <CardHeader>
                <CardTitle className="text-lg">Konten Teks</CardTitle>
                <CardDescription>Semua teks di halaman PUSDI bisa diubah.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Kata Pengantar</label>
                  <Textarea
                    value={pusdi.kataPengantar.join("\n\n")}
                    onChange={(e) => setPusdi({ ...pusdi, kataPengantar: splitParagraphs(e.target.value) })}
                    className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl min-h-[160px]"
                    placeholder="Pisahkan paragraf dengan baris kosong"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tujuan (1 baris 1 poin)</label>
                    <Textarea
                      value={pusdi.tujuan.join("\n")}
                      onChange={(e) => setPusdi({ ...pusdi, tujuan: splitLines(e.target.value) })}
                      className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl min-h-[160px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fungsi (1 baris 1 poin)</label>
                    <Textarea
                      value={pusdi.fungsi.join("\n")}
                      onChange={(e) => setPusdi({ ...pusdi, fungsi: splitLines(e.target.value) })}
                      className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl min-h-[160px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Bidang Kegiatan (1 baris 1 poin)</label>
                    <Textarea
                      value={pusdi.bidangKegiatan.join("\n")}
                      onChange={(e) => setPusdi({ ...pusdi, bidangKegiatan: splitLines(e.target.value) })}
                      className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl min-h-[180px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mitra Kerja Potensial (1 baris 1 poin)</label>
                    <Textarea
                      value={pusdi.mitraKerja.join("\n")}
                      onChange={(e) => setPusdi({ ...pusdi, mitraKerja: splitLines(e.target.value) })}
                      className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl min-h-[180px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Staf Pendukung</label>
                    <Textarea
                      value={pusdi.stafPendukung.join("\n\n")}
                      onChange={(e) => setPusdi({ ...pusdi, stafPendukung: splitParagraphs(e.target.value) })}
                      className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl min-h-[160px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Legalitas</label>
                    <Textarea
                      value={pusdi.legalitas}
                      onChange={(e) => setPusdi({ ...pusdi, legalitas: e.target.value })}
                      className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl min-h-[160px]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fasilitas</label>
                  <Textarea
                    value={pusdi.fasilitas}
                    onChange={(e) => setPusdi({ ...pusdi, fasilitas: e.target.value })}
                    className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl min-h-[160px]"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pengalaman: Agraria & Pertanahan</label>
                    <Textarea
                      value={pusdi.pengalamanPakar.agrariaPertanahan.join("\n")}
                      onChange={(e) =>
                        setPusdi({
                          ...pusdi,
                          pengalamanPakar: { ...pusdi.pengalamanPakar, agrariaPertanahan: splitLines(e.target.value) },
                        })
                      }
                      className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl min-h-[180px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pengalaman: Tataruang & Pengembangan</label>
                    <Textarea
                      value={pusdi.pengalamanPakar.tataruangPengembangan.join("\n")}
                      onChange={(e) =>
                        setPusdi({
                          ...pusdi,
                          pengalamanPakar: { ...pusdi.pengalamanPakar, tataruangPengembangan: splitLines(e.target.value) },
                        })
                      }
                      className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl min-h-[180px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pengalaman: Pengembangan Kelembagaan</label>
                    <Textarea
                      value={pusdi.pengalamanPakar.pengembanganKelembagaan.join("\n")}
                      onChange={(e) =>
                        setPusdi({
                          ...pusdi,
                          pengalamanPakar: { ...pusdi.pengalamanPakar, pengembanganKelembagaan: splitLines(e.target.value) },
                        })
                      }
                      className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl min-h-[180px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pengalaman: Penyelenggaraan Pendidikan</label>
                    <Textarea
                      value={pusdi.pengalamanPakar.penyelenggaraanPendidikan.join("\n")}
                      onChange={(e) =>
                        setPusdi({
                          ...pusdi,
                          pengalamanPakar: { ...pusdi.pengalamanPakar, penyelenggaraanPendidikan: splitLines(e.target.value) },
                        })
                      }
                      className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl min-h-[180px]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white dark:bg-[#1a1a1a] rounded-3xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Personil Tenaga Ahli</CardTitle>
                  <CardDescription>Tambah, edit, hapus, dan ubah foto (URL atau upload).</CardDescription>
                </div>
                <Button onClick={() => setIsAddingTenagaAhli(true)} className="bg-emerald-500 hover:bg-emerald-600 gap-2 rounded-xl">
                  <Plus className="w-4 h-4" /> Tambah
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pusdi.tenagaAhli.map((p: PusdiAgrataruTenagaAhli, idx: number) => (
                    <Card key={p.id} className="border-none shadow-sm bg-white dark:bg-[#1a1a1a] rounded-3xl overflow-hidden group">
                      <div className="aspect-[16/10] bg-slate-200 relative">
                        {p.photoUrl ? (
                          <img src={p.photoUrl} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">Tidak ada foto</div>
                        )}
                        <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black">
                          {idx + 1}
                        </div>
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            type="button"
                            onClick={() => openUploadForTenagaAhli(p.id)}
                            size="icon"
                            className="bg-white/90 hover:bg-white text-slate-800 rounded-lg h-8 w-8"
                            disabled={isUploadingTenagaAhliPhoto && uploadTargetTenagaAhliId === p.id}
                          >
                            {isUploadingTenagaAhliPhoto && uploadTargetTenagaAhliId === p.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Upload className="w-3.5 h-3.5" />
                            )}
                          </Button>
                          <Button onClick={() => setEditingTenagaAhli(p)} size="icon" className="bg-white/90 hover:bg-white text-slate-800 rounded-lg h-8 w-8">
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button onClick={() => handleDeleteTenagaAhli(p.id)} size="icon" className="bg-red-500/90 hover:bg-red-500 text-white rounded-lg h-8 w-8">
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-5 space-y-1">
                        <div className="font-bold text-base">{p.nama}</div>
                        <div className="text-xs text-slate-500 line-clamp-3 whitespace-pre-line">{p.bio}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {(isAddingTenagaAhli || editingTenagaAhli) && (
                  <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <Card className="w-full max-w-lg border-none shadow-2xl bg-white dark:bg-[#1a1a1a] rounded-3xl">
                      <CardHeader>
                        <CardTitle>{isAddingTenagaAhli ? "Tambah Tenaga Ahli" : "Edit Tenaga Ahli"}</CardTitle>
                        <CardDescription>Foto bisa via URL atau upload.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nama</label>
                          <Input
                            value={isAddingTenagaAhli ? newTenagaAhli.nama : (editingTenagaAhli?.nama ?? "")}
                            onChange={(e) =>
                              isAddingTenagaAhli
                                ? setNewTenagaAhli({ ...newTenagaAhli, nama: e.target.value })
                                : setEditingTenagaAhli({ ...(editingTenagaAhli as PusdiAgrataruTenagaAhli), nama: e.target.value })
                            }
                            className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">URL Foto</label>
                          <Input
                            value={isAddingTenagaAhli ? (newTenagaAhli.photoUrl ?? "") : (editingTenagaAhli?.photoUrl ?? "")}
                            onChange={(e) =>
                              isAddingTenagaAhli
                                ? setNewTenagaAhli({ ...newTenagaAhli, photoUrl: e.target.value })
                                : setEditingTenagaAhli({ ...(editingTenagaAhli as PusdiAgrataruTenagaAhli), photoUrl: e.target.value })
                            }
                            className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Biografi</label>
                          <Textarea
                            value={isAddingTenagaAhli ? newTenagaAhli.bio : (editingTenagaAhli?.bio ?? "")}
                            onChange={(e) =>
                              isAddingTenagaAhli
                                ? setNewTenagaAhli({ ...newTenagaAhli, bio: e.target.value })
                                : setEditingTenagaAhli({ ...(editingTenagaAhli as PusdiAgrataruTenagaAhli), bio: e.target.value })
                            }
                            className="bg-slate-50 dark:bg-[#252525] border-none rounded-xl min-h-[160px]"
                          />
                        </div>

                        <div className="flex gap-3 pt-2">
                          <Button
                            onClick={() => {
                              setIsAddingTenagaAhli(false);
                              setEditingTenagaAhli(null);
                            }}
                            variant="ghost"
                            className="flex-1 rounded-xl"
                          >
                            Batal
                          </Button>
                          <Button
                            onClick={isAddingTenagaAhli ? handleAddTenagaAhli : handleUpdateTenagaAhli}
                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 rounded-xl"
                          >
                            Simpan
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function OrgSection(props: {
  title: string;
  description: string;
  items: OrgItem[];
  onAdd: () => void;
  onEdit: (item: OrgItem) => void;
  onDelete: (id: string) => void;
}) {
  const { title, description, items, onAdd, onEdit, onDelete } = props;
  return (
    <Card className="border-none shadow-sm bg-white dark:bg-[#1a1a1a] rounded-3xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Button onClick={onAdd} className="bg-emerald-500 hover:bg-emerald-600 gap-2 rounded-xl">
          <Plus className="w-4 h-4" /> Tambah
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-slate-50 dark:bg-[#252525] rounded-2xl p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg shrink-0">
                {item.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold uppercase tracking-widest text-emerald-500">{item.jabatan}</div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 break-words">{item.nama}</div>
                {item.sub ? <div className="text-[10px] text-slate-500 mt-1 break-words">{item.sub}</div> : null}
                <div className="flex gap-2 mt-3">
                  <Button onClick={() => onEdit(item)} size="sm" variant="outline" className="rounded-xl gap-2">
                    <Pencil className="w-4 h-4" /> Edit
                  </Button>
                  <Button onClick={() => onDelete(item.id)} size="sm" variant="destructive" className="rounded-xl gap-2">
                    <Trash2 className="w-4 h-4" /> Hapus
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
