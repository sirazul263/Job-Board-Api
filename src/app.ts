import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth";
import jobsRoutes from "./routes/jobs";
import applicationsRoutes from "./routes/applications";

dotenv.config();

const app = express();

// Parse comma-separated list of origins from env
const allowedOrigins = process.env.CORS_ORIGINS?.split(",").map(origin => origin.trim()) || [];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(bodyParser.json());

app.get("/", (_, res) => {
  res.send("Application is running (TypeScript)");
});

const apiRouter = express.Router();
apiRouter.use("/auth", authRoutes);
apiRouter.use("/jobs", jobsRoutes);
apiRouter.use("/applications", applicationsRoutes);

app.use("/api", apiRouter);

export default app;