import express from "express";
import multer from "multer";
import auth from "../middlewares/auth.middleware.js";
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  importCSV,
} from "../controllers/employee.controller.js";

const router = express.Router();

// Multer STREAMING (tidak ke RAM)
const upload = multer({
  dest: "tmp/csv/",
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

router.get("/", auth, getEmployees);
router.get("/:id", auth, getEmployeeById);
router.post("/", auth, createEmployee);
router.put("/:id", auth, updateEmployee);
router.delete("/:id", auth, deleteEmployee);

// 🔥 CSV Import
router.post("/import", auth, upload.single("file"), importCSV);

export default router;
