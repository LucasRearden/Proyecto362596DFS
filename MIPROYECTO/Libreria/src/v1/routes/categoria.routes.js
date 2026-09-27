import { Router } from "express";
import {
    getCategoriasController,
    createCategoriaController,
    updateCategoriaController,
    deleteCategoriaController
} from "../controller/categoria.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validarRolAdminMiddleware } from "../middleware/rol.middleware.js";
import { validateParamsIdCategoriaMiddleware } from "../middleware/common.middleware.js";
import {
    crearCategoriaValidateMiddleware,
    actualizarCategoriaValidateMiddleware
} from "../middleware/categoria.middleware.js";

const categoriaRoutes = Router();

categoriaRoutes.use(authMiddleware);

categoriaRoutes.get("/", getCategoriasController);
categoriaRoutes.post("/", validarRolAdminMiddleware, crearCategoriaValidateMiddleware, createCategoriaController);
categoriaRoutes.put("/:idCategoria", validarRolAdminMiddleware, validateParamsIdCategoriaMiddleware, actualizarCategoriaValidateMiddleware, updateCategoriaController);
categoriaRoutes.delete("/:idCategoria", validarRolAdminMiddleware, validateParamsIdCategoriaMiddleware, deleteCategoriaController);

export default categoriaRoutes;