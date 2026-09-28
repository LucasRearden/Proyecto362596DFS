import { Role } from "../constants/role.constants.js";
import { constructorError } from "../utils/contructor.error.js";

const validarRolMiddleware = (rolRequerido) => {
    return (req, res, next) => {
        const usuario = req.user;
        if (usuario.role !== rolRequerido) {
            return next(constructorError("No tiene permisos suficientes", 403));
        }
        return next();
    };
};

export const validarRolAdminMiddleware = validarRolMiddleware(Role.admin);