import { http } from "./http.js";

// ───────────────────────── Mapas de status ─────────────────────────
// As telas do funcionário usam strings de exibição (com espaço/acento);
// o backend usa enum com underscore/sem acento.
const STATUS_TO_VIEW = {
  pendente: "pendente",
  confirmado: "confirmado",
  em_andamento: "em andamento",
  concluido: "concluído",
  cancelado: "cancelado",
  nao_compareceu: "não compareceu",
};

const DAY_NAMES = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

// ───────────────────────── Adapters ─────────────────────────

// Employee (backend) → shape das telas (nome/cargo/foto/redesSociais...)
export function adaptEmployee(e) {
  if (!e) return null;
  const user = e.userId && typeof e.userId === "object" ? e.userId : null;
  return {
    id: e._id,
    nome: user?.name || "Funcionário",
    email: user?.email || "",
    telefone: user?.phone || "",
    foto: e.photo || "",
    cargo: e.position || "Barbeiro",
    especialidades: e.specialties || [],
    status: e.status || "offline", // online | offline | trabalhando | pausado
    redesSociais: {
      instagram: e.socialLinks?.instagram || "",
      youtube: e.socialLinks?.youtube || "",
    },
  };
}

// Appointment (backend, populado) → shape das telas do funcionário.
// Combina múltiplos serviços num único `servico` (nome concatenado, preço/duração totais).
export function adaptEmployeeAppointment(a) {
  if (!a) return null;
  const client = a.clientId && typeof a.clientId === "object" ? a.clientId : null;
  const services = (a.serviceIds || []).filter((s) => typeof s === "object");
  const nome = services.map((s) => s.name).join(" + ") || "Serviço";
  const preco =
    a.totalPrice ?? services.reduce((sum, s) => sum + (s.price || 0), 0);
  const duracao =
    a.totalDuration ?? services.reduce((sum, s) => sum + (s.duration || 0), 0);
  return {
    id: a._id,
    cliente: {
      id: client?._id || a.clientId,
      nome: client?.name || "Cliente",
      telefone: client?.phone || "",
      observacoes: a.notes || "",
    },
    servico: {
      ids: services.map((s) => s._id),
      nome,
      preco,
      duracao,
    },
    data: a.date,
    horario: a.time,
    status: STATUS_TO_VIEW[a.status] || a.status,
    statusRaw: a.status, // status original do backend (caso precise)
  };
}

// Availability (backend) → shape das telas (diasSemana/horarios/pausas/folgas).
// Se o funcionário ainda não configurou os horários (workHours vazio),
// sintetiza uma linha por dia de trabalho com 09:00–18:00 para a tela ficar utilizável.
export function adaptAvailability(av) {
  const weekDays = av?.weekDays || [];
  let horarios;
  if (av?.workHours?.length) {
    horarios = av.workHours.map((w) => ({
      _day: w.day,
      dia: DAY_NAMES[w.day],
      horarioInicio: w.start,
      horarioFim: w.end,
      disponivel: w.active !== false,
    }));
  } else {
    horarios = weekDays.map((d) => ({
      _day: d,
      dia: DAY_NAMES[d],
      horarioInicio: "09:00",
      horarioFim: "18:00",
      disponivel: true,
    }));
  }
  horarios.sort((x, y) => x._day - y._day);

  const pausas = (av?.breaks || []).map((b) => ({
    _day: b.day,
    dia: DAY_NAMES[b.day],
    horarioInicio: b.start,
    horarioFim: b.end,
    disponivel: b.active !== false,
  }));

  return {
    diasSemana: weekDays,
    horarios,
    pausas,
    folgas: av?.daysOff || [],
    bloqueios: av?.blockedSlots || [],
  };
}

// shape da tela → payload do backend (PUT /employees/me/availability).
// Não enviamos `breaks` de propósito: pausas são geridas pelo admin e o $set
// preserva as existentes quando o campo é omitido.
export function toBackendAvailability(local) {
  return {
    weekDays: local?.diasSemana || [],
    workHours: (local?.horarios || []).map((h) => ({
      day: h._day,
      start: h.horarioInicio,
      end: h.horarioFim,
      active: !!h.disponivel,
    })),
    daysOff: local?.folgas || [],
    blockedSlots: local?.bloqueios || [],
  };
}

// ───────────────────────── Service ─────────────────────────
export const employeeService = {
  // Perfil
  getMe: async () => adaptEmployee((await http.get("/employees/me")).data),

  // Atualiza perfil: campos de Employee vão para /employees/me; nome/email/telefone
  // pertencem ao User → /auth/me. Atualiza o User primeiro para o populate vir fresco.
  updateMe: async (data) => {
    await http.patch("/auth/me", {
      name: data.nome,
      email: data.email,
      phone: data.telefone,
    });
    const body = await http.patch("/employees/me", {
      photo: data.foto,
      position: data.cargo,
      specialties: data.especialidades || [],
      socialLinks: {
        instagram: data.redesSociais?.instagram || "",
        youtube: data.redesSociais?.youtube || "",
      },
    });
    return adaptEmployee(body.data);
  },

  setStatus: async (status) =>
    adaptEmployee((await http.patch("/employees/me/status", { status })).data),

  // Disponibilidade
  getAvailability: async () =>
    adaptAvailability((await http.get("/employees/me/availability")).data),
  updateAvailability: async (local) =>
    adaptAvailability(
      (await http.put("/employees/me/availability", toBackendAvailability(local))).data
    ),

  // Agenda
  listAppointments: async (filters = {}) => {
    const body = await http.get("/employees/me/appointments", { params: filters });
    return (body.data || []).map(adaptEmployeeAppointment);
  },

  // Ações de status (o backend valida as transições; erro vira error.message)
  accept: async (id) =>
    adaptEmployeeAppointment(
      (await http.patch(`/employees/me/appointments/${id}/accept`)).data
    ),
  reject: async (id) =>
    adaptEmployeeAppointment(
      (await http.patch(`/employees/me/appointments/${id}/reject`)).data
    ),
  start: async (id) =>
    adaptEmployeeAppointment(
      (await http.patch(`/employees/me/appointments/${id}/start`)).data
    ),
  complete: async (id) =>
    adaptEmployeeAppointment(
      (await http.patch(`/employees/me/appointments/${id}/complete`)).data
    ),
  noShow: async (id) =>
    adaptEmployeeAppointment(
      (await http.patch(`/employees/me/appointments/${id}/no-show`)).data
    ),
  suggestTime: async (id, { date, time, message }) =>
    adaptEmployeeAppointment(
      (await http.post(`/employees/me/appointments/${id}/suggest-time`, {
        date,
        time,
        message,
      })).data
    ),
};
