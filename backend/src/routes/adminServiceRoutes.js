import express from "express";
import {
  createService,
  deleteService,
  getService,
  listServices,
  toggleServiceActive,
  updateService,
} from "../controllers/adminServiceController.js";
import { onlyAdmin, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(onlyAdmin);

router.get("/", listServices);
router.get("/:id", getService);
router.post("/", createService);
router.patch("/:id", updateService);
router.delete("/:id", deleteService);
router.patch("/:id/toggle-active", toggleServiceActive);

export default router;
