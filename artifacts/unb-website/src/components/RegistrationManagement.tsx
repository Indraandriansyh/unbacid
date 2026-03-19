import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/contexts/SettingsContext";
import {
  Plus, Trash2, Loader2, Save, Upload, Link as LinkIcon,
  MessageCircle, FileText, DollarSign, Clock, Users, ArrowUpDown, Image as ImageIcon,
  CreditCard, Building2, ToggleLeft, ToggleRight, Info
} from "lucide-react";
import { MediaItemRow } from "./MediaUploader";
import {
  DEFAULT_REGISTRATION_CONTENT,
  type RegistrationContent,
  type FlowStep,
  type TrackItem,
  type WaveItem,
  type TuitionGroup,
  FLOW_ICON_OPTIONS,
  TRACK_ICON_OPTIONS,
} from "@/tabs/RegistrationTab";

const uploadOrDataUrl = async (file: File): Promise<string> => {
  try {
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/site-settings/upload", { method: "POST", body });
    if (!res.ok) throw new Error();
    const data = await res.json();
    if (data?.url && typeof data.url === "string") return data.url as string;
    throw new Error();
  } catch {
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ""));
      reader.onerror = () => reject(new Error("File read failed"));
      reader.readAsDataURL(file);
    });
  }
};

const SECTION_TABS = [
  { id: "banner", label: "Banner", icon: ImageIcon },
  { id: "flow", label: "Alur Pendaftaran", icon: Users },
  { id: "tracks", label: "Jalur Pendaftaran", icon: ArrowUpDown },
  { id: "waves", label: "Waktu Pendaftaran", icon: Clock },
  { id: "tuition", label: "Biaya Pendidikan", icon: DollarSign },
  { id: "contact", label: "Formulir & Kontak", icon: MessageCircle },
  { id: "payment", label: "Pengaturan Bayar", icon: CreditCard },
] as const;

type TabId = typeof SECTION_TABS[number]["id"];

const DEFAULT_PAYMENT_SETTINGS = {
  midtransEnabled: false,
  midtransClientKey: "",
  midtransIsProduction: false,
  bankName: "BJB Syariah",
  bankAccountNumber: "0040102001205",
  bankAccountName: "Universitas Nusa Bangsa",
  registrationFee: 300000,
};

function getPaymentSettings(settings: any) {
  const ps = settings?.paymentSettings ?? {};
  return {
    midtransEnabled: ps.midtransEnabled === true,
    midtransClientKey: ps.midtransClientKey ?? "",
    midtransIsProduction: ps.midtransIsProduction === true,
    bankName: ps.bankName ?? DEFAULT_PAYMENT_SETTINGS.bankName,
    bankAccountNumber: ps.bankAccountNumber ?? DEFAULT_PAYMENT_SETTINGS.bankAccountNumber,
    bankAccountName: ps.bankAccountName ?? DEFAULT_PAYMENT_SETTINGS.bankAccountName,
    registrationFee: typeof ps.registrationFee === "number" ? ps.registrationFee : DEFAULT_PAYMENT_SETTINGS.registrationFee,
  };
}

function getRegistrationContent(settings: any): RegistrationContent {
  const saved = settings?.registrationContent;
  if (!saved) return DEFAULT_REGISTRATION_CONTENT;
  return {
    bannerItems: Array.isArray(saved.bannerItems) ? saved.bannerItems : DEFAULT_REGISTRATION_CONTENT.bannerItems,
    admissionFlow: Array.isArray(saved.admissionFlow) ? saved.admissionFlow : DEFAULT_REGISTRATION_CONTENT.admissionFlow,
    admissionTracks: Array.isArray(saved.admissionTracks) ? saved.admissionTracks : DEFAULT_REGISTRATION_CONTENT.admissionTracks,
    admissionWaves: Array.isArray(saved.admissionWaves) ? saved.admissionWaves : DEFAULT_REGISTRATION_CONTENT.admissionWaves,
    tuitionData: Array.isArray(saved.tuitionData) ? saved.tuitionData : DEFAULT_REGISTRATION_CONTENT.tuitionData,
    brochureUrl: saved.brochureUrl ?? "",
    formUrl: saved.formUrl ?? "",
    whatsappNumber: saved.whatsappNumber ?? DEFAULT_REGISTRATION_CONTENT.whatsappNumber,
  };
}

export default function RegistrationManagement() {
  const { settings, updateSettings } = useSettings();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabId>("banner");
  const [content, setContent] = useState<RegistrationContent>(DEFAULT_REGISTRATION_CONTENT);
  const [isSaving, setIsSaving] = useState(false);
  const [paymentSettings, setPaymentSettings] = useState(DEFAULT_PAYMENT_SETTINGS);
  const [isSavingPayment, setIsSavingPayment] = useState(false);

  const brochureFileRef = useRef<HTMLInputElement>(null);
  const formFileRef = useRef<HTMLInputElement>(null);
  const [isUploadingBrochure, setIsUploadingBrochure] = useState(false);
  const [isUploadingForm, setIsUploadingForm] = useState(false);

  useEffect(() => {
    setContent(getRegistrationContent(settings));
    setPaymentSettings(getPaymentSettings(settings));
  }, [settings]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateSettings("registrationContent", content);
      toast({ title: "Tersimpan", description: "Konten halaman Pendaftaran berhasil diperbarui." });
    } catch {
      toast({ variant: "destructive", title: "Gagal Menyimpan" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePayment = async () => {
    try {
      setIsSavingPayment(true);
      await updateSettings("paymentSettings", paymentSettings);
      toast({ title: "Tersimpan", description: "Pengaturan pembayaran berhasil diperbarui." });
    } catch {
      toast({ variant: "destructive", title: "Gagal Menyimpan" });
    } finally {
      setIsSavingPayment(false);
    }
  };

  const handleBrochureFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      setIsUploadingBrochure(true);
      const url = await uploadOrDataUrl(file);
      setContent(c => ({ ...c, brochureUrl: url }));
      toast({ title: "Brosur diupload", description: "File brosur berhasil diunggah." });
    } catch {
      toast({ variant: "destructive", title: "Gagal upload brosur" });
    } finally {
      setIsUploadingBrochure(false);
    }
  };

  const handleFormFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      setIsUploadingForm(true);
      const url = await uploadOrDataUrl(file);
      setContent(c => ({ ...c, formUrl: url }));
      toast({ title: "Formulir diupload", description: "File formulir pendaftaran berhasil diunggah." });
    } catch {
      toast({ variant: "destructive", title: "Gagal upload formulir" });
    } finally {
      setIsUploadingForm(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <input ref={brochureFileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" className="hidden" onChange={handleBrochureFile} />
      <input ref={formFileRef} type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" className="hidden" onChange={handleFormFile} />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Kelola Halaman Pendaftaran</h2>
          <p className="text-slate-500 mt-1 text-sm">Edit semua konten halaman pendaftaran mahasiswa baru.</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 rounded-xl px-6 h-11 gap-2"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? "Menyimpan..." : "Simpan Semua Perubahan"}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
        {SECTION_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-600"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ─── Banner ─── */}
      {activeTab === "banner" && (
        <BannerEditor
          items={content.bannerItems}
          onChange={(items) => setContent(c => ({ ...c, bannerItems: items }))}
        />
      )}

      {/* ─── Alur Pendaftaran ─── */}
      {activeTab === "flow" && (
        <FlowEditor
          steps={content.admissionFlow}
          onChange={(steps) => setContent(c => ({ ...c, admissionFlow: steps }))}
        />
      )}

      {/* ─── Jalur Pendaftaran ─── */}
      {activeTab === "tracks" && (
        <TracksEditor
          tracks={content.admissionTracks}
          onChange={(tracks) => setContent(c => ({ ...c, admissionTracks: tracks }))}
        />
      )}

      {/* ─── Waktu Pendaftaran ─── */}
      {activeTab === "waves" && (
        <WavesEditor
          waves={content.admissionWaves}
          onChange={(waves) => setContent(c => ({ ...c, admissionWaves: waves }))}
        />
      )}

      {/* ─── Biaya Pendidikan ─── */}
      {activeTab === "tuition" && (
        <TuitionEditor
          tuitionData={content.tuitionData}
          brochureUrl={content.brochureUrl}
          onChangeTuition={(tuitionData) => setContent(c => ({ ...c, tuitionData }))}
          onChangeBrochure={(url) => setContent(c => ({ ...c, brochureUrl: url }))}
          onUploadBrochure={() => brochureFileRef.current?.click()}
          isUploadingBrochure={isUploadingBrochure}
        />
      )}

      {/* ─── Formulir & Kontak ─── */}
      {activeTab === "contact" && (
        <ContactEditor
          formUrl={content.formUrl}
          whatsappNumber={content.whatsappNumber}
          onChangeFormUrl={(url) => setContent(c => ({ ...c, formUrl: url }))}
          onChangeWhatsapp={(num) => setContent(c => ({ ...c, whatsappNumber: num }))}
          onUploadForm={() => formFileRef.current?.click()}
          isUploadingForm={isUploadingForm}
        />
      )}

      {/* ─── Pengaturan Bayar ─── */}
      {activeTab === "payment" && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold">Pengaturan Pembayaran</h3>
              <p className="text-sm text-slate-500">Atur metode pembayaran yang tersedia untuk calon mahasiswa.</p>
            </div>
            <Button
              onClick={handleSavePayment}
              disabled={isSavingPayment}
              className="bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 rounded-xl px-6 h-11 gap-2"
            >
              {isSavingPayment ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSavingPayment ? "Menyimpan..." : "Simpan Pengaturan Bayar"}
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-500" />
                Biaya Pendaftaran
              </CardTitle>
              <CardDescription>Nominal biaya pendaftaran yang dikenakan kepada calon mahasiswa.</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-500">Jumlah (Rupiah)</label>
                <div className="flex gap-2 items-center">
                  <span className="text-sm font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-l-md shrink-0">Rp</span>
                  <Input
                    type="number"
                    value={paymentSettings.registrationFee}
                    onChange={(e) => setPaymentSettings(p => ({ ...p, registrationFee: Number(e.target.value) || 0 }))}
                    placeholder="300000"
                    className="rounded-l-none font-mono"
                    min={0}
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Contoh: 300000 = Rp 300.000</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-500" />
                Transfer Bank
              </CardTitle>
              <CardDescription>Informasi rekening bank untuk pembayaran manual via transfer. Selalu aktif dan tidak dapat dinonaktifkan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-500">Nama Bank</label>
                <Input
                  value={paymentSettings.bankName}
                  onChange={(e) => setPaymentSettings(p => ({ ...p, bankName: e.target.value }))}
                  placeholder="BJB Syariah"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-500">Nomor Rekening</label>
                <Input
                  value={paymentSettings.bankAccountNumber}
                  onChange={(e) => setPaymentSettings(p => ({ ...p, bankAccountNumber: e.target.value }))}
                  placeholder="0040102001205"
                  className="font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-500">Atas Nama</label>
                <Input
                  value={paymentSettings.bankAccountName}
                  onChange={(e) => setPaymentSettings(p => ({ ...p, bankAccountName: e.target.value }))}
                  placeholder="Universitas Nusa Bangsa"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-500" />
                Midtrans Payment Gateway
              </CardTitle>
              <CardDescription>Aktifkan Midtrans untuk menerima pembayaran online (QRIS, e-wallet, kartu kredit, dll). Memerlukan akun Midtrans yang sudah diverifikasi.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <div>
                  <p className="text-sm font-semibold">Aktifkan Midtrans</p>
                  <p className="text-xs text-slate-400 mt-0.5">Tampilkan opsi Midtrans di modal pembayaran</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPaymentSettings(p => ({ ...p, midtransEnabled: !p.midtransEnabled }))}
                  className={`transition-colors ${paymentSettings.midtransEnabled ? "text-emerald-500" : "text-slate-300"}`}
                >
                  {paymentSettings.midtransEnabled ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
                </button>
              </div>

              <div className={paymentSettings.midtransEnabled ? "" : "opacity-50 pointer-events-none"}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-500">Client Key</label>
                    <Input
                      value={paymentSettings.midtransClientKey}
                      onChange={(e) => setPaymentSettings(p => ({ ...p, midtransClientKey: e.target.value }))}
                      placeholder="SB-Mid-client-xxxxxxxx (Sandbox) atau Mid-client-xxxxxxxx (Production)"
                      className="font-mono text-xs"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Client Key tersedia di dashboard Midtrans → Settings → Access Keys</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold mb-2 text-slate-500">Server Key</p>
                    <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/30 rounded-xl">
                      <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-blue-700 dark:text-blue-300 leading-relaxed">
                        Server Key diatur melalui environment variable <code className="font-mono bg-blue-100 dark:bg-blue-900/50 px-1 rounded">MIDTRANS_SERVER_KEY</code> di server, bukan di sini, demi keamanan.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <div>
                      <p className="text-sm font-semibold">Mode Produksi</p>
                      <p className="text-xs text-slate-400 mt-0.5">Nonaktifkan untuk mode sandbox/testing</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPaymentSettings(p => ({ ...p, midtransIsProduction: !p.midtransIsProduction }))}
                      className={`transition-colors ${paymentSettings.midtransIsProduction ? "text-emerald-500" : "text-slate-300"}`}
                    >
                      {paymentSettings.midtransIsProduction ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
                    </button>
                  </div>
                  {!paymentSettings.midtransIsProduction && (
                    <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800/30 rounded-xl">
                      <Info className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-yellow-700 dark:text-yellow-300 leading-relaxed">
                        Mode <strong>Sandbox</strong> aktif — transaksi bersifat simulasi dan tidak memproses uang nyata. Gunakan ini untuk testing.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function BannerEditor({ items, onChange }: {
  items: RegistrationContent["bannerItems"];
  onChange: (items: RegistrationContent["bannerItems"]) => void;
}) {
  const add = () => onChange([...items, { type: "image" as const, url: "" }]);
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const update = (i: number, field: "type" | "url", val: string) =>
    onChange(items.map((it, idx) => idx === i ? { ...it, [field]: val as any } : it));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gambar Banner Pendaftaran</CardTitle>
        <CardDescription>Gambar atau video yang tampil di bagian atas halaman pendaftaran.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 && (
          <p className="text-sm text-slate-400 italic">Belum ada banner. Klik "Tambah Gambar" untuk mulai.</p>
        )}
        {items.map((item, i) => (
          <MediaItemRow
            key={i}
            item={item}
            index={i}
            onUpdate={(field, val) => update(i, field as "type" | "url", val)}
            onRemove={() => remove(i)}
          />
        ))}
        <Button variant="outline" size="sm" className="gap-2 text-emerald-600 border-emerald-300" onClick={add}>
          <Plus className="w-4 h-4" /> Tambah Gambar / Video
        </Button>
      </CardContent>
    </Card>
  );
}

function FlowEditor({ steps, onChange }: {
  steps: FlowStep[];
  onChange: (steps: FlowStep[]) => void;
}) {
  const update = (i: number, field: keyof FlowStep, val: string) =>
    onChange(steps.map((s, idx) => idx === i ? { ...s, [field]: val } : s));

  const add = () => onChange([
    ...steps,
    { id: steps.length + 1, title: "", sub: "", iconName: "UserCheck", desc: "" }
  ]);

  const remove = (i: number) =>
    onChange(steps.filter((_, idx) => idx !== i).map((s, idx) => ({ ...s, id: idx + 1 })));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alur Pendaftaran</CardTitle>
        <CardDescription>Edit langkah-langkah alur pendaftaran mahasiswa baru. Setiap langkah bisa diklik untuk melihat deskripsi detail.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {steps.map((step, i) => (
          <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-3 bg-slate-50/50 dark:bg-slate-800/20">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-500">Langkah {step.id}</span>
              <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 h-7 w-7" onClick={() => remove(i)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-500">Ikon</label>
                <select
                  value={step.iconName}
                  onChange={(e) => update(i, "iconName", e.target.value)}
                  className="w-full h-9 px-3 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                >
                  {FLOW_ICON_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-500">Judul (Indonesia) *</label>
                <Input value={step.title} onChange={(e) => update(i, "title", e.target.value)} placeholder="Pra-Pendaftaran" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-500">Sub-judul (Inggris)</label>
                <Input value={step.sub} onChange={(e) => update(i, "sub", e.target.value)} placeholder="Pre-Registration" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-500">Deskripsi Detail (tampil saat diklik)</label>
              <Textarea
                rows={3}
                value={step.desc}
                onChange={(e) => update(i, "desc", e.target.value)}
                placeholder="Penjelasan lengkap langkah ini..."
              />
            </div>
          </div>
        ))}
        <Button variant="outline" size="sm" className="gap-2 text-emerald-600 border-emerald-300 w-full" onClick={add}>
          <Plus className="w-4 h-4" /> Tambah Langkah
        </Button>
      </CardContent>
    </Card>
  );
}

function TracksEditor({ tracks, onChange }: {
  tracks: TrackItem[];
  onChange: (tracks: TrackItem[]) => void;
}) {
  const update = (i: number, field: keyof TrackItem, val: string) =>
    onChange(tracks.map((t, idx) => idx === i ? { ...t, [field]: val } : t));

  const add = () => onChange([
    ...tracks,
    { id: tracks.length + 1, title: "", sub: "", iconName: "GraduationCap", desc: "" }
  ]);

  const remove = (i: number) =>
    onChange(tracks.filter((_, idx) => idx !== i).map((t, idx) => ({ ...t, id: idx + 1 })));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Jalur Pendaftaran</CardTitle>
        <CardDescription>Edit kartu-kartu jalur penerimaan mahasiswa. Setiap kartu bisa diklik untuk melihat deskripsi detail.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {tracks.map((track, i) => (
          <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-3 bg-slate-50/50 dark:bg-slate-800/20">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-500">Jalur {track.id}</span>
              <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 h-7 w-7" onClick={() => remove(i)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-500">Ikon</label>
                <select
                  value={track.iconName}
                  onChange={(e) => update(i, "iconName", e.target.value)}
                  className="w-full h-9 px-3 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
                >
                  {TRACK_ICON_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-500">Judul (Indonesia) *</label>
                <Input value={track.title} onChange={(e) => update(i, "title", e.target.value)} placeholder="Jalur Reguler" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-500">Sub-judul (Inggris)</label>
                <Input value={track.sub} onChange={(e) => update(i, "sub", e.target.value)} placeholder="Regular Admission" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-500">Deskripsi Detail (tampil saat diklik)</label>
              <Textarea
                rows={3}
                value={track.desc}
                onChange={(e) => update(i, "desc", e.target.value)}
                placeholder="Penjelasan lengkap jalur ini..."
              />
            </div>
          </div>
        ))}
        <Button variant="outline" size="sm" className="gap-2 text-emerald-600 border-emerald-300 w-full" onClick={add}>
          <Plus className="w-4 h-4" /> Tambah Jalur
        </Button>
      </CardContent>
    </Card>
  );
}

function WavesEditor({ waves, onChange }: {
  waves: WaveItem[];
  onChange: (waves: WaveItem[]) => void;
}) {
  const update = (i: number, field: keyof WaveItem, val: string | boolean) =>
    onChange(waves.map((w, idx) => idx === i ? { ...w, [field]: val } : w));

  const add = () => onChange([
    ...waves,
    { title: `Gelombang ${waves.length + 1}`, date: "", status: "Segera", active: false }
  ]);

  const remove = (i: number) => onChange(waves.filter((_, idx) => idx !== i));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Waktu Pendaftaran (Gelombang)</CardTitle>
        <CardDescription>Edit jadwal gelombang pendaftaran. Tandai satu gelombang sebagai "Aktif" untuk menampilkan status terbuka.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {waves.map((wave, i) => (
          <div key={i} className={`border rounded-2xl p-5 space-y-3 ${wave.active ? "border-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/10" : "border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20"}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-500">Gelombang {i + 1}</span>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={wave.active}
                    onChange={(e) => {
                      const newWaves = waves.map((w, idx) =>
                        idx === i ? { ...w, active: true } : { ...w, active: false }
                      );
                      if (!e.target.checked) {
                        onChange(waves.map((w, idx) => idx === i ? { ...w, active: false } : w));
                      } else {
                        onChange(newWaves);
                      }
                    }}
                    className="w-4 h-4 accent-emerald-500"
                  />
                  <span className="text-xs font-semibold text-emerald-600">Aktif (Sedang Buka)</span>
                </label>
                <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 h-7 w-7" onClick={() => remove(i)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-500">Nama Gelombang *</label>
                <Input value={wave.title} onChange={(e) => update(i, "title", e.target.value)} placeholder="Gelombang 1" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-500">Periode Tanggal *</label>
                <Input value={wave.date} onChange={(e) => update(i, "date", e.target.value)} placeholder="Januari - Maret 2026" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-500">Teks Status Badge</label>
                <Input value={wave.status} onChange={(e) => update(i, "status", e.target.value)} placeholder="Buka / Segera / Tutup" />
              </div>
            </div>
          </div>
        ))}
        <Button variant="outline" size="sm" className="gap-2 text-emerald-600 border-emerald-300 w-full" onClick={add}>
          <Plus className="w-4 h-4" /> Tambah Gelombang
        </Button>
      </CardContent>
    </Card>
  );
}

function TuitionEditor({ tuitionData, brochureUrl, onChangeTuition, onChangeBrochure, onUploadBrochure, isUploadingBrochure }: {
  tuitionData: TuitionGroup[];
  brochureUrl: string;
  onChangeTuition: (data: TuitionGroup[]) => void;
  onChangeBrochure: (url: string) => void;
  onUploadBrochure: () => void;
  isUploadingBrochure: boolean;
}) {
  const updateGroup = (gi: number, field: "no" | "faculty", val: string) =>
    onChangeTuition(tuitionData.map((g, idx) => idx === gi ? { ...g, [field]: val } : g));

  const updateProgram = (gi: number, pi: number, field: "name" | "reguler" | "ekstensi", val: string) =>
    onChangeTuition(tuitionData.map((g, gIdx) =>
      gIdx !== gi ? g : {
        ...g,
        programs: g.programs.map((p, pIdx) => pIdx === pi ? { ...p, [field]: val } : p)
      }
    ));

  const addProgram = (gi: number) =>
    onChangeTuition(tuitionData.map((g, idx) =>
      idx !== gi ? g : { ...g, programs: [...g.programs, { name: "", reguler: "", ekstensi: "" }] }
    ));

  const removeProgram = (gi: number, pi: number) =>
    onChangeTuition(tuitionData.map((g, idx) =>
      idx !== gi ? g : { ...g, programs: g.programs.filter((_, pIdx) => pIdx !== pi) }
    ));

  const addGroup = () =>
    onChangeTuition([...tuitionData, {
      no: String.fromCharCode(73 + tuitionData.length),
      faculty: "",
      programs: [{ name: "", reguler: "", ekstensi: "" }]
    }]);

  const removeGroup = (gi: number) =>
    onChangeTuition(tuitionData.filter((_, idx) => idx !== gi));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Brosur Pendaftaran</CardTitle>
          <CardDescription>Upload file brosur (PDF/gambar) yang bisa diunduh oleh calon mahasiswa dari halaman Biaya Pendidikan.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-3 items-start">
            <div className="flex-1">
              <label className="block text-xs font-semibold mb-1 text-slate-500">URL File Brosur</label>
              <Input
                value={brochureUrl}
                onChange={(e) => onChangeBrochure(e.target.value)}
                placeholder="https://... atau upload file di bawah"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="block text-xs font-semibold mb-1 text-slate-500 invisible">Upload</label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2 text-emerald-600 border-emerald-300"
                  disabled={isUploadingBrochure}
                  onClick={onUploadBrochure}
                >
                  {isUploadingBrochure ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  Upload Brosur
                </Button>
                {brochureUrl && (
                  <a
                    href={brochureUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm text-blue-600 hover:text-blue-700 border border-blue-200 hover:bg-blue-50 transition-colors"
                  >
                    <LinkIcon className="w-4 h-4" />
                    Preview
                  </a>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tabel Biaya Pendidikan</CardTitle>
          <CardDescription>Edit data biaya per fakultas dan program studi. Kolom "Reguler" dan "Ekstensi" menampilkan nominal dalam Rupiah (tanpa simbol Rp).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {tuitionData.map((group, gi) => (
            <div key={gi} className="border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12">
                  <label className="block text-xs font-semibold mb-1 text-slate-500">No</label>
                  <Input value={group.no} onChange={(e) => updateGroup(gi, "no", e.target.value)} className="text-center font-bold" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold mb-1 text-slate-500">Nama Fakultas *</label>
                  <Input value={group.faculty} onChange={(e) => updateGroup(gi, "faculty", e.target.value)} placeholder="Fakultas Ekonomi & Bisnis" />
                </div>
                <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 mt-5" onClick={() => removeGroup(gi)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2 pl-2 border-l-2 border-emerald-100 dark:border-emerald-900/30">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-2">Program Studi</p>
                {group.programs.map((prog, pi) => (
                  <div key={pi} className="grid grid-cols-[1fr_140px_140px_36px] gap-2 items-center">
                    <Input
                      value={prog.name}
                      onChange={(e) => updateProgram(gi, pi, "name", e.target.value)}
                      placeholder="Nama program studi"
                      className="text-sm"
                    />
                    <Input
                      value={prog.reguler}
                      onChange={(e) => updateProgram(gi, pi, "reguler", e.target.value)}
                      placeholder="Reguler (Rp)"
                      className="text-sm font-mono"
                    />
                    <Input
                      value={prog.ekstensi}
                      onChange={(e) => updateProgram(gi, pi, "ekstensi", e.target.value)}
                      placeholder="Ekstensi (Rp)"
                      className="text-sm font-mono"
                    />
                    <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 h-9 w-9 shrink-0" onClick={() => removeProgram(gi, pi)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                <Button variant="ghost" size="sm" className="text-emerald-600 gap-1 text-xs ml-2" onClick={() => addProgram(gi)}>
                  <Plus className="w-3 h-3" /> Tambah Program Studi
                </Button>
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" className="gap-2 text-emerald-600 border-emerald-300 w-full" onClick={addGroup}>
            <Plus className="w-4 h-4" /> Tambah Kelompok Fakultas
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function ContactEditor({ formUrl, whatsappNumber, onChangeFormUrl, onChangeWhatsapp, onUploadForm, isUploadingForm }: {
  formUrl: string;
  whatsappNumber: string;
  onChangeFormUrl: (url: string) => void;
  onChangeWhatsapp: (num: string) => void;
  onUploadForm: () => void;
  isUploadingForm: boolean;
}) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-500" />
            Formulir Pendaftaran Manual
          </CardTitle>
          <CardDescription>Upload formulir pendaftaran fisik (PDF/Word) yang bisa diunduh calon mahasiswa dari halaman pendaftaran.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-start">
            <div className="flex-1">
              <label className="block text-xs font-semibold mb-1 text-slate-500">URL File Formulir</label>
              <Input
                value={formUrl}
                onChange={(e) => onChangeFormUrl(e.target.value)}
                placeholder="https://... atau upload file di bawah"
              />
              <p className="text-[10px] text-slate-400 mt-1">Isi URL langsung atau upload file di bawah. Format yang didukung: PDF, DOC, DOCX, JPG, PNG.</p>
            </div>
            <div className="flex flex-col gap-2">
              <label className="block text-xs font-semibold mb-1 text-slate-500 invisible">Upload</label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2 text-emerald-600 border-emerald-300"
                  disabled={isUploadingForm}
                  onClick={onUploadForm}
                >
                  {isUploadingForm ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  Upload Formulir
                </Button>
                {formUrl && (
                  <a
                    href={formUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm text-blue-600 hover:text-blue-700 border border-blue-200 hover:bg-blue-50 transition-colors"
                  >
                    <LinkIcon className="w-4 h-4" />
                    Preview
                  </a>
                )}
              </div>
            </div>
          </div>

          {formUrl && (
            <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">File aktif saat ini:</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 break-all font-mono">{formUrl}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-emerald-500" />
            Nomor WhatsApp Admin PMB
          </CardTitle>
          <CardDescription>Nomor ini akan tampil di halaman pendaftaran sebagai kontak untuk calon mahasiswa.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-500">Nomor WhatsApp (format internasional tanpa +)</label>
            <div className="flex gap-2 items-center">
              <span className="text-sm font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-l-md">+</span>
              <Input
                value={whatsappNumber}
                onChange={(e) => onChangeWhatsapp(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="6281234567890"
                className="font-mono rounded-l-none"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Contoh: <strong>6281234567890</strong> untuk nomor +62 812-3456-7890. Jangan masukkan tanda + atau spasi.
            </p>
          </div>

          {whatsappNumber && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">Tampilan di halaman web:</p>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                +{whatsappNumber.replace(/^62/, "62 ").replace(/(\d{3})(\d{4})(\d+)/, "$1-$2-$3")}
              </p>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-emerald-600 hover:text-emerald-700 underline mt-1 block"
              >
                Test link WhatsApp →
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
