import Appointment from "../models/Appointment.js";
import {
  buildAppointmentPopulate,
  calculateAppointmentTotals,
  ensureSlotIsFree,
} from "../services/appointmentService.js";
import { createNotification } from "../services/notificationService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const APPOINTMENT_STATUSES = [
  "pendente",
  "confirmado",
  "em_andamento",
  "concluido",
  "cancelado",
  "nao_compareceu",
];

// Campos que o admin pode alterar em um agendamento (evita mass assignment).
const ALLOWED_UPDATE_FIELDS = [
  "clientId",
  "employeeId",
  "serviceIds",
  "date",
  "time",
  "notes",
  "status",
  "cancelReason",
];

function buildAppointmentFilter(query) {
  const filter = {};

  if (query.date) filter.date = query.date;
  if (query.status) filter.status = query.status;
  if (query.clientId) filter.clientId = query.clientId;
  if (query.employeeId) filter.employeeId = query.employeeId;
  if (query.serviceId) filter.serviceIds = query.serviceId;

  return filter;
}

export async function listAppointments(req, res, next) {
  try {
    const appointments = await buildAppointmentPopulate(
      Appointment.find(buildAppointmentFilter(req.query)).sort({ date: -1, time: -1 })
    );

    sendSuccess(res, appointments);
  } catch (error) {
    next(error);
  }
}

export async function getAppointment(req, res, next) {
  try {
    const appointment = await buildAppointmentPopulate(Appointment.findById(req.params.id));

    if (!appointment) {
      throw new ApiError(404, "Agendamento não encontrado");
    }

    sendSuccess(res, appointment);
  } catch (error) {
    next(error);
  }
}

export async function createAppointment(req, res, next) {
  try {
    const { clientId, employeeId, serviceIds, date, time, notes } = req.body;

    if (!clientId || !employeeId || !serviceIds?.length || !date || !time) {
      throw new ApiError(400, "Dados do agendamento incompletos");
    }

    if (req.body.status && !APPOINTMENT_STATUSES.includes(req.body.status)) {
      throw new ApiError(400, "Status inválido");
    }

    const totals = await calculateAppointmentTotals(serviceIds);

    await ensureSlotIsFree({ employeeId, date, time });

    const appointment = await Appointment.create({
      clientId,
      employeeId,
      serviceIds,
      date,
      time,
      notes,
      status: req.body.status || "pendente",
      ...totals,
    });

    createNotification({
      userId: clientId,
      type: "agendamento",
      title: "Agendamento criado",
      message: `Um agendamento foi criado para ${date} às ${time}.`,
      data: { appointmentId: appointment._id },
    });

    sendSuccess(res, appointment, "Agendamento criado", 201);
  } catch (error) {
    next(error);
  }
}

export async function updateAppointment(req, res, next) {
  try {
    const update = {};
    for (const field of ALLOWED_UPDATE_FIELDS) {
      if (req.body[field] !== undefined) update[field] = req.body[field];
    }
    const current = await Appointment.findById(req.params.id);

    if (!current) {
      throw new ApiError(404, "Agendamento não encontrado");
    }

    if (update.status && !APPOINTMENT_STATUSES.includes(update.status)) {
      throw new ApiError(400, "Status inválido");
    }

    if (update.serviceIds?.length) {
      Object.assign(update, await calculateAppointmentTotals(update.serviceIds));
    }

    if (update.date || update.time || update.employeeId) {
      await ensureSlotIsFree({
        employeeId: update.employeeId || current.employeeId,
        date: update.date || current.date,
        time: update.time || current.time,
        ignoreAppointmentId: current._id,
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    sendSuccess(res, appointment, "Agendamento atualizado");
  } catch (error) {
    next(error);
  }
}

export async function deleteAppointment(req, res, next) {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      throw new ApiError(404, "Agendamento não encontrado");
    }

    sendSuccess(res, null, "Agendamento excluído");
  } catch (error) {
    next(error);
  }
}

export async function updateAppointmentStatus(req, res, next) {
  try {
    if (!APPOINTMENT_STATUSES.includes(req.body.status)) {
      throw new ApiError(400, "Status inválido");
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      throw new ApiError(404, "Agendamento não encontrado");
    }

    createNotification({
      userId: appointment.clientId,
      type: "status",
      title: "Atualização do agendamento",
      message: `O status do seu agendamento foi atualizado para "${req.body.status}".`,
      data: { appointmentId: appointment._id, status: req.body.status },
    });

    sendSuccess(res, appointment, "Status atualizado");
  } catch (error) {
    next(error);
  }
}

export async function rescheduleAppointment(req, res, next) {
  try {
    const { date, time } = req.body;

    if (!date || !time) {
      throw new ApiError(400, "Data e horário são obrigatórios");
    }

    const current = await Appointment.findById(req.params.id);

    if (!current) {
      throw new ApiError(404, "Agendamento não encontrado");
    }

    await ensureSlotIsFree({
      employeeId: current.employeeId,
      date,
      time,
      ignoreAppointmentId: current._id,
    });

    current.date = date;
    current.time = time;
    current.status = "pendente";
    await current.save();

    createNotification({
      userId: current.clientId,
      type: "agendamento",
      title: "Agendamento reagendado",
      message: `Seu agendamento foi reagendado para ${date} às ${time}.`,
      data: { appointmentId: current._id },
    });

    sendSuccess(res, current, "Agendamento reagendado");
  } catch (error) {
    next(error);
  }
}
