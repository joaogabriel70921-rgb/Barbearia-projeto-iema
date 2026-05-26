import Appointment from "../models/Appointment.js";
import Service from "../models/Service.js";

export async function calculateAppointmentTotals(serviceIds) {
  const services = await Service.find({
    _id: { $in: serviceIds },
    active: true,
  });

  if (services.length !== serviceIds.length) {
    const error = new Error("Um ou mais servicos nao foram encontrados");
    error.statusCode = 400;
    throw error;
  }

  return services.reduce(
    (total, service) => ({
      totalPrice: total.totalPrice + service.price,
      totalDuration: total.totalDuration + service.duration,
    }),
    { totalPrice: 0, totalDuration: 0 }
  );
}

export async function ensureSlotIsFree({ employeeId, date, time, ignoreAppointmentId }) {
  const query = {
    employeeId,
    date,
    time,
    status: { $nin: ["cancelado", "nao_compareceu"] },
  };

  if (ignoreAppointmentId) {
    query._id = { $ne: ignoreAppointmentId };
  }

  const existingAppointment = await Appointment.findOne(query);

  if (existingAppointment) {
    const error = new Error("Esse horario ja esta ocupado");
    error.statusCode = 400;
    throw error;
  }
}

export function buildAppointmentPopulate(query) {
  return query
    .populate("clientId", "name email phone")
    .populate({
      path: "employeeId",
      populate: { path: "userId", select: "name email phone" },
    })
    .populate("serviceIds");
}
