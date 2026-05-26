import Employee from "../models/Employee.js";
import Service from "../models/Service.js";
import { getEmployeeAvailableSlots } from "../services/availabilityService.js";

export async function listServices(req, res, next) {
  try {
    const services = await Service.find({ active: true }).populate({
      path: "employeeIds",
      populate: { path: "userId", select: "name email phone" },
    });

    res.json(services);
  } catch (error) {
    next(error);
  }
}

export async function getService(req, res, next) {
  try {
    const service = await Service.findOne({ _id: req.params.id, active: true });

    if (!service) {
      return res.status(404).json({ message: "Servico nao encontrado" });
    }

    res.json(service);
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

    res.json(employees);
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
      return res.status(404).json({ message: "Funcionario nao encontrado" });
    }

    res.json(employee);
  } catch (error) {
    next(error);
  }
}

export async function getAvailableSlots(req, res, next) {
  try {
    const { employeeId, date } = req.query;

    if (!employeeId || !date) {
      return res.status(400).json({ message: "employeeId e date sao obrigatorios" });
    }

    const slots = await getEmployeeAvailableSlots(employeeId, date);

    res.json({ slots });
  } catch (error) {
    next(error);
  }
}
