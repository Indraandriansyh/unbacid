import { Router, type IRouter } from "express";
import healthRouter from "./health";
import registrationsRouter from "./registrations";
import profileRouter from "./profile";
import siteSettingsRouter from "./site-settings";
import uploadRouter from "./upload";
import authRouter from "./auth";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(registrationsRouter);
router.use(profileRouter);
router.use(siteSettingsRouter);
router.use(uploadRouter);

export default router;
