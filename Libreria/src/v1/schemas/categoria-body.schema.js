import Joi from "joi";

export const crearCategoriaBodySchema = Joi.object({
    nombre: Joi.string().trim().required(),
    descripcion: Joi.string().allow("").optional()
});

export const actualizarCategoriaBodySchema = Joi.object({
    nombre: Joi.string().trim().optional(),
    descripcion: Joi.string().allow("").optional()
});