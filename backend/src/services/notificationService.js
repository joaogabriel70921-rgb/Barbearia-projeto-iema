import { sendEmail } from "./emailService.js";

export async function sendAppointmentCreatedEmail(appointment) {
  await sendEmail({
    to: appointment.clientId.email,
    subject: "Agendamento criado com sucesso",
    html: `
      <h2>Seu agendamento foi criado!</h2>
      <p>Data: ${appointment.date}</p>
      <p>Horario: ${appointment.time}</p>
      <p>Status: ${appointment.status}</p>
    `,
  });
}