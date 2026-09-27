import { listarTareasQuerySchema } from "../schemas/tareas-query.schema.js";
import { crearTareaBodySchema, actualizarTareaBodySchema, reemplazarTareaBodySchema } from "../schemas/tarea-body.schema.js";
import { velidateRequest } from "./validate.middleware.js";

// El mismo validador genérico se configura con un esquema distinto para cada ruta.
export const tareaQueryValidateMiddleware = velidateRequest(listarTareasQuerySchema, "query");
export const crearTareaValidateMiddleware = velidateRequest(crearTareaBodySchema, "body");
export const actualizarTareaValidateMiddleware = velidateRequest(actualizarTareaBodySchema, "body");
export const reemplazarTareaValidateMiddleware = velidateRequest(reemplazarTareaBodySchema, "body");
