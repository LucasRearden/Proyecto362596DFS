import { paramsIdLibroSchema } from "../schemas/common.schema.js";
import { velidateRequest } from "./validate.middleware.js";

export const validateParamsIdLibroMiddleware = velidateRequest(paramsIdLibroSchema, "params");