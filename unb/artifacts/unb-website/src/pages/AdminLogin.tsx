import { useState } from "react";
import logoUnb from "@/assets/logo-unb.png";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock, User, ShieldCheck } from "lucide-react";
import { saveSession } from "@/lib/auth";

const API = "/api";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ variant: "destructive", title: "Login Gagal", description: data.error || "Username atau password salah." });
        return;
      }
      saveSession(data);
      toast({ title: "Login Berhasil", description: `Selamat datang, ${data.user.displayName}` });
      setLocation("/admin/dashboard");
    } catch {
      toast({ variant: "destructive", title: "Kesalahan", description: "Tidak dapat terhubung ke server." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#0d0d0d] flex items-center justify-center p-4 selection:bg-emerald-500 selection:text-white">
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 flex items-center justify-center">
            <img src={logoUnb} alt="Logo UNB" className="w-20 h-20 object-contain" />
          </div>
        </div>

        <Card className="border-none shadow-2xl bg-white dark:bg-[#1a1a1a] rounded-3xl overflow-hidden">
          <CardHeader className="space-y-1 pb-8 text-center">
            <CardTitle className="text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-500">
              Admin UNB
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Silakan login untuk mengelola website UNB
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-emerald-500" />
                  <Input
                    type="text"
                    placeholder="Username"
                    className="pl-10 h-12 bg-gray-50 dark:bg-[#252525] border-none rounded-xl focus-visible:ring-2 focus-visible:ring-emerald-500 transition-all"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-emerald-500" />
                  <Input
                    type="password"
                    placeholder="Password"
                    className="pl-10 h-12 bg-gray-50 dark:bg-[#252525] border-none rounded-xl focus-visible:ring-2 focus-visible:ring-emerald-500 transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? "Memproses..." : "Masuk ke Dashboard"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Universitas Nusa Bangsa. All rights reserved.
        </div>
      </div>
    </div>
  );
}
