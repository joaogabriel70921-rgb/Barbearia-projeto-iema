import Appointment from "../models/Appointment.js";
import Service from "../models/Service.js";
import { ApiError } from "../utils/ApiError.js";

export async function calculateAppointmentTotals(serviceIds) {
  const services = await Service.find({
    _id: { $in: serviceIds },
    active: true,
  });

  if (services.length !== serviceIds.length) {
    throw new ApiError(400, "Um ou mais serviços não foram encontrados");
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
    throw new ApiError(400, "Esse horário já está ocupado");
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
