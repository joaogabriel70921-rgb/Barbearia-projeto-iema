import BarbershopSettings from "../models/BarbershopSettings.js";
import User from "../models/User.js";
import { sendSuccess } from "../utils/apiResponse.js";

export async function getAdminProfile(req, res) {
  sendSuccess(res, {
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    phone: req.user.phone,
    role: req.user.role,
  });
}

export async function updateAdminProfile(req, res, next) {
  try {
    const update = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    };

    Object.keys(update).forEach((key) => update[key] === undefined && delete update[key]);

    const user = await User.findByIdAndUpdate(req.user._id, update, {
      new: true,
      runValidators: true,
    });

    sendSuccess(res, user, "Perfil atualizado");
  } catch (error) {
    next(error);
  }
}

export async function getSettings(req, res, next) {
  try {
    const settings = await BarbershopSettings.findOne();
    sendSuccess(res, settings);
  } catch (error) {
    next(error);
  }
}

export async function updateSettings(req, res, next) {
  try {
    const current = await BarbershopSettings.findOne();
    const settings = current
      ? await BarbershopSettings.findByIdAndUpdate(current._id, req.body, {
          new: true,
          runValidators: true,
        })
      : await BarbershopSettings.create({ ...req.body, ownerId: req.user._id });

    sendSuccess(res, settings, "Configurações atualizadas");
  } catch (error) {
    next(error);
  }
}
