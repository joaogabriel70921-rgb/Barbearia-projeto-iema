const services = [
  {
    id: "1",
    name: "Corte de Cabelo",
    duration: 30,
    price: 50,
    description: "Corte cl\xE1ssico ou moderno com acabamento perfeito",
    iconName: "scissors"
  },
  {
    id: "2",
    name: "Barba",
    duration: 20,
    price: 35,
    description: "Modelagem e hidrata\xE7\xE3o com navalha quente",
    iconName: "smile"
  },
  {
    id: "3",
    name: "Corte + Barba",
    duration: 45,
    price: 75,
    description: "O combo completo para o visual perfeito",
    iconName: "star"
  },
  {
    id: "4",
    name: "Sobrancelha",
    duration: 15,
    price: 25,
    description: "Design e alinhamento de sobrancelhas",
    iconName: "eye"
  },
  {
    id: "5",
    name: "Platinado",
    duration: 90,
    price: 150,
    description: "Descolora\xE7\xE3o e platinado com prote\xE7\xE3o total",
    iconName: "palette"
  },
  {
    id: "6",
    name: "Luzes",
    duration: 60,
    price: 120,
    description: "Mechas e luzes para um visual moderno",
    iconName: "sparkles"
  }
];
const barbers = [
  {
    id: "1",
    name: "Carlos Silva",
    specialty: "Cortes Cl\xE1ssicos",
    image: "",
    specialties: ["Cortes Cl\xE1ssicos", "Barba", "Degrad\xEA"],
    instagram: "@carlos.barber",
    youtube: "@carloscortes",
    availableToday: true,
    nextAvailable: "09:30"
  },
  {
    id: "2",
    name: "Bruno Santos",
    specialty: "Degrad\xEA & Moderno",
    image: "",
    specialties: ["Degrad\xEA", "Platinado", "Visual Moderno"],
    instagram: "@bruno.fade",
    youtube: "",
    availableToday: true,
    nextAvailable: "10:00"
  },
  {
    id: "3",
    name: "Rafael Costa",
    specialty: "Barba & Acabamento",
    image: "",
    specialties: ["Barba", "Acabamento", "Navalha"],
    instagram: "@rafa.barba",
    youtube: "@rafaelcosta",
    availableToday: false,
    nextAvailable: "14:00"
  },
  {
    id: "4",
    name: "Thiago Oliveira",
    specialty: "Colora\xE7\xE3o",
    image: "",
    specialties: ["Colora\xE7\xE3o", "Luzes", "Platinado"],
    instagram: "",
    youtube: "@thiagocolor",
    availableToday: true,
    nextAvailable: "11:30"
  }
];
const availableTimeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00"
];
const getAppointments = () => {
  const stored = localStorage.getItem("bs-appointments-v2");
  if (!stored) return [];
  const parsed = JSON.parse(stored);
  return parsed.map((apt) => {
    const migrated = { ...apt };
    if (apt.serviceId && !apt.serviceIds) {
      migrated.serviceIds = [apt.serviceId];
      delete migrated.serviceId;
    }
    if (!Array.isArray(migrated.serviceIds)) {
      migrated.serviceIds = [];
    }
    if (!migrated.status) {
      migrated.status = "confirmed";
    }
    return migrated;
  });
};
const saveAppointment = (appointment) => {
  const appointments = getAppointments();
  const newAppointment = {
    ...appointment,
    id: Date.now().toString(),
    status: appointment.status ?? "confirmed"
  };
  appointments.push(newAppointment);
  localStorage.setItem("bs-appointments-v2", JSON.stringify(appointments));
  return newAppointment;
};
const cancelAppointment = (id) => {
  const appointments = getAppointments();
  const updated = appointments.map(
    (apt) => apt.id === id ? { ...apt, status: "cancelled" } : apt
  );
  localStorage.setItem("bs-appointments-v2", JSON.stringify(updated));
};
const deleteAppointment = cancelAppointment;
const getAvailableSlots = (barberId, date) => {
  const appointments = getAppointments();
  const dateStr = date.toISOString().split("T")[0];
  const bookedSlots = appointments.filter(
    (apt) => apt.barberId === barberId && apt.date === dateStr && apt.status !== "cancelled"
  ).map((apt) => apt.time);
  return availableTimeSlots.filter((slot) => !bookedSlots.includes(slot));
};
const getServiceById = (id) => services.find((s) => s.id === id);
const getBarberById = (id) => barbers.find((b) => b.id === id);
const getServicesByIds = (ids) => (ids || []).map((id) => getServiceById(id)).filter(Boolean);
const getTotalPrice = (ids) => getServicesByIds(ids).reduce((sum, s) => sum + s.price, 0);
const getTotalDuration = (ids) => getServicesByIds(ids).reduce((sum, s) => sum + s.duration, 0);
export {
  availableTimeSlots,
  barbers,
  cancelAppointment,
  deleteAppointment,
  getAppointments,
  getAvailableSlots,
  getBarberById,
  getServiceById,
  getServicesByIds,
  getTotalDuration,
  getTotalPrice,
  saveAppointment,
  services
};
