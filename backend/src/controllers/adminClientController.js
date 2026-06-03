import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export async function listClients(req, res, next) {
  try {
    const filter = { role: "cliente" };

    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
        { phone: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const clients = await User.find(filter).sort({ createdAt: -1 });
    sendSuccess(res, clients);
  } catch (error) {
    next(error);
  }
}

export async function getClient(req, res, next) {
  try {
    const client = await User.findOne({ _id: req.params.id, role: "cliente" });

    if (!client) {
      throw new ApiError(404, "Cliente não encontrado");
    }

    sendSuccess(res, client);
  } catch (error) {
    next(error);
  }
}

export async function updateClient(req, res, next) {
  try {
    const update = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      active: req.body.active,
    };

    Object.keys(update).forEach((key) => update[key] === undefined && delete update[key]);

    const client = await User.findOneAndUpdate(
      { _id: req.params.id, role: "cliente" },
      update,
      { new: true, runValidators: true }
    );

    if (!client) {
      throw new ApiError(404, "Cliente não encontrado");
    }

    sendSuccess(res, client, "Cliente atualizado");
  } catch (error) {
    next(error);
  }
}

export async function deleteClient(req, res, next) {
  try {
    const client = await User.findOneAndUpdate(
      { _id: req.params.id, role: "cliente" },
      { active: false },
      { new: true }
    );

    if (!client) {
      throw new ApiError(404, "Cliente não encontrado");
    }

    sendSuccess(res, null, "Cliente desativado");
  } catch (error) {
    next(error);
  }
}

export async function getClientAppointments(req, res, next) {
  try {
    const appointments = await Appointment.find({ clientId: req.params.id })
      .populate({
        path: "employeeId",
        populate: { path: "userId", select: "name phone email" },
      })
      .populate("serviceIds")
      .sort({ date: -1, time: -1 });

    sendSuccess(res, appointments);
  } catch (error) {
    next(error);
  }
}

export const getClientHistory = getClientAppointments;
