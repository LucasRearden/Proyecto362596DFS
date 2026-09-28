import { paramsIdLibroSchema, paramsIdCategoriaSchema } from "../schemas/common.schema.js";
import { velidateRequest } from "./validate.middleware.js";

export const validateParamsIdLibroMiddleware = velidateRequest(paramsIdLibroSchema, "params");
export const validateParamsIdCategoriaMiddleware = velidateRequest(paramsIdCategoriaSchema, "params");