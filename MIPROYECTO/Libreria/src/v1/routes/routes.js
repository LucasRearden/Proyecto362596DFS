
import { Router } from "express"
import userRoutes from "./user.routes.js"
import tareasRoutes from "./tarea.routes.js"
import authRoutes from "./auth.routes.js";
import publicRoutes from "./public.routes.js";


const v1Routes = Router()


v1Routes.use("/public", publicRoutes);

v1Routes.use("/auth", authRoutes);
v1Routes.use("/users", userRoutes)
v1Routes.use("/tareas", tareasRoutes)

export default v1Routes

