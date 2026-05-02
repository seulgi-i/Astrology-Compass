import { Router, type IRouter } from "express";
import healthRouter from "./health";
import astrologyRouter from "./astrology/index";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/astrology", astrologyRouter);

export default router;
