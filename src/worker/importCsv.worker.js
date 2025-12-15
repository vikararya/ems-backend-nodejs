import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { Worker } from "bullmq";
import fs from "fs";
import csv from "csv-parser";
import mongoose from "mongoose";
import Employee from "../models/Employee.js";
import { redisConnection, notificationQueue } from "../services/queue.js";
import { JOB_CSV_IMPORTED } from "../constants/jobs.js";

await mongoose.connect(process.env.MONGO_URI);
console.log("CSV Worker connected to MongoDB");

new Worker(
  "employeeQueue",
  async (job) => {
    if (job.name !== "import-csv") return;

    console.log("JOB DITERIMA:", job.id);

    const { filePath } = job.data;
    let batch = [];
    let processed = 0;
    const BATCH_SIZE = 1000;

    const stream = fs.createReadStream(filePath).pipe(csv());

    for await (const row of stream) {
      batch.push({
        name: row.name,
        age: Number(row.age),
        position: row.position,
        salary: Number(row.salary),
      });

      if (batch.length === BATCH_SIZE) {
        await Employee.insertMany(batch);
        processed += batch.length;
        batch = [];
        console.log(`Inserted ${processed}`);
      }
    }

    if (batch.length) {
      await Employee.insertMany(batch);
      processed += batch.length;
    }

    fs.unlinkSync(filePath);
    console.log("CSV import selesai:", processed);

    // Push notification ke Notification Queue
 console.log("KIRIM NOTIF CSV");
await notificationQueue.add(JOB_CSV_IMPORTED, {
  message: `Import CSV selesai, total ${processed} karyawan ditambahkan`,
});

  },
  { connection: redisConnection }
);

console.log("CSV Worker running...");
