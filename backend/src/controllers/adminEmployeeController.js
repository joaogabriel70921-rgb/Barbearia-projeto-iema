import Employee from "../models/Employee.js";
import User from "../models/User.js";
import Availability from "../models/Availability.js";
import Appointment from "../models/Appointment.js";
import { createUser } from "../services/authService.js";
import { getAvailabilityOrDefault } from "../services/availabilityService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const EMPLOYEE_STATUSES = ["online", "offline", "trabalhando", "pausado"];

export async function listEmployees(req, res, next) {
  try {
    const employees = await Employee.find().populate(
      "userId",
      "name email phone active role"
    );
    sendSuccess(res, employees);
  } catch (error) {
    next(error);
  }
}

export async function getEmployee(req, res, next) {
  try {
    const employee = await Employee.findById(req.params.id).populate(
      "userId",
      "name email phone active role"
    );

    if (!employee) {
      throw new ApiError(404, "Funcionário não encontrado");
    }

    sendSuccess(res, employee);
  } catch (error) {
    next(error);
  }
}

export async function createEmployee(req, res, next) {
  try {
    const user = await createUser({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      role: "funcionario",
      verified: true, // criado pelo admin (dono) → já confiável
    });

    const employee = await Employee.create({
      userId: user._id,
      photo: req.body.photo,
      position: req.body.position,
      specialties: req.body.specialties || [],
    });

    sendSuccess(res, employee, "Funcionário criado", 201);
  } catch (error) {
    next(error);
  }
}

export async function updateEmployee(req, res, next) {
  try {
    const { photo, position, specialties, socialLinks, active } = req.body;
    const update = {};

    if (photo !== undefined) update.photo = photo;
    if (position !== undefined) update.position = position;
    if (specialties !== undefined) update.specialties = specialties;
    if (socialLinks !== undefined) update.socialLinks = socialLinks;
    if (active !== undefined) update.active = active;

    const employee = await Employee.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!employee) {
      throw new ApiError(404, "Funcionário não encontrado");
    }

    if (
      req.body.name !== undefined ||
      req.body.email !== undefined ||
      req.body.phone !== undefined
    ) {
      const userUpdate = {};

      if (req.body.name !== undefined) userUpdate.name = req.body.name;
      if (req.body.email !== undefined) userUpdate.email = req.body.email;
      if (req.body.phone !== undefined) userUpdate.phone = req.body.phone;

      await User.findByIdAndUpdate(employee.userId, userUpdate, {
        runValidators: true,
      });
    }

    sendSuccess(res, employee, "Funcionário atualizado");
  } catch (error) {
    next(error);
  }
}

export async function deleteEmployee(req, res, next) {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );

    if (!employee) {
      throw new ApiError(404, "Funcionário não encontrado");
    }

    await User.findByIdAndUpdate(employee.userId, { active: false });

    sendSuccess(res, null, "Funcionário desativado");
  } catch (error) {
    next(error);
  }
}

export async function updateEmployeeStatus(req, res, next) {
  try {
    if (!EMPLOYEE_STATUSES.includes(req.body.status)) {
      throw new ApiError(400, "Status inválido");
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!employee) {
      throw new ApiError(404, "Funcionário não encontrado");
    }

    sendSuccess(res, employee, "Status atualizado");
  } catch (error) {
    next(error);
  }
}

export async function getEmployeeAvailability(req, res, next) {
  try {
    const availability = await getAvailabilityOrDefault(req.params.id);
    sendSuccess(res, availability);
  } catch (error) {
    next(error);
  }
}

export async function updateEmployeeAvailability(req, res, next) {
  try {
    const availability = await Availability.findOneAndUpdate(
      { employeeId: req.params.id },
      { ...req.body, employeeId: req.params.id },
      { new: true, upsert: true, runValidators: true }
    );

    sendSuccess(res, availability, "Disponibilidade atualizada");
  } catch (error) {
    next(error);
  }
}

export async function getEmployeeHistory(req, res, next) {
  try {
    const appointments = await Appointment.find({ employeeId: req.params.id })
      .populate("clientId", "name phone email")
      .populate("serviceIds")
      .sort({ date: -1, time: -1 });

    sendSuccess(res, appointments);
  } catch (error) {
    next(error);
  }
}
