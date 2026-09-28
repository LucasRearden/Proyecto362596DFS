import Categoria from "../models/categoria.model.js";
import Libro from "../models/libro.model.js";
import { constructorError } from "../utils/contructor.error.js";

export const getCategoriasService = async () => {
    return await Categoria.find();
};

export const createCategoriaService = async (data) => {
    try {
        return await Categoria.create(data);
    } catch (error) {
        if (error.code === 11000) {
            throw constructorError("Ya existe una categoría con ese nombre", 409);
        }
        throw error;
    }
};

export const updateCategoriaService = async (id, data) => {
    try {
        const categoria = await Categoria.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true
        });
        return categoria;
    } catch (error) {
        if (error.code === 11000) {
            throw constructorError("Ya existe una categoría con ese nombre", 409);
        }
        throw error;
    }
};

// No se puede borrar una categoría que tenga libros asociados.
export const deleteCategoriaService = async (id) => {
    const categoria = await Categoria.findById(id);
    if (!categoria) return null;

    const tieneLibrosAsociados = await Libro.exists({ categoria: id });
    if (tieneLibrosAsociados) {
        throw constructorError(
            "No se puede borrar la categoría porque tiene libros asociados",
            409
        );
    }

    return await Categoria.findByIdAndDelete(id);
};