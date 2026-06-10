const adminUser = {
  id: "admin-1",
  name: "Carlos Silva",
  email: "carlos@barbearia.com",
  phone: "(11) 98765-4321",
  photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos"
};
const employees = [
  {
    id: "emp-1",
    name: "Jo\xE3o Santos",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joao",
    position: "Barbeiro S\xEAnior",
    specialties: ["Corte", "Barba", "Degrad\xEA"],
    status: "available",
    availableHours: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"]
  },
  {
    id: "emp-2",
    name: "Pedro Oliveira",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro",
    position: "Barbeiro",
    specialties: ["Corte", "Sobrancelha"],
    status: "busy",
    availableHours: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]
  },
  {
    id: "emp-3",
    name: "Lucas Ferreira",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas",
    position: "Barbeiro Junior",
    specialties: ["Corte", "Barba"],
    status: "offline",
    availableHours: ["10:00", "11:00", "14:00", "15:00", "16:00"]
  }
];
const clients = [
  {
    id: "cli-1",
    name: "Marcos Almeida",
    phone: "(11) 99999-1111",
    email: "marcos@email.com",
    appointments: ["apt-1", "apt-4"]
  },
  {
    id: "cli-2",
    name: "Ricardo Costa",
    phone: "(11) 99999-2222",
    email: "ricardo@email.com",
    appointments: ["apt-2"]
  },
  {
    id: "cli-3",
    name: "Felipe Lima",
    phone: "(11) 99999-3333",
    email: "felipe@email.com",
    appointments: ["apt-3"]
  },
  {
    id: "cli-4",
    name: "Andr\xE9 Santos",
    phone: "(11) 99999-4444",
    email: "andre@email.com",
    appointments: ["apt-5"]
  },
  {
    id: "cli-5",
    name: "Bruno Rocha",
    phone: "(11) 99999-5555",
    email: "bruno@email.com",
    appointments: ["apt-6"]
  }
];
const services = [
  {
    id: "srv-1",
    name: "Corte Masculino",
    description: "Corte de cabelo tradicional ou moderno",
    duration: 30,
    price: 45,
    status: "active",
    employeeIds: ["emp-1", "emp-2", "emp-3"]
  },
  {
    id: "srv-2",
    name: "Barba",
    description: "Aparar e modelar barba",
    duration: 20,
    price: 35,
    status: "active",
    employeeIds: ["emp-1", "emp-3"]
  },
  {
    id: "srv-3",
    name: "Corte + Barba",
    description: "Combo completo",
    duration: 45,
    price: 70,
    status: "active",
    employeeIds: ["emp-1", "emp-2"]
  },
  {
    id: "srv-4",
    name: "Degrad\xEA",
    description: "Degrad\xEA profissional",
    duration: 40,
    price: 55,
    status: "active",
    employeeIds: ["emp-1"]
  },
  {
    id: "srv-5",
    name: "Sobrancelha",
    description: "Design de sobrancelha",
    duration: 15,
    price: 20,
    status: "active",
    employeeIds: ["emp-2"]
  }
];
const getTodayDate = () => (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
const getTomorrowDate = () => {
  const tomorrow = /* @__PURE__ */ new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
};
const appointments = [
  {
    id: "apt-1",
    clientId: "cli-1",
    employeeId: "emp-1",
    serviceId: "srv-3",
    date: getTodayDate(),
    time: "09:00",
    value: 70,
    status: "confirmed"
  },
  {
    id: "apt-2",
    clientId: "cli-2",
    employeeId: "emp-2",
    serviceId: "srv-1",
    date: getTodayDate(),
    time: "10:00",
    value: 45,
    status: "pending"
  },
  {
    id: "apt-3",
    clientId: "cli-3",
    employeeId: "emp-1",
    serviceId: "srv-2",
    date: getTodayDate(),
    time: "11:00",
    value: 35,
    status: "confirmed"
  },
  {
    id: "apt-4",
    clientId: "cli-1",
    employeeId: "emp-2",
    serviceId: "srv-4",
    date: getTodayDate(),
    time: "14:00",
    value: 55,
    status: "completed"
  },
  {
    id: "apt-5",
    clientId: "cli-4",
    employeeId: "emp-1",
    serviceId: "srv-1",
    date: getTodayDate(),
    time: "15:00",
    value: 45,
    status: "cancelled"
  },
  {
    id: "apt-6",
    clientId: "cli-5",
    employeeId: "emp-3",
    serviceId: "srv-5",
    date: getTodayDate(),
    time: "16:00",
    value: 20,
    status: "no_show"
  },
  {
    id: "apt-7",
    clientId: "cli-2",
    employeeId: "emp-1",
    serviceId: "srv-3",
    date: getTomorrowDate(),
    time: "09:00",
    value: 70,
    status: "pending"
  },
  {
    id: "apt-8",
    clientId: "cli-3",
    employeeId: "emp-2",
    serviceId: "srv-1",
    date: getTomorrowDate(),
    time: "10:00",
    value: 45,
    status: "pending"
  }
];
export {
  adminUser,
  appointments,
  clients,
  employees,
  services
};
