import Service from "../models/Service.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { ApiError } from "../utils/ApiError.js";

function pickServiceFields(body) {
  const { name, description, duration, price, employeeIds, active } = body;
  const update = {};

  if (name !== undefined) update.name = name;
  if (description !== undefined) update.description = description;
  if (duration !== undefined) update.duration = duration;
  if (price !== undefined) update.price = price;
  if (employeeIds !== undefined) update.employeeIds = employeeIds;
  if (active !== undefined) update.active = active;

  return update;
}

export async function listServices(req, res, next) {
  try {
    const services = await Service.find().populate({
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
    const service = await Service.findById(req.params.id).populate({
      path: "employeeIds",
      populate: { path: "userId", select: "name email phone" },
    });

    if (!service) {
      throw new ApiError(404, "Serviço não encontrado");
    }

    sendSuccess(res, service);
  } catch (error) {
    next(error);
  }
}

export async function createService(req, res, next) {
  try {
    const { name, duration, price } = req.body;

    if (!name || duration === undefined || price === undefined) {
      throw new ApiError(400, "Nome, duração e preço são obrigatórios");
    }

    const service = await Service.create(pickServiceFields(req.body));
    sendSuccess(res, service, "Serviço criado", 201);
  } catch (error) {
    next(error);
  }
}

export async function updateService(req, res, next) {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, pickServiceFields(req.body), {
      new: true,
      runValidators: true,
    });

    if (!service) {
      throw new ApiError(404, "Serviço não encontrado");
    }

    sendSuccess(res, service, "Serviço atualizado");
  } catch (error) {
    next(error);
  }
}

export async function deleteService(req, res, next) {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );

    if (!service) {
      throw new ApiError(404, "Serviço não encontrado");
    }

    sendSuccess(res, service, "Serviço desativado");
  } catch (error) {
    next(error);
  }
}

export async function toggleServiceActive(req, res, next) {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      throw new ApiError(404, "Serviço não encontrado");
    }

    service.active = !service.active;
    await service.save();

    sendSuccess(res, service, "Status do serviço atualizado");
  } catch (error) {
    next(error);
  }
}
