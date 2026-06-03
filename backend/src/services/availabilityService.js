import Appointment from "../models/Appointment.js";
import Availability from "../models/Availability.js";
import { makeTimeSlots } from "../utils/dateUtils.js";

// Disponibilidade padrão usada quando o funcionário ainda não configurou a dele.
export function defaultAvailability(employeeId) {
  return {
    employeeId,
    weekDays: [1, 2, 3, 4, 5, 6],
    workHours: [],
    breaks: [],
    daysOff: [],
    blockedSlots: [],
  };
}

// Retorna a disponibilidade do funcionário ou um objeto padrão (nunca null).
export async function getAvailabilityOrDefault(employeeId) {
  const availability = await Availability.findOne({ employeeId });
  return availability || defaultAvailability(employeeId);
}

export async function getEmployeeAvailableSlots(employeeId, date) {
  const day = new Date(`${date}T00:00:00`).getDay();
  const availability = await Availability.findOne({ employeeId });

  if (!availability) {
    return makeTimeSlots();
  }

  if (availability.daysOff.includes(date) || !availability.weekDays.includes(day)) {
    return [];
  }

  const dayWorkHours = availability.workHours.find(
    (item) => item.day === day && item.active
  );

  const baseSlots = dayWorkHours
    ? makeTimeSlots(dayWorkHours.start, dayWorkHours.end)
    : makeTimeSlots();

  const dayBreaks = availability.breaks.filter(
    (item) => item.day === day && item.active
  );

  const bookedAppointments = await Appointment.find({
    employeeId,
    date,
    status: { $nin: ["cancelado", "nao_compareceu"] },
  });

  const bookedSlots = bookedAppointments.map((appointment) => appointment.time);

  return baseSlots.filter((slot) => {
    const blocked = availability.blockedSlots.includes(`${date}T${slot}`);
    const isBreak = dayBreaks.some((item) => slot >= item.start && slot < item.end);

    return !bookedSlots.includes(slot) && !blocked && !isBreak;
  });
}
