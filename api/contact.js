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

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "daniel@faiellainsurance.com";
const FROM = "Daniel Faiella Insurance <noreply@faiellainsurance.com>";
const PHONE = "775-315-5572";
const THANKS_URL = "/contact-thanks";

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

function newsletterConfirmation({ email }) {
  return {
    from: FROM,
    to: [email],
    subject: "You're on the list — Daniel Faiella Insurance",
    html: wrap(
      `<h2 style="color:#0e2a47;margin:0 0 12px">You're on the list — talk soon.</h2>` +
        `<p style="color:#0f172a;font-size:15px;line-height:1.6;margin:0 0 18px">Expect one plain-English email a month — Medicare deadlines, long-term-care tips, and retirement-income moves for Northern Nevada families. No spam, ever.</p>` +
        `<p style="color:#64748b;font-size:13px;line-height:1.5;margin:0">Daniel J. Faiella · Insurance Advisors · Carson City, Nevada<br>` +
        `This is an automated confirmation from an unmonitored address — please don't reply to it.</p>`
    ),
    text:
      `You're on the list — talk soon.\n\n` +
      `Expect one plain-English email a month — Medicare deadlines, long-term-care tips, and retirement-income moves for Northern Nevada families. No spam, ever.\n\n` +
      `Daniel J. Faiella · Insurance Advisors · Carson City, Nevada\n` +
      `This is an automated confirmation from an unmonitored address — please don't reply to it.`,
  };
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

  const notify = await send(type === "newsletter" ? newsletterNotify(data) : contactNotify(data));
  if (!notify.ok) {
    const detail = await notify.text().catch(() => "");
    console.error("Resend notification failed:", notify.status, detail);
    return done(502, { error: "We couldn't send your message. Please call or text " + PHONE + "." });
  }

  // Confirmation is best-effort: the submission already reached Daniel.
  const confirm = await send(type === "newsletter" ? newsletterConfirmation(data) : contactConfirmation(data));
  if (!confirm.ok) {
    const detail = await confirm.text().catch(() => "");
    console.error("Resend confirmation failed:", confirm.status, detail);
  }

  return done(200, { ok: true });
};
