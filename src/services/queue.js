import { Queue } from "bullmq";
import IORedis from "ioredis";

export const redisConnection = new IORedis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
});

export const employeeQueue = new Queue("employeeQueue", {
  connection: redisConnection,
});

export const notificationQueue = new Queue("notificationQueue", {
  connection: redisConnection,
});
