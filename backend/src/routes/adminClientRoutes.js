import express from "express";
import {
  deleteClient,
  getClient,
  getClientAppointments,
  getClientHistory,
  listClients,
  updateClient,
} from "../controllers/adminClientController.js";
import { onlyAdmin, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(onlyAdmin);

router.get("/", listClients);
router.get("/:id", getClient);
router.patch("/:id", updateClient);
router.delete("/:id", deleteClient);
router.get("/:id/appointments", getClientAppointments);
router.get("/:id/history", getClientHistory);

export default router;
