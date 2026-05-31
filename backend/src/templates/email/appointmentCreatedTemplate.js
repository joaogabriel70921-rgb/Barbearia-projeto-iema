const COLORS = {
  background: "#F5F5F0",
  gold: "#C9A84C",
  black: "#1A1A1A",
  white: "#FFFFFF",
};

const STATUS_LABELS = {
  pendente: "Pendente",
  confirmado: "Confirmado",
  em_andamento: "Em andamento",
  concluido: "Concluido",
  cancelado: "Cancelado",
  nao_compareceu: "Nao compareceu",
};

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(date) {
  if (!date) return "Data nao informada";

  const parsedDate = new Date(`${date}T00:00:00`);

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
}

function getClientName(appointment) {
  return appointment?.clientId?.name || "Cliente";
}

function getClientEmail(appointment) {
  return appointment?.clientId?.email || "";
}

function getEmployeeName(appointment) {
  return appointment?.employeeId?.userId?.name || "Barbeiro a confirmar";
}

function getServiceNames(appointment) {
  const services = appointment?.serviceIds || [];
  const names = services.map((service) => service.name).filter(Boolean);

  return names.length > 0 ? names.join(", ") : "Servico nao informado";
}

function getStatusTitle(status) {
  if (status === "confirmado") return "Agendamento Confirmado!";
  if (status === "cancelado") return "Agendamento Cancelado";
  return "Agendamento Recebido!";
}

function detailRow({ icon, label, value }) {
  return `
    <tr>
      <td style="width: 38px; padding: 14px 0; vertical-align: top;">
        <div style="width: 28px; height: 28px; border-radius: 999px; border: 1px solid ${COLORS.gold}; color: ${COLORS.gold}; font-size: 15px; line-height: 28px; text-align: center; font-weight: 700;">
          ${icon}
        </div>
      </td>
      <td style="padding: 14px 0; vertical-align: top;">
        <div style="font-size: 11px; line-height: 14px; color: ${COLORS.black}; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">
          ${label}
        </div>
        <div style="font-size: 19px; line-height: 26px; color: ${COLORS.black}; font-weight: 500; margin-top: 4px;">
          ${value}
        </div>
      </td>
    </tr>
  `;
}

export function appointmentCreatedTemplate(appointment) {
  const clientName = escapeHtml(getClientName(appointment));
  const clientEmail = escapeHtml(getClientEmail(appointment));
  const employeeName = escapeHtml(getEmployeeName(appointment));
  const serviceNames = escapeHtml(getServiceNames(appointment));
  const date = escapeHtml(formatDate(appointment?.date));
  const time = escapeHtml(appointment?.time || "Horario nao informado");
  const status = escapeHtml(STATUS_LABELS[appointment?.status] || appointment?.status || "Pendente");
  const title = escapeHtml(getStatusTitle(appointment?.status));
  const frontendUrl = process.env.FRONTEND_URL || "#";
  const appointmentUrl =
    frontendUrl === "#"
      ? "#"
      : `${frontendUrl.replace(/\/$/, "")}/agendamentos`;

  return `
    <!doctype html>
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${title}</title>
      </head>
      <body style="margin: 0; padding: 0; background: ${COLORS.background}; font-family: Arial, Helvetica, sans-serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: ${COLORS.background}; margin: 0; padding: 28px 12px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 430px; background: ${COLORS.white}; border: 1px solid #deded6; border-radius: 4px; overflow: hidden;">
                <tr>
                  <td style="background: ${COLORS.gold}; padding: 42px 28px 38px; text-align: center;">
                    <div style="width: 58px; height: 58px; margin: 0 auto 18px; border-radius: 999px; background: ${COLORS.black}; color: ${COLORS.gold}; font-size: 34px; line-height: 58px; font-weight: 900;">
                      &#10003;
                    </div>
                    <h1 style="margin: 0; color: ${COLORS.black}; font-size: 28px; line-height: 34px; font-weight: 800;">
                      ${title}
                    </h1>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 24px 30px 10px; border-left: 5px solid ${COLORS.gold};">
                    <div style="font-size: 12px; line-height: 16px; color: ${COLORS.black}; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">
                      Servicos
                    </div>
                    <div style="font-size: 24px; line-height: 31px; color: ${COLORS.black}; font-weight: 700; margin-top: 6px;">
                      ${serviceNames}
                    </div>

                    <div style="height: 1px; background: ${COLORS.background}; margin: 22px 0 10px;"></div>

                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="width: 50%; padding: 14px 8px 14px 0; vertical-align: top;">
                          <div style="font-size: 11px; line-height: 14px; color: ${COLORS.black}; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">
                            Data
                          </div>
                          <div style="font-size: 21px; line-height: 28px; color: ${COLORS.black}; font-weight: 700; margin-top: 6px;">
                            ${date}
                          </div>
                        </td>
                        <td style="width: 50%; padding: 14px 0 14px 8px; vertical-align: top; text-align: right;">
                          <div style="font-size: 11px; line-height: 14px; color: ${COLORS.black}; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">
                            Hora
                          </div>
                          <div style="font-size: 21px; line-height: 28px; color: ${COLORS.black}; font-weight: 700; margin-top: 6px;">
                            ${time}
                          </div>
                        </td>
                      </tr>
                    </table>

                    <div style="height: 1px; background: ${COLORS.background}; margin: 8px 0;"></div>

                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      ${detailRow({ icon: "&#128100;", label: "Cliente", value: clientName })}
                      ${detailRow({ icon: "&#9986;", label: "Barbeiro", value: employeeName })}
                      ${detailRow({ icon: "&#9679;", label: "Status", value: status })}
                    </table>

                    ${
                      clientEmail
                        ? `<p style="margin: 8px 0 22px; color: #55554f; font-size: 13px; line-height: 19px;">Enviamos esta confirmacao para ${clientEmail}.</p>`
                        : ""
                    }

                    <a href="${appointmentUrl}" style="display: block; text-decoration: none; background: ${COLORS.gold}; color: ${COLORS.black}; text-align: center; padding: 15px 18px; border-radius: 2px; font-size: 16px; line-height: 20px; font-weight: 800; margin: 18px 0 8px;">
                      Ver Agendamento &rarr;
                    </a>

                    <p style="margin: 18px 0 6px; color: #55554f; font-size: 12px; line-height: 18px; text-align: center;">
                      Barbearia Premium
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}
