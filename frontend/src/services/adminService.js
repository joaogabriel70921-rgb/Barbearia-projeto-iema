import { http } from "./http.js";

// ───────────────────────── Adapters ─────────────────────────

// Employee (backend) → shape das abas do admin.
// Mantém o status do backend (online|offline|trabalhando|pausado).
export function adaptAdminEmployee(e) {
  if (!e) return null;
  const user = e.userId && typeof e.userId === "object" ? e.userId : null;
  return {
    id: e._id,
    name: user?.name || "Funcionário",
    email: user?.email || "",
    phone: user?.phone || "",
    photo: e.photo || "",
    position: e.position || "Barbeiro",
    specialties: e.specialties || [],
    status: e.status || "offline",
    active: e.active !== false,
    socialLinks: {
      instagram: e.socialLinks?.instagram || "",
      youtube: e.socialLinks?.youtube || "",
    },
  };
}

// Usuário cliente (backend) → shape das abas do admin.
export function adaptAdminClient(u) {
  if (!u) return null;
  return {
    id: u._id,
    name: u.name || "",
    email: u.email || "",
    phone: u.phone || "",
    active: u.active !== false,
    createdAt: u.createdAt,
  };
}

// Service (backend) → shape das abas do admin.
export function adaptAdminService(s) {
  if (!s) return null;
  return {
    id: s._id,
    name: s.name,
    description: s.description || "",
    duration: s.duration,
    price: s.price,
    iconName: s.iconName || "scissors",
    active: s.active !== false,
    employeeCount: Array.isArray(s.employeeIds) ? s.employeeIds.length : 0,
  };
}

// Appointment (backend, populado) → shape das abas do admin.
export function adaptAdminAppointment(a) {
  if (!a) return null;
  const client = a.clientId && typeof a.clientId === "object" ? a.clientId : null;
  const emp = a.employeeId && typeof a.employeeId === "object" ? a.employeeId : null;
  const services = (a.serviceIds || []).filter((s) => typeof s === "object");
  return {
    id: a._id,
    date: a.date,
    time: a.time,
    status: a.status, // pendente | confirmado | em_andamento | concluido | cancelado | nao_compareceu
    totalPrice: a.totalPrice,
    totalDuration: a.totalDuration,
    notes: a.notes || "",
    client: {
      id: client?._id || a.clientId,
      name: client?.name || "Cliente",
      phone: client?.phone || "",
      email: client?.email || "",
    },
    employee: {
      id: emp?._id || a.employeeId,
      name: emp?.userId?.name || "Barbeiro",
    },
    services: services.map((s) => ({
      id: s._id,
      name: s.name,
      price: s.price,
      duration: s.duration,
    })),
    serviceNames: services.map((s) => s.name).join(" + "),
  };
}

// ───────────────────────── Service ─────────────────────────
export const adminService = {
  dashboard: {
    summary: async () => (await http.get("/admin/dashboard/summary")).data,
    todayAppointments: async () =>
      ((await http.get("/admin/dashboard/today-appointments")).data || []).map(
        adaptAdminAppointment
      ),
    onlineEmployees: async () =>
      ((await http.get("/admin/dashboard/online-employees")).data || []).map(
        adaptAdminEmployee
      ),
  },

  employees: {
    list: async () =>
      ((await http.get("/admin/employees")).data || []).map(adaptAdminEmployee),
    get: async (id) => adaptAdminEmployee((await http.get(`/admin/employees/${id}`)).data),
    create: async (payload) =>
      adaptAdminEmployee((await http.post("/admin/employees", payload)).data),
    update: async (id, payload) =>
      adaptAdminEmployee((await http.patch(`/admin/employees/${id}`, payload)).data),
    remove: async (id) => http.delete(`/admin/employees/${id}`),
    setStatus: async (id, status) =>
      adaptAdminEmployee(
        (await http.patch(`/admin/employees/${id}/status`, { status })).data
      ),
    getAvailability: async (id) => (await http.get(`/admin/employees/${id}/availability`)).data,
    updateAvailability: async (id, body) =>
      (await http.put(`/admin/employees/${id}/availability`, body)).data,
    history: async (id) =>
      ((await http.get(`/admin/employees/${id}/history`)).data || []).map(
        adaptAdminAppointment
      ),
  },

  services: {
    list: async () =>
      ((await http.get("/admin/services")).data || []).map(adaptAdminService),
    get: async (id) => adaptAdminService((await http.get(`/admin/services/${id}`)).data),
    create: async (payload) =>
      adaptAdminService((await http.post("/admin/services", payload)).data),
    update: async (id, payload) =>
      adaptAdminService((await http.patch(`/admin/services/${id}`, payload)).data),
    remove: async (id) => http.delete(`/admin/services/${id}`),
    toggleActive: async (id) =>
      adaptAdminService((await http.patch(`/admin/services/${id}/toggle-active`)).data),
  },

  clients: {
    list: async () =>
      ((await http.get("/admin/clients")).data || []).map(adaptAdminClient),
    get: async (id) => adaptAdminClient((await http.get(`/admin/clients/${id}`)).data),
    update: async (id, payload) =>
      adaptAdminClient((await http.patch(`/admin/clients/${id}`, payload)).data),
    remove: async (id) => http.delete(`/admin/clients/${id}`),
    appointments: async (id) =>
      ((await http.get(`/admin/clients/${id}/appointments`)).data || []).map(
        adaptAdminAppointment
      ),
    history: async (id) =>
      ((await http.get(`/admin/clients/${id}/history`)).data || []).map(
        adaptAdminAppointment
      ),
  },

  appointments: {
    list: async (params = {}) =>
      ((await http.get("/admin/appointments", { params })).data || []).map(
        adaptAdminAppointment
      ),
    get: async (id) => adaptAdminAppointment((await http.get(`/admin/appointments/${id}`)).data),
    create: async (payload) =>
      adaptAdminAppointment((await http.post("/admin/appointments", payload)).data),
    update: async (id, payload) =>
      adaptAdminAppointment((await http.patch(`/admin/appointments/${id}`, payload)).data),
    remove: async (id) => http.delete(`/admin/appointments/${id}`),
    setStatus: async (id, status) =>
      adaptAdminAppointment(
        (await http.patch(`/admin/appointments/${id}/status`, { status })).data
      ),
    reschedule: async (id, { date, time }) =>
      adaptAdminAppointment(
        (await http.patch(`/admin/appointments/${id}/reschedule`, { date, time })).data
      ),
  },

  reports: {
    summary: async (params = {}) => (await http.get("/admin/reports/summary", { params })).data,
    completed: async (params = {}) =>
      (await http.get("/admin/reports/completed-appointments", { params })).data,
    cancelled: async (params = {}) =>
      (await http.get("/admin/reports/cancelled-appointments", { params })).data,
    noShows: async (params = {}) => (await http.get("/admin/reports/no-shows", { params })).data,
    topServices: async (params = {}) =>
      (await http.get("/admin/reports/top-services", { params })).data,
    employeePerformance: async (params = {}) =>
      (await http.get("/admin/reports/employee-performance", { params })).data,
  },

  settings: {
    getProfile: async () => (await http.get("/admin/settings/profile")).data,
    updateProfile: async (payload) =>
      (await http.patch("/admin/settings/profile", payload)).data,
    getBarbershop: async () => (await http.get("/admin/settings/barbershop")).data,
    updateBarbershop: async (payload) =>
      (await http.patch("/admin/settings/barbershop", payload)).data,
  },
};
