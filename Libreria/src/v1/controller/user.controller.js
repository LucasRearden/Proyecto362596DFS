import { getUsuariosService, cambiarPlanService } from "../services/usuario.services.js";
import { constructorError } from "../utils/contructor.error.js";

// Solo admin: listado de usuarios registrados.
export const getUsuariosController = async (req, res, next) => {
    try {
        const usuarios = await getUsuariosService();
        return res.status(200).json(usuarios);
    } catch (error) {
        return next(error);
    }
};

// Solo el propio usuario (plus → premium). El admin no gestiona planes.
export const cambiarPlanController = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) return next(constructorError("Usuario no autenticado", 401));
        const usuario = await cambiarPlanService(userId);
        return res.status(200).json(usuario);
    } catch (error) {
        return next(error);
    }
};