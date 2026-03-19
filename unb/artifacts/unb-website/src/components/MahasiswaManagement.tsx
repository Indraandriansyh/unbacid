import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, Trash2, Loader2, Pencil, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { authHeaders } from "@/lib/auth";

const API = "/api";

type Mahasiswa = {
  id: number;
  nim: string;
  nama: string;
  prodi_id: string;
  angkatan: number;
  semester: number;
  status: string;
  jenis_kelamin: string;
  tempat_lahir: string | null;
  tanggal_lahir: string | null;
  alamat: string | null;
  email: string | null;
  telepon: string | null;
  foto_url: string | null;
};

const STATUS_COLORS: Record<string, string> = {
  aktif: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  cuti: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  lulus: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  dropout: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const EMPTY: Omit<Mahasiswa, "id"> = {
  nim: "", nama: "", prodi_id: "", angkatan: new Date().getFullYear(),
  semester: 1, status: "aktif", jenis_kelamin: "L",
  tempat_lahir: "", tanggal_lahir: "", alamat: "", email: "", telepon: "", foto_url: "",
};

export default function MahasiswaManagement({ prodiId }: { prodiId: string }) {
  const { toast } = useToast();
  const [list, setList] = useState<Mahasiswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Mahasiswa | null>(null);
  const [form, setForm] = useState<Omit<Mahasiswa, "id">>({ ...EMPTY, prodi_id: prodiId });
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const fetchList = async (q = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ prodiId });
      if (q) params.set("q", q);
      const res = await fetch(`${API}/mahasiswa?${params}`);
      if (res.ok) setList(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, [prodiId]);

  useEffect(() => {
    const t = setTimeout(() => fetchList(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY, prodi_id: prodiId });
    setShowForm(true);
  };

  const openEdit = (m: Mahasiswa) => {
    setEditing(m);
    setForm({ nim: m.nim, nama: m.nama, prodi_id: m.prodi_id, angkatan: m.angkatan, semester: m.semester, status: m.status, jenis_kelamin: m.jenis_kelamin, tempat_lahir: m.tempat_lahir ?? "", tanggal_lahir: m.tanggal_lahir ?? "", alamat: m.alamat ?? "", email: m.email ?? "", telepon: m.telepon ?? "", foto_url: m.foto_url ?? "" });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editing ? `${API}/mahasiswa/${editing.id}` : `${API}/mahasiswa`;
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { toast({ variant: "destructive", title: "Gagal", description: data.error }); return; }
      toast({ title: "Tersimpan", description: `Data ${form.nama} berhasil ${editing ? "diperbarui" : "ditambahkan"}.` });
      setShowForm(false);
      fetchList(search);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (m: Mahasiswa) => {
    if (!confirm(`Hapus data mahasiswa ${m.nama} (${m.nim})?`)) return;
    const res = await fetch(`${API}/mahasiswa/${m.id}`, { method: "DELETE", headers: authHeaders() });
    if (res.ok) { toast({ title: "Dihapus" }); fetchList(search); }
    else { const d = await res.json(); toast({ variant: "destructive", title: "Gagal", description: d.error }); }
  };

  const f = (key: keyof typeof form, val: string | number) => setForm(prev => ({ ...prev, [key]: val }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Cari nama, NIM, atau email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={openAdd} className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2 shrink-0">
          <Plus className="w-4 h-4" /> Tambah Mahasiswa
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {["aktif", "cuti", "lulus", "dropout"].map(s => (
          <div key={s} className="bg-white dark:bg-slate-800/50 rounded-xl p-3 border border-slate-200 dark:border-slate-700 text-center">
            <p className="text-2xl font-extrabold text-slate-800 dark:text-white">{list.filter(m => m.status === s).length}</p>
            <p className="text-xs capitalize text-slate-500 mt-0.5">{s}</p>
          </div>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{editing ? "Edit Mahasiswa" : "Tambah Mahasiswa Baru"}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}><X className="w-4 h-4" /></Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><label className="text-xs font-semibold text-slate-500 mb-1 block">NIM *</label>
                  <Input value={form.nim} onChange={e => f("nim", e.target.value)} placeholder="2024AGR0001" required /></div>
                <div><label className="text-xs font-semibold text-slate-500 mb-1 block">Nama Lengkap *</label>
                  <Input value={form.nama} onChange={e => f("nama", e.target.value)} required /></div>
                <div><label className="text-xs font-semibold text-slate-500 mb-1 block">Angkatan</label>
                  <Input type="number" value={form.angkatan} onChange={e => f("angkatan", parseInt(e.target.value))} /></div>
                <div><label className="text-xs font-semibold text-slate-500 mb-1 block">Semester</label>
                  <Input type="number" min={1} max={14} value={form.semester} onChange={e => f("semester", parseInt(e.target.value))} /></div>
                <div><label className="text-xs font-semibold text-slate-500 mb-1 block">Jenis Kelamin</label>
                  <select className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" value={form.jenis_kelamin} onChange={e => f("jenis_kelamin", e.target.value)}>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select></div>
                <div><label className="text-xs font-semibold text-slate-500 mb-1 block">Status</label>
                  <select className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" value={form.status} onChange={e => f("status", e.target.value)}>
                    <option value="aktif">Aktif</option>
                    <option value="cuti">Cuti</option>
                    <option value="lulus">Lulus</option>
                    <option value="dropout">Dropout</option>
                  </select></div>
                <div><label className="text-xs font-semibold text-slate-500 mb-1 block">Email</label>
                  <Input type="email" value={form.email ?? ""} onChange={e => f("email", e.target.value)} /></div>
                <div><label className="text-xs font-semibold text-slate-500 mb-1 block">Telepon</label>
                  <Input value={form.telepon ?? ""} onChange={e => f("telepon", e.target.value)} /></div>
                <div><label className="text-xs font-semibold text-slate-500 mb-1 block">Tempat Lahir</label>
                  <Input value={form.tempat_lahir ?? ""} onChange={e => f("tempat_lahir", e.target.value)} /></div>
                <div><label className="text-xs font-semibold text-slate-500 mb-1 block">Tanggal Lahir</label>
                  <Input type="date" value={form.tanggal_lahir ?? ""} onChange={e => f("tanggal_lahir", e.target.value)} /></div>
                <div className="sm:col-span-2"><label className="text-xs font-semibold text-slate-500 mb-1 block">Alamat</label>
                  <Input value={form.alamat ?? ""} onChange={e => f("alamat", e.target.value)} /></div>
                <div className="sm:col-span-2"><label className="text-xs font-semibold text-slate-500 mb-1 block">URL Foto</label>
                  <Input value={form.foto_url ?? ""} onChange={e => f("foto_url", e.target.value)} placeholder="https://..." /></div>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Batal</Button>
                <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white" disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {editing ? "Perbarui" : "Simpan"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-emerald-500" /></div>
          ) : list.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-sm">{search ? "Tidak ada hasil pencarian." : "Belum ada data mahasiswa."}</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {/* Desktop header */}
              <div className="hidden sm:grid grid-cols-[48px_1fr_140px_80px_90px_80px] gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-slate-500 uppercase tracking-wider rounded-t-xl">
                <span></span>
                <span>Nama / NIM</span>
                <span>Kontak</span>
                <span>Angkatan</span>
                <span>Semester</span>
                <span>Aksi</span>
              </div>
              {list.map(m => (
                <div key={m.id}>
                  {/* Mobile row */}
                  <div className="sm:hidden flex items-center gap-3 px-4 py-3">
                    <img
                      src={m.foto_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.nama)}&background=10b981&color=fff&size=64`}
                      alt={m.nama}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-slate-800 dark:text-white truncate">{m.nama}</p>
                      <p className="text-xs text-slate-400">{m.nim} · Smt {m.semester}</p>
                    </div>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full font-semibold shrink-0", STATUS_COLORS[m.status] ?? STATUS_COLORS.aktif)}>{m.status}</span>
                    <button onClick={() => setExpandedId(expandedId === m.id ? null : m.id)} className="shrink-0">
                      <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", expandedId === m.id && "rotate-180")} />
                    </button>
                  </div>
                  {expandedId === m.id && (
                    <div className="sm:hidden px-4 pb-3 space-y-1 text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/30">
                      {m.email && <p>📧 {m.email}</p>}
                      {m.telepon && <p>📱 {m.telepon}</p>}
                      {m.alamat && <p>📍 {m.alamat}</p>}
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" className="gap-1 h-7 text-xs" onClick={() => openEdit(m)}><Pencil className="w-3 h-3" />Edit</Button>
                        <Button size="sm" variant="ghost" className="gap-1 h-7 text-xs text-red-500 hover:bg-red-50" onClick={() => handleDelete(m)}><Trash2 className="w-3 h-3" />Hapus</Button>
                      </div>
                    </div>
                  )}

                  {/* Desktop row */}
                  <div className="hidden sm:grid grid-cols-[48px_1fr_140px_80px_90px_80px] gap-3 px-4 py-3 items-center hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <img
                      src={m.foto_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.nama)}&background=10b981&color=fff&size=64`}
                      alt={m.nama}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-slate-800 dark:text-white truncate">{m.nama}</p>
                      <p className="text-xs text-slate-400">{m.nim} · {m.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}</p>
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {m.email && <p className="truncate">{m.email}</p>}
                      {m.telepon && <p>{m.telepon}</p>}
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{m.angkatan}</span>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-slate-700 dark:text-slate-300">Smt {m.semester}</span>
                      <span className={cn("text-xs px-2 py-0.5 rounded-full font-semibold w-fit", STATUS_COLORS[m.status] ?? STATUS_COLORS.aktif)}>{m.status}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-emerald-600" onClick={() => openEdit(m)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500" onClick={() => handleDelete(m)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <p className="text-xs text-slate-400 text-right">{list.length} mahasiswa ditemukan</p>
    </div>
  );
}
