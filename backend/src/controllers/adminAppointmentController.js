import Appointment from "../models/Appointment.js";
import {
  buildAppointmentPopulate,
  calculateAppointmentTotals,
  ensureSlotIsFree,
} from "../services/appointmentService.js";

const APPOINTMENT_STATUSES = [
  "pendente",
  "confirmado",
  "em_andamento",
  "concluido",
  "cancelado",
  "nao_compareceu",
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

    res.json(appointments);
  } catch (error) {
    next(error);
  }
}

export async function getAppointment(req, res, next) {
  try {
    const appointment = await buildAppointmentPopulate(Appointment.findById(req.params.id));

    if (!appointment) {
      return res.status(404).json({ message: "Agendamento nao encontrado" });
    }

    res.json(appointment);
  } catch (error) {
    next(error);
  }
}

export async function createAppointment(req, res, next) {
  try {
    const { clientId, employeeId, serviceIds, date, time, notes } = req.body;

    if (!clientId || !employeeId || !serviceIds?.length || !date || !time) {
      return res.status(400).json({ message: "Dados do agendamento incompletos" });
    }

    if (req.body.status && !APPOINTMENT_STATUSES.includes(req.body.status)) {
      return res.status(400).json({ message: "Status invalido" });
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

    res.status(201).json({ message: "Agendamento criado", appointment });
  } catch (error) {
    next(error);
  }
}

export async function updateAppointment(req, res, next) {
  try {
    const update = { ...req.body };
    const current = await Appointment.findById(req.params.id);

    if (!current) {
      return res.status(404).json({ message: "Agendamento nao encontrado" });
    }

    if (update.status && !APPOINTMENT_STATUSES.includes(update.status)) {
      return res.status(400).json({ message: "Status invalido" });
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

    res.json({ message: "Agendamento atualizado", appointment });
  } catch (error) {
    next(error);
  }
}

export async function deleteAppointment(req, res, next) {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Agendamento nao encontrado" });
    }

    res.json({ message: "Agendamento excluido" });
  } catch (error) {
    next(error);
  }
}

export async function updateAppointmentStatus(req, res, next) {
  try {
    if (!APPOINTMENT_STATUSES.includes(req.body.status)) {
      return res.status(400).json({ message: "Status invalido" });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Agendamento nao encontrado" });
    }

    res.json({ message: "Status atualizado", appointment });
  } catch (error) {
    next(error);
  }
}

export async function rescheduleAppointment(req, res, next) {
  try {
    const { date, time } = req.body;

    if (!date || !time) {
      return res.status(400).json({ message: "Data e horario sao obrigatorios" });
    }

    const current = await Appointment.findById(req.params.id);

    if (!current) {
      return res.status(404).json({ message: "Agendamento nao encontrado" });
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

    res.json({ message: "Agendamento reagendado", appointment: current });
  } catch (error) {
    next(error);
  }
}
