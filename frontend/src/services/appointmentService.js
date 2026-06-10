import { http } from "./http.js";

// Converte o agendamento (populado) do backend para o shape das telas.
export function adaptAppointment(a) {
  if (!a) return null;
  const emp = a.employeeId && typeof a.employeeId === "object" ? a.employeeId : null;
  const client = a.clientId && typeof a.clientId === "object" ? a.clientId : null;
  const services = (a.serviceIds || []).map((s) =>
    typeof s === "object" ? { id: s._id, name: s.name, price: s.price, duration: s.duration } : { id: s }
  );
  return {
    id: a._id,
    barberId: emp ? emp._id : a.employeeId,
    barber: emp
      ? {
          id: emp._id,
          name: emp.userId?.name || "Barbeiro",
          image: emp.photo || "",
          specialty: emp.position || emp.specialties?.[0] || "Barbeiro",
        }
      : null,
    serviceIds: services.map((s) => s.id),
    services,
    date: a.date,
    time: a.time,
    status: a.status, // pendente | confirmado | em_andamento | concluido | cancelado | nao_compareceu
    totalPrice: a.totalPrice,
    totalDuration: a.totalDuration,
    notes: a.notes || "",
    customerName: client?.name || "",
    customerPhone: client?.phone || "",
    customerEmail: client?.email || "",
  };
}

export const appointmentService = {
  create: async ({ employeeId, serviceIds, date, time, notes }) => {
    const body = await http.post("/appointments", { employeeId, serviceIds, date, time, notes });
    return adaptAppointment(body.data);
  },
  listMine: async () => {
    const body = await http.get("/appointments/me");
    return (body.data || []).map(adaptAppointment);
  },
  getMine: async (id) => adaptAppointment((await http.get(`/appointments/${id}`)).data),
  cancel: async (id, reason) => adaptAppointment((await http.patch(`/appointments/${id}/cancel`, { reason })).data),
  reschedule: async (id, { date, time }) =>
    adaptAppointment((await http.patch(`/appointments/${id}/reschedule`, { date, time })).data),
};
