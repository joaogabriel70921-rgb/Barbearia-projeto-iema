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

const EMPLOYEE_STATUSES = ["online", "offline", "trabalhando", "pausado"];

const APPOINTMENT_TRANSITIONS = {
  pendente: ["confirmado", "cancelado"],
  confirmado: ["em_andamento", "cancelado"],
  em_andamento: ["concluido", "nao_compareceu"],
};

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
      { new: true, runValidators: true }
    ).populate("userId", "name email phone");

    if (!employee) {
      return res.status(404).json({ message: "Perfil de funcionario nao encontrado" });
    }

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

    if (!employee) {
      return res.status(404).json({ message: "Perfil de funcionario nao encontrado" });
    }

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      employeeId: employee._id,
    });

    if (!appointment) {
      return res.status(404).json({ message: "Agendamento nao encontrado" });
    }

    const allowedStatuses = APPOINTMENT_TRANSITIONS[appointment.status];

    if (!allowedStatuses || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: `Nao e possivel mudar de "${appointment.status}" para "${status}"`,
      });
    }

    appointment.status = status;
    await appointment.save();

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

    if (!employee) {
      return res.status(404).json({ message: "Perfil de funcionario nao encontrado" });
    }

    if (!date || !time) {
      return res.status(400).json({ message: "Data e horario sao obrigatorios" });
    }

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
    if (!EMPLOYEE_STATUSES.includes(req.body.status)) {
      return res.status(400).json({ message: "Status invalido" });
    }

    const employee = await Employee.findOneAndUpdate(
      { userId: req.user._id },
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({ message: "Perfil de funcionario nao encontrado" });
    }

    res.json({ message: "Status atualizado", employee });
  } catch (error) {
    next(error);
  }
}

export async function getMyAvailability(req, res, next) {
  try {
    const employee = await Employee.findOne({ userId: req.user._id });

    if (!employee) {
      return res.status(404).json({ message: "Perfil de funcionario nao encontrado" });
    }

    const availability = await Availability.findOne({ employeeId: employee._id });

    res.json(availability);
  } catch (error) {
    next(error);
  }
}

export async function updateMyAvailability(req, res, next) {
  try {
    const employee = await Employee.findOne({ userId: req.user._id });

    if (!employee) {
      return res.status(404).json({ message: "Perfil de funcionario nao encontrado" });
    }

    const availability = await Availability.findOneAndUpdate(
      { employeeId: employee._id },
      { ...req.body, employeeId: employee._id },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ message: "Disponibilidade atualizada", availability });
  } catch (error) {
    next(error);
  }
}
