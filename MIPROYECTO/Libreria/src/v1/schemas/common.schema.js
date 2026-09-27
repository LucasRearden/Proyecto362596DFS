import Joi from "joi";

export const paramsIdLibroSchema = Joi.object({
    idLibro: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
});

export const paramsIdCategoriaSchema = Joi.object({
    idCategoria: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
});