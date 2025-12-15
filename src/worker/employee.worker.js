import mongoose from "mongoose";
import { Worker } from "bullmq";
import IORedis from "ioredis";
import Notification from "../models/Notification.js";
import fs from "fs";
import csvParser from "csv-parser";
import Employee from "../models/Employee.js";
import { employeeQueue } from "../services/queue.js";
import { notificationQueue } from "../services/queue.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ems";

// connect MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected (worker)"))
  .catch((err) => console.error(err));

const connection = new IORedis();

const worker = new Worker(
  "employee-queue",
  async (job) => {
    console.log("Processing job:", job.data);

    // simpan notifikasi
    const notif = await Notification.create({
      message: `Karyawan ${job.data.name} berhasil ditambahkan`,
    });

    console.log("Notification saved:", notif.message);
  },
  { connection }
);
employeeQueue.process("employee-import-csv", async (job) => {
  const { path, totalRows } = job.data;
  const BATCH_SIZE = 1000; // insert per 1000 baris
  let batch = [];
  let processed = 0;

  return new Promise((resolve, reject) => {
    fs.createReadStream(path)
      .pipe(csvParser())
      .on("data", (row) => {
        batch.push({
          name: row.name,
          age: Number(row.age),
          position: row.position,
          salary: Number(row.salary),
        });

        if (batch.length >= BATCH_SIZE) {
          Employee.insertMany(batch);
          processed += batch.length;
          batch = [];
          console.log(`Processed ${processed}/${totalRows}`);
          // opsional: push progress ke notif queue
        }
      })
      .on("end", async () => {
        if (batch.length > 0) {
          await Employee.insertMany(batch);
          processed += batch.length;
        }
        console.log("CSV import completed:", processed, "rows");
        resolve();
      })
      .on("error", (err) => {
        console.error(err);
        reject(err);
      });
  });
});

console.log("✅ Employee worker running");
