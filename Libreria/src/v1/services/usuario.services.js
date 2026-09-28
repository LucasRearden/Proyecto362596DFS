import Usuario from "../models/usuario.model.js";

// Solo admin: listado de usuarios.
export const getUsuariosService = async () => {
    return await Usuario.find();
};

export const getUsuarioByEmailOrUsernameService = async (data) => {
    return await Usuario.findOne({
        $or: [{ email: data }, { username: data }]
    }).select("+password");
};

export const getUsuarioByEmailService = async (email) => {
    return await Usuario.findOne({ email });
};

export const getUsuarioByUsernameService = async (username) => {
    return await Usuario.findOne({ username });
};

export const cambiarPlanService = async (userId) => {
    const usuario = await Usuario.findById(userId);
    if (usuario.plan === "premium") {
        return usuario; // ya está en premium, no hace nada
    }
    usuario.plan = "premium";
    await usuario.save();
    return usuario;
};