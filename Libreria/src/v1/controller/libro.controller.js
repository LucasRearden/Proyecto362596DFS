import {
    createLibroService,
    deleteLibroService,
    getLibroByIdService,
    getLibrosService,
    getLibrosServicePaginated,
    replaceLibroService,
    updateLibroService
} from "../services/libro.services.js";
import { constructorError } from "../utils/contructor.error.js";

// Catálogo visible para cualquier usuario autenticado, con filtros y paginación opcional.
export const getLibrosController = async (req, res, next) => {
    try {
        const { pagina, limite, categoria, autor, titulo } = res.locals.validatedQuery;

        if (pagina === undefined && limite === undefined) {
            const libros = await getLibrosService({ categoria, autor, titulo });
            return res.status(200).json(libros);
        }

        const resultado = await getLibrosServicePaginated({
            pagina: pagina ?? 1,
            limite: limite ?? 20,
            categoria,
            autor,
            titulo
        });
        return res.status(200).json(resultado);
    } catch (error) {
        return next(error);
    }
};

// El middleware de la ruta ya comprobó que idLibro tenga formato ObjectId.
export const getLibroByIdController = async (req, res, next) => {
    try {
        const libro = await getLibroByIdService(req.params.idLibro);
        if (!libro) return next(constructorError("Libro no encontrado", 404));
        return res.status(200).json(libro);
    } catch (error) {
        return next(error);
    }
};

// createdBy sale del token; el servicio valida duplicado y límite de plan.
export const createLibroController = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) return next(constructorError("Usuario no autenticado", 401));
        const libro = await createLibroService(userId, req.body, req.user);
        return res.status(201).json({ libro });
    } catch (error) {
        return next(error);
    }
};

// req.libro ya viene cacheado por el middleware esDueñoOAdmin.
export const deleteLibroController = async (req, res, next) => {
    try {
        await deleteLibroService(req.params.idLibro);
        return res.status(204).send();
    } catch (error) {
        return next(error);
    }
};

// PATCH modifica únicamente los campos enviados por el cliente.
export const updateLibroController = async (req, res, next) => {
    try {
        const libro = await updateLibroService(req.params.idLibro, req.body);
        if (!libro) return next(constructorError("Libro no encontrado", 404));
        return res.status(200).json(libro);
    } catch (error) {
        return next(error);
    }
};

// PUT reemplaza los campos del libro; el servicio conserva createdBy.
export const replaceLibroController = async (req, res, next) => {
    try {
        const libro = await replaceLibroService(req.params.idLibro, req.body);
        if (!libro) return next(constructorError("Libro no encontrado", 404));
        return res.status(200).json(libro);
    } catch (error) {
        return next(error);
    }
};