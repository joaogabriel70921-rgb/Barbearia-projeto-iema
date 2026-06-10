import Appointment from "../models/Appointment.js";
import Availability from "../models/Availability.js";
import Employee from "../models/Employee.js";
import {
  buildAppointmentPopulate,
  ensureSlotIsFree,
} from "../services/appointmentService.js";
import { getAvailabilityOrDefault } from "../services/availabilityService.js";
import { createNotification } from "../services/notificationService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { ApiError } from "../utils/ApiError.js";

async function findMyEmployee(userId) {
  return Employee.findOne({ userId }).populate("userId", "name email phone");
}

const EMPLOYEE_STATUSES = ["online", "offline", "trabalhando", "pausado"];

const APPOINTMENT_TRANSITIONS = {
  pendente: ["confirmado", "cancelado"],
  confirmado: ["em_andamento", "cancelado"],
  em_andamento: ["concluido", "nao_compareceu"],
};

const CLIENT_STATUS_MESSAGES = {
  confirmado: "Seu agendamento foi confirmado.",
  cancelado: "Seu agendamento foi recusado/cancelado.",
  em_andamento: "Seu atendimento foi iniciado.",
  concluido: "Seu atendimento foi concluído.",
  nao_compareceu: "Você foi marcado como ausente neste agendamento.",
};

export async function getEmployeeMe(req, res, next) {
  try {
    const employee = await findMyEmployee(req.user._id);

    if (!employee) {
      throw new ApiError(404, "Perfil de funcionário não encontrado");
    }

    sendSuccess(res, employee);
  } catch (error) {
    next(error);
  }
}

export async function updateEmployeeMe(req, res, next) {
  try {
    const allowedFields = ["photo", "position", "specialties", "socialLinks"];
    const update = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => allowedFields.includes(key))
    );

    const employee = await Employee.findOneAndUpdate(
      { userId: req.user._id },
      update,
      { new: true, runValidators: true }
    ).populate("userId", "name email phone");

    if (!employee) {
      throw new ApiError(404, "Perfil de funcionário não encontrado");
    }

    sendSuccess(res, employee, "Perfil atualizado");
  } catch (error) {
    next(error);
  }
}

export async function listEmployeeAppointments(req, res, next) {
  try {
    const employee = await Employee.findOne({ userId: req.user._id });

    if (!employee) {
      throw new ApiError(404, "Funcionário não encontrado");
    }

    const filter = { employeeId: employee._id };

    if (req.query.status) filter.status = req.query.status;
    if (req.query.date) filter.date = req.query.date;

    const appointments = await buildAppointmentPopulate(
      Appointment.find(filter).sort({ date: 1, time: 1 })
    );

    sendSuccess(res, appointments);
  } catch (error) {
    next(error);
  }
}

export async function updateEmployeeAppointmentStatus(req, res, next) {
  try {
    const employee = await Employee.findOne({ userId: req.user._id });
    const { status } = req.body;

    if (!employee) {
      throw new ApiError(404, "Perfil de funcionário não encontrado");
    }

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      employeeId: employee._id,
    });

    if (!appointment) {
      throw new ApiError(404, "Agendamento não encontrado");
    }

    const allowedStatuses = APPOINTMENT_TRANSITIONS[appointment.status];

    if (!allowedStatuses || !allowedStatuses.includes(status)) {
      throw new ApiError(
        400,
        `Não é possível mudar de "${appointment.status}" para "${status}"`
      );
    }

    appointment.status = status;
    await appointment.save();

    // Notifica o cliente sobre a mudança de status.
    createNotification({
      userId: appointment.clientId,
      type: "status",
      title: "Atualização do agendamento",
      message: CLIENT_STATUS_MESSAGES[status] || `Status atualizado: ${status}`,
      data: { appointmentId: appointment._id, status },
    });

    sendSuccess(res, appointment, "Status atualizado");
  } catch (error) {
    next(error);
  }
}

// Os wrappers usam `{ ...req.body }` para não quebrar quando a requisição
// chega sem corpo (req.body === undefined) — ex.: PATCH sem JSON body.
export async function acceptAppointment(req, res, next) {
  req.body = { ...req.body, status: "confirmado" };
  return updateEmployeeAppointmentStatus(req, res, next);
}

export async function rejectAppointment(req, res, next) {
  req.body = { ...req.body, status: "cancelado" };
  return updateEmployeeAppointmentStatus(req, res, next);
}

export async function startAppointment(req, res, next) {
  req.body = { ...req.body, status: "em_andamento" };
  return updateEmployeeAppointmentStatus(req, res, next);
}

export async function completeAppointment(req, res, next) {
  req.body = { ...req.body, status: "concluido" };
  return updateEmployeeAppointmentStatus(req, res, next);
}

export async function markNoShow(req, res, next) {
  req.body = { ...req.body, status: "nao_compareceu" };
  return updateEmployeeAppointmentStatus(req, res, next);
}

export async function suggestAppointmentTime(req, res, next) {
  try {
    const employee = await Employee.findOne({ userId: req.user._id });
    const { date, time, message } = req.body;

    if (!employee) {
      throw new ApiError(404, "Perfil de funcionário não encontrado");
    }

    if (!date || !time) {
      throw new ApiError(400, "Data e horário são obrigatórios");
    }

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      employeeId: employee._id,
    });

    if (!appointment) {
      throw new ApiError(404, "Agendamento não encontrado");
    }

    await ensureSlotIsFree({
      employeeId: employee._id,
      date,
      time,
      ignoreAppointmentId: appointment._id,
    });

    appointment.date = date;
    appointment.time = time;
    appointment.notes = message || appointment.notes;
    appointment.status = "pendente";
    await appointment.save();

    createNotification({
      userId: appointment.clientId,
      type: "agendamento",
      title: "Novo horário sugerido",
      message: `O profissional sugeriu um novo horário: ${date} às ${time}.`,
      data: { appointmentId: appointment._id },
    });

    sendSuccess(res, appointment, "Novo horário sugerido");
  } catch (error) {
    next(error);
  }
}

export async function updateEmployeeStatus(req, res, next) {
  try {
    if (!EMPLOYEE_STATUSES.includes(req.body.status)) {
      throw new ApiError(400, "Status inválido");
    }

    const employee = await Employee.findOneAndUpdate(
      { userId: req.user._id },
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!employee) {
      throw new ApiError(404, "Perfil de funcionário não encontrado");
    }

    sendSuccess(res, employee, "Status atualizado");
  } catch (error) {
    next(error);
  }
}

export async function getMyAvailability(req, res, next) {
  try {
    const employee = await Employee.findOne({ userId: req.user._id });

    if (!employee) {
      throw new ApiError(404, "Perfil de funcionário não encontrado");
    }

    const availability = await getAvailabilityOrDefault(employee._id);

    sendSuccess(res, availability);
  } catch (error) {
    next(error);
  }
}

export async function updateMyAvailability(req, res, next) {
  try {
    const employee = await Employee.findOne({ userId: req.user._id });

    if (!employee) {
      throw new ApiError(404, "Perfil de funcionário não encontrado");
    }

    const availability = await Availability.findOneAndUpdate(
      { employeeId: employee._id },
      { ...req.body, employeeId: employee._id },
      { new: true, upsert: true, runValidators: true }
    );

    sendSuccess(res, availability, "Disponibilidade atualizada");
  } catch (error) {
    next(error);
  }
}
