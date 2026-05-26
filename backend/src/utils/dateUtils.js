export function getTodayString() {
  return new Date().toISOString().split("T")[0];
}

export function getDateRange(query) {
  const today = getTodayString();

  if (query.startDate && query.endDate) {
    return {
      $gte: query.startDate,
      $lte: query.endDate,
    };
  }

  if (query.period === "today") {
    return today;
  }

  if (query.period === "week" || query.period === "month") {
    const start = new Date();
    const end = new Date();
    end.setDate(start.getDate() + (query.period === "week" ? 7 : 30));

    return {
      $gte: start.toISOString().split("T")[0],
      $lte: end.toISOString().split("T")[0],
    };
  }

  return undefined;
}

export function makeTimeSlots(start = "09:00", end = "18:00", intervalMinutes = 30) {
  const slots = [];
  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);

  const current = new Date(2000, 0, 1, startHour, startMinute);
  const limit = new Date(2000, 0, 1, endHour, endMinute);

  while (current < limit) {
    slots.push(current.toTimeString().slice(0, 5));
    current.setMinutes(current.getMinutes() + intervalMinutes);
  }

  return slots;
}
