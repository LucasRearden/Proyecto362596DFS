import { buscarEnGoogleBooksService } from "../services/google-books.services.js";
import { constructorError } from "../utils/contructor.error.js";

export const buscarEnGoogleBooksController = async (req, res, next) => {
    try {
        const { q } = req.query;
        if (!q) return next(constructorError("El parámetro 'q' es obligatorio.", 400));
        const resultados = await buscarEnGoogleBooksService(q);
        return res.status(200).json(resultados);
    } catch (error) {
        return next(error);
    }
};