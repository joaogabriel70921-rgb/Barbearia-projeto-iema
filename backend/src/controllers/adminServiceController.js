import Service from "../models/Service.js";

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
    const { name, duration, price } = req.body;

    if (!name || duration === undefined || price === undefined) {
      return res.status(400).json({ message: "Nome, duracao e preco sao obrigatorios" });
    }

    const service = await Service.create(pickServiceFields(req.body));
    res.status(201).json({ message: "Servico criado", service });
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

    if (!service) return res.status(404).json({ message: "Servico nao encontrado" });

    res.json({ message: "Servico atualizado", service });
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

    if (!service) return res.status(404).json({ message: "Servico nao encontrado" });

    res.json({ message: "Servico desativado", service });
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
