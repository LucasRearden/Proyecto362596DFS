import express from "express";
import "dotenv/config";
import { connectMongo } from "./src/v1/config/mongo.config.js";
import apiRoutes from "./src/v1/routes/index.js";
import { middlewareErrores } from "./src/v1/middleware/error.middleware.js";
import { apiRateLimit } from "./src/v1/middleware/rate-limit.middleware.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({ message: "Servidor disponible" });
});

app.use(
    "/api",

    // Límite general de peticiones por IP.
    apiRateLimit,

    // Conectamos MongoDB antes de procesar cualquier ruta.
    async (req, res, next) => {
        try {
            await connectMongo();
            next();
        } catch (error) {
            next(error);
        }
    },

    // Finalmente procesamos las rutas versionadas.
    apiRoutes
);

app.use(middlewareErrores);

app.listen(process.env.PORT, () => {
    console.log(`Servidor escuchando en el puerto ${process.env.PORT}`);
});

export default app;