export function verificationCodeTemplate({ name, code }) {
  return `
  <div style="font-family: Arial, sans-serif; background:#191816; padding:32px; color:#FFFEFA;">
    <div style="max-width:480px; margin:0 auto; background:#2E2823; border-radius:12px; padding:32px;">
      <h1 style="color:#D4A745; margin-top:0;">Confirme seu email</h1>
      <p>Olá${name ? `, ${name}` : ""}!</p>
      <p>Use o código abaixo para confirmar seu email e ativar sua conta na Barbearia IEMA.</p>
      <div style="text-align:center; margin:32px 0;">
        <span style="display:inline-block; background:#191816; color:#D4A745; font-size:32px; font-weight:bold; letter-spacing:8px; padding:16px 28px; border-radius:10px; border:1px solid #D4A745;">
          ${code}
        </span>
      </div>
      <p style="font-size:13px; color:#bdbab2;">Este código expira em 15 minutos. Se você não criou esta conta, pode ignorar este email.</p>
    </div>
  </div>`;
}
