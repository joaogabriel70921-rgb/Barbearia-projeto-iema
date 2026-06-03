export function passwordResetTemplate({ name, resetUrl }) {
  return `
  <div style="font-family: Arial, sans-serif; background:#191816; padding:32px; color:#FFFEFA;">
    <div style="max-width:480px; margin:0 auto; background:#2E2823; border-radius:12px; padding:32px;">
      <h1 style="color:#D4A745; margin-top:0;">Recuperação de senha</h1>
      <p>Olá${name ? `, ${name}` : ""}!</p>
      <p>Recebemos um pedido para redefinir a senha da sua conta na Barbearia.</p>
      <p>Clique no botão abaixo para criar uma nova senha. Este link expira em 1 hora.</p>
      <p style="text-align:center; margin:32px 0;">
        <a href="${resetUrl}"
           style="background:#D4A745; color:#191816; text-decoration:none; font-weight:bold; padding:12px 24px; border-radius:8px; display:inline-block;">
          Redefinir senha
        </a>
      </p>
      <p style="font-size:13px; color:#bdbab2;">Se você não solicitou isso, pode ignorar este email com segurança.</p>
      <p style="font-size:12px; color:#807d76; word-break:break-all;">Se o botão não funcionar, copie e cole este link no navegador:<br>${resetUrl}</p>
    </div>
  </div>`;
}
