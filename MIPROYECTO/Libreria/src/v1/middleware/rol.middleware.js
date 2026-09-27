import { Role } from "../constants/role.constants.js";
import { constructorError } from "../utils/contructor.error.js";

const validateRolMiddleware = (role) => {
    return (req, res, next) => {
        const usuario = req.user;
        const rolUsuario = usuario.role;

        if (role !== rolUsuario) {
            const errorSinRol = constructorError("No tiene permisos suficientes", 403)
            next(errorSinRol);
        }
        next();
    }
}


export const validarRolAdminMiddleware = validateRolMiddleware(Role.admin);