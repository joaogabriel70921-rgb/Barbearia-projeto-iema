import nodemailer from "nodemailer";
import { lookup } from "node:dns/promises";

function isEmailConfigured() {
  return Boolean(
    process.env.EMAIL_HOST &&
      process.env.EMAIL_PORT &&
      process.env.EMAIL_USER &&
      process.env.EMAIL_PASS &&
      process.env.EMAIL_FROM
  );
}

// Resolve o host SMTP para um endereço IPv4.
// Muitos ambientes (Render, redes sem rota IPv6, etc.) não conseguem conectar
// via IPv6. O nodemailer resolve IPv4 e IPv6 e escolhe um endereço aleatório,
// causando falhas intermitentes "connect ENETUNREACH ...:587". Forçando IPv4 e
// mantendo o servername original, o TLS continua validando o certificado.
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

export async function sendEmail({ to, subject, html }) {
  if (!isEmailConfigured()) {
    console.warn("Email nao configurado. Mensagem nao enviada.");
    return;
  }

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
