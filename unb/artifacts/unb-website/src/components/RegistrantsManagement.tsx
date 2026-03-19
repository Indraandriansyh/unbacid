import { useState } from "react";
import { useListRegistrations } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getListRegistrationsQueryKey } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import {
  Users2, Search, RefreshCw, ChevronDown, CheckCircle2,
  Clock, XCircle, AlertCircle, Building2, CreditCard, Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type PaymentStatus = "unpaid" | "paid" | "verified";
type PaymentMethod = "midtrans" | "bank_transfer" | null;

const STATUS_CONFIG: Record<PaymentStatus, { label: string; color: string; icon: React.ElementType }> = {
  unpaid:   { label: "Belum Bayar", color: "bg-red-500/10 text-red-400 border-red-500/20",     icon: XCircle },
  paid:     { label: "Sudah Bayar",  color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", icon: Clock },
  verified: { label: "Terverifikasi",color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", icon: CheckCircle2 },
};

const METHOD_CONFIG: Record<string, { label: string; icon: React.ElementType }> = {
  midtrans:     { label: "Midtrans",       icon: CreditCard },
  bank_transfer:{ label: "Transfer Bank",  icon: Building2 },
};

async function updatePaymentStatus(id: number, paymentStatus: string): Promise<void> {
  const res = await fetch(`/api/registrations/${id}/payment-status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ paymentStatus }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "Gagal update status");
  }
}

export default function RegistrantsManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: registrations = [], isLoading, refetch } = useListRegistrations();
  const [search, setSearch] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | PaymentStatus>("all");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const filtered = registrations
    .filter((r: any) => {
      const q = search.toLowerCase();
      if (q && !r.fullName?.toLowerCase().includes(q) && !r.email?.toLowerCase().includes(q) && !r.phone?.includes(q)) {
        return false;
      }
      if (filterTab !== "all" && r.paymentStatus !== filterTab) return false;
      return true;
    })
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const counts = {
    all: registrations.length,
    unpaid: registrations.filter((r: any) => r.paymentStatus === "unpaid").length,
    paid: registrations.filter((r: any) => r.paymentStatus === "paid").length,
    verified: registrations.filter((r: any) => r.paymentStatus === "verified").length,
  };

  const handleStatusChange = async (id: number, paymentStatus: PaymentStatus, isMidtrans: boolean) => {
    if (isMidtrans) {
      toast({ title: "Tidak dapat diubah", description: "Status Midtrans diupdate otomatis oleh sistem.", variant: "destructive" });
      return;
    }
    try {
      setUpdatingId(id);
      await updatePaymentStatus(id, paymentStatus);
      queryClient.invalidateQueries({ queryKey: getListRegistrationsQueryKey() });
      toast({ title: "Status diperbarui", description: `Status berhasil diubah ke "${STATUS_CONFIG[paymentStatus]?.label}".` });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Gagal", description: err.message });
    } finally {
      setUpdatingId(null);
    }
  };

  const TABS: Array<{ id: "all" | PaymentStatus; label: string }> = [
    { id: "all",      label: `Semua (${counts.all})` },
    { id: "unpaid",   label: `Belum Bayar (${counts.unpaid})` },
    { id: "paid",     label: `Sudah Bayar (${counts.paid})` },
    { id: "verified", label: `Terverifikasi (${counts.verified})` },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <Users2 className="w-6 h-6 text-emerald-500" />
            Data Pendaftar
          </h2>
          <p className="text-slate-500 mt-1 text-sm">Kelola dan pantau status pembayaran semua pendaftar mahasiswa baru.</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="gap-2 text-emerald-600 border-emerald-300"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Pendaftar", value: counts.all, color: "text-slate-600 dark:text-slate-300", bg: "bg-slate-100 dark:bg-slate-800" },
          { label: "Belum Bayar", value: counts.unpaid, color: "text-red-500", bg: "bg-red-50 dark:bg-red-950/20" },
          { label: "Sudah Bayar", value: counts.paid, color: "text-yellow-600", bg: "bg-yellow-50 dark:bg-yellow-950/20" },
          { label: "Terverifikasi", value: counts.verified, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/20" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4`}>
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs font-semibold text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter + Search */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
        <div className="flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                filterTab === tab.id
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative md:ml-auto w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Cari nama, email, atau telepon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <AlertCircle className="w-10 h-10 mx-auto mb-3 text-slate-300" />
          <p className="font-medium">Tidak ada data pendaftar</p>
          <p className="text-sm mt-1">Pendaftar akan muncul di sini setelah mereka mengisi formulir.</p>
        </div>
      ) : (
        <div className="bg-card border border-white/10 dark:border-white/10 border-slate-200 rounded-[24px] overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5">
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-400">No.</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-400">Nama Lengkap</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-400">Kontak</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-400">Fakultas / Prodi</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-400">Jalur</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-400">Metode Bayar</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-400">Status Bayar</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-400">Tanggal Daftar</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-400">Ubah Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filtered.map((reg: any, idx: number) => {
                  const statusCfg = STATUS_CONFIG[reg.paymentStatus as PaymentStatus] ?? STATUS_CONFIG.unpaid;
                  const methodCfg = reg.paymentMethod ? METHOD_CONFIG[reg.paymentMethod] : null;
                  const isMidtrans = reg.paymentMethod === "midtrans";
                  const StatusIcon = statusCfg.icon;
                  const createdDate = new Date(reg.createdAt).toLocaleDateString("id-ID", {
                    day: "2-digit", month: "short", year: "numeric"
                  });

                  return (
                    <tr key={reg.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-slate-400 text-xs font-mono">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-800 dark:text-white text-sm">{reg.fullName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">ID #{reg.id}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs text-slate-600 dark:text-slate-300">{reg.email}</p>
                        <p className="text-[10px] text-slate-400">{reg.phone}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs font-medium text-slate-700 dark:text-slate-200">{reg.faculty || "-"}</p>
                        <p className="text-[10px] text-slate-400">{reg.program}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-300">
                          {(reg.registrationType ?? "").replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {methodCfg ? (
                          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            <methodCfg.icon className="w-3.5 h-3.5" />
                            {methodCfg.label}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusCfg.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusCfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[10px] text-slate-400 whitespace-nowrap">{createdDate}</td>
                      <td className="px-4 py-3">
                        {isMidtrans ? (
                          <span className="text-[9px] text-slate-300 italic">Auto (Midtrans)</span>
                        ) : updatingId === reg.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                        ) : (
                          <StatusDropdown
                            current={reg.paymentStatus as PaymentStatus}
                            onChange={(v) => handleStatusChange(reg.id, v, false)}
                          />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusDropdown({ current, onChange }: {
  current: PaymentStatus;
  onChange: (v: PaymentStatus) => void;
}) {
  const [open, setOpen] = useState(false);
  const options: PaymentStatus[] = ["unpaid", "paid", "verified"];
  const currentCfg = STATUS_CONFIG[current] ?? STATUS_CONFIG.unpaid;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border cursor-pointer hover:opacity-80 transition-opacity ${currentCfg.color}`}
      >
        {currentCfg.label}
        <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-20 bg-card border border-slate-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden w-44 py-1">
            {options.map((opt) => {
              const cfg = STATUS_CONFIG[opt];
              const Icon = cfg.icon;
              return (
                <button
                  key={opt}
                  onClick={() => { onChange(opt); setOpen(false); }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-left text-[11px] font-semibold transition-colors hover:bg-slate-50 dark:hover:bg-white/5 ${opt === current ? "text-emerald-500" : "text-slate-600 dark:text-slate-300"}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cfg.label}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
