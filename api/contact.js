/**
 * Form endpoint — sends email via Resend (https://resend.com).
 *
 * Handles two submission types:
 *   - contact (default): the /contact "Send a message" form. Notifies Daniel
 *     (reply-to set to the visitor) and sends the visitor a "message
 *     received" confirmation.
 *   - newsletter: the homepage signup. Notifies Daniel and sends the
 *     subscriber a short "you're on the list" confirmation.
 *
 * Accepts JSON (fetch) and application/x-www-form-urlencoded (no-JS
 * fallback — responds with a 303 redirect to /contact-thanks).
 *
 * Requires the RESEND_API_KEY environment variable (Vercel project settings).
 * The sending domain (faiellainsurance.com) must be verified in Resend.
 */

const crypto = require("crypto");

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const RESEND_AUDIENCES = "https://api.resend.com/audiences";
// Newsletter subscribers are stored as contacts in this Resend Audience.
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID || "6f12a47e-8aad-4e30-a28a-6dfab62ccabf";
const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "daniel@faiellainsurance.com";
const FROM = "Daniel Faiella Insurance <noreply@faiellainsurance.com>";
const PHONE = "775-315-5572";
const THANKS_URL = "/contact-thanks";

// Signed unsubscribe link so only the recipient can unsubscribe themselves.
function unsubToken(email, key) {
  return crypto.createHmac("sha256", key).update(email.toLowerCase()).digest("hex").slice(0, 32);
}

function unsubUrl(email, key) {
  return "https://faiellainsurance.com/api/unsubscribe?e=" + encodeURIComponent(email) + "&t=" + unsubToken(email, key);
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function field(value, max) {
  return String(value || "").trim().slice(0, max);
}

const wrap = (inner) =>
  `<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:24px">${inner}</div>`;

function contactNotify({ name, phone, email, message }) {
  const rows = [
    ["Name", name],
    ["Phone", phone || "—"],
    ["Email", email],
  ]
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 14px 6px 0;color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:.06em;vertical-align:top">${label}</td>` +
        `<td style="padding:6px 0;color:#0f172a;font-size:15px">${esc(value)}</td></tr>`
    )
    .join("");

  return {
    from: FROM,
    to: [TO_EMAIL],
    reply_to: [email],
    subject: `New website message from ${name}`,
    html: wrap(
      `<h2 style="color:#0e2a47;margin:0 0 4px">New message from your website</h2>` +
        `<p style="color:#64748b;margin:0 0 18px;font-size:14px">Someone filled out the contact form on faiellainsurance.com. Reply to this email to answer them directly.</p>` +
        `<table style="border-collapse:collapse">${rows}</table>` +
        `<p style="margin:18px 0 6px;color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:.06em">Message</p>` +
        `<p style="margin:0;padding:14px;background:#f8fafc;border-radius:8px;color:#0f172a;font-size:15px;line-height:1.6;white-space:pre-wrap">${esc(message)}</p>`
    ),
    text:
      `New message from faiellainsurance.com\n\n` +
      `Name: ${name}\nPhone: ${phone || "-"}\nEmail: ${email}\n\nMessage:\n${message}\n`,
  };
}

function contactConfirmation({ name, email }) {
  const first = name.split(" ")[0];
  return {
    from: FROM,
    to: [email],
    subject: "We received your message — Daniel Faiella Insurance",
    html: wrap(
      `<h2 style="color:#0e2a47;margin:0 0 12px">Thanks, ${esc(first)} — your message has been received.</h2>` +
        `<p style="color:#0f172a;font-size:15px;line-height:1.6;margin:0 0 12px">Daniel will personally review it and reach out shortly — usually the same day.</p>` +
        `<p style="color:#0f172a;font-size:15px;line-height:1.6;margin:0 0 18px">Need to talk sooner? Call or text <a href="tel:+17753155572" style="color:#0e2a47;font-weight:bold">${PHONE}</a>.</p>` +
        `<p style="color:#64748b;font-size:13px;line-height:1.5;margin:0">Daniel J. Faiella · Insurance Advisors · Carson City, Nevada<br>` +
        `This is an automated confirmation from an unmonitored address — please don't reply to it.</p>`
    ),
    text:
      `Thanks, ${first} — your message has been received.\n\n` +
      `Daniel will personally review it and reach out shortly — usually the same day.\n` +
      `Need to talk sooner? Call or text ${PHONE}.\n\n` +
      `Daniel J. Faiella · Insurance Advisors · Carson City, Nevada\n` +
      `This is an automated confirmation from an unmonitored address — please don't reply to it.`,
  };
}

function newsletterNotify({ email }) {
  return {
    from: FROM,
    to: [TO_EMAIL],
    reply_to: [email],
    subject: "New newsletter signup — faiellainsurance.com",
    html: wrap(
      `<h2 style="color:#0e2a47;margin:0 0 12px">New newsletter signup</h2>` +
        `<p style="color:#0f172a;font-size:15px;margin:0"><strong>${esc(email)}</strong> subscribed via the homepage.</p>`
    ),
    text: `New newsletter signup on faiellainsurance.com: ${email}`,
  };
}

function newsletterConfirmation({ email }, apiKey) {
  const unsub = unsubUrl(email, apiKey);
  return {
    from: FROM,
    to: [email],
    subject: "You're opted in — Daniel's monthly newsletter",
    headers: {
      "List-Unsubscribe": `<${unsub}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
    html: wrap(
      `<h2 style="color:#0e2a47;margin:0 0 12px">You're opted in — talk soon.</h2>` +
        `<p style="color:#0f172a;font-size:15px;line-height:1.6;margin:0 0 12px">You've been added to Daniel's newsletter. It arrives <strong>once a month, on the 1st</strong> — one plain-English email with Medicare deadlines, long-term-care tips, and retirement-income moves for Northern Nevada families. No spam, ever.</p>` +
        `<p style="color:#0f172a;font-size:15px;line-height:1.6;margin:0 0 18px"><strong>Want out?</strong> <a href="${unsub}" style="color:#0e2a47;font-weight:bold">Unsubscribe with one click</a>, or email <a href="mailto:hello@faiellainsurance.com" style="color:#0e2a47">hello@faiellainsurance.com</a> and we'll remove you right away.</p>` +
        `<p style="color:#64748b;font-size:13px;line-height:1.5;margin:0">Daniel J. Faiella · Insurance Advisors · Carson City, Nevada<br>` +
        `This is an automated confirmation from an unmonitored address — please don't reply to it.</p>`
    ),
    text:
      `You're opted in — talk soon.\n\n` +
      `You've been added to Daniel's newsletter. It arrives once a month, on the 1st — one plain-English email with Medicare deadlines, long-term-care tips, and retirement-income moves for Northern Nevada families. No spam, ever.\n\n` +
      `Want out? Unsubscribe here: ${unsub}\n` +
      `Or email hello@faiellainsurance.com and we'll remove you right away.\n\n` +
      `Daniel J. Faiella · Insurance Advisors · Carson City, Nevada\n` +
      `This is an automated confirmation from an unmonitored address — please don't reply to it.`,
  };
}

// Store the subscriber in the Resend Audience (create, then un-unsubscribe in
// case they signed up before). Failures are logged but never block the signup.
async function addToAudience(email, apiKey) {
  const H = { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
  try {
    const create = await fetch(`${RESEND_AUDIENCES}/${AUDIENCE_ID}/contacts`, {
      method: "POST",
      headers: H,
      body: JSON.stringify({ email, unsubscribed: false }),
    });
    if (!create.ok) {
      console.error("Audience create failed:", create.status, await create.text().catch(() => ""));
    }
    const update = await fetch(`${RESEND_AUDIENCES}/${AUDIENCE_ID}/contacts/${encodeURIComponent(email)}`, {
      method: "PATCH",
      headers: H,
      body: JSON.stringify({ unsubscribed: false }),
    });
    if (!update.ok) {
      console.error("Audience update failed:", update.status, await update.text().catch(() => ""));
    }
  } catch (e) {
    console.error("Audience call crashed:", e);
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // No-JS <form> posts are urlencoded and expect a redirect, not JSON.
  const isFormPost = String(req.headers["content-type"] || "").includes("application/x-www-form-urlencoded");
  const done = (status, payload) => {
    if (isFormPost) {
      res.statusCode = 303;
      res.setHeader("Location", status === 200 ? THANKS_URL : "/contact");
      return res.end();
    }
    return res.status(status).json(payload);
  };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return done(500, { error: "Email service is not configured. Please call or text " + PHONE + "." });
  }

  const body = req.body || {};

  // Honeypot: hidden field real visitors never fill. Pretend success for bots.
  if (field(body._honey, 200) || field(body.company, 200)) {
    return done(200, { ok: true });
  }

  const type = field(body.type, 20) === "newsletter" ? "newsletter" : "contact";
  const data = {
    name: field(body.name, 200),
    phone: field(body.phone, 50),
    email: field(body.email, 200),
    message: field(body.message, 5000),
  };

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
  if (!emailOk || (type === "contact" && !data.name)) {
    return done(400, { error: "Please provide your name and a valid email address." });
  }

  const send = (payload) =>
    fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

  if (type === "newsletter") {
    await addToAudience(data.email, apiKey);
  }

  const notify = await send(type === "newsletter" ? newsletterNotify(data) : contactNotify(data));
  if (!notify.ok) {
    const detail = await notify.text().catch(() => "");
    console.error("Resend notification failed:", notify.status, detail);
    return done(502, { error: "We couldn't send your message. Please call or text " + PHONE + "." });
  }

  // Confirmation is best-effort: the submission already reached Daniel.
  const confirm = await send(type === "newsletter" ? newsletterConfirmation(data, apiKey) : contactConfirmation(data));
  if (!confirm.ok) {
    const detail = await confirm.text().catch(() => "");
    console.error("Resend confirmation failed:", confirm.status, detail);
  }

  return done(200, { ok: true });
};
