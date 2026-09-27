import { Router } from "express";
import { createTareaController, deleteTareaController, updateTareaController, getTareasByUserController, replaceTareaController, getTareasController, getTareaByIdController } from "../controller/todo.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validarRolAdminMiddleware } from "../middleware/rol.middleware.js";
import { validateParamsIdTareaMiddleware } from "../middleware/common.middleware.js";
import { sanitizeTaskMiddleware } from "../middleware/sanitize-task.middleware.js";
import { tareaQueryValidateMiddleware, crearTareaValidateMiddleware, actualizarTareaValidateMiddleware, reemplazarTareaValidateMiddleware } from "../middleware/tarea.middelware.js";

const tareasRoutes = Router();

// Todas las rutas siguientes requieren un token válido.
tareasRoutes.use(authMiddleware);

// /admin va antes de las rutas con :idTarea para que "admin" no se interprete como un ID.
tareasRoutes.get("/admin", validarRolAdminMiddleware, getTareasController);
// Joi valida y convierte query; el controlador decide si debe paginar.
tareasRoutes.get("/", tareaQueryValidateMiddleware, getTareasByUserController);
// Se limpia el título antes de comprobar que el body sea válido.
tareasRoutes.post("/", sanitizeTaskMiddleware, crearTareaValidateMiddleware, createTareaController);
tareasRoutes.get("/:idTarea", validateParamsIdTareaMiddleware, getTareaByIdController);
tareasRoutes.delete("/:idTarea", validateParamsIdTareaMiddleware, deleteTareaController);
// PATCH acepta uno o más campos; PUT exige la representación completa.
tareasRoutes.patch("/:idTarea", validateParamsIdTareaMiddleware, sanitizeTaskMiddleware, actualizarTareaValidateMiddleware, updateTareaController);
tareasRoutes.put("/:idTarea", validateParamsIdTareaMiddleware, sanitizeTaskMiddleware, reemplazarTareaValidateMiddleware, replaceTareaController);

export default tareasRoutes;
