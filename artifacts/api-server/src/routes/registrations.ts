import { Router, type IRouter } from "express";
import { db, registrationsTable, siteSettingsTable } from "@workspace/db";
import { CreateRegistrationBody } from "@workspace/api-zod";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getMidtransBase(): string {
  const isProd = process.env.MIDTRANS_IS_PRODUCTION === "true";
  return isProd
    ? "https://app.midtrans.com/snap/v1"
    : "https://app.sandbox.midtrans.com/snap/v1";
}

function midtransAuthHeader(): string {
  const serverKey = process.env.MIDTRANS_SERVER_KEY ?? "";
  return "Basic " + Buffer.from(serverKey + ":").toString("base64");
}

function getPaymentSettings(rawSettings: any) {
  const ps = rawSettings?.paymentSettings ?? {};
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

// ─── POST /registrations ─────────────────────────────────────────────────────
router.post("/registrations", async (req, res) => {
  try {
    const parsed = CreateRegistrationBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validation failed", details: parsed.error.format() });
      return;
    }
    const data = parsed.data;
    const [registration] = await db
      .insert(registrationsTable)
      .values({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        birthDate: data.birthDate,
        address: data.address,
        faculty: data.faculty,
        program: data.program,
        registrationType: data.registrationType,
        message: data.message ?? null,
      })
      .returning();

    res.status(201).json(registration);
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── GET /registrations ───────────────────────────────────────────────────────
router.get("/registrations", async (_req, res) => {
  try {
    const registrations = await db
      .select()
      .from(registrationsTable)
      .orderBy(registrationsTable.createdAt);
    res.json(registrations);
  } catch (err) {
    console.error("List registrations error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── POST /registrations/:id/payment-init ─────────────────────────────────────
// Initialises payment. For midtrans: creates Snap token.
// For bank_transfer: marks method and returns bank details.
router.post("/registrations/:id/payment-init", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

    const { paymentMethod } = req.body as { paymentMethod: "midtrans" | "bank_transfer" };
    if (!["midtrans", "bank_transfer"].includes(paymentMethod)) {
      res.status(400).json({ error: "Invalid paymentMethod" }); return;
    }

    const [registration] = await db
      .select()
      .from(registrationsTable)
      .where(eq(registrationsTable.id, id));

    if (!registration) { res.status(404).json({ error: "Registration not found" }); return; }

    // Fetch site settings for payment config
    let rawSettings: any = {};
    try {
      const rows = await db.select().from(siteSettingsTable);
      rawSettings = rows.reduce((acc: any, r: any) => { acc[r.key] = r.value; return acc; }, {});
    } catch { /* ignore */ }

    const ps = getPaymentSettings(rawSettings);

    if (paymentMethod === "bank_transfer") {
      await db
        .update(registrationsTable)
        .set({ paymentMethod: "bank_transfer" })
        .where(eq(registrationsTable.id, id));

      res.json({
        paymentMethod: "bank_transfer",
        bankName: ps.bankName,
        bankAccountNumber: ps.bankAccountNumber,
        bankAccountName: ps.bankAccountName,
        amount: ps.registrationFee,
      });
      return;
    }

    // Midtrans Snap
    if (!process.env.MIDTRANS_SERVER_KEY) {
      res.status(503).json({ error: "Midtrans server key not configured" }); return;
    }

    const orderId = `REG-${id}-${Date.now()}`;
    const snapBody = {
      transaction_details: {
        order_id: orderId,
        gross_amount: ps.registrationFee,
      },
      customer_details: {
        first_name: registration.fullName,
        email: registration.email,
        phone: registration.phone,
      },
      item_details: [
        {
          id: "REG-FEE",
          price: ps.registrationFee,
          quantity: 1,
          name: "Biaya Pendaftaran UNB",
        },
      ],
    };

    const snapRes = await fetch(`${getMidtransBase()}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: midtransAuthHeader(),
      },
      body: JSON.stringify(snapBody),
    });

    if (!snapRes.ok) {
      const errBody = await snapRes.text();
      console.error("Midtrans error:", errBody);
      res.status(502).json({ error: "Midtrans API error", detail: errBody }); return;
    }

    const snapData = await snapRes.json() as { token: string; redirect_url: string };

    await db
      .update(registrationsTable)
      .set({ paymentMethod: "midtrans", midtransOrderId: orderId })
      .where(eq(registrationsTable.id, id));

    res.json({
      paymentMethod: "midtrans",
      snapToken: snapData.token,
      redirectUrl: snapData.redirect_url,
      orderId,
      clientKey: ps.midtransClientKey,
      isProduction: ps.midtransIsProduction,
      amount: ps.registrationFee,
    });
  } catch (err) {
    console.error("Payment init error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── POST /registrations/midtrans-notify ──────────────────────────────────────
// Midtrans payment notification webhook
router.post("/registrations/midtrans-notify", async (req, res) => {
  try {
    const body = req.body as {
      order_id: string;
      transaction_status: string;
      fraud_status?: string;
      payment_type?: string;
      signature_key?: string;
      gross_amount: string;
      status_code: string;
    };

    // Verify signature: sha512(order_id + status_code + gross_amount + serverKey)
    const serverKey = process.env.MIDTRANS_SERVER_KEY ?? "";
    const { createHash } = await import("crypto");
    const rawSig = body.order_id + body.status_code + body.gross_amount + serverKey;
    const expectedSig = createHash("sha512").update(rawSig).digest("hex");
    if (body.signature_key && body.signature_key !== expectedSig) {
      res.status(403).json({ error: "Invalid signature" }); return;
    }

    const orderId = body.order_id;
    const transStatus = body.transaction_status;
    const fraudStatus = body.fraud_status;

    let paymentStatus: string = "unpaid";
    if (transStatus === "capture") {
      paymentStatus = fraudStatus === "challenge" ? "unpaid" : "paid";
    } else if (transStatus === "settlement") {
      paymentStatus = "paid";
    } else if (["cancel", "deny", "expire"].includes(transStatus)) {
      paymentStatus = "unpaid";
    } else if (transStatus === "pending") {
      paymentStatus = "unpaid";
    }

    await db
      .update(registrationsTable)
      .set({
        paymentStatus,
        midtransPaymentType: body.payment_type ?? null,
      })
      .where(eq(registrationsTable.midtransOrderId, orderId));

    res.json({ ok: true });
  } catch (err) {
    console.error("Midtrans notify error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── PATCH /registrations/:id/payment-status ─────────────────────────────────
// Admin manually updates payment status (for bank_transfer)
router.patch("/registrations/:id/payment-status", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

    const { paymentStatus } = req.body as { paymentStatus: string };
    if (!["unpaid", "paid", "verified"].includes(paymentStatus)) {
      res.status(400).json({ error: "Invalid paymentStatus" }); return;
    }

    const [updated] = await db
      .update(registrationsTable)
      .set({ paymentStatus })
      .where(eq(registrationsTable.id, id))
      .returning();

    if (!updated) { res.status(404).json({ error: "Not found" }); return; }

    res.json(updated);
  } catch (err) {
    console.error("Update payment status error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
