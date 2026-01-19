import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, "data", "subscribers.json");
const FRONTEND_DIR = path.join(__dirname, "..", "frontend");
const PORT = process.env.PORT || 3000;
const {
  SMTP_URL,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_SECURE,
  NOTIFY_EMAIL,
  NOTIFY_FROM
} = process.env;

const app = express();
app.use(cors());
app.use(express.json());

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "");
}

async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, "[]", "utf8");
  }
}

async function loadSubscribers() {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, "utf8");
  return JSON.parse(raw || "[]");
}

async function saveSubscribers(list) {
  await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), "utf8");
}

function buildTransport() {
  if (SMTP_URL) {
    return nodemailer.createTransport(SMTP_URL);
  }

  if (SMTP_HOST) {
    return nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: String(SMTP_SECURE || "").toLowerCase() === "true" || Number(SMTP_PORT) === 465,
      auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined
    });
  }

  return null;
}

async function notifyOwner(email, seriesTitle) {
  if (!NOTIFY_EMAIL) return;

  const transport = buildTransport();
  if (!transport) {
    console.warn("Notification skipped: no SMTP configuration set");
    return;
  }

  const subject = `[${seriesTitle || "Dienstagsfortbildung"}] Neue Anmeldung`;
  const text = `Neue Anmeldung eingegangen:\nE-Mail: ${email}\nReihe: ${seriesTitle || "Dienstagsfortbildung 2026"}\nZeitpunkt: ${new Date().toISOString()}`;

  await transport.sendMail({
    from: NOTIFY_FROM || SMTP_USER || "no-reply@example.com",
    to: NOTIFY_EMAIL,
    subject,
    text
  });
}

async function notifySubscriber(email, seriesTitle) {
  const transport = buildTransport();
  if (!transport) {
    console.warn("Subscriber notification skipped: no SMTP configuration set");
    return;
  }

  const subject = `[${seriesTitle || "Dienstagsfortbildung"}] Anmeldung bestaetigt`;
  const text = `Vielen Dank fuer Ihre Anmeldung zur Reihe "${seriesTitle || "Dienstagsfortbildung 2026"}".\nIhre Adresse: ${email}\nZeitpunkt: ${new Date().toISOString()}`;

  await transport.sendMail({
    from: NOTIFY_FROM || SMTP_USER || "no-reply@example.com",
    to: email,
    subject,
    text
  });
}

async function notifyOwnerUnsubscribe(email, seriesTitle) {
  if (!NOTIFY_EMAIL) return;

  const transport = buildTransport();
  if (!transport) {
    console.warn("Unsubscribe notification skipped: no SMTP configuration set");
    return;
  }

  const subject = `[${seriesTitle || "Dienstagsfortbildung"}] Abmeldung`;
  const text = `Abmeldung erfolgt:\nE-Mail: ${email}\nReihe: ${seriesTitle || "Dienstagsfortbildung 2026"}\nZeitpunkt: ${new Date().toISOString()}`;

  await transport.sendMail({
    from: NOTIFY_FROM || SMTP_USER || "no-reply@example.com",
    to: NOTIFY_EMAIL,
    subject,
    text
  });
}

async function notifySubscriberUnsubscribe(email, seriesTitle) {
  const transport = buildTransport();
  if (!transport) {
    console.warn("Unsubscribe confirmation skipped: no SMTP configuration set");
    return;
  }

  const subject = `[${seriesTitle || "Dienstagsfortbildung"}] Abmeldung bestaetigt`;
  const text = `Sie wurden erfolgreich von der Reihe "${seriesTitle || "Dienstagsfortbildung 2026"}" abgemeldet.\n\nIhre Adresse: ${email}\nZeitpunkt: ${new Date().toISOString()}\n\nWir hoffen, Sie bald wieder begrüßen zu dürfen!`;

  await transport.sendMail({
    from: NOTIFY_FROM || SMTP_USER || "no-reply@example.com",
    to: email,
    subject,
    text
  });
}

app.post("/api/subscribe", async (req, res) => {
  const { email, seriesTitle } = req.body || {};
  if (!isValidEmail(email)) return res.status(400).json({ error: "Bitte geben Sie eine gültige E-Mail-Adresse ein." });

  const list = await loadSubscribers();
  const existing = list.find((e) => e.email === email);
  
  if (!existing) {
    list.push({ email, seriesTitle: seriesTitle || "Dienstagsfortbildung 2026", createdAt: new Date().toISOString() });
    await saveSubscribers(list);
    try {
      await notifyOwner(email, seriesTitle);
    } catch (err) {
      console.error("Failed to send owner notification", err);
    }
    try {
      await notifySubscriber(email, seriesTitle);
    } catch (err) {
      console.error("Failed to send subscriber notification", err);
    }
    res.json({ 
      ok: true, 
      message: "Vielen Dank für Ihre Anmeldung! Sie erhalten in Kürze eine Bestätigungsmail.",
      email 
    });
  } else {
    res.json({ 
      ok: true, 
      message: "Diese E-Mail-Adresse ist bereits angemeldet.",
      email 
    });
  }
});

app.post("/api/unsubscribe", async (req, res) => {
  const { email } = req.body || {};
  if (!isValidEmail(email)) return res.status(400).json({ error: "Bitte geben Sie eine gültige E-Mail-Adresse ein." });

  const list = await loadSubscribers();
  const existing = list.find((e) => e.email === email);
  const next = list.filter((e) => e.email !== email);
  await saveSubscribers(next);
  
  if (existing) {
    try {
      await notifyOwnerUnsubscribe(email, existing.seriesTitle);
    } catch (err) {
      console.error("Failed to send owner unsubscribe notification", err);
    }
    try {
      await notifySubscriberUnsubscribe(email, existing.seriesTitle);
    } catch (err) {
      console.error("Failed to send subscriber unsubscribe confirmation", err);
    }
    res.json({ 
      ok: true, 
      message: "Sie wurden erfolgreich abgemeldet. Schade, dass Sie gehen!",
      email 
    });
  } else {
    res.json({ 
      ok: true, 
      message: "Diese E-Mail-Adresse war nicht in unserer Liste.",
      email 
    });
  }
});

app.post("/api/notify", async (req, res) => {
  // This demo endpoint just logs; wire to SMTP/Mail API in production.
  const { subject = "Dienstagsfortbildung Update", body = "Next lecture info", emails } = req.body || {};
  const list = emails && Array.isArray(emails) ? emails : (await loadSubscribers()).map((e) => e.email);
  console.log("Notify would send to:", list);
  res.json({ ok: true, recipients: list.length, subject, bodyPreview: String(body).slice(0, 80) });
});

app.get("/health", (_req, res) => res.json({ ok: true }));

// Serve frontend for local dev so /api and UI share one origin
app.use(express.static(FRONTEND_DIR));
app.get("*", (_req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Backend listening on :${PORT}`);
});
