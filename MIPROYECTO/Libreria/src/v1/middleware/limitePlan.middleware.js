import Libro from "../models/libro.model.js";
import { Plan } from "../constants/plan.constants.js";
import { constructorError } from "../utils/contructor.error.js";

const LIMITE_LIBROS_PLUS = 4;

// Se usa en POST /libros: los usuarios plus solo pueden tener 4 libros activos.
export const validarLimitePlanMiddleware = async (req, res, next) => {
    try {
        if (req.user.plan !== Plan.plus) {
            return next(); // premium no tiene límite
        }

        const cantidadActual = await Libro.countDocuments({ createdBy: req.user.id });
        if (cantidadActual >= LIMITE_LIBROS_PLUS) {
            return next(constructorError(
                `Alcanzaste el límite de ${LIMITE_LIBROS_PLUS} libros del plan plus`,
                403
            ));
        }

        return next();
    } catch (error) {
        return next(error);
    }
};