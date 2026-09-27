import { paramsIdTareaSchema } from "../schemas/common.schema.js";
import { velidateRequest } from "./validate.middleware.js";



export const validateParamsIdTareaMiddleware = velidateRequest(paramsIdTareaSchema, "params");

