
import { Router } from "express"
import { transformTextController } from "../controller/transform-text.controller.js";
import { obtenerUsuariosExternosController } from "../controller/api-externas.controller.js";

const publicRoutes = Router();



publicRoutes.post("/embellecer", transformTextController);

publicRoutes.get("/user-externos", obtenerUsuariosExternosController);




export default publicRoutes



