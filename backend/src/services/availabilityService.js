import Appointment from "../models/Appointment.js";
import Availability from "../models/Availability.js";
import { makeTimeSlots } from "../utils/dateUtils.js";

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

  const bookedAppointments = await Appointment.find({
    employeeId,
    date,
    status: { $nin: ["cancelado", "nao_compareceu"] },
  });

  const bookedSlots = bookedAppointments.map((appointment) => appointment.time);

  return baseSlots.filter((slot) => {
    const blocked = availability.blockedSlots.includes(`${date}T${slot}`);
    return !bookedSlots.includes(slot) && !blocked;
  });
}
