import express from "express";
import cors from "cors";
import resolveOwner from "./utils/resolveOwner";
import newsRouter from "./routes/news";
import lookupRouter from "./routes/lookup";
import historyRouter from "./routes/history";
import router from "./routes";

const app = express();

const corsOrigin = process.env.CORS_ORIGIN;

if (!corsOrigin) {
  throw new Error("CORS_ORIGIN must be set in environment");
}

app.use(express.json());

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "X-Client-ID"],
  })
);

app.use("/news", newsRouter);
app.use(resolveOwner);

app.get("/", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/lookup", lookupRouter);
app.use("/history", historyRouter);
app.use("/", router);

export default app;
