# Plano de Ligação ao Backend — Funcionário & Admin

> Continuação do trabalho já feito na **área do cliente** (100% ligada e testada em 07/06).
> Este doc lista, em passos de 1 a 6, como ligar **Funcionário** e **Admin** ao backend
> usando o **mesmo padrão comprovado**.

---

## 🔁 Padrão comprovado (recap — vale para tudo)

1. **Service layer** em `frontend/src/services/<area>Service.js`:
   - Função `adaptX(obj)` converte o shape do backend → shape que a tela já espera (mantém os nomes de campo das telas convertidas, só preenche a partir do `_id`, populates, etc.).
   - Métodos `list/get/create/update/...` que chamam `http` e devolvem o `.data` já adaptado.
2. **Na tela:** `useState` para `data/loading/error` + `useEffect` que chama o service. Mostrar estado de carregando, de erro (com "Tentar novamente") e vazio.
3. **`http.js` já está pronto:** devolve o envelope `{success,message,data}`; em erro rejeita com `new Error(message)` + `.status` + `.fields`. Então na tela basta `catch (e) => e.message`.
4. **Status em português** já são tratados pelo `client/components/StatusBadge.jsx` (pendente/confirmado/em_andamento/concluido/cancelado/nao_compareceu). Funcionário/Admin têm os próprios StatusBadge — reaproveitar a mesma ideia.
5. **Testar ao vivo** (preview MCP + backend real) cada passo: fluxo feliz **e** casos de erro (401 sem token, 400 transições inválidas, slot ocupado, validações). Conferir **console sem erros**.
6. **Remover os imports de mock** de cada tela (`*/data/mockData` ou dados fixos) só depois que o real estiver funcionando.

**Contas de teste:** `cliente.dark@teste.local` / `123456`. Criar (ou usar do seed) um **funcionario** e um **admin** para testar essas áreas — conferir credenciais no seed do backend.

---

## 👔 PARTE A — Funcionário (`employee/components/Dashboard/*`)

**Base das rotas:** `/employees` (todas exigem token de papel `funcionario`).

| Endpoint | Uso |
|---|---|
| `GET /employees/me` | perfil do funcionário logado (userId populado, position, specialties, socialLinks, photo, status) |
| `PATCH /employees/me` | editar `photo, position, specialties, socialLinks` |
| `PATCH /employees/me/status` | `status`: `online\|offline\|trabalhando\|pausado` |
| `GET /employees/me/availability` · `PUT /employees/me/availability` | disponibilidade/horários |
| `GET /employees/me/appointments?status=&date=` | agenda do funcionário (appointment populado) |
| `PATCH /employees/me/appointments/:id/accept` | pendente → confirmado |
| `PATCH /employees/me/appointments/:id/reject` | pendente → cancelado |
| `PATCH /employees/me/appointments/:id/start` | confirmado → em_andamento |
| `PATCH /employees/me/appointments/:id/complete` | em_andamento → concluido |
| `PATCH /employees/me/appointments/:id/no-show` | em_andamento → nao_compareceu |
| `POST /employees/me/appointments/:id/suggest-time` | `{date,time,message}` sugere novo horário (volta p/ pendente) |

**Transições válidas (o backend recusa o resto com 400):**
`pendente → confirmado/cancelado` · `confirmado → em_andamento/cancelado` · `em_andamento → concluido/nao_compareceu`.

### Passo 1 — Criar `services/employeeService.js`
- `adaptEmployee(e)`: `{ id:e._id, name:e.userId?.name, email, phone, position, specialties:[], socialLinks:{instagram,youtube}, photo, status }`.
- Reaproveitar `adaptAppointment` (já existe em `appointmentService.js`) para a agenda — exportar/centralizar para não duplicar.
- Métodos: `getMe, updateMe, setStatus, getAvailability, updateAvailability, listAppointments(filtros), accept, reject, start, complete, noShow, suggestTime`.

### Passo 2 — Perfil (`ProfileNew.jsx`)
- `GET /employees/me` no `useEffect`; formulário salva via `PATCH /employees/me`.
- Toggle de **status** (online/trabalhando/pausado/offline) → `PATCH /employees/me/status`.
- Testar: editar specialties/socialLinks e ver refletir; trocar status.

### Passo 3 — Overview / Resumo (`Overview.jsx`)
- Derivar os cards (hoje, pendentes, concluídos) de `GET /employees/me/appointments?date=<hoje>` (e/ou sem filtro), contando por status no front.
- Testar: números batem com a agenda real.

### Passo 4 — Novos Agendamentos (`NewAppointments.jsx` + `SuggestTimeModal.jsx`)
- Lista `GET /employees/me/appointments?status=pendente`.
- Botões **Aceitar** (`/accept`) e **Recusar** (`/reject`); recarregar lista após ação.
- **Sugerir horário** → `POST .../suggest-time` com `{date,time,message}`.
- Testar erros: aceitar algo que não é pendente → 400; sugerir slot ocupado → 400.

### Passo 5 — Minha Agenda (`MyAppointments.jsx`)
- Lista `GET /employees/me/appointments` (filtro por data/status na UI).
- Ações: **Iniciar** (`/start`), **Concluir** (`/complete`), **Não compareceu** (`/no-show`).
- Testar a sequência completa de um agendamento: confirmado → em_andamento → concluido.

### Passo 6 — Disponibilidade (`AvailabilityNew.jsx`) + teste E2E
- `GET /employees/me/availability` para preencher; salvar com `PUT /employees/me/availability`.
- ⚠️ Conferir o **shape do model `Availability.js`** antes (dias da semana, intervalos) e mapear no adapter.
- Fechar com teste E2E do funcionário (aceitar → iniciar → concluir um agendamento real) + **remover mocks** + console limpo.

---

## 🛠️ PARTE B — Admin (`admin/components/admin/*Tab.jsx`)

**Base das rotas:** `/admin/*` (todas exigem token de papel `admin`).

| Recurso | Endpoints |
|---|---|
| **Dashboard** | `GET /admin/dashboard/summary` · `/today-appointments` · `/online-employees` |
| **Serviços** | `GET/POST /admin/services` · `GET/PATCH/DELETE /admin/services/:id` · `PATCH /:id/toggle-active` |
| **Funcionários** | `GET/POST /admin/employees` · `GET/PATCH/DELETE /:id` · `PATCH /:id/status` · `GET/PUT /:id/availability` · `GET /:id/history` |
| **Clientes** | `GET /admin/clients` · `GET/PATCH/DELETE /:id` · `GET /:id/appointments` · `GET /:id/history` |
| **Agendamentos** | `GET/POST /admin/appointments` · `GET/PATCH/DELETE /:id` · `PATCH /:id/status` · `PATCH /:id/reschedule` |
| **Relatórios** | `GET /admin/reports/summary` · `/completed-appointments` · `/cancelled-appointments` · `/no-shows` · `/top-services` · `/employee-performance` |
| **Config/Perfil** | `GET/PATCH /admin/settings/profile` · `GET/PATCH /admin/settings/barbershop` |

### Passo 1 — Criar `services/adminService.js`
- Sub-objetos por recurso: `adminService.services`, `.employees`, `.clients`, `.appointments`, `.reports`, `.settings`, `.dashboard`.
- Adapters: `adaptAdminEmployee`, `adaptClient`, reaproveitar `adaptService`/`adaptAppointment`.
- Mantém um único `http` (token de admin entra automático pelo interceptor).

### Passo 2 — Dashboard (`DashboardTab.jsx`)
- 3 chamadas em paralelo (`Promise.all`): summary, today-appointments, online-employees.
- Só leitura → ótimo primeiro passo para validar o token/role de admin ao vivo.

### Passo 3 — Serviços (`ServicesTab.jsx`)  ← valida o padrão **CRUD**
- Listar; criar; editar; excluir; **ativar/desativar** (`toggle-active`).
- Recarregar a lista após cada mutação; tratar erro de validação (400 com `fields`).
- É o CRUD mais simples — depois replicar a mesma estrutura nos outros tabs.

### Passo 4 — Funcionários (`EmployeesTab.jsx`)
- CRUD + `PATCH /:id/status` + ver/editar disponibilidade (`/:id/availability`) + histórico (`/:id/history`).
- ⚠️ Criar funcionário provavelmente cria **User + Employee** no backend — conferir o payload esperado em `adminEmployeeController.createEmployee`.

### Passo 5 — Clientes (`ClientsTab.jsx`) + Agendamentos (`AppointmentsTab.jsx`)
- Clientes: listar/detalhe/editar/excluir + agendamentos e histórico do cliente.
- Agendamentos: listar/criar/editar/excluir + `status` + `reschedule` (reusar `adaptAppointment`).
- Testar transições/erros e o reschedule com slot ocupado (400).

### Passo 6 — Relatórios (`ReportsTab.jsx`) + Config (`ProfileTab.jsx`) + teste E2E
- Relatórios: 6 endpoints só-leitura → preencher cards/gráficos (`chart.jsx` já existe).
- Config: perfil do admin (`/settings/profile`) e dados da barbearia (`/settings/barbershop`).
- Fechar com E2E do admin (criar serviço → aparece no catálogo do cliente; mudar status de agendamento → cliente vê) + **remover mocks** + console limpo.

---

## 🔔 Extra transversal — Sino de Notificações (as 3 áreas)
Backend pronto em `/notifications`: `GET /` (feed), `GET /unread-count`, `PATCH /read-all`, `PATCH /:id/read`, `DELETE /:id`.
- Criar `services/notificationService.js` + um componente de sino reutilizável (badge com `unread-count`, lista ao abrir, marcar lida).
- Plugar no header de cliente, funcionário e admin.
- (A tela `client/pages/Notifications.jsx` continua sendo **preferências locais** — coisa diferente do feed.)

---

## ⚠️ Gotchas / lembretes
- **Shapes a confirmar na hora de implementar:** `Employee.js`, `Availability.js`, `BarbershopSettings.js`, e os payloads de `createEmployee`/`createAppointment` (admin).
- **Reuso:** centralizar `adaptAppointment` (hoje em `appointmentService.js`) para cliente/funcionário/admin não duplicarem.
- **Status PT** em toda parte; transições recusadas viram 400 com mensagem clara (já dá pra mostrar no toast).
- **Cada tela hoje usa mock/dados fixos** — localizar o import e só remover depois do real funcionando.
- **Sempre testar ao vivo + casos de erro** (foi assim que pegamos tudo no cliente sem deixar bug).
- **Tema escuro:** funcionário usa `.dark`; admin usa `.admin-theme`; se aparecer área "camuflada", é var `--bs-*` inline (mesmo problema já resolvido no cliente).

---

### ✅ Já concluído (referência)
Cliente: auth, catálogo (Home/Serviços/Barbeiros/Detalhes), agendamento (Booking+disponibilidade+criar), Meus Agendamentos (listar+cancelar), BookingSuccess, Perfil (`PATCH /auth/me`). Tudo testado ao vivo, inclusive erros. Ver `frontend-status.md` (memória) e `RELATORIO_FRONTEND_E_REVIEW.md`.
