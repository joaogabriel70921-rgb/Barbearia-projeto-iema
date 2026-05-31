import Appointment from "../models/Appointment.js";
import {
  buildAppointmentPopulate,
  calculateAppointmentTotals,
  ensureSlotIsFree,
} from "../services/appointmentService.js";
import { sendAppointmentCreatedEmail } from "../services/notificationService.js";

const CLIENT_MUTABLE_STATUSES = ["pendente", "confirmado"];

export async function createAppointment(req, res, next) {
  try {
    const { employeeId, serviceIds, date, time, notes } = req.body;

    if (!employeeId || !serviceIds?.length || !date || !time) {
      return res.status(400).json({ message: "Dados do agendamento incompletos" });
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

    res.status(201).json({
      message: "Agendamento criado com sucesso",
      appointment: populatedAppointment,
    });
  } catch (error) {
    next(error);
  }
}

export async function listMyAppointments(req, res, next) {
  try {
    const appointments = await buildAppointmentPopulate(
      Appointment.find({ clientId: req.user._id }).sort({ date: -1, time: -1 })
    );

    res.json(appointments);
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
      return res.status(404).json({ message: "Agendamento nao encontrado" });
    }

    res.json(appointment);
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
      return res.status(404).json({ message: "Agendamento nao encontrado" });
    }

    if (!CLIENT_MUTABLE_STATUSES.includes(appointment.status)) {
      return res.status(400).json({
        message: `Nao e possivel cancelar um agendamento com status "${appointment.status}"`,
      });
    }

    appointment.status = "cancelado";
    appointment.cancelReason = req.body.reason || "";
    await appointment.save();

    res.json({ message: "Agendamento cancelado", appointment });
  } catch (error) {
    next(error);
  }
}

export async function rescheduleMyAppointment(req, res, next) {
  try {
    const { date, time } = req.body;

    if (!date || !time) {
      return res.status(400).json({ message: "Data e horario sao obrigatorios" });
    }

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      clientId: req.user._id,
    });

    if (!appointment) {
      return res.status(404).json({ message: "Agendamento nao encontrado" });
    }

    if (!CLIENT_MUTABLE_STATUSES.includes(appointment.status)) {
      return res.status(400).json({
        message: `Nao e possivel reagendar um agendamento com status "${appointment.status}"`,
      });
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

    res.json({ message: "Agendamento reagendado", appointment });
  } catch (error) {
    next(error);
  }
}
