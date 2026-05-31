import { sendEmail } from "./emailService.js";
import { appointmentCreatedTemplate } from "../templates/email/appointmentCreatedTemplate.js";

export async function sendAppointmentCreatedEmail(appointment) {
  if (!appointment?.clientId?.email) {
    console.warn("Cliente sem email. Mensagem de agendamento nao enviada.");
    return;
  }

  await sendEmail({
    to: appointment.clientId.email,
    subject: "Agendamento criado com sucesso",
    html: appointmentCreatedTemplate(appointment),
  });
}
