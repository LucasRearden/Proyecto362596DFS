import Libro from "../models/libro.model.js";
import { Role } from "../constants/role.constants.js";
import { constructorError } from "../utils/contructor.error.js";

// Se usa en PUT/DELETE de libros: solo quien lo cargó o un admin puede modificarlo.
export const esDueñoOAdminMiddleware = async (req, res, next) => {
    try {
        const libro = await Libro.findById(req.params.idLibro);
        if (!libro) {
            return next(constructorError("Libro no encontrado", 404));
        }

        const esAdmin = req.user.role === Role.admin;
        const esDueño = libro.createdBy.toString() === req.user.id;

        if (!esAdmin && !esDueño) {
            return next(constructorError("No tiene permisos para modificar este libro", 403));
        }

        // Lo cacheamos para no volver a buscarlo en el controller/service.
        req.libro = libro;
        return next();
    } catch (error) {
        return next(error);
    }
};