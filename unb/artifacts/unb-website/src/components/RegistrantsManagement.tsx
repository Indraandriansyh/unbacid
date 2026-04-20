import { useState } from "react";
import { useListRegistrations } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getListRegistrationsQueryKey } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import {
  Users2, Search, RefreshCw, ChevronDown, CheckCircle2,
  Clock, XCircle, AlertCircle, Building2, CreditCard, Loader2,
  Download, FileText
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

function formatDate(dateStr: string | null | undefined, includeTime = false): string {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const opts: Intl.DateTimeFormatOptions = { day: "2-digit", month: "long", year: "numeric" };
  if (includeTime) { opts.hour = "2-digit"; opts.minute = "2-digit"; }
  return d.toLocaleDateString("id-ID", opts);
}

function formatStatus(status: string): string {
  const map: Record<string, string> = {
    unpaid: "Belum Bayar",
    paid: "Sudah Bayar (Menunggu Verifikasi)",
    verified: "Terverifikasi",
  };
  return map[status] ?? status;
}

function formatMethod(method: string | null): string {
  if (!method) return "-";
  const map: Record<string, string> = {
    midtrans: "Midtrans (Online)",
    bank_transfer: "Transfer Bank",
  };
  return map[method] ?? method;
}

function formatJalur(type: string | null): string {
  if (!type) return "-";
  return type.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

// ─── CV-style PDF for single registrant ──────────────────────────────────────
function downloadSingleCV(reg: any) {
  const statusLabel = formatStatus(reg.paymentStatus ?? "unpaid");
  const methodLabel = formatMethod(reg.paymentMethod);
  const jalurLabel  = formatJalur(reg.registrationType);
  const tglDaftar   = formatDate(reg.createdAt, true);
  const tglLahir    = formatDate(reg.birthDate);

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8"/>
<title>Data Pendaftar - ${reg.fullName}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; background:#fff; color:#1a1a2e; font-size:13px; }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .no-print { display:none !important; }
    @page { margin: 0; }
    .page { padding: 0; }
  }

  .page { max-width:794px; margin:0 auto; padding:20px; }

  /* Header strip */
  .header { background: linear-gradient(135deg, #065f46, #059669); color:#fff; padding:32px 36px; border-radius:12px 12px 0 0; display:flex; align-items:center; gap:24px; }
  .header-logo { width:64px; height:64px; background:rgba(255,255,255,0.2); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:28px; font-weight:900; flex-shrink:0; }
  .header-info h1 { font-size:22px; font-weight:800; letter-spacing:-0.5px; }
  .header-info p { font-size:11px; opacity:0.8; margin-top:4px; }
  .header-id { margin-left:auto; text-align:right; }
  .header-id .id-num { font-size:28px; font-weight:900; opacity:0.5; }
  .header-id .id-label { font-size:10px; opacity:0.6; text-transform:uppercase; letter-spacing:1px; }

  /* Status badge */
  .status-bar { background:#f0fdf4; border-left:4px solid #059669; padding:10px 20px; display:flex; align-items:center; justify-content:space-between; gap:12px; }
  .status-bar.unpaid { background:#fff1f2; border-color:#e11d48; }
  .status-bar.paid   { background:#fefce8; border-color:#d97706; }
  .status-bar .status-label { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; }
  .status-bar .tgl { font-size:11px; color:#6b7280; }

  /* Sections */
  .sections { background:#fff; border:1px solid #e5e7eb; border-top:none; border-radius:0 0 12px 12px; overflow:hidden; }
  .section { padding:20px 28px; border-bottom:1px solid #f3f4f6; }
  .section:last-child { border-bottom:none; }
  .section-title { font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:1.5px; color:#059669; margin-bottom:14px; display:flex; align-items:center; gap:6px; }
  .section-title::before { content:''; display:inline-block; width:3px; height:14px; background:#059669; border-radius:2px; }

  /* Grid rows */
  .grid2 { display:grid; grid-template-columns:1fr 1fr; gap:12px 24px; }
  .grid3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px 16px; }
  .field { }
  .field-label { font-size:10px; font-weight:600; color:#9ca3af; text-transform:uppercase; letter-spacing:0.8px; margin-bottom:3px; }
  .field-value { font-size:13px; font-weight:600; color:#111827; }
  .field-value.mono { font-family: monospace; }
  .field-value.address { line-height:1.5; font-weight:400; color:#374151; white-space:pre-wrap; }
  .field-value.message { line-height:1.6; font-weight:400; color:#374151; font-style:italic; background:#f9fafb; padding:10px 14px; border-radius:8px; border-left:3px solid #d1fae5; }

  /* Payment section */
  .payment-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .payment-card { background:#f9fafb; border-radius:10px; padding:14px 16px; }
  .payment-card-label { font-size:10px; font-weight:700; color:#9ca3af; text-transform:uppercase; letter-spacing:0.8px; margin-bottom:6px; }
  .payment-card-value { font-size:14px; font-weight:700; color:#111827; }
  .payment-card-value.green { color:#059669; }
  .payment-card-value.yellow { color:#d97706; }
  .payment-card-value.red { color:#e11d48; }

  /* Footer */
  .footer { margin-top:16px; padding:12px 20px; background:#f9fafb; border-radius:8px; display:flex; justify-content:space-between; align-items:center; font-size:10px; color:#9ca3af; }

  /* Print button */
  .no-print { text-align:center; padding:24px; }
  .btn-print { background:#059669; color:white; border:none; padding:12px 32px; border-radius:8px; font-size:14px; font-weight:700; cursor:pointer; }
  .btn-print:hover { background:#047857; }
</style>
</head>
<body>
<div class="page">

  <!-- Header -->
  <div class="header">
    <div class="header-logo">UNB</div>
    <div class="header-info">
      <h1>${reg.fullName ?? "-"}</h1>
      <p>Calon Mahasiswa Baru · Universitas Nusa Bangsa · Bogor</p>
    </div>
    <div class="header-id">
      <div class="id-num">#${String(reg.id).padStart(4, "0")}</div>
      <div class="id-label">No. Daftar</div>
    </div>
  </div>

  <!-- Status bar -->
  <div class="status-bar ${reg.paymentStatus ?? 'unpaid'}">
    <span class="status-label">Status: ${statusLabel}</span>
    <span class="tgl">Terdaftar: ${tglDaftar}</span>
  </div>

  <div class="sections">

    <!-- Data Pribadi -->
    <div class="section">
      <div class="section-title">Data Pribadi</div>
      <div class="grid2">
        <div class="field">
          <div class="field-label">Nama Lengkap</div>
          <div class="field-value">${reg.fullName ?? "-"}</div>
        </div>
        <div class="field">
          <div class="field-label">Tanggal Lahir</div>
          <div class="field-value">${tglLahir}</div>
        </div>
        <div class="field">
          <div class="field-label">Email</div>
          <div class="field-value mono">${reg.email ?? "-"}</div>
        </div>
        <div class="field">
          <div class="field-label">No. Telepon / WhatsApp</div>
          <div class="field-value mono">${reg.phone ?? "-"}</div>
        </div>
      </div>
      <div style="margin-top:12px">
        <div class="field">
          <div class="field-label">Alamat</div>
          <div class="field-value address">${reg.address ?? "-"}</div>
        </div>
      </div>
    </div>

    <!-- Pilihan Studi -->
    <div class="section">
      <div class="section-title">Pilihan Program Studi</div>
      <div class="grid3">
        <div class="field">
          <div class="field-label">Fakultas</div>
          <div class="field-value">${reg.faculty ?? "-"}</div>
        </div>
        <div class="field">
          <div class="field-label">Program Studi</div>
          <div class="field-value">${reg.program ?? "-"}</div>
        </div>
        <div class="field">
          <div class="field-label">Jalur Pendaftaran</div>
          <div class="field-value">${jalurLabel}</div>
        </div>
      </div>
    </div>

    <!-- Informasi Pembayaran -->
    <div class="section">
      <div class="section-title">Informasi Pembayaran</div>
      <div class="payment-grid">
        <div class="payment-card">
          <div class="payment-card-label">Metode Pembayaran</div>
          <div class="payment-card-value">${methodLabel}</div>
        </div>
        <div class="payment-card">
          <div class="payment-card-label">Status Pembayaran</div>
          <div class="payment-card-value ${reg.paymentStatus === 'verified' ? 'green' : reg.paymentStatus === 'paid' ? 'yellow' : 'red'}">${statusLabel}</div>
        </div>
      </div>
    </div>

    ${reg.message ? `
    <!-- Pesan -->
    <div class="section">
      <div class="section-title">Pesan / Catatan Pendaftar</div>
      <div class="field-value message">${reg.message}</div>
    </div>
    ` : ""}

  </div>

  <!-- Footer -->
  <div class="footer">
    <span>Dokumen ini digenerate otomatis oleh sistem · Universitas Nusa Bangsa</span>
    <span>ID Pendaftar: #${String(reg.id).padStart(4, "0")} · ${tglDaftar}</span>
  </div>

  <!-- Print button (hidden on print) -->
  <div class="no-print">
    <button class="btn-print" onclick="window.print()">Cetak / Simpan PDF</button>
  </div>
</div>
</body>
</html>`;

  const win = window.open("", "_blank", "width=860,height=700,scrollbars=yes");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
}

// ─── Table PDF for all/filtered registrants ───────────────────────────────────
function downloadTablePDF(regs: any[], title: string) {
  const rows = regs.map((r, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><strong>${r.fullName ?? "-"}</strong><br/><span class="sub">#${String(r.id).padStart(4,"0")}</span></td>
      <td>${r.email ?? "-"}<br/><span class="sub">${r.phone ?? "-"}</span></td>
      <td>${formatDate(r.birthDate)}</td>
      <td>${r.faculty ?? "-"}<br/><span class="sub">${r.program ?? "-"}</span></td>
      <td>${formatJalur(r.registrationType)}</td>
      <td>${formatMethod(r.paymentMethod)}</td>
      <td class="status-${r.paymentStatus ?? 'unpaid'}">${formatStatus(r.paymentStatus ?? "unpaid")}</td>
      <td>${formatDate(r.createdAt)}</td>
    </tr>`).join("");

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8"/>
<title>${title}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; font-size:11px; color:#111; background:#fff; }
  @media print {
    body { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
    .no-print { display:none !important; }
    @page { margin:10mm 8mm; size: A4 landscape; }
  }
  .page { padding:24px; max-width:1100px; margin:0 auto; }
  .hdr { display:flex; align-items:center; gap:16px; padding-bottom:16px; border-bottom:3px solid #059669; margin-bottom:16px; }
  .hdr-logo { background:#059669; color:#fff; font-size:18px; font-weight:900; width:44px; height:44px; display:flex; align-items:center; justify-content:center; border-radius:8px; flex-shrink:0; }
  .hdr-text h1 { font-size:16px; font-weight:800; color:#059669; }
  .hdr-text p  { font-size:10px; color:#6b7280; margin-top:2px; }
  .hdr-meta { margin-left:auto; text-align:right; font-size:10px; color:#9ca3af; }
  table { width:100%; border-collapse:collapse; margin-top:0; }
  thead tr { background:#059669; color:#fff; }
  thead th { padding:8px 10px; text-align:left; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; white-space:nowrap; }
  tbody tr:nth-child(even) { background:#f0fdf4; }
  tbody tr:hover { background:#d1fae5; }
  tbody td { padding:8px 10px; vertical-align:top; border-bottom:1px solid #e5e7eb; }
  .sub { font-size:9px; color:#9ca3af; }
  .status-verified { color:#059669; font-weight:700; }
  .status-paid     { color:#d97706; font-weight:700; }
  .status-unpaid   { color:#e11d48; font-weight:700; }
  .summary { display:flex; gap:12px; margin-bottom:16px; }
  .sum-card { flex:1; background:#f9fafb; border-radius:8px; padding:10px 14px; border-top:3px solid #e5e7eb; }
  .sum-card.green { border-color:#059669; }
  .sum-card.yellow { border-color:#d97706; }
  .sum-card.red { border-color:#e11d48; }
  .sum-card .num { font-size:22px; font-weight:900; }
  .sum-card .lbl { font-size:9px; font-weight:600; color:#6b7280; text-transform:uppercase; letter-spacing:0.5px; }
  .footer { margin-top:16px; text-align:center; font-size:9px; color:#9ca3af; border-top:1px solid #e5e7eb; padding-top:10px; }
  .no-print { text-align:center; padding:20px; }
  .btn-print { background:#059669; color:white; border:none; padding:10px 28px; border-radius:8px; font-size:13px; font-weight:700; cursor:pointer; }
</style>
</head>
<body>
<div class="page">
  <div class="hdr">
    <div class="hdr-logo">UNB</div>
    <div class="hdr-text">
      <h1>${title}</h1>
      <p>Universitas Nusa Bangsa · Jl. KH. Sholeh Iskandar KM.4, Bogor</p>
    </div>
    <div class="hdr-meta">
      <div>Dicetak: ${formatDate(new Date().toISOString(), true)}</div>
      <div>Total: <strong>${regs.length} pendaftar</strong></div>
    </div>
  </div>

  <div class="summary">
    <div class="sum-card">
      <div class="num">${regs.length}</div>
      <div class="lbl">Total Pendaftar</div>
    </div>
    <div class="sum-card green">
      <div class="num" style="color:#059669">${regs.filter(r=>r.paymentStatus==="verified").length}</div>
      <div class="lbl">Terverifikasi</div>
    </div>
    <div class="sum-card yellow">
      <div class="num" style="color:#d97706">${regs.filter(r=>r.paymentStatus==="paid").length}</div>
      <div class="lbl">Sudah Bayar</div>
    </div>
    <div class="sum-card red">
      <div class="num" style="color:#e11d48">${regs.filter(r=>r.paymentStatus==="unpaid").length}</div>
      <div class="lbl">Belum Bayar</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>No.</th>
        <th>Nama / ID</th>
        <th>Kontak</th>
        <th>Tgl. Lahir</th>
        <th>Fakultas / Prodi</th>
        <th>Jalur</th>
        <th>Metode Bayar</th>
        <th>Status Bayar</th>
        <th>Tgl. Daftar</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <div class="footer">Dokumen ini digenerate otomatis oleh Sistem Informasi PMB Universitas Nusa Bangsa · ${formatDate(new Date().toISOString(), true)}</div>

  <div class="no-print">
    <button class="btn-print" onclick="window.print()">Cetak / Simpan PDF</button>
  </div>
</div>
</body>
</html>`;

  const win = window.open("", "_blank", "width=1140,height=740,scrollbars=yes");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
}

// ─── Main Component ───────────────────────────────────────────────────────────
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

  const handleDownloadAll = () => {
    if (filtered.length === 0) {
      toast({ variant: "destructive", title: "Tidak ada data", description: "Tidak ada pendaftar untuk didownload." });
      return;
    }
    const filterLabel = filterTab === "all" ? "Semua" : STATUS_CONFIG[filterTab]?.label ?? filterTab;
    const title = `Data Pendaftar Mahasiswa Baru UNB${filterTab !== "all" ? ` — ${filterLabel}` : ""}`;
    downloadTablePDF(filtered, title);
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
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadAll}
            className="gap-2 text-emerald-700 border-emerald-300 hover:bg-emerald-50"
          >
            <FileText className="w-4 h-4" />
            Download PDF ({filtered.length})
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="gap-2 text-slate-500 border-slate-300"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
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
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Status Bayar
                    <span className="ml-1 text-[8px] font-normal normal-case text-slate-300">(klik untuk ubah)</span>
                  </th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-400">Tanggal</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-400">PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filtered.map((reg: any, idx: number) => {
                  const statusCfg = STATUS_CONFIG[reg.paymentStatus as PaymentStatus] ?? STATUS_CONFIG.unpaid;
                  const methodCfg = reg.paymentMethod ? METHOD_CONFIG[reg.paymentMethod] : null;
                  const isMidtrans = reg.paymentMethod === "midtrans";
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
                        {updatingId === reg.id ? (
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusCfg.color}`}>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Menyimpan...
                          </span>
                        ) : isMidtrans ? (
                          <div className="space-y-1">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusCfg.color}`}>
                              {(() => { const I = statusCfg.icon; return <I className="w-3 h-3" />; })()}
                              {statusCfg.label}
                            </span>
                            <p className="text-[9px] text-slate-400 italic">Auto via Midtrans</p>
                          </div>
                        ) : (
                          <StatusDropdown
                            current={reg.paymentStatus as PaymentStatus}
                            onChange={(v) => handleStatusChange(reg.id, v, false)}
                          />
                        )}
                      </td>
                      <td className="px-4 py-3 text-[10px] text-slate-400 whitespace-nowrap">{createdDate}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => downloadSingleCV(reg)}
                          title={`Download CV PDF - ${reg.fullName}`}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 transition-colors text-[10px] font-bold"
                        >
                          <Download className="w-3.5 h-3.5" />
                          CV
                        </button>
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
