import {
    getCategoriasService,
    createCategoriaService,
    updateCategoriaService,
    deleteCategoriaService
} from "../services/categoria.service.js";
import { constructorError } from "../utils/contructor.error.js";

export const getCategoriasController = async (req, res, next) => {
    try {
        const categorias = await getCategoriasService();
        return res.status(200).json(categorias);
    } catch (error) {
        return next(error);
    }
};

export const createCategoriaController = async (req, res, next) => {
    try {
        const categoria = await createCategoriaService(req.body);
        return res.status(201).json(categoria);
    } catch (error) {
        return next(error);
    }
};

export const updateCategoriaController = async (req, res, next) => {
    try {
        const categoria = await updateCategoriaService(req.params.idCategoria, req.body);
        if (!categoria) return next(constructorError("Categoría no encontrada", 404));
        return res.status(200).json(categoria);
    } catch (error) {
        return next(error);
    }
};

export const deleteCategoriaController = async (req, res, next) => {
    try {
        const categoria = await deleteCategoriaService(req.params.idCategoria);
        if (!categoria) return next(constructorError("Categoría no encontrada", 404));
        return res.status(204).send();
    } catch (error) {
        return next(error);
    }
};