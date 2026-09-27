import { crearCategoriaBodySchema, actualizarCategoriaBodySchema } from "../schemas/categoria-body.schema.js";
import { velidateRequest } from "./validate.middleware.js";

export const crearCategoriaValidateMiddleware = velidateRequest(crearCategoriaBodySchema, "body");
export const actualizarCategoriaValidateMiddleware = velidateRequest(actualizarCategoriaBodySchema, "body");