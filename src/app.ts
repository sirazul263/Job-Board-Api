import express from "express";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth";
const app = express();

app.use(bodyParser.json());

app.get("/", (_, res) => {
  res.send("Application is running (TypeScript)");
});

const apiRouter = express.Router();
apiRouter.use("/auth", authRoutes);

app.use("/api", apiRouter);

export default app;
