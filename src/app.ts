import express from "express";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth";
import jobsRoutes from "./routes/jobs";
import applicationsRoutes from "./routes/applications";

const app = express();

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
