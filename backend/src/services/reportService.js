import Appointment from "../models/Appointment.js";
import { getDateRange } from "../utils/dateUtils.js";

export async function buildAppointmentReport(query = {}) {
  const dateRange = getDateRange(query);
  const filter = {};

  if (dateRange) {
    filter.date = dateRange;
  }

  const appointments = await Appointment.find(filter).populate("serviceIds");

  const summary = appointments.reduce(
    (total, appointment) => {
      total.totalAppointments += 1;

      if (appointment.status === "concluido") {
        total.completed += 1;
        total.estimatedRevenue += appointment.totalPrice;
      }

      if (appointment.status === "cancelado") total.cancelled += 1;
      if (appointment.status === "nao_compareceu") total.noShows += 1;

      return total;
    },
    {
      totalAppointments: 0,
      completed: 0,
      cancelled: 0,
      noShows: 0,
      estimatedRevenue: 0,
    }
  );

  return { summary, appointments };
}
