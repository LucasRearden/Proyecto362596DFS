import { Router } from "express";
import {
    createLibroController,
    deleteLibroController,
    updateLibroController,
    getLibrosController,
    replaceLibroController,
    getLibroByIdController
} from "../controller/libro.controller.js";
import { buscarEnGoogleBooksController } from "../controller/google-books.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { esDueñoOAdminMiddleware } from "../middleware/esDueñoOAdmin.middleware.js";
import { validarLimitePlanMiddleware } from "../middleware/limitePlan.middleware.js";
import { validateParamsIdLibroMiddleware } from "../middleware/common.middleware.js";
import { sanitizeLibroMiddleware } from "../middleware/sanitize-libro.middleware.js";
import {
    libroQueryValidateMiddleware,
    crearLibroValidateMiddleware,
    actualizarLibroValidateMiddleware,
    reemplazarLibroValidateMiddleware
} from "../middleware/libro.middleware.js";

const libroRoutes = Router();

// Todas las rutas siguientes requieren un token válido.
libroRoutes.use(authMiddleware);

// /buscar-externo va antes de /:idLibro para que no se interprete como un ID.
libroRoutes.get("/buscar-externo", buscarEnGoogleBooksController);

// Catálogo compartido, paginado y filtrable.
libroRoutes.get("/", libroQueryValidateMiddleware, getLibrosController);

// El límite de plan se valida antes de sanitizar/validar el body.
libroRoutes.post("/", validarLimitePlanMiddleware, sanitizeLibroMiddleware, crearLibroValidateMiddleware, createLibroController);

libroRoutes.get("/:idLibro", validateParamsIdLibroMiddleware, getLibroByIdController);

// esDueñoOAdmin ya busca el libro y valida el permiso antes de modificar/borrar.
libroRoutes.delete("/:idLibro", validateParamsIdLibroMiddleware, esDueñoOAdminMiddleware, deleteLibroController);
libroRoutes.patch("/:idLibro", validateParamsIdLibroMiddleware, esDueñoOAdminMiddleware, sanitizeLibroMiddleware, actualizarLibroValidateMiddleware, updateLibroController);
libroRoutes.put("/:idLibro", validateParamsIdLibroMiddleware, esDueñoOAdminMiddleware, sanitizeLibroMiddleware, reemplazarLibroValidateMiddleware, replaceLibroController);

export default libroRoutes;