import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";

import { connectRedis } from "../config/redis.config.js";

/*
 * Almacén compartido para Vercel.
 *
 * Cada vez que express-rate-limit necesita ejecutar un comando,
 * obtiene o reutiliza la conexión de Redis.
 */
const redisStore = (prefix) =>
    new RedisStore({
        prefix,

        sendCommand: async (...args) => {
            const redis = await connectRedis();

            return redis.sendCommand(args);
        }
    });

/*
 * Límite general para toda la API.
 *
 * Cada IP puede hacer hasta 100 peticiones cada 15 minutos.
 */
export const apiRateLimit = rateLimit({
    // Ventana de tiempo: 15 minutos.
    windowMs: 15 * 60 * 1000,

    // Cantidad máxima de peticiones dentro de la ventana.
    limit: 100,

    // Los contadores se guardan en Redis.
    store: redisStore("rate-limit:api:"),

    // Envía información del límite en los encabezados HTTP.
    standardHeaders: true,

    // Desactiva los encabezados antiguos X-RateLimit-*.
    legacyHeaders: false,

    // Respuesta cuando se supera el límite.
    handler: (req, res) => {
        return res.status(429).json({
            message:
                "Demasiadas peticiones. Intente nuevamente más tarde."
        });
    }
});

/*
 * Límite más estricto para el inicio de sesión.
 *
 * Cada IP puede intentar iniciar sesión cinco veces
 * durante un período de 15 minutos.
 */
export const loginRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,

    limit: 2,

    store: redisStore("rate-limit:login:"),

    standardHeaders: true,
    legacyHeaders: false,

    /*
     * Las peticiones exitosas no consumen intentos.
     *
     * Solamente interesa limitar intentos de login fallidos.
     */
    skipSuccessfulRequests: false,

    handler: (req, res) => {
        console.log('ENTRO EN HANDLER')
        return res.status(429).json({
            message:
                "Demasiados intentos de inicio de sesión. Intente nuevamente en 15 minutos."
        });
    }
});