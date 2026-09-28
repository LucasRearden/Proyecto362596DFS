import Libro from "../models/libro.model.js";
import { constructorError } from "../utils/contructor.error.js";
import { generarKeyRedisLibros } from "../utils/generar-key-redis.js";
import { guardarDato, obtenerDato, incrementarContador } from "./redis.service.js";
import { connectRedis } from "../config/redis.config.js";

const VERSION_KEY = "libros:version";

const obtenerVersionCatalogo = async () => {
    const redis = await connectRedis();
    const version = await redis.get(VERSION_KEY);
    return version ?? "0";
};

const invalidarCatalogo = async () => {
    await incrementarContador(VERSION_KEY);
};

const construirFiltro = ({ categoria, autor, titulo }) => {
    const filtro = {};
    if (categoria) filtro.categoria = categoria;
    if (autor) filtro.autor = { $regex: autor, $options: "i" };
    if (titulo) filtro.titulo = { $regex: titulo, $options: "i" };
    return filtro;
};

export const getLibrosService = async ({ categoria, autor, titulo } = {}) => {
    const version = await obtenerVersionCatalogo();
    const key = generarKeyRedisLibros(version, { categoria, autor, titulo });

    const enCache = await obtenerDato(key);
    if (enCache) return enCache;

    const filtro = construirFiltro({ categoria, autor, titulo });
    const libros = await Libro.find(filtro)
        .populate("categoria", "nombre")
        .populate("createdBy", "username");

    await guardarDato(key, libros);
    return libros;
};

export const getLibrosServicePaginated = async ({ pagina, limite, categoria, autor, titulo }) => {
    const version = await obtenerVersionCatalogo();
    const key = generarKeyRedisLibros(version, { pagina, limite, categoria, autor, titulo });

    const enCache = await obtenerDato(key);
    if (enCache) return enCache;

    const filtro = construirFiltro({ categoria, autor, titulo });

    const [libros, total] = await Promise.all([
        Libro.find(filtro)
            .sort({ _id: -1 })
            .skip((pagina - 1) * limite)
            .limit(limite)
            .populate("categoria", "nombre")
            .populate("createdBy", "username"),
        Libro.countDocuments(filtro)
    ]);

    const resultado = {
        libros,
        pagina,
        limite,
        total,
        totalPaginas: Math.ceil(total / limite)
    };

    await guardarDato(key, resultado);
    return resultado;
};

export const getLibroByIdService = async (id) => {
    return await Libro.findById(id)
        .populate("categoria", "nombre")
        .populate("createdBy", "username");
};

export const createLibroService = async (userId, data) => {
    try {
        const libro = await Libro.create({ ...data, createdBy: userId });
        await invalidarCatalogo();
        return libro;
    } catch (error) {
        if (error.code === 11000) {
            throw constructorError("Ya existe un libro con ese título y autor", 409);
        }
        throw error;
    }
};

export const updateLibroService = async (id, data) => {
    try {
        const libro = await Libro.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        if (libro) await invalidarCatalogo();
        return libro;
    } catch (error) {
        if (error.code === 11000) {
            throw constructorError("Ya existe un libro con ese título y autor", 409);
        }
        throw error;
    }
};

export const replaceLibroService = async (id, data) => {
    try {
        const libroExistente = await Libro.findById(id);
        if (!libroExistente) return null;

        const libro = await Libro.findOneAndReplace(
            { _id: id },
            { ...data, createdBy: libroExistente.createdBy },
            { new: true, runValidators: true }
        );
        await invalidarCatalogo();
        return libro;
    } catch (error) {
        if (error.code === 11000) {
            throw constructorError("Ya existe un libro con ese título y autor", 409);
        }
        throw error;
    }
};

export const deleteLibroService = async (id) => {
    const eliminado = await Libro.findByIdAndDelete(id);
    if (eliminado) await invalidarCatalogo();
    return eliminado;
};