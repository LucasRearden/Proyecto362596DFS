import Joi from "joi";

// Sin pagina ni limite, la lista se devuelve completa.
// Si viene uno de los dos, el controlador completa el otro con su valor por defecto.
export const listarLibrosQuerySchema = Joi.object({
    pagina: Joi.number().integer().min(1),
    limite: Joi.number().integer().min(1).max(100),
    categoria: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
    autor: Joi.string().trim().optional(),
    titulo: Joi.string().trim().optional()
});