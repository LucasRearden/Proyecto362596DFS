import Tarea from "../models/tareas.model.js";
import { generarKeyRedisTareasUser } from "../utils/generar-key-redis.js";
import { eliminarDato, guardarDato, obtenerDato } from "./redis.service.js";



export const getAllTareasService = async () => {
    return await Tarea.find().populate("userId", "name email");
};



// getbyid
export const getTareaByIdService = async (id) => {
    return await Tarea.findById(id).populate("userId", "name email");
};



// getbycompleted
export const getTareasByCompletedService = async (completed) => {
    return await Tarea.find({ completed }).populate("userId", "name email");
};

// getbytitle
export const getTareasByTitleService = async (title) => {
    return await Tarea.find({ title: { $regex: title, $options: "i" } }).populate("userId", "name email");
};


// crear
export const createTareaService = async (userId, data) => {
    const keyRedis = generarKeyRedisTareasUser(userId);
    data.userId = userId;
    const tarea = await Tarea.create(data);
    await eliminarDato(keyRedis);
    return tarea;
}

//delete
export const deleteTareaService = async (userId, idTarea) => {

    const keyRedis = generarKeyRedisTareasUser(userId);

    const tarea = await getTareaByIdService(idTarea);
    if (!tarea) {
        const error = new Error("Tarea no encontrada");
        error.status = 404;
        throw error;
    }
    //porque el objeto esta populado 
    const idPropietario = tarea.userId?._id ?? tarea.userId;
    if (idPropietario.toString() !== userId.toString()) {
        const error = new Error(
            "No puede borrar la tarea porque no le pertenece"
        );
        error.status = 403;
        throw error;
    }
    //se elimina de redis la lista de tareas del usuario
    //ya que al eliminar una tarea la lista no representa lo que hay en mongo
    //esto fuerza a que al consultar las tareas del usuario, no se obtenga el dato
    //desde redis y tenga que volver a consultarse a mongo, obteniendo ahora si la
    //lista de tareas sin la que se acaba de eliminar
    const eliminada = await Tarea.findByIdAndDelete(idTarea);
    await eliminarDato(keyRedis);
    return eliminada;
};

// Las modificaciones se limitan al propietario y nunca aceptan userId del body.
export const updateTareaService = async (userId, id, data) => {
    const tarea = await Tarea.findOneAndUpdate(
        { _id: id, userId }, data, { returnDocument: "after", runValidators: true }
    );
    if (tarea) await eliminarDato(generarKeyRedisTareasUser(userId));
    return tarea;
};

export const replaceTareaService = async (userId, id, data) => {
    const tarea = await Tarea.findOneAndReplace(
        { _id: id, userId }, { ...data, userId },
        { returnDocument: "after", runValidators: true }
    );
    if (tarea) await eliminarDato(generarKeyRedisTareasUser(userId));
    return tarea;
};

// Consulta sin paginación. El caché corresponde únicamente a la lista completa;
// una consulta filtrada por completed no debe reutilizarla ni sobrescribirla.
export const getTareasByUserService = async (userId, completed) => {
    const filtro = { userId };
    if (completed !== undefined) filtro.completed = completed;

    if (completed !== undefined) {
        return Tarea.find(filtro).populate("userId", "name email");
    }

    const keyRedis = generarKeyRedisTareasUser(userId);
    const tareasEnCache = await obtenerDato(keyRedis);
    if (tareasEnCache) return tareasEnCache;

    const tareas = await Tarea.find(filtro).populate("userId", "name email");
    await guardarDato(keyRedis, tareas);
    return tareas;
};

// La consulta paginada usa Mongo: aplica el filtro antes de contar y limitar.
export const getTareasByUserServicePaginated = async (
    userId,
    { pagina, limite, completed }
) => {
    const filtro = { userId };

    // completed ya fue convertido a boolean por Joi.
    if (completed !== undefined) {
        filtro.completed = completed;
    }

    const [tareas, total] = await Promise.all(
        [
            Tarea.find(filtro)
                .sort({ _id: -1 })
                .skip((pagina - 1) * limite)
                .limit(limite)
                .populate("userId", "name email"),
            Tarea.countDocuments(filtro)
        ]
    );
    return {
        tareas,
        pagina,
        limite,
        total,
        totalPaginas: Math.ceil(total / limite)
    };
};
