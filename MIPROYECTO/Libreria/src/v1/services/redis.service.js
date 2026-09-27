import { connectRedis } from "../config/redis.config.js";

export const guardarDato = async (key, value, segundos = 3600) => {
    const redis = await connectRedis();

    await redis.set(key, JSON.stringify(value), {
        EX: segundos
    });
};

export const obtenerDato = async (key) => {
    const redis = await connectRedis();
    const value = await redis.get(key);
    if (!value) {
        return null;
    }
    return JSON.parse(value);
};

export const eliminarDato = async (key) => {
    const redis = await connectRedis();
    return redis.del(key);
};