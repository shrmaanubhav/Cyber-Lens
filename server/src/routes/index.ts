import { Router } from 'express';
import { historyController } from "../controllers/historyController";

const router = Router();

router.get("/history", historyController);

export default router;

