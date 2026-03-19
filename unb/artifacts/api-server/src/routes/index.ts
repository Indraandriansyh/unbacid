import { Router, type IRouter } from "express";
import healthRouter from "./health";
import registrationsRouter from "./registrations";
import profileRouter from "./profile";
import siteSettingsRouter from "./site-settings";
import uploadRouter from "./upload";

const router: IRouter = Router();

router.use(healthRouter);
router.use(registrationsRouter);
router.use(profileRouter);
router.use(siteSettingsRouter);
router.use(uploadRouter);

export default router;
