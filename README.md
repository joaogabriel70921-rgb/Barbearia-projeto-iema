# Barbearia IEMA

Sistema de agendamento para barbearia. A aplicação é dividida em uma **API REST** (backend) e uma **interface web** (frontend) que se comunicam por requisições HTTP no padrão JSON (`{ success, message, data }`).

> **IEMA Pleno Bacelar Portela** — Disciplina de **PWA (Projeto de Aplicação Web)**
> Professor: **William Marinho** · Turma: **302**

## Equipe

Integrantes: João Gabriel Rocha, João Guilherme Sousa, Isaque Fonseca, Anne Beatriz, Rhasta Ferreira, Thanielly Beatriz.

| Parte | Responsáveis |
|-------|--------------|
| **Arquitetura** | João Gabriel Rocha e Anne Beatriz |
| **Desenvolvimento** | João Guilherme Sousa e Thanielly Beatriz |
| **UX/UI** | Isaque Fonseca e Rhasta Ferreira |

---

## Visão geral

A aplicação tem **login único**: o papel do usuário (`cliente`, `funcionario` ou `admin`) vem dentro do token JWT e o front redireciona para a área certa. Três áreas:

- **Cliente** — vê o catálogo (serviços e barbeiros), agenda horários, acompanha "Meus Agendamentos" e gerencia o perfil.
- **Funcionário** — vê o resumo do dia, aceita/recusa novos agendamentos (ou sugere outro horário), toca a agenda (iniciar/concluir/não-compareceu) e define sua disponibilidade.
- **Admin** — painel com dashboard, CRUD de serviços/funcionários/clientes, gestão de agendamentos, relatórios e configurações da barbearia.

## Funcionalidades

- 🔐 **Login único por papel** (cliente / funcionário / admin) com JWT.
- ✅ **Cadastro com verificação de email** por código de 6 dígitos — o login fica bloqueado até confirmar (garante emails reais).
- 🔑 **Recuperação de senha** por email (link com token, validade de 1h).
- 📅 **Agendamento** com verificação de disponibilidade em tempo real.
- 👤 **Cliente:** catálogo, agendamento, meus agendamentos, perfil, privacidade (trocar senha).
- ✂️ **Funcionário:** status (online/ocupado/pausa/offline), overview do dia, novos, agenda, disponibilidade.
- 🛠️ **Admin:** dashboard, serviços, funcionários, clientes, agendamentos, relatórios e configurações.
- 🎨 **Tema claro/escuro** por área e campos de senha com mostrar/ocultar (👁️).

## Tecnologias

**Backend** — Node.js + Express 5 (ESM), MongoDB Atlas + Mongoose, JWT, bcryptjs, Nodemailer, express-rate-limit. Arquitetura em camadas: **rotas → controllers → services → models**, com middleware de erros centralizado.

**Frontend** — React 18 + Vite 6 (SPA — Single Page Application), React Router 7, Tailwind CSS v4, Radix UI / shadcn, axios, date-fns, Recharts (gráficos do admin), Sonner (toasts) e Motion (animações).

---

## Como rodar localmente

**Pré-requisitos:** Node.js 18+ e uma conexão MongoDB (recomendado: cluster grátis no [MongoDB Atlas](https://www.mongodb.com/atlas)).

### 1. Backend

```bash
cd backend
npm install
# crie o arquivo .env (veja .env.example e a seção "Variáveis de ambiente")
npm run seed:admin        # cria o usuário admin
npm run seed:services     # cria os serviços iniciais
npm run seed:employees    # cria os funcionários iniciais
npm run dev               # sobe a API em http://localhost:3000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev               # sobe a interface em http://localhost:5173
```

Abra **http://localhost:5173** no navegador. O backend precisa estar rodando para o login funcionar.

### Credenciais de teste (depois de rodar os seeds)

| Papel | Email | Senha |
|-------|-------|-------|
| Admin | `ADMIN_EMAIL` (ou `admin@barbearia.com`) | `admin123` |
| Funcionário | `carlos@barbearia.com` / `bruno@barbearia.com` | `func123` |

---

## Variáveis de ambiente

Crie um arquivo **`backend/.env`** (há um modelo em `backend/.env.example`):

| Variável | Descrição |
|----------|-----------|
| `PORT` | Porta da API (ex.: `3000`). |
| `MONGO_URI` | String de conexão do MongoDB (Atlas ou local). |
| `JWT_SECRET` | Segredo para assinar os tokens JWT (use um valor forte). |
| `FRONTEND_URL` | URL(s) do frontend — usado no **CORS** e nos **links de email**. Aceita várias separadas por vírgula. |
| `ADMIN_EMAIL` | Email do admin (dono). Os seeds usam esse valor; se vazio, cai em `admin@barbearia.com`. |
| `EMAIL_HOST` `EMAIL_PORT` `EMAIL_USER` `EMAIL_PASS` `EMAIL_FROM` | Configuração de SMTP para envio de emails (opcional — veja abaixo). |

No **frontend** (opcional), `VITE_API_URL` define a URL da API; se não for definida, usa `http://localhost:3000/api`.

### Email (verificação e recuperação de senha)

O envio de emails usa SMTP. Com **Gmail**: ative a verificação em duas etapas e gere uma **Senha de App** (16 dígitos) em https://myaccount.google.com/apppasswords, e preencha:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seuemail@gmail.com
EMAIL_PASS=sua_senha_de_app
EMAIL_FROM=Barbearia IEMA <seuemail@gmail.com>
```

> **Importante:** use a porta **587** (STARTTLS). Se as variáveis de email **não** forem configuradas, o app continua funcionando normalmente — só o envio de email (verificação de cadastro e recuperação de senha) fica desativado.

---

## Como funciona a verificação de email

Para impedir cadastros com emails falsos:

1. **Cadastro** → a conta nasce **não verificada**, um **código de 6 dígitos** é enviado por email, e o usuário **não** é logado.
2. **Login bloqueado** (HTTP 403) até confirmar — a tela mostra o atalho para a página de confirmação.
3. Em **`/confirmar-email`**, o usuário digita o código → a conta é verificada → login automático. Há botão de **reenviar código** (validade de 15 min).
4. **Admin e funcionários** (criados pelo admin no painel) já entram **verificados** — não precisam de código, pois são contas criadas pelo próprio dono.

---

## Deploy (resumo)

A aplicação foi feita pensando em deploy (URLs por variável de ambiente, sem mexer no código):

- **Backend** → host que roda Node (Render, Railway, Fly.io, etc.). Configure as variáveis de ambiente e libere o IP do servidor no **Atlas → Network Access**.
- **Frontend** → hospedagem estática (Netlify, Vercel, …). Faça o build com `VITE_API_URL=https://seu-backend/api` e habilite o **fallback de SPA** (servir `index.html` em qualquer rota).
- No backend, ajuste `FRONTEND_URL` para o domínio do frontend (CORS + links de email).
- Em produção, garanta **HTTPS** nos dois lados e um `JWT_SECRET` forte.

## Estrutura do projeto

```
backend/    API Express (rotas → controllers → services → models, seeds e templates de email)
frontend/   React + Vite — áreas cliente, funcionário e admin + telas de autenticação
```
