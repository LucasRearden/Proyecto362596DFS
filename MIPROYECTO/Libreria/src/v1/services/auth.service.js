import { constructorError } from "../utils/contructor.error.js";
import { generarAccessTokenByUser } from "../utils/token.util.js";
import { compararPassword, hashear } from "../utils/validar-password.js";
import Usuario from "../models/usuario.model.js";
import {
    getUsuarioByEmailOrUsernameService,
    getUsuarioByEmailService,
    getUsuarioByUsernameService
} from "./usuario.service.js";
import { Role } from "../constants/role.constants.js";
import { Plan } from "../constants/plan.constants.js";

export const createUserService = async (data) => {
    const { username, email, password } = data;

    const usuarioPorEmail = await getUsuarioByEmailService(email);
    if (usuarioPorEmail) {
        throw constructorError("El email ya está en uso", 409);
    }
    const usuarioPorUsername = await getUsuarioByUsernameService(username);
    if (usuarioPorUsername) {
        throw constructorError("El username ya está en uso", 409);
    }

    const hashPassword = await hashear(password);

    const usuario = await Usuario.create({
        username,
        email,
        password: hashPassword,
        role: Role.user,
        plan: Plan.plus
    });

    return usuario;
};

export const generarTokenAuthService = (usuario) => {
    return generarAccessTokenByUser(usuario);
};

export const loginService = async (reqBody) => {
    const errorCredencialInvalida = constructorError("Credenciales inválidas", 401);

    if (!reqBody) throw errorCredencialInvalida;

    const usuario = await getUsuarioByEmailOrUsernameService(reqBody.identificador);
    if (!usuario) throw errorCredencialInvalida;

    const valid = await compararPassword(reqBody.password, usuario.password);
    if (!valid) throw errorCredencialInvalida;

    return usuario;
};