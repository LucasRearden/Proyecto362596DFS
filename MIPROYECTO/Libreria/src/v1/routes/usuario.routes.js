import { Router } from "express"
import { getUsuariosController, cambiarPlanController } from "../controller/user.controller.js"
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validarRolAdminMiddleware } from "../middleware/rol.middleware.js";

const usuarioRoutes = Router();

// Todas las rutas siguientes requieren un token válido.
usuarioRoutes.use(authMiddleware);

// Solo admin.
usuarioRoutes.get("/", validarRolAdminMiddleware, getUsuariosController);

// Cualquier usuario autenticado puede cambiar su propio plan.
usuarioRoutes.put("/plan", cambiarPlanController);

export default usuarioRoutes