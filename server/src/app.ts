import express from "express";
import cors from "cors";
import resolveOwner from "./utils/resolveOwner";
import lookupRouter from "./routes/lookup";
import historyRouter from "./routes/history";

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(resolveOwner);

// Simple health route
app.get("/", (_req, res) => res.json({ status: "ok" }));

app.use("/lookup", lookupRouter);
app.use("/history", historyRouter);

export default app;
