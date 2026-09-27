import { createUserService, generarTokenAuthService, loginService } from "../services/auth.service.js";

export const loginController = async (req, res) => {
    const reqBody = req.body
    const user = await loginService(reqBody);
    const token = generarTokenAuthService(user);
    //devolvemos user y token
    return res.status(200).json({
        user,
        token
    });
}

//ya quedaria validado el body con un middleware de registro
export const registerController = async (req, res) => {
    const data = req.body;
    const user = await createUserService(data);
    const token = generarTokenAuthService(user);
    //devolvemos user y token
    return res.status(201).json({
        user,
        token
    });
}