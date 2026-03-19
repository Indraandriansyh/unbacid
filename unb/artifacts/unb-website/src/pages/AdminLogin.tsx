import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock, User, ShieldCheck } from "lucide-react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock login for now
    setTimeout(() => {
      if (username === "admin" && password === "admin123") {
        toast({
          title: "Login Berhasil",
          description: "Selamat datang di Dashboard Admin Master UNB.",
        });
        setLocation("/admin/dashboard");
      } else {
        toast({
          variant: "destructive",
          title: "Login Gagal",
          description: "Username atau password salah.",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#0d0d0d] flex items-center justify-center p-4 selection:bg-emerald-500 selection:text-white">
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 rotate-3">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
        </div>

        <Card className="border-none shadow-2xl bg-white dark:bg-[#1a1a1a] rounded-3xl overflow-hidden">
          <CardHeader className="space-y-1 pb-8 text-center">
            <CardTitle className="text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-500">
              Admin Master
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
