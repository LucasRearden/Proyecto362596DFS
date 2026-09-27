import Joi from "joi";

// userId siempre sale del token; el cliente no puede cambiar el propietario.
const camposTarea = {
    title: Joi.string().trim().min(1).required(),
    completed: Joi.boolean().required(),
    imageUrl: Joi.string().uri().allow("").optional()
};

// POST y PUT requieren todos los campos obligatorios del modelo.
export const crearTareaBodySchema = Joi.object(camposTarea);
export const reemplazarTareaBodySchema = Joi.object(camposTarea);
// PATCH permite omitir campos, pero exige al menos uno.
export const actualizarTareaBodySchema = Joi.object({
    title: camposTarea.title.optional(),
    completed: camposTarea.completed.optional(),
    imageUrl: camposTarea.imageUrl
}).min(1);
