import Appointment from "../models/Appointment.js";
import Availability from "../models/Availability.js";
import Employee from "../models/Employee.js";
import {
  buildAppointmentPopulate,
  ensureSlotIsFree,
} from "../services/appointmentService.js";

async function findMyEmployee(userId) {
  return Employee.findOne({ userId }).populate("userId", "name email phone");
}

export async function getEmployeeMe(req, res, next) {
  try {
    const employee = await findMyEmployee(req.user._id);

    if (!employee) {
      return res.status(404).json({ message: "Perfil de funcionario nao encontrado" });
    }

    res.json(employee);
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
      { new: true }
    ).populate("userId", "name email phone");

    res.json({ message: "Perfil atualizado", employee });
  } catch (error) {
    next(error);
  }
}

export async function listEmployeeAppointments(req, res, next) {
  try {
    const employee = await Employee.findOne({ userId: req.user._id });

    if (!employee) {
      return res.status(404).json({ message: "Funcionario nao encontrado" });
    }

    const filter = { employeeId: employee._id };

    if (req.query.status) filter.status = req.query.status;
    if (req.query.date) filter.date = req.query.date;

    const appointments = await buildAppointmentPopulate(
      Appointment.find(filter).sort({ date: 1, time: 1 })
    );

    res.json(appointments);
  } catch (error) {
    next(error);
  }
}

export async function updateEmployeeAppointmentStatus(req, res, next) {
  try {
    const employee = await Employee.findOne({ userId: req.user._id });
    const { status } = req.body;

    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, employeeId: employee._id },
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Agendamento nao encontrado" });
    }

    res.json({ message: "Status atualizado", appointment });
  } catch (error) {
    next(error);
  }
}

export async function acceptAppointment(req, res, next) {
  req.body.status = "confirmado";
  return updateEmployeeAppointmentStatus(req, res, next);
}

export async function rejectAppointment(req, res, next) {
  req.body.status = "cancelado";
  return updateEmployeeAppointmentStatus(req, res, next);
}

export async function startAppointment(req, res, next) {
  req.body.status = "em_andamento";
  return updateEmployeeAppointmentStatus(req, res, next);
}

export async function completeAppointment(req, res, next) {
  req.body.status = "concluido";
  return updateEmployeeAppointmentStatus(req, res, next);
}

export async function markNoShow(req, res, next) {
  req.body.status = "nao_compareceu";
  return updateEmployeeAppointmentStatus(req, res, next);
}

export async function suggestAppointmentTime(req, res, next) {
  try {
    const employee = await Employee.findOne({ userId: req.user._id });
    const { date, time, message } = req.body;
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      employeeId: employee._id,
    });

    if (!appointment) {
      return res.status(404).json({ message: "Agendamento nao encontrado" });
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

    res.json({ message: "Novo horario sugerido", appointment });
  } catch (error) {
    next(error);
  }
}

export async function updateEmployeeStatus(req, res, next) {
  try {
    const employee = await Employee.findOneAndUpdate(
      { userId: req.user._id },
      { status: req.body.status },
      { new: true }
    );

    res.json({ message: "Status atualizado", employee });
  } catch (error) {
    next(error);
  }
}

export async function getMyAvailability(req, res, next) {
  try {
    const employee = await Employee.findOne({ userId: req.user._id });
    const availability = await Availability.findOne({ employeeId: employee._id });

    res.json(availability);
  } catch (error) {
    next(error);
  }
}

export async function updateMyAvailability(req, res, next) {
  try {
    const employee = await Employee.findOne({ userId: req.user._id });
    const availability = await Availability.findOneAndUpdate(
      { employeeId: employee._id },
      { ...req.body, employeeId: employee._id },
      { new: true, upsert: true }
    );

    res.json({ message: "Disponibilidade atualizada", availability });
  } catch (error) {
    next(error);
  }
}
