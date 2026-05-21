import {Router} from "express"
import { healthCheck } from "../controller/health.controller.js";

const router = Router();

router.get("/healthCheck",healthCheck);

export default router;

