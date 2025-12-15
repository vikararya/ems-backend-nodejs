import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { Worker } from "bullmq";
import mongoose from "mongoose";
import { redisConnection } from "../services/queue.js";
import Notification from "../models/Notification.js";
import { JOB_EMPLOYEE_CREATED, JOB_CSV_IMPORTED } from "../constants/jobs.js";

// Connect MongoDB
await mongoose.connect(process.env.MONGO_URI);
console.log("MongoDB connected (notification worker)");

// Notification Worker
new Worker(
  "notificationQueue",
  async (job) => {
    console.log("JOB MASUK:", job.name); // DEBUG

    switch (job.name) {
      case JOB_EMPLOYEE_CREATED:
      case JOB_CSV_IMPORTED: // 🔥 INI YANG KURANG
        await Notification.create({ message: job.data.message });
        console.log("Notification saved:", job.data.message);
        break;

      default:
        console.log("Unknown job:", job.name);
    }
  },
  { connection: redisConnection }
);

console.log("Notification Worker running...");
