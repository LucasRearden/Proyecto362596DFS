//routes/v1/users.routes.js
import { Router } from "express"
import { createUserController, deleteUserController, replaceUserController, updateUserController } from "../controller/user.controller.js"
import { validarRolAdminMiddleware } from "../middleware/rol.middleware.js";

const userRoutes = Router();

userRoutes.use(validarRolAdminMiddleware);

userRoutes.post("/", createUserController);
userRoutes.delete("/:idUser", deleteUserController);
userRoutes.patch("/:idUser", updateUserController);
userRoutes.put("/:idUser", replaceUserController);


export default userRoutes
