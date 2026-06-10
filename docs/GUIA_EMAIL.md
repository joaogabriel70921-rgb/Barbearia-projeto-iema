# Guia: Configuração de Email (`.env`)

Este guia explica como configurar o envio de emails do backend da Barbearia.

## 1. Para que serve o email no projeto

O email é usado em **dois momentos**:

1. **Agendamento criado** → o cliente recebe um email de confirmação (`sendAppointmentCreatedEmail`).
2. **Recuperação de senha** → o usuário recebe um link para redefinir a senha (`sendPasswordResetEmail`), apontando para `FRONTEND_URL/redefinir-senha?token=...`.

> ⚠️ **O email é opcional.** Se as variáveis não estiverem configuradas, o backend apenas registra um aviso no console (`"Email nao configurado. Mensagem nao enviada."`) e **continua funcionando normalmente** — o agendamento é criado, as notificações in-app funcionam. Só a recuperação de senha por email é que depende dessa configuração para funcionar de ponta a ponta.

## 2. As variáveis no `.env`

O backend lê estas 5 variáveis (arquivo `backend/.env`):

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seuemail@gmail.com
EMAIL_PASS=sua_senha_de_app_de_16_digitos
EMAIL_FROM=Barbearia IEMA <seuemail@gmail.com>
```

| Variável | O que é |
|----------|---------|
| `EMAIL_HOST` | Servidor SMTP do provedor (ex.: `smtp.gmail.com`) |
| `EMAIL_PORT` | Porta SMTP — use **587** (ver observação técnica abaixo) |
| `EMAIL_USER` | Usuário/login do SMTP (geralmente o email) |
| `EMAIL_PASS` | Senha do SMTP — no Gmail é uma **Senha de App**, não a senha normal |
| `EMAIL_FROM` | Remetente exibido. Formato: `Nome <email@dominio.com>` |

> 🔧 **Observação técnica (importante):** o `emailService.js` usa `secure: false`. Isso significa **STARTTLS**, que funciona na **porta 587**. **Não use a porta 465** (essa exigiria `secure: true`). Se usar 465 com `secure:false`, a conexão falha.

Variável relacionada (já existente):

```env
FRONTEND_URL=http://localhost:5173
```
É para onde o link de recuperação de senha aponta (`FRONTEND_URL/redefinir-senha?token=...`). O frontend precisará ter essa rota.

## 3. Como preencher — escolha um provedor

### Opção A — Gmail (envio real) ✅ recomendado para produção/demo
1. Ative a **verificação em duas etapas** na sua Conta Google (obrigatório).
2. Acesse **Conta Google → Segurança → Senhas de app**.
3. Gere uma senha de app para "Email" → o Google mostra **16 caracteres**.
4. Use no `.env`:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seuemail@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop   # a senha de app (pode colar sem espaços)
EMAIL_FROM=Barbearia IEMA <seuemail@gmail.com>
```
> A senha normal do Gmail **não funciona** via SMTP — tem que ser a Senha de App.

### Opção B — Mailtrap (teste, não entrega de verdade) ✅ recomendado para desenvolvimento
O Mailtrap **captura** os emails numa caixa de testes, sem enviar pra ninguém de verdade — ótimo pra desenvolver sem spammar inboxes.
1. Crie conta grátis em **mailtrap.io** → **Email Testing → Inbox → SMTP Settings**.
2. Copie os dados mostrados:
```env
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=587
EMAIL_USER=xxxxxxxxxxxxx        # fornecido pelo Mailtrap
EMAIL_PASS=xxxxxxxxxxxxx        # fornecido pelo Mailtrap
EMAIL_FROM=Barbearia IEMA <nao-responder@barbearia.com>
```

### Opção C — Outros provedores
Funciona com qualquer SMTP (Outlook, Brevo/Sendinblue, SendGrid, etc.). Basta usar `host`/`port` (587)/`user`/`pass` do provedor.

## 4. Como funciona no código (resumo)

```text
emailService.js  → sendEmail({ to, subject, html })
   ├─ se as 5 variáveis NÃO estão setadas → só loga um aviso e ignora (não quebra)
   └─ se estão setadas → cria o transporte SMTP (nodemailer) e envia

notificationService.js
   ├─ sendAppointmentCreatedEmail(...)  → chamado ao criar agendamento
   └─ sendPasswordResetEmail(...)       → chamado no POST /api/auth/forgot-password
```

Os envios são **disparados sem bloquear a resposta** (fire-and-forget) — se o email demorar/falhar, a API responde normalmente e o erro é apenas logado.

**Não precisa mexer em código.** Basta preencher o `.env` e reiniciar o backend (`npm run dev`).

## 5. Como testar

Depois de preencher as variáveis e reiniciar o backend:

- **Teste 1 (recuperação de senha):**
  ```
  POST http://localhost:3000/api/auth/forgot-password
  Body: { "email": "admin@barbearia.com" }
  ```
  Deve chegar um email (ou aparecer na caixa do Mailtrap) com o link de redefinição.

- **Teste 2 (agendamento):** crie um agendamento como cliente — o email de confirmação é enviado para o email do cliente.

> Se nada chegar, verifique o console do backend: se aparecer `"Email nao configurado..."`, alguma das 5 variáveis está faltando/vazia.

## 6. Segurança

- O `.env` **não vai pro Git** (já está no `.gitignore`) — nunca comite senhas.
- No Gmail, use **Senha de App** (revogável), nunca a senha principal.
- Em produção, prefira um serviço transacional (Brevo, SendGrid) a uma conta pessoal do Gmail.
