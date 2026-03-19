import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getSession, clearSession, authHeaders, type AdminUser } from "@/lib/auth";
import ProdiManagement from "@/components/ProdiManagement";
import MahasiswaManagement from "@/components/MahasiswaManagement";
import {
  BookOpen, Users, LogOut, Plus, Trash2, Loader2, Eye, EyeOff, ShieldCheck,
  Image, Images, Newspaper, GraduationCap, Menu, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const API = "/api";

type AdminUserRow = {
  id: number; username: string; role: string;
  scopeId: string | null; displayName: string; createdAt: string;
};

type MenuId = "informasi" | "banner" | "galeri" | "berita" | "mahasiswa" | "users";

const MENU_ITEMS: { id: MenuId; label: string; icon: React.ReactNode }[] = [
  { id: "informasi", label: "Informasi & Kurikulum", icon: <BookOpen className="w-4 h-4" /> },
  { id: "banner", label: "Gambar Banner", icon: <Image className="w-4 h-4" /> },
  { id: "galeri", label: "Galeri Kegiatan", icon: <Images className="w-4 h-4" /> },
  { id: "berita", label: "Berita / Jurnal", icon: <Newspaper className="w-4 h-4" /> },
  { id: "mahasiswa", label: "Data Mahasiswa", icon: <GraduationCap className="w-4 h-4" /> },
  { id: "users", label: "Kelola Pengguna", icon: <Users className="w-4 h-4" /> },
];

export default function ProdiAdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const session = getSession();
  const user = session?.user as AdminUser | null;

  const [menu, setMenu] = useState<MenuId>("informasi");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newDisplayName, setNewDisplayName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!session || !user || user.role !== "prodi") {
      clearSession();
      setLocation("/admin");
    }
  }, []);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch(`${API}/auth/users`, { headers: authHeaders() });
      if (res.ok) setUsers(await res.json());
    } finally { setLoadingUsers(false); }
  };

  useEffect(() => { if (menu === "users") fetchUsers(); }, [menu]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      const res = await fetch(`${API}/auth/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ username: newUsername, password: newPassword, displayName: newDisplayName, role: "prodi", scopeId: user?.scopeId ?? null }),
      });
      const data = await res.json();
      if (!res.ok) { toast({ variant: "destructive", title: "Gagal", description: data.error }); return; }
      toast({ title: "Berhasil", description: `User ${newUsername} ditambahkan.` });
      setNewUsername(""); setNewPassword(""); setNewDisplayName("");
      fetchUsers();
    } finally { setAdding(false); }
  };

  const handleDeleteUser = async (id: number, name: string) => {
    if (!confirm(`Hapus user "${name}"?`)) return;
    const res = await fetch(`${API}/auth/users/${id}`, { method: "DELETE", headers: authHeaders() });
    if (res.ok) { toast({ title: "Dihapus" }); fetchUsers(); }
    else { const d = await res.json(); toast({ variant: "destructive", title: "Gagal", description: d.error }); }
  };

  const handleLogout = () => { clearSession(); setLocation("/admin"); };
  const handleMenuClick = (id: MenuId) => { setMenu(id); setSidebarOpen(false); };

  if (!user) return null;

  const activeLabel = MENU_ITEMS.find(m => m.id === menu)?.label ?? "";

  const SidebarContent = () => (
    <>
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-xs uppercase tracking-wider">Admin Prodi</span>
        </div>
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-snug">{user.displayName}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">@{user.username}</p>
        {user.scopeId && <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">{user.scopeId}</p>}
      </div>

      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {MENU_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => handleMenuClick(item.id)}
            className={cn(
              "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all",
              menu === item.id
                ? "bg-emerald-500 text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-700 dark:hover:text-emerald-400"
            )}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-2 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
        >
          <LogOut className="w-4 h-4" /> Keluar
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#0d0d0d] flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-60 shrink-0 bg-white dark:bg-[#111] border-r border-slate-200 dark:border-slate-800 flex-col">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-50 w-64 bg-white dark:bg-[#111] flex flex-col h-full shadow-2xl">
            <div className="flex justify-end p-2">
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></Button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-white dark:bg-[#111] border-b border-slate-200 dark:border-slate-800 shadow-sm">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}><Menu className="w-5 h-5" /></Button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{activeLabel}</p>
            <p className="text-xs text-slate-400 truncate">{user.displayName}</p>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1">
          {(menu === "informasi" || menu === "banner" || menu === "galeri" || menu === "berita") && (
            <div className="p-4 md:p-8 max-w-5xl">
              {menu !== "berita" && (
                <h1 className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-white mb-4 md:mb-6">{activeLabel}</h1>
              )}
              <ProdiManagement prodiId={user.scopeId ?? ""} section={menu as "informasi" | "banner" | "galeri" | "berita"} />
            </div>
          )}

          {menu === "mahasiswa" && (
            <div className="p-4 md:p-8 max-w-6xl">
              <div className="mb-4 md:mb-6">
                <h1 className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-white">Data Mahasiswa</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{user.displayName}</p>
              </div>
              <MahasiswaManagement prodiId={user.scopeId ?? ""} />
            </div>
          )}

          {menu === "users" && (
            <div className="p-4 md:p-8 max-w-3xl space-y-6">
              <div>
                <h1 className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-white">Kelola Pengguna</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Tambah atau hapus pengguna yang dapat mengakses dashboard ini.</p>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2"><Plus className="w-4 h-4 text-emerald-500" />Tambah Pengguna</CardTitle>
                  <CardDescription>Pengguna baru mendapat akses ke dashboard prodi {user.scopeId}.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddUser} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input placeholder="Username" value={newUsername} onChange={e => setNewUsername(e.target.value)} required />
                      <Input placeholder="Nama Lengkap" value={newDisplayName} onChange={e => setNewDisplayName(e.target.value)} required />
                    </div>
                    <div className="relative">
                      <Input type={showPw ? "text" : "password"} placeholder="Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="pr-10" />
                      <button type="button" className="absolute right-3 top-3 text-slate-400" onClick={() => setShowPw(!showPw)}>
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white" disabled={adding}>
                      {adding ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}Tambah Pengguna
                    </Button>
                  </form>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Users className="w-4 h-4 text-emerald-500" />Daftar Pengguna</CardTitle></CardHeader>
                <CardContent>
                  {loadingUsers ? (
                    <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-emerald-500" /></div>
                  ) : users.length === 0 ? (
                    <p className="text-slate-400 text-sm text-center py-6">Belum ada pengguna yang ditambahkan.</p>
                  ) : (
                    <div className="space-y-2">
                      {users.map(u => (
                        <div key={u.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                          <div><p className="font-semibold text-sm">{u.displayName}</p><p className="text-xs text-slate-400">@{u.username}</p></div>
                          <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600" onClick={() => handleDeleteUser(u.id, u.username)}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
