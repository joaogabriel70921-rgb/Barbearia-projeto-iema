import Service from "../models/Service.js";

export async function listServices(req, res, next) {
  try {
    const services = await Service.find().populate({
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
    const service = await Service.findById(req.params.id).populate({
      path: "employeeIds",
      populate: { path: "userId", select: "name email phone" },
    });

    if (!service) return res.status(404).json({ message: "Servico nao encontrado" });

    res.json(service);
  } catch (error) {
    next(error);
  }
}

export async function createService(req, res, next) {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ message: "Servico criado", service });
  } catch (error) {
    next(error);
  }
}

export async function updateService(req, res, next) {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json({ message: "Servico atualizado", service });
  } catch (error) {
    next(error);
  }
}

export async function deleteService(req, res, next) {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Servico excluido" });
  } catch (error) {
    next(error);
  }
}

export async function toggleServiceActive(req, res, next) {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) return res.status(404).json({ message: "Servico nao encontrado" });

    service.active = !service.active;
    await service.save();

    res.json({ message: "Status do servico atualizado", service });
  } catch (error) {
    next(error);
  }
}
