import Appointment from "../models/Appointment.js";
import User from "../models/User.js";

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
    res.json(clients);
  } catch (error) {
    next(error);
  }
}

export async function getClient(req, res, next) {
  try {
    const client = await User.findOne({ _id: req.params.id, role: "cliente" });

    if (!client) return res.status(404).json({ message: "Cliente nao encontrado" });

    res.json(client);
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
      { new: true }
    );

    res.json({ message: "Cliente atualizado", client });
  } catch (error) {
    next(error);
  }
}

export async function deleteClient(req, res, next) {
  try {
    await User.findOneAndUpdate(
      { _id: req.params.id, role: "cliente" },
      { active: false }
    );

    res.json({ message: "Cliente desativado" });
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

    res.json(appointments);
  } catch (error) {
    next(error);
  }
}

export const getClientHistory = getClientAppointments;
