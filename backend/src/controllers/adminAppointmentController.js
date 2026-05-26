import Appointment from "../models/Appointment.js";
import {
  buildAppointmentPopulate,
  calculateAppointmentTotals,
  ensureSlotIsFree,
} from "../services/appointmentService.js";

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

    if (update.serviceIds?.length) {
      Object.assign(update, await calculateAppointmentTotals(update.serviceIds));
    }

    if (update.date || update.time || update.employeeId) {
      const current = await Appointment.findById(req.params.id);
      await ensureSlotIsFree({
        employeeId: update.employeeId || current.employeeId,
        date: update.date || current.date,
        time: update.time || current.time,
        ignoreAppointmentId: current._id,
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(req.params.id, update, {
      new: true,
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
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json({ message: "Status atualizado", appointment });
  } catch (error) {
    next(error);
  }
}

export async function rescheduleAppointment(req, res, next) {
  try {
    const { date, time } = req.body;
    const current = await Appointment.findById(req.params.id);

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
const populatedAppointment = await buildAppointmentPopulate(
  Appointment.findById(appointment._id)
);

await sendAppointmentCreatedEmail(populatedAppointment);

res.status(201).json({
  message: "Agendamento criado com sucesso",
  appointment: populatedAppointment,
});