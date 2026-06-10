const currentEmployee = {
  id: "1",
  nome: "Carlos Silva",
  foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
  cargo: "Barbeiro Senior",
  especialidades: ["Corte Masculino", "Barba", "Platinado", "Degrad\xEA"],
  telefone: "(11) 98765-4321",
  email: "carlos.silva@barbearia.com",
  status: "online",
  redesSociais: {
    instagram: "@carlosbarber",
    youtube: "@carlossilvabarber"
  }
};
const clients = [
  {
    id: "1",
    nome: "Jo\xE3o Pedro",
    telefone: "(11) 91234-5678",
    observacoes: "Prefere degrad\xEA baixo"
  },
  {
    id: "2",
    nome: "Lucas Oliveira",
    telefone: "(11) 92345-6789"
  },
  {
    id: "3",
    nome: "Rafael Santos",
    telefone: "(11) 93456-7890",
    observacoes: "Al\xE9rgico a alguns produtos"
  },
  {
    id: "4",
    nome: "Matheus Costa",
    telefone: "(11) 94567-8901"
  },
  {
    id: "5",
    nome: "Gabriel Alves",
    telefone: "(11) 95678-9012"
  }
];
const services = [
  {
    id: "1",
    nome: "Corte Masculino",
    duracao: 30,
    preco: 45
  },
  {
    id: "2",
    nome: "Barba",
    duracao: 20,
    preco: 30
  },
  {
    id: "3",
    nome: "Corte + Barba",
    duracao: 45,
    preco: 70
  },
  {
    id: "4",
    nome: "Platinado",
    duracao: 60,
    preco: 120
  },
  {
    id: "5",
    nome: "Degrad\xEA",
    duracao: 40,
    preco: 50
  }
];
const newAppointments = [
  {
    id: "1",
    cliente: clients[0],
    servico: services[2],
    data: "2026-05-19",
    horario: "14:30",
    status: "pendente"
  },
  {
    id: "2",
    cliente: clients[1],
    servico: services[0],
    data: "2026-05-19",
    horario: "16:00",
    status: "pendente"
  },
  {
    id: "3",
    cliente: clients[2],
    servico: services[4],
    data: "2026-05-19",
    horario: "17:00",
    status: "pendente"
  },
  {
    id: "10",
    cliente: { id: "6", nome: "Pedro Henrique", telefone: "(11) 96789-0123" },
    servico: services[1],
    data: "2026-05-19",
    horario: "09:30",
    status: "pendente"
  },
  {
    id: "11",
    cliente: { id: "7", nome: "Bruno Costa", telefone: "(11) 97890-1234", observacoes: "Primeira vez na barbearia" },
    servico: services[3],
    data: "2026-05-19",
    horario: "11:00",
    status: "pendente"
  },
  {
    id: "12",
    cliente: { id: "8", nome: "Felipe Rodrigues", telefone: "(11) 98901-2345" },
    servico: services[0],
    data: "2026-05-19",
    horario: "15:30",
    status: "pendente"
  },
  {
    id: "13",
    cliente: { id: "9", nome: "Thiago Martins", telefone: "(11) 99012-3456", observacoes: "Gosta de corte social" },
    servico: services[4],
    data: "2026-05-20",
    horario: "10:30",
    status: "pendente"
  },
  {
    id: "14",
    cliente: { id: "10", nome: "Andr\xE9 Silva", telefone: "(11) 90123-4567" },
    servico: services[2],
    data: "2026-05-20",
    horario: "14:00",
    status: "pendente"
  },
  {
    id: "15",
    cliente: { id: "11", nome: "Leonardo Santos", telefone: "(11) 91234-5670" },
    servico: services[1],
    data: "2026-05-20",
    horario: "16:30",
    status: "pendente"
  },
  {
    id: "16",
    cliente: { id: "12", nome: "Ricardo Almeida", telefone: "(11) 92345-6701", observacoes: "Prefere tesoura ao inv\xE9s de m\xE1quina" },
    servico: services[0],
    data: "2026-05-21",
    horario: "09:00",
    status: "pendente"
  },
  {
    id: "17",
    cliente: { id: "13", nome: "Gustavo Lima", telefone: "(11) 93456-7012" },
    servico: services[3],
    data: "2026-05-21",
    horario: "13:00",
    status: "pendente"
  },
  {
    id: "18",
    cliente: { id: "14", nome: "Diego Fernandes", telefone: "(11) 94567-8123" },
    servico: services[4],
    data: "2026-05-21",
    horario: "15:00",
    status: "pendente"
  }
];
const confirmedAppointments = [
  {
    id: "4",
    cliente: clients[3],
    servico: services[0],
    data: "2026-05-19",
    horario: "10:00",
    status: "confirmado"
  },
  {
    id: "5",
    cliente: clients[4],
    servico: services[1],
    data: "2026-05-19",
    horario: "11:00",
    status: "confirmado"
  },
  {
    id: "6",
    cliente: clients[0],
    servico: services[2],
    data: "2026-05-19",
    horario: "13:00",
    status: "em andamento"
  },
  {
    id: "7",
    cliente: clients[1],
    servico: services[3],
    data: "2026-05-20",
    horario: "14:00",
    status: "confirmado"
  },
  {
    id: "8",
    cliente: clients[2],
    servico: services[0],
    data: "2026-05-20",
    horario: "15:30",
    status: "confirmado"
  }
];
const completedAppointments = [
  {
    id: "9",
    cliente: clients[3],
    servico: services[0],
    data: "2026-05-19",
    horario: "09:00",
    status: "conclu\xEDdo"
  }
];
const employeeAvailability = {
  diasSemana: [1, 2, 3, 4, 5, 6],
  horarios: [
    {
      dia: "Segunda-feira",
      horarioInicio: "09:00",
      horarioFim: "18:00",
      disponivel: true
    },
    {
      dia: "Ter\xE7a-feira",
      horarioInicio: "09:00",
      horarioFim: "18:00",
      disponivel: true
    },
    {
      dia: "Quarta-feira",
      horarioInicio: "09:00",
      horarioFim: "18:00",
      disponivel: true
    },
    {
      dia: "Quinta-feira",
      horarioInicio: "09:00",
      horarioFim: "18:00",
      disponivel: true
    },
    {
      dia: "Sexta-feira",
      horarioInicio: "09:00",
      horarioFim: "19:00",
      disponivel: true
    },
    {
      dia: "S\xE1bado",
      horarioInicio: "08:00",
      horarioFim: "17:00",
      disponivel: true
    }
  ],
  pausas: [
    {
      dia: "Todos os dias",
      horarioInicio: "12:00",
      horarioFim: "13:00",
      disponivel: false
    }
  ],
  bloqueios: [],
  folgas: ["2026-05-18"]
};
export {
  completedAppointments,
  confirmedAppointments,
  currentEmployee,
  employeeAvailability,
  newAppointments
};
