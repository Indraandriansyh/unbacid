import { Router, type IRouter } from "express";
import { db, registrationsTable } from "@workspace/db";
import { CreateRegistrationBody } from "@workspace/api-zod";

const router: IRouter = Router();

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

export default router;
