import { Router } from 'express';
import { authSignupController } from '../controllers/authSignupController';

const router = Router();

router.post("/auth/signup", authSignupController);

export default router;

