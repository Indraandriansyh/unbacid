import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getSession, clearSession, authHeaders, type AdminUser } from "@/lib/auth";
import ProdiManagement from "@/components/ProdiManagement";
import {
  BookOpen, Users, LogOut, Plus, Trash2, Loader2, Eye, EyeOff, ShieldCheck,
} from "lucide-react";

const API = "/api";

type AdminUserRow = {
  id: number;
  username: string;
  role: string;
  scopeId: string | null;
  displayName: string;
  createdAt: string;
};

type Menu = "konten" | "users";

export default function ProdiAdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const session = getSession();
  const user = session?.user as AdminUser | null;

  const [menu, setMenu] = useState<Menu>("konten");
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
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (menu === "users") fetchUsers();
  }, [menu]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      const res = await fetch(`${API}/auth/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          username: newUsername,
          password: newPassword,
          displayName: newDisplayName,
          role: "prodi",
          scopeId: user?.scopeId ?? null,
        }),
      });
      const data = await res.json();
      if (!res.ok) { toast({ variant: "destructive", title: "Gagal", description: data.error }); return; }
      toast({ title: "Berhasil", description: `User ${newUsername} berhasil ditambahkan.` });
      setNewUsername(""); setNewPassword(""); setNewDisplayName("");
      fetchUsers();
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteUser = async (id: number, name: string) => {
    if (!confirm(`Hapus user "${name}"?`)) return;
    const res = await fetch(`${API}/auth/users/${id}`, { method: "DELETE", headers: authHeaders() });
    if (res.ok) { toast({ title: "Dihapus", description: `User ${name} telah dihapus.` }); fetchUsers(); }
    else { const d = await res.json(); toast({ variant: "destructive", title: "Gagal", description: d.error }); }
  };

  const handleLogout = () => {
    clearSession();
    setLocation("/admin");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#0d0d0d] flex">
      {/* Sidebar */}
      <div className="w-64 shrink-0 bg-white dark:bg-[#111] border-r border-slate-200 dark:border-slate-800 flex flex-col">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm uppercase tracking-wider">Admin Prodi</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">{user.displayName}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">@{user.username}</p>
          {user.scopeId && (
            <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400 mt-1">{user.scopeId}</p>
          )}
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <button
            onClick={() => setMenu("konten")}
            className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-semibold transition-all ${menu === "konten" ? "bg-emerald-500 text-white shadow-md" : "text-slate-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"}`}
          >
            <BookOpen className="w-4 h-4" />
            Kelola Konten Prodi
          </button>
          <button
            onClick={() => setMenu("users")}
            className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-semibold transition-all ${menu === "users" ? "bg-emerald-500 text-white shadow-md" : "text-slate-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"}`}
          >
            <Users className="w-4 h-4" />
            Kelola Pengguna
          </button>
        </nav>

        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Keluar
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {menu === "konten" && (
          <div className="p-8 max-w-5xl">
            <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-6">{user.displayName}</h1>
            <ProdiManagement prodiId={user.scopeId ?? ""} />
          </div>
        )}

        {menu === "users" && (
          <div className="p-8 max-w-3xl space-y-8">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Kelola Pengguna</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                Tambah atau hapus pengguna yang dapat mengakses dashboard prodi ini.
              </p>
            </div>

            {/* Add User Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-500" /> Tambah Pengguna Baru
                </CardTitle>
                <CardDescription>Pengguna baru akan mendapat akses ke dashboard prodi {user.scopeId}.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddUser} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="Username" value={newUsername} onChange={e => setNewUsername(e.target.value)} required />
                    <Input placeholder="Nama Lengkap / Display Name" value={newDisplayName} onChange={e => setNewDisplayName(e.target.value)} required />
                  </div>
                  <div className="relative">
                    <Input
                      type={showPw ? "text" : "password"}
                      placeholder="Password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      required
                      className="pr-10"
                    />
                    <button type="button" className="absolute right-3 top-3 text-slate-400" onClick={() => setShowPw(!showPw)}>
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white" disabled={adding}>
                    {adding ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                    Tambah Pengguna
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Users List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-500" /> Daftar Pengguna
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingUsers ? (
                  <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-emerald-500" /></div>
                ) : users.length === 0 ? (
                  <p className="text-slate-400 text-sm text-center py-6">Belum ada pengguna yang ditambahkan.</p>
                ) : (
                  <div className="space-y-2">
                    {users.map(u => (
                      <div key={u.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                        <div>
                          <p className="font-semibold text-sm text-slate-800 dark:text-white">{u.displayName}</p>
                          <p className="text-xs text-slate-400">@{u.username}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                          onClick={() => handleDeleteUser(u.id, u.username)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
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
  );
}
