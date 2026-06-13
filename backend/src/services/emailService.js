import nodemailer from "nodemailer";
import { lookup } from "node:dns/promises";

function isSmtpConfigured() {
  return Boolean(
    process.env.EMAIL_HOST &&
      process.env.EMAIL_PORT &&
      process.env.EMAIL_USER &&
      process.env.EMAIL_PASS &&
      process.env.EMAIL_FROM
  );
}

// Extrai nome e email de um valor no formato "Nome <email@dominio>" ou só "email@dominio".
function parseFrom(from) {
  if (!from) return { name: "", email: "" };
  const match = from.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  if (match) {
    return { name: match[1].replace(/^"|"$/g, "").trim(), email: match[2].trim() };
  }
  return { name: "", email: from.trim() };
}

// --- Provedor 1: API HTTP (Brevo) ---
// Envia por HTTPS (porta 443), então funciona em hosts que bloqueiam SMTP de
// saída — como o Render no plano gratuito (portas 25/465/587 bloqueadas).
async function sendViaBrevo({ to, subject, html }) {
  const parsed = parseFrom(process.env.EMAIL_FROM);
  const senderEmail = process.env.BREVO_SENDER_EMAIL || parsed.email;
  const senderName =
    process.env.BREVO_SENDER_NAME || parsed.name || "Barbearia IEMA";

  if (!senderEmail) {
    throw new Error(
      "Remetente do Brevo não definido (configure EMAIL_FROM ou BREVO_SENDER_EMAIL)."
    );
  }

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Brevo respondeu ${response.status}: ${detail}`);
  }
}

// Resolve o host SMTP para um endereço IPv4.
// Muitos ambientes (redes sem rota IPv6, etc.) não conseguem conectar via IPv6.
// O nodemailer resolve IPv4 e IPv6 e escolhe um endereço aleatório, causando
// falhas intermitentes "connect ENETUNREACH ...:587". Forçando IPv4 e mantendo
// o servername original, o TLS continua validando o certificado.
async function resolveIPv4(host) {
  if (!host || /^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return host || null;
  try {
    const { address } = await lookup(host, { family: 4 });
    return address || null;
  } catch (error) {
    console.warn(`Não foi possível resolver IPv4 de ${host}:`, error.message);
    return null;
  }
}

// --- Provedor 2: SMTP (Gmail) — usado no desenvolvimento local. ---
async function sendViaSmtp({ to, subject, html }) {
  const host = process.env.EMAIL_HOST;
  const ipv4 = await resolveIPv4(host);

  const transporter = nodemailer.createTransport({
    host: ipv4 || host,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    requireTLS: true,
    connectionTimeout: 10000,
    // Conectamos via IPv4, mas validamos o certificado TLS contra o hostname real (SNI).
    servername: ipv4 && ipv4 !== host ? host : undefined,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
}

export async function sendEmail({ to, subject, html }) {
  // Prioriza a API HTTP (não depende de portas SMTP — ideal para o Render free).
  if (process.env.BREVO_API_KEY) {
    return sendViaBrevo({ to, subject, html });
  }

  // Fallback: SMTP (Gmail) — usado no desenvolvimento local.
  if (isSmtpConfigured()) {
    return sendViaSmtp({ to, subject, html });
  }

  console.warn("Email nao configurado. Mensagem nao enviada.");
}
