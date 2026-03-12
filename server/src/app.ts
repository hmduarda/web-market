import express from "express";
import cors from "cors";
import path from "path";
import routes from "./routes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res) => {
  res.json({ message: "Server running!" });
});

app.use(routes);

app.use(errorHandler);

export default app;
