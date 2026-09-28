import { listarLibrosQuerySchema } from "../schemas/libro-query.schema.js";
import { crearLibroBodySchema, actualizarLibroBodySchema, reemplazarLibroBodySchema } from "../schemas/libro-body.schema.js";
import { velidateRequest } from "./validate.middleware.js";

export const libroQueryValidateMiddleware = velidateRequest(listarLibrosQuerySchema, "query");
export const crearLibroValidateMiddleware = velidateRequest(crearLibroBodySchema, "body");
export const actualizarLibroValidateMiddleware = velidateRequest(actualizarLibroBodySchema, "body");
export const reemplazarLibroValidateMiddleware = velidateRequest(reemplazarLibroBodySchema, "body");