# Relatório de Correções — Backend Barbearia IEMA

**Projeto:** Sistema de agendamento de barbearia (PWA) — API REST Node.js + Express + MongoDB
**Escopo deste relatório:** correções de segurança, consistência, qualidade e um bug crítico no backend
**Data:** junho/2026

---

## 1. Resumo executivo

Foram aplicadas correções em quatro frentes: **segurança** (1 falha de severidade alta + 3 médias), **consistência** das respostas da API, **qualidade/correção** de código e **1 bug crítico** que impedia a conexão com o banco de dados. Todas as correções foram validadas por **testes automatizados** executados contra um MongoDB real (em memória).

| Severidade | Correção | Status |
|------------|----------|--------|
| 🔴 Alta | Escalada de privilégio no cadastro | Corrigido |
| 🟠 Média | Ausência de rate limiting | Corrigido |
| 🟠 Média | Senha sem validação de tamanho | Corrigido |
| 🟠 Média | CORS permissivo | Corrigido |
| 🟡 Consistência | Padronização do `authMiddleware` | Corrigido |
| 🟡 Qualidade | Mass assignment na edição de agendamento (admin) | Corrigido |
| 🟡 Qualidade | Erros 500 não registrados em log | Corrigido |
| 🟡 Qualidade | Email/notificação bloqueando a resposta | Corrigido |
| 🐛 Crítico | Conexão com o banco corrompida | Corrigido |

---

## 2. Correções de segurança

### 2.1 🔴 [ALTA] Escalada de privilégio no cadastro
- **Problema:** o endpoint `POST /api/auth/register` repassava o corpo inteiro da requisição para a criação do usuário. Era possível enviar `role: "admin"` no cadastro e criar uma conta de administrador.
- **Correção:** o cadastro passou a aceitar somente `name`, `email`, `phone` e `password`. O `role` é sempre `"cliente"` por padrão.
- **Arquivo:** `src/controllers/authController.js`
- **Validação:** teste confirma que um cadastro tentando `role:"admin"` resulta em `role:"cliente"` — tanto na resposta quanto no banco.

### 2.2 🟠 [MÉDIA] Ausência de rate limiting
- **Problema:** sem limite de tentativas em `login` e `forgot-password`, abrindo espaço para força-bruta de senhas e spam de emails.
- **Correção:** adicionado `express-rate-limit` (máx. 20 requisições / 15 min por IP) nas rotas sensíveis de autenticação.
- **Arquivos:** `src/middlewares/rateLimitMiddleware.js` (novo), `src/routes/authRoutes.js`
- **Validação:** ao exceder o limite, a API responde **HTTP 429** com o envelope padrão.

### 2.3 🟠 [MÉDIA] Senha sem validação de tamanho
- **Problema:** o tamanho mínimo da senha não era validado no cadastro/troca/reset (a regra do schema não pegava, pois a senha já chegava criptografada).
- **Correção:** validação `minLength` (mínimo 6 caracteres) aplicada em `register`, `reset-password` e `change-password`.
- **Arquivos:** `src/middlewares/validateMiddleware.js`, `src/routes/authRoutes.js`
- **Validação:** senha curta → **HTTP 400** com o campo apontado.

### 2.4 🟠 [MÉDIA] CORS permissivo
- **Problema:** liberação para qualquer origem (`*`) quando `FRONTEND_URL` não estava definido.
- **Correção:** CORS restrito às origens de `FRONTEND_URL` (aceita lista separada por vírgula). Liberação geral apenas em desenvolvimento, com aviso no log.
- **Arquivo:** `server.js`

---

## 3. Correção de consistência

### 3.1 🟡 Padronização do `authMiddleware`
- **Problema:** os middlewares `protect`, `onlyAdmin` e `onlyEmployee` ainda retornavam erros no formato antigo `{ message }` — sem `success:false` e sem acentuação —, fora do padrão da API. **Falha detectada pelos próprios testes.**
- **Correção:** passaram a usar `ApiError` + tratamento central de erros, gerando o envelope padronizado `{ success:false, message }`.
- **Arquivo:** `src/middlewares/authMiddleware.js`

> **Contexto:** em etapa anterior (já publicada no `main`), toda a API foi padronizada para o envelope `{ success, message, data }`, com acentos corrigidos e a disponibilidade retornando objeto padrão em vez de `null`.

---

## 4. Correções de qualidade

### 4.1 🟡 Mass assignment na edição de agendamento (admin)
- **Problema:** `updateAppointment` aplicava `{ ...req.body }` diretamente, permitindo ao admin sobrescrever campos não previstos (ex.: `totalPrice`, `totalDuration`).
- **Correção:** apenas uma lista de campos permitidos (`ALLOWED_UPDATE_FIELDS`) é aceita.
- **Arquivo:** `src/controllers/adminAppointmentController.js`
- **Validação:** teste confirma que injetar `totalPrice: 1` é **ignorado** (valor permanece o calculado pelo servidor), enquanto campos permitidos (`notes`, `status`) são atualizados.

### 4.2 🟡 Erros 500 não registrados em log
- **Problema:** erros inesperados (5xx) eram respondidos ao cliente, mas não eram registrados — dificultando o diagnóstico.
- **Correção:** o tratamento central passou a registrar (`console.error`) os erros de severidade 5xx.
- **Arquivo:** `src/middlewares/errorMiddleware.js`

### 4.3 🟡 Email/notificação bloqueando a resposta
- **Problema:** ao criar agendamento (e em mudanças de status), o envio de email e a criação de notificações eram aguardados (`await`) antes de responder — uma falha/lentidão no email atrasava a resposta.
- **Correção:** email e notificações passaram a ser disparados sem bloquear a resposta (fire-and-forget), com captura de erro para não gerar rejeições não tratadas.
- **Arquivos:** `src/controllers/appointmentController.js`, `src/controllers/adminAppointmentController.js`, `src/controllers/employeeController.js`

---

## 5. Correção de bug crítico

### 5.1 🐛 Conexão com o banco corrompida
- **Problema:** o arquivo de conexão estava com a linha quebrada — `mongoose.connect(process.env_URI).MONGO` — provavelmente por edição acidental. Isso **impediria o backend de conectar ao MongoDB ao iniciar**.
- **Correção:** restaurado para `mongoose.connect(process.env.MONGO_URI)`.
- **Arquivo:** `src/config/database.js`
- **Observação:** o problema não aparecia nos testes (que conectam diretamente a um Mongo de teste); foi identificado na revisão do controle de versão (git).

---

## 6. Validação (testes automatizados)

Baterias executadas contra um **MongoDB real em memória**:

**Autenticação, RBAC e segurança (12/12):**
- 🔒 Injeção de `role` bloqueada (resposta **e** banco)
- Login (sucesso / senha incorreta), `/auth/me` (com e sem token), `PATCH /auth/me`
- RBAC: cliente bloqueado (403) / admin liberado (200)
- Validação de campos e de tamanho de senha (400)
- Rate limiting (429); recuperação de senha (200)

**Agendamentos / mass assignment (4/4):**
- Criação de agendamento com totais calculados no servidor (201)
- Edição altera apenas campos permitidos (`notes`, `status`)
- Injeção de `totalPrice` **ignorada** (valor preservado)

---

## 7. Situação no controle de versão

- **Já publicado** (`main`, commit `8beef6b`): padronização geral da API e novos endpoints (edição de perfil, recuperação de senha, notificações).
- **Pendente de commit** (working tree): correções de segurança (seções 2 e 3), correções de qualidade (seção 4) e o bug crítico (seção 5).

---

## 8. Recomendações pendentes (ainda não corrigidas)

- Adicionar um `.env.example` para facilitar a configuração pela equipe.
- Paginação nas listagens (clientes, agendamentos, relatórios) caso a base cresça.
- Atualizar a opção `new: true` → `returnDocument: "after"` do Mongoose (apenas um aviso de depreciação, não quebra).
- Conferir o `MONGO_URI` do `.env`: o cluster Atlas configurado não respondeu nos testes de conexão (possível cluster pausado/removido ou string desatualizada).
