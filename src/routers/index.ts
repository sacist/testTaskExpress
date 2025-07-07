import { Router } from "express";
import { authRouter } from "./auth-router";
import { userActionsRouter } from "./user-actions-router";
export const router= Router()

router.use('/auth',authRouter)
router.use('/user',userActionsRouter)