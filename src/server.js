// src/server.js
import 'dotenv/config'; // puts env into process.env
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import employeeRoutes from "./routes/employees.js";
import notificationRoutes from "./routes/notifications.js";



const app = express();
app.use(cors());
app.use(express.json());


// routes
app.use('/api/auth', authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/notifications", notificationRoutes);


console.log("Registering employee routes");


// health
app.get('/', (req, res) => res.json({ ok: true, env: process.env.NODE_ENV || 'dev' }));

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB(process.env.MONGO_URI);
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
})();
