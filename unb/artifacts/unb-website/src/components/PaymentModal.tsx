import { useState, useEffect } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { Loader2, CreditCard, Building2, CheckCircle2, Copy, MessageCircle, ArrowRight, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentModalProps {
  registrationId: number;
  registrantName: string;
  onClose: () => void;
  onPaymentComplete: () => void;
}

interface PaymentInitResult {
  paymentMethod: "midtrans" | "bank_transfer";
  // midtrans
  snapToken?: string;
  redirectUrl?: string;
  orderId?: string;
  clientKey?: string;
  isProduction?: boolean;
  // bank_transfer
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  amount?: number;
}

function getPaymentSettings(settings: any) {
  const ps = (settings as any)?.paymentSettings ?? {};
  return {
    midtransEnabled: ps.midtransEnabled === true,
    midtransClientKey: ps.midtransClientKey ?? "",
    midtransIsProduction: ps.midtransIsProduction === true,
    bankName: ps.bankName ?? "BJB Syariah",
    bankAccountNumber: ps.bankAccountNumber ?? "0040102001205",
    bankAccountName: ps.bankAccountName ?? "Universitas Nusa Bangsa",
    registrationFee: ps.registrationFee ?? 300000,
  };
}

function formatRupiah(n: number): string {
  return "Rp " + n.toLocaleString("id-ID");
}

function loadSnapScript(clientKey: string, isProd: boolean): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.getElementById("midtrans-snap-script");
    if (existing) { resolve(); return; }
    const script = document.createElement("script");
    script.id = "midtrans-snap-script";
    script.src = isProd
      ? "https://app.midtrans.com/snap/snap.js"
      : "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", clientKey);
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Snap.js"));
    document.head.appendChild(script);
  });
}

export default function PaymentModal({ registrationId, registrantName, onClose, onPaymentComplete }: PaymentModalProps) {
  const { settings } = useSettings();
  const { toast } = useToast();
  const ps = getPaymentSettings(settings);

  const [step, setStep] = useState<"choose" | "bank_transfer" | "processing" | "done">("choose");
  const [isLoading, setIsLoading] = useState(false);
  const [bankInfo, setBankInfo] = useState<PaymentInitResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleMidtrans = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/registrations/${registrationId}/payment-init`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethod: "midtrans" }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Gagal inisiasi pembayaran");
      }
      const data: PaymentInitResult = await res.json();

      const clientKey = data.clientKey ?? ps.midtransClientKey;
      const isProd = data.isProduction ?? ps.midtransIsProduction;

      await loadSnapScript(clientKey, isProd);

      const snap = (window as any).snap;
      if (!snap) throw new Error("Midtrans Snap tidak tersedia");

      snap.pay(data.snapToken, {
        onSuccess: () => {
          setStep("done");
          onPaymentComplete();
        },
        onPending: () => {
          toast({ title: "Pembayaran Pending", description: "Selesaikan pembayaran Anda segera." });
          onPaymentComplete();
          onClose();
        },
        onError: () => {
          toast({ variant: "destructive", title: "Pembayaran Gagal", description: "Silakan coba lagi." });
        },
        onClose: () => {
          // User closed popup without paying - don't close our modal
        },
      });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBankTransfer = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/registrations/${registrationId}/payment-init`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethod: "bank_transfer" }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Gagal");
      }
      const data: PaymentInitResult = await res.json();
      setBankInfo(data);
      setStep("bank_transfer");
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const copyAccount = () => {
    const num = bankInfo?.bankAccountNumber ?? ps.bankAccountNumber;
    navigator.clipboard.writeText(num).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const getWaConfirmLink = () => {
    const waNum = (settings as any)?.registrationContent?.whatsappNumber ?? "6281234567890";
    const amount = bankInfo?.amount ?? ps.registrationFee;
    const msg = encodeURIComponent(
      `Assalamu'alaikum Admin PMB UNB,\n\nSaya *${registrantName}* telah melakukan pembayaran biaya pendaftaran sebesar *${formatRupiah(amount)}* via Transfer Bank.\n\nNo. ID Pendaftaran: *${registrationId}*\n\nMohon konfirmasi pembayaran saya. Bukti transfer terlampir.\n\nTerima kasih.`
    );
    return `https://wa.me/${waNum}?text=${msg}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-md bg-card border border-white/10 rounded-[35px] shadow-2xl overflow-hidden transition-colors duration-500">
        {/* Header */}
        <div className="bg-emerald-500/10 border-b border-white/10 px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">Pembayaran Pendaftaran</h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/70 mt-0.5">
              {formatRupiah(bankInfo?.amount ?? ps.registrationFee)} · No. {registrationId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-emerald-400 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* ─── Step: Choose method ─── */}
        {step === "choose" && (
          <div className="p-8 space-y-4">
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Pilih metode pembayaran untuk menyelesaikan pendaftaran Anda. Biaya pendaftaran sebesar <strong className="text-white">{formatRupiah(ps.registrationFee)}</strong>.
            </p>

            {ps.midtransEnabled && ps.midtransClientKey && (
              <button
                onClick={handleMidtrans}
                disabled={isLoading}
                className="w-full flex items-center gap-4 bg-emerald-500 hover:bg-emerald-400 text-white p-5 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 group disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin shrink-0" />
                ) : (
                  <CreditCard className="w-6 h-6 shrink-0" />
                )}
                <div className="text-left flex-1">
                  <p className="text-sm font-black uppercase tracking-wider">Bayar dengan Midtrans</p>
                  <p className="text-[10px] text-emerald-100/70 mt-0.5">Transfer Bank, QRIS, Dompet Digital, dll</p>
                </div>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            <button
              onClick={handleBankTransfer}
              disabled={isLoading}
              className="w-full flex items-center gap-4 bg-card hover:bg-white/5 border border-white/10 hover:border-emerald-500/30 text-white p-5 rounded-2xl transition-all group disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin shrink-0 text-emerald-400" />
              ) : (
                <Building2 className="w-6 h-6 shrink-0 text-emerald-400" />
              )}
              <div className="text-left flex-1">
                <p className="text-sm font-black uppercase tracking-wider">Transfer Bank</p>
                <p className="text-[10px] text-emerald-500/60 mt-0.5">BJB Syariah · Konfirmasi via WhatsApp</p>
              </div>
              <ArrowRight size={16} className="text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </button>

            <p className="text-[9px] text-gray-500 text-center pt-2">
              Dengan melakukan pembayaran, Anda menyetujui syarat & ketentuan pendaftaran Universitas Nusa Bangsa.
            </p>
          </div>
        )}

        {/* ─── Step: Bank Transfer ─── */}
        {step === "bank_transfer" && (
          <div className="p-8 space-y-6">
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Building2 size={18} className="text-emerald-400" />
                <span className="text-sm font-black uppercase tracking-wider text-white">
                  {bankInfo?.bankName ?? ps.bankName}
                </span>
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-500/60 mb-1">Nomor Rekening</p>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-mono font-black text-white tracking-wider">
                    {bankInfo?.bankAccountNumber ?? ps.bankAccountNumber}
                  </span>
                  <button
                    onClick={copyAccount}
                    className="text-[9px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
                  >
                    {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                    {copied ? "Tersalin" : "Salin"}
                  </button>
                </div>
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-500/60 mb-1">Atas Nama</p>
                <p className="text-sm font-bold text-white">{bankInfo?.bankAccountName ?? ps.bankAccountName}</p>
              </div>

              <div className="border-t border-white/5 pt-4">
                <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-500/60 mb-1">Jumlah Transfer</p>
                <p className="text-2xl font-black text-emerald-400">
                  {formatRupiah(bankInfo?.amount ?? ps.registrationFee)}
                </p>
                <p className="text-[9px] text-gray-500 mt-1">Transfer tepat sesuai nominal di atas agar mudah dikonfirmasi.</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-gray-400 leading-relaxed">
                Setelah transfer, klik tombol di bawah untuk mengirimkan bukti transfer ke Admin PMB melalui WhatsApp.
              </p>
              <a
                href={getWaConfirmLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full bg-green-500 hover:bg-green-400 text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-green-500/20"
                onClick={() => { onPaymentComplete(); }}
              >
                <MessageCircle size={18} />
                Konfirmasi Pembayaran via WhatsApp
              </a>
              <button
                onClick={() => setStep("choose")}
                className="w-full text-[9px] font-bold uppercase tracking-widest text-gray-500 hover:text-gray-300 transition-colors py-2"
              >
                ← Kembali ke pilihan pembayaran
              </button>
            </div>
          </div>
        )}

        {/* ─── Step: Done ─── */}
        {step === "done" && (
          <div className="p-10 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
              <CheckCircle2 size={40} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-2">Pembayaran Berhasil!</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Terima kasih {registrantName}! Pendaftaran Anda sedang diproses. Kami akan menghubungi Anda melalui email atau WhatsApp.
              </p>
            </div>
            <button
              onClick={onClose}
              className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors"
            >
              Tutup
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
