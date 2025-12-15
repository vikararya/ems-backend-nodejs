// src/controllers/employee.controller.js
import fs from "fs";
import csvParser from "csv-parser";
import Employee from "../models/Employee.js";
import { JOB_EMPLOYEE_CREATED } from "../constants/jobs.js";
import { employeeQueue, notificationQueue } from "../services/queue.js";

/**
 * GET /api/employees
 * Ambil semua karyawan, urut dari terbaru
 */
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil data karyawan" });
  }
};

/**
 * GET /api/employees/:id
 * Ambil detail karyawan berdasarkan ID
 */
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Karyawan tidak ditemukan" });
    res.json(employee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil data karyawan" });
  }
};

/**
 * POST /api/employees
 * Tambah karyawan baru
 * Otomatis push job ke Redis Queue untuk notifikasi
 */
export const createEmployee = async (req, res) => {
  try {
    const { name, age, position, salary } = req.body;
    const employee = await Employee.create({ name, age, position, salary });

    // Push notifikasi
    await notificationQueue.add(JOB_EMPLOYEE_CREATED, {
      message: `Karyawan ${employee.name} berhasil ditambahkan`,
    });

    console.log("Notification job added:", employee.name);
    res.status(201).json(employee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal menambahkan karyawan" });
  }
};

/**
 * PUT /api/employees/:id
 * Update data karyawan
 */
export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!employee) return res.status(404).json({ message: "Karyawan tidak ditemukan" });
    res.json(employee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengubah data karyawan" });
  }
};

/**
 * DELETE /api/employees/:id
 * Hapus karyawan
 */
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: "Karyawan tidak ditemukan" });
    res.json({ message: "Karyawan berhasil dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal menghapus karyawan" });
  }
};

export const importCSV = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "File CSV wajib diupload" });
  }

  // Push job ke Redis
  const job = await employeeQueue.add("import-csv", {
    filePath: req.file.path,
    filename: req.file.originalname,
  });

  res.json({
    message: "CSV berhasil diupload, sedang diproses",
    jobId: job.id,
  });
};