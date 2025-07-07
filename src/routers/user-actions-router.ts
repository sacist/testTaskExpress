import { Router } from "express";
import { getUserById,getAllUsers,banUser } from "../controllers/user-actions";

export const userActionsRouter=Router()

userActionsRouter.get('/get/:userId',getUserById)

userActionsRouter.get('/getAll',getAllUsers)

userActionsRouter.put('/ban/:userId',banUser)