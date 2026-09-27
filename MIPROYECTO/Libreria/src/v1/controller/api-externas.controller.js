import { obtenerUsuariosExternosServices } from "../services/api-externa.service.js";

export const obtenerUsuariosExternosController = async (req, res) => {
    const usuarios = await obtenerUsuariosExternosServices();
    return res.status(200).json(usuarios);
}
