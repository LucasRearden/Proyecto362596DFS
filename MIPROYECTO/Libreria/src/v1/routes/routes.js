import { Router } from "express"
import usuarioRoutes from "./usuario.routes.js"
import libroRoutes from "./libro.routes.js"
import categoriaRoutes from "./categoria.routes.js"
import authRoutes from "./auth.routes.js";

const v1Routes = Router()

v1Routes.use("/auth", authRoutes);
v1Routes.use("/usuarios", usuarioRoutes);
v1Routes.use("/libros", libroRoutes);
v1Routes.use("/categorias", categoriaRoutes);

export default v1Routes