import "dotenv/config";
import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
    throw new Error("Falta la variable de entorno REDIS_URL");
}

const redisClient = createClient({
    url: redisUrl
});

redisClient.on("error", (error) => {
    console.error("Redis error:", error.message);
});

redisClient.on("ready", () => {
    console.log("Redis listo");
});

redisClient.on("reconnecting", () => {
    console.log("Reconectando a Redis...");
});

let connectionPromise = null;

export const connectRedis = async () => {
    if (redisClient.isReady) {
        return redisClient;
    }

    if (connectionPromise) {
        return connectionPromise;
    }

    // Redis ya abrió la conexión y está reconectando.
    if (redisClient.isOpen) {
        return redisClient;
    }

    connectionPromise = redisClient
        .connect()
        .then(() => {
            console.log("Redis conectado");
            return redisClient;
        });

    try {
        return await connectionPromise;
    } catch (error) {
        console.error(
            "No se pudo conectar a Redis:",
            error.message
        );

        throw error;
    } finally {
        connectionPromise = null;
    }
};

export default redisClient;