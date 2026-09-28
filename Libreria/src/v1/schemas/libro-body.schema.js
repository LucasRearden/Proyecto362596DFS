import Joi from "joi";

// createdBy siempre sale del token; el cliente no puede cambiar el propietario.
const camposLibro = {
    titulo: Joi.string().trim().min(1).required(),
    autor: Joi.string().trim().min(1).required(),
    categoria: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    sinopsis: Joi.string().trim().allow("").optional(),
    portadaUrl: Joi.string().uri().allow("").optional()
};

export const crearLibroBodySchema = Joi.object(camposLibro);
export const reemplazarLibroBodySchema = Joi.object(camposLibro);
export const actualizarLibroBodySchema = Joi.object({
    titulo: camposLibro.titulo.optional(),
    autor: camposLibro.autor.optional(),
    categoria: camposLibro.categoria.optional(),
    sinopsis: camposLibro.sinopsis,
    portadaUrl: camposLibro.portadaUrl
}).min(1);