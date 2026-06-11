import Notification from "../models/Notification.js";
import { sendEmail } from "./emailService.js";
import { appointmentCreatedTemplate } from "../templates/email/appointmentCreatedTemplate.js";
import { passwordResetTemplate } from "../templates/email/passwordResetTemplate.js";
import { verificationCodeTemplate } from "../templates/email/verificationCodeTemplate.js";

export async function sendAppointmentCreatedEmail(appointment) {
  if (!appointment?.clientId?.email) {
    console.warn("Cliente sem email. Mensagem de agendamento não enviada.");
    return;
  }

  await sendEmail({
    to: appointment.clientId.email,
    subject: "Agendamento criado com sucesso",
    html: appointmentCreatedTemplate(appointment),
  });
}

export async function sendPasswordResetEmail(user, resetUrl) {
  if (!user?.email) {
    console.warn("Usuário sem email. Mensagem de recuperação não enviada.");
    return;
  }

  await sendEmail({
    to: user.email,
    subject: "Recuperação de senha - Barbearia",
    html: passwordResetTemplate({ name: user.name, resetUrl }),
  });
}

export async function sendVerificationEmail(user, code) {
  if (!user?.email) {
    console.warn("Usuário sem email. Código de verificação não enviado.");
    return;
  }

  await sendEmail({
    to: user.email,
    subject: "Confirme seu email - Barbearia IEMA",
    html: verificationCodeTemplate({ name: user.name, code }),
  });
}

// Cria uma notificação in-app. É resiliente: nunca quebra o fluxo principal.
export async function createNotification({ userId, type, title, message, data }) {
  if (!userId || !title) {
    return null;
  }

  try {
    return await Notification.create({
      userId,
      type: type || "geral",
      title,
      message: message || "",
      data: data || {},
    });
  } catch (error) {
    console.warn("Falha ao criar notificação:", error.message);
    return null;
  }
}
