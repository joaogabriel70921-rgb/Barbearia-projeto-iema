import BarbershopSettings from "../models/BarbershopSettings.js";
import User from "../models/User.js";

export async function getAdminProfile(req, res) {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role,
    },
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

    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true });

    res.json({ message: "Perfil atualizado", user });
  } catch (error) {
    next(error);
  }
}

export async function getSettings(req, res, next) {
  try {
    const settings = await BarbershopSettings.findOne();
    res.json(settings);
  } catch (error) {
    next(error);
  }
}

export async function updateSettings(req, res, next) {
  try {
    const current = await BarbershopSettings.findOne();
    const settings = current
      ? await BarbershopSettings.findByIdAndUpdate(current._id, req.body, { new: true })
      : await BarbershopSettings.create({ ...req.body, ownerId: req.user._id });

    res.json({ message: "Configuracoes atualizadas", settings });
  } catch (error) {
    next(error);
  }
}
