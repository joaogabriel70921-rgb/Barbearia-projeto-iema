import Employee from "../models/Employee.js";
import Service from "../models/Service.js";
import { getEmployeeAvailableSlots } from "../services/availabilityService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export async function listServices(req, res, next) {
  try {
    const services = await Service.find({ active: true }).populate({
      path: "employeeIds",
      populate: { path: "userId", select: "name email phone" },
    });

    sendSuccess(res, services);
  } catch (error) {
    next(error);
  }
}

export async function getService(req, res, next) {
  try {
    const service = await Service.findOne({ _id: req.params.id, active: true });

    if (!service) {
      throw new ApiError(404, "Serviço não encontrado");
    }

    sendSuccess(res, service);
  } catch (error) {
    next(error);
  }
}

export async function listEmployees(req, res, next) {
  try {
    const employees = await Employee.find({ active: true }).populate(
      "userId",
      "name email phone"
    );

    sendSuccess(res, employees);
  } catch (error) {
    next(error);
  }
}

export async function getEmployee(req, res, next) {
  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      active: true,
    }).populate("userId", "name email phone");

    if (!employee) {
      throw new ApiError(404, "Funcionário não encontrado");
    }

    sendSuccess(res, employee);
  } catch (error) {
    next(error);
  }
}

export async function getAvailableSlots(req, res, next) {
  try {
    const { employeeId, date } = req.query;

    if (!employeeId || !date) {
      throw new ApiError(400, "employeeId e date são obrigatórios");
    }

    const slots = await getEmployeeAvailableSlots(employeeId, date);

    sendSuccess(res, slots);
  } catch (error) {
    next(error);
  }
}
