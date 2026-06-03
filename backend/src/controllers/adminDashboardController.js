import Appointment from "../models/Appointment.js";
import Employee from "../models/Employee.js";
import { getTodayString } from "../utils/dateUtils.js";
import { sendSuccess } from "../utils/apiResponse.js";

export async function getDashboardSummary(req, res, next) {
  try {
    const today = getTodayString();
    const todayAppointments = await Appointment.find({ date: today });
    const onlineEmployees = await Employee.countDocuments({
      status: { $in: ["online", "trabalhando"] },
      active: true,
    });

    const summary = todayAppointments.reduce(
      (total, appointment) => {
        total.todayAppointments += 1;
        if (appointment.status === "concluido") {
          total.completed += 1;
          total.estimatedRevenue += appointment.totalPrice;
        }
        if (appointment.status === "cancelado") total.cancelled += 1;
        return total;
      },
      {
        todayAppointments: 0,
        estimatedRevenue: 0,
        completed: 0,
        cancelled: 0,
        onlineEmployees,
      }
    );

    sendSuccess(res, summary);
  } catch (error) {
    next(error);
  }
}

export async function getTodayAppointments(req, res, next) {
  try {
    const appointments = await Appointment.find({ date: getTodayString() })
      .populate("clientId", "name phone email")
      .populate("serviceIds")
      .populate({
        path: "employeeId",
        populate: { path: "userId", select: "name phone email" },
      })
      .sort({ time: 1 });

    sendSuccess(res, appointments);
  } catch (error) {
    next(error);
  }
}

export async function getOnlineEmployees(req, res, next) {
  try {
    const employees = await Employee.find({
      status: { $in: ["online", "trabalhando"] },
      active: true,
    }).populate("userId", "name email phone");

    sendSuccess(res, employees);
  } catch (error) {
    next(error);
  }
}
