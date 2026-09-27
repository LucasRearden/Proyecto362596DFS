import { createTareaService, deleteTareaService, getAllTareasService, getTareaByIdService, getTareasByUserService, getTareasByUserServicePaginated, replaceTareaService, updateTareaService } from "../services/tarea.services.js";
import { constructorError } from "../utils/contructor.error.js";

// El administrador puede consultar todas las tareas, sin filtrar por propietario.
export const getTareasController = async (req, res, next) => {
    try {
        return res.status(200).json(await getAllTareasService());
    } catch (error) {
        // El middleware global transforma el error en una respuesta HTTP.
        return next(error);
    }
};

// El middleware de la ruta ya comprobó que idTarea tenga formato ObjectId.
export const getTareaByIdController = async (req, res, next) => {
    try {
        const tarea = await getTareaByIdService(req.params.idTarea);
        if (!tarea) return next(constructorError("Tarea no encontrada", 404));
        return res.status(200).json(tarea);
    } catch (error) {
        // El middleware global transforma el error en una respuesta HTTP.
        return next(error);
    }
};

// userId sale del token; el servicio lo incorpora a la tarea al crearla.
export const createTareaController = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) return next(constructorError("Usuario no autenticado", 401));
        const tarea = await createTareaService(userId, req.body);
        return res.status(201).json({ tarea });
    } catch (error) {
        // El middleware global transforma el error en una respuesta HTTP.
        return next(error);
    }
};

// Un borrado exitoso responde 204: no tiene cuerpo de respuesta.
export const deleteTareaController = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) return next(constructorError("Usuario no autenticado", 401));
        await deleteTareaService(userId, req.params.idTarea);
        return res.status(204).send();
    } catch (error) {
        // El middleware global transforma el error en una respuesta HTTP.
        return next(error);
    }
};

// PATCH modifica únicamente los campos enviados por el cliente.
export const updateTareaController = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) return next(constructorError("Usuario no autenticado", 401));
        const tarea = await updateTareaService(userId, req.params.idTarea, req.body);
        if (!tarea) return next(constructorError("Tarea no encontrada", 404));
        return res.status(200).json(tarea);
    } catch (error) {
        // El middleware global transforma el error en una respuesta HTTP.
        return next(error);
    }
};

// PUT reemplaza los campos de la tarea; el servicio conserva su propietario.
export const replaceTareaController = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) return next(constructorError("Usuario no autenticado", 401));
        const tarea = await replaceTareaService(userId, req.params.idTarea, req.body);
        if (!tarea) return next(constructorError("Tarea no encontrada", 404));
        return res.status(200).json(tarea);
    } catch (error) {
        // El middleware global transforma el error en una respuesta HTTP.
        return next(error);
    }
};

// La presencia de pagina o limite decide entre lista completa y resultado paginado.
export const getTareasByUserController = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) return next(constructorError("Usuario no autenticado", 401));
        // Joi convierte los parámetros y los deja aquí. En Express 5 req.query es de solo lectura.
        const { pagina, limite, completed } = res.locals.validatedQuery;
        // Si la URL no indica paginación, mantenemos el formato original: un array.
        // completed también funciona sin paginar.
        if (pagina === undefined && limite === undefined) {
            const tareas = await getTareasByUserService(userId, completed);
            return res.status(200).json(tareas);
        }

        // Si llega solo uno de los parámetros, usamos el valor por defecto del otro.
        const resultado = await getTareasByUserServicePaginated(userId, {
            pagina: pagina ?? 1,
            limite: limite ?? 20,
            completed
        });
        return res.status(200).json(resultado);
    } catch (error) {
        // El middleware global transforma el error en una respuesta HTTP.
        return next(error);
    }
};
