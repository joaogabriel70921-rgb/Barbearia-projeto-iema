import Appointment from "../models/Appointment.js";
import {
  buildAppointmentPopulate,
  calculateAppointmentTotals,
  ensureSlotIsFree,
} from "../services/appointmentService.js";
import {
  createNotification,
  sendAppointmentCreatedEmail,
} from "../services/notificationService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const CLIENT_MUTABLE_STATUSES = ["pendente", "confirmado"];

export async function createAppointment(req, res, next) {
  try {
    const { employeeId, serviceIds, date, time, notes } = req.body;

    if (!employeeId || !serviceIds?.length || !date || !time) {
      throw new ApiError(400, "Dados do agendamento incompletos");
    }

    await ensureSlotIsFree({ employeeId, date, time });
    const totals = await calculateAppointmentTotals(serviceIds);

    const appointment = await Appointment.create({
      clientId: req.user._id,
      employeeId,
      serviceIds,
      date,
      time,
      notes,
      ...totals,
    });

    const populatedAppointment = await buildAppointmentPopulate(
      Appointment.findById(appointment._id)
    );

    await sendAppointmentCreatedEmail(populatedAppointment);

    // Notifica o funcionário sobre o novo agendamento.
    await createNotification({
      userId: populatedAppointment.employeeId?.userId?._id,
      type: "agendamento",
      title: "Novo agendamento",
      message: `Novo agendamento de ${populatedAppointment.clientId?.name || "um cliente"} para ${date} às ${time}.`,
      data: { appointmentId: populatedAppointment._id },
    });

    sendSuccess(res, populatedAppointment, "Agendamento criado com sucesso", 201);
  } catch (error) {
    next(error);
  }
}

export async function listMyAppointments(req, res, next) {
  try {
    const appointments = await buildAppointmentPopulate(
      Appointment.find({ clientId: req.user._id }).sort({ date: -1, time: -1 })
    );

    sendSuccess(res, appointments);
  } catch (error) {
    next(error);
  }
}

export async function getMyAppointment(req, res, next) {
  try {
    const appointment = await buildAppointmentPopulate(
      Appointment.findOne({ _id: req.params.id, clientId: req.user._id })
    );

    if (!appointment) {
      throw new ApiError(404, "Agendamento não encontrado");
    }

    sendSuccess(res, appointment);
  } catch (error) {
    next(error);
  }
}

export async function cancelMyAppointment(req, res, next) {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      clientId: req.user._id,
    });

    if (!appointment) {
      throw new ApiError(404, "Agendamento não encontrado");
    }

    if (!CLIENT_MUTABLE_STATUSES.includes(appointment.status)) {
      throw new ApiError(
        400,
        `Não é possível cancelar um agendamento com status "${appointment.status}"`
      );
    }

    appointment.status = "cancelado";
    appointment.cancelReason = req.body.reason || "";
    await appointment.save();

    sendSuccess(res, appointment, "Agendamento cancelado");
  } catch (error) {
    next(error);
  }
}

export async function rescheduleMyAppointment(req, res, next) {
  try {
    const { date, time } = req.body;

    if (!date || !time) {
      throw new ApiError(400, "Data e horário são obrigatórios");
    }

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      clientId: req.user._id,
    });

    if (!appointment) {
      throw new ApiError(404, "Agendamento não encontrado");
    }

    if (!CLIENT_MUTABLE_STATUSES.includes(appointment.status)) {
      throw new ApiError(
        400,
        `Não é possível reagendar um agendamento com status "${appointment.status}"`
      );
    }

    await ensureSlotIsFree({
      employeeId: appointment.employeeId,
      date,
      time,
      ignoreAppointmentId: appointment._id,
    });

    appointment.date = date;
    appointment.time = time;
    appointment.status = "pendente";
    await appointment.save();

    sendSuccess(res, appointment, "Agendamento reagendado");
  } catch (error) {
    next(error);
  }
}
