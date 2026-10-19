import { Resend } from "resend";

// Vercel caps request bodies at 4.5 MB, so attachments stay under 4 MB total.
export const MAX_BYTES = 4 * 1024 * 1024;

export class UserError extends Error {}

export function text(fd, key, max = 2000) {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export function isEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// Honeypot field plus a minimum fill time. Bots get a fake success.
export function isSpam(fd) {
  if (text(fd, "website")) return true;
  const t = Number(text(fd, "t"));
  return !t || Date.now() - t < 3000;
}

export async function getFiles(fd, key, allowed) {
  const files = fd.getAll(key).filter((f) => f && typeof f === "object" && "arrayBuffer" in f && f.size > 0);
  let total = 0;
  const out = [];
  for (const f of files) {
    const ext = (f.name.split(".").pop() || "").toLowerCase();
    if (!allowed.includes(ext)) throw new UserError(`${f.name} is not an accepted file type.`);
    total += f.size;
    if (total > MAX_BYTES) throw new UserError("Attachments must total under 4 MB.");
    out.push({ filename: f.name.replace(/[^\w.\- ]+/g, "_"), content: Buffer.from(await f.arrayBuffer()) });
  }
  return out;
}

export function table(rows) {
  const tr = rows
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="color:#555;vertical-align:top;white-space:nowrap;padding:6px 12px 6px 0"><strong>${esc(k)}</strong></td><td style="padding:6px 0">${esc(v).replace(/\n/g, "<br>")}</td></tr>`
    )
    .join("");
  return `<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">${tr}</table>`;
}

export function recipients(envName) {
  return (process.env[envName] || process.env.MAIL_TO || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function sendMail({ to, subject, html, replyTo, attachments }) {
  if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is not set");
  if (!process.env.MAIL_FROM) throw new Error("MAIL_FROM is not set");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: process.env.MAIL_FROM,
    to,
    subject,
    html,
    replyTo,
    attachments: attachments && attachments.length ? attachments : undefined,
  });
  if (error) throw new Error(error.message || "Email failed");
}

export function wantsConfirmation() {
  return process.env.SEND_CONFIRMATION !== "false";
}

export function fail(e) {
  if (e instanceof UserError) return Response.json({ error: e.message }, { status: 400 });
  console.error(e);
  return Response.json({ error: "The form could not be sent." }, { status: 500 });
}
