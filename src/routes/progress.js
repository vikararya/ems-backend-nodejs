import express from "express";
import IORedis from "ioredis";

const router = express.Router();
const redis = new IORedis();

router.get("/:jobId", async (req, res) => {
  const progress = await redis.get(
    `import-progress:${req.params.jobId}`
  );
  res.json({ progress });
});

export default router;
