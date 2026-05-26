import Appointment from "../models/Appointment.js";
import { buildAppointmentReport } from "../services/reportService.js";
import { getDateRange } from "../utils/dateUtils.js";

function reportFilter(query, status) {
  const filter = {};
  const dateRange = getDateRange(query);

  if (dateRange) filter.date = dateRange;
  if (status) filter.status = status;

  return filter;
}

export async function getReportSummary(req, res, next) {
  try {
    const report = await buildAppointmentReport(req.query);
    res.json(report.summary);
  } catch (error) {
    next(error);
  }
}

export async function getCompletedAppointments(req, res, next) {
  try {
    const appointments = await Appointment.find(reportFilter(req.query, "concluido"));
    res.json(appointments);
  } catch (error) {
    next(error);
  }
}

export async function getCancelledAppointments(req, res, next) {
  try {
    const appointments = await Appointment.find(reportFilter(req.query, "cancelado"));
    res.json(appointments);
  } catch (error) {
    next(error);
  }
}

export async function getNoShows(req, res, next) {
  try {
    const appointments = await Appointment.find(reportFilter(req.query, "nao_compareceu"));
    res.json(appointments);
  } catch (error) {
    next(error);
  }
}

export async function getTopServices(req, res, next) {
  try {
    const filter = reportFilter(req.query);
    const result = await Appointment.aggregate([
      { $match: filter },
      { $unwind: "$serviceIds" },
      { $group: { _id: "$serviceIds", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getEmployeePerformance(req, res, next) {
  try {
    const filter = reportFilter(req.query);
    const result = await Appointment.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$employeeId",
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "concluido"] }, 1, 0] },
          },
          cancelled: {
            $sum: { $cond: [{ $eq: ["$status", "cancelado"] }, 1, 0] },
          },
          revenue: {
            $sum: { $cond: [{ $eq: ["$status", "concluido"] }, "$totalPrice", 0] },
          },
        },
      },
      { $sort: { completed: -1 } },
    ]);

    res.json(result);
  } catch (error) {
    next(error);
  }
}
