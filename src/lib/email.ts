import "server-only";
import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
export const adminEmail = process.env.ADMIN_EMAIL || "tiam.rainbow@gmail.com";
const fromEmail =
  process.env.RESEND_FROM_EMAIL || "Chez Jules <onboarding@resend.dev>";

let _resend: Resend | null = null;
export function getResend(): Resend | null {
  if (!apiKey) return null;
  if (!_resend) _resend = new Resend(apiKey);
  return _resend;
}

export function isResendConfigured() {
  return Boolean(apiKey);
}

type OrderEmailPayload = {
  orderId: string;
  email: string;
  totalCents: number;
  lines: { name: string; qty: number; unitPriceCents: number }[];
};

function fmt(cents: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export async function sendOrderEmails(payload: OrderEmailPayload) {
  const resend = getResend();
  if (!resend) return { ok: false, reason: "resend-not-configured" } as const;

  const linesHtml = payload.lines
    .map(
      (l) => `
        <tr>
          <td style="padding:8px 0;color:#1d2a23;">
            ${escapeHtml(l.name)} × ${l.qty}
          </td>
          <td style="padding:8px 0;text-align:right;color:#1d2a23;font-variant-numeric:tabular-nums;">
            ${fmt(l.unitPriceCents * l.qty)}
          </td>
        </tr>`
    )
    .join("");

  const adminHtml = `
    <!doctype html>
    <html><body style="font-family:system-ui,sans-serif;background:#FAF7F2;padding:24px;color:#1d2a23;">
      <div style="max-width:560px;margin:0 auto;background:#FFFBF3;border-radius:24px;padding:32px;border:1px solid rgba(0,0,0,.05);">
        <p style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#6b7268;margin:0 0 8px;">Nouvelle commande</p>
        <h1 style="font-family:Georgia,serif;font-weight:400;font-size:28px;color:#2F4A3A;margin:0 0 16px;">
          ${fmt(payload.totalCents)} de ${escapeHtml(payload.email)}
        </h1>
        <table style="width:100%;border-collapse:collapse;font-size:14px;border-top:1px solid rgba(0,0,0,.08);">
          ${linesHtml}
          <tr>
            <td style="padding:12px 0 0;border-top:1px solid rgba(0,0,0,.08);font-weight:600;">Total</td>
            <td style="padding:12px 0 0;border-top:1px solid rgba(0,0,0,.08);text-align:right;font-weight:600;">
              ${fmt(payload.totalCents)}
            </td>
          </tr>
        </table>
        <p style="margin-top:24px;font-size:12px;color:#6b7268;">
          Réf : ${payload.orderId.slice(0, 8)}…
        </p>
      </div>
    </body></html>
  `;

  const customerHtml = `
    <!doctype html>
    <html><body style="font-family:system-ui,sans-serif;background:#FAF7F2;padding:24px;color:#1d2a23;">
      <div style="max-width:560px;margin:0 auto;background:#FFFBF3;border-radius:24px;padding:32px;border:1px solid rgba(0,0,0,.05);">
        <h1 style="font-family:Georgia,serif;font-weight:400;font-size:28px;color:#2F4A3A;margin:0 0 8px;">
          Merci pour votre commande
        </h1>
        <p style="margin:0 0 16px;color:#6b7268;">
          Jules vient d'être prévenu et commence votre composition.
        </p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;border-top:1px solid rgba(0,0,0,.08);">
          ${linesHtml}
          <tr>
            <td style="padding:12px 0 0;border-top:1px solid rgba(0,0,0,.08);font-weight:600;">Total</td>
            <td style="padding:12px 0 0;border-top:1px solid rgba(0,0,0,.08);text-align:right;font-weight:600;">
              ${fmt(payload.totalCents)}
            </td>
          </tr>
        </table>
        <p style="margin-top:24px;font-size:13px;">
          À très vite,<br/>L'atelier Chez Jules
        </p>
      </div>
    </body></html>
  `;

  const [admin, customer] = await Promise.allSettled([
    resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `🌿 Nouvelle commande · ${fmt(payload.totalCents)}`,
      html: adminHtml,
    }),
    resend.emails.send({
      from: fromEmail,
      to: payload.email,
      subject: "Merci pour votre commande — Chez Jules",
      html: customerHtml,
    }),
  ]);

  return {
    ok: true,
    admin: admin.status === "fulfilled",
    customer: customer.status === "fulfilled",
  } as const;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
