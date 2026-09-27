import { loginBodySchema } from "../schemas/login-body.schema.js";
import { registerBodySchema } from "../schemas/register-body.schema.js";
import { velidateRequest } from "./validate.middleware.js";
import { verifyAccessToken } from "../utils/token.util.js";

export const middlewareValidateLoginBody = velidateRequest(loginBodySchema, "body");
export const middlewareValidateRegisterBody = velidateRequest(registerBodySchema, "body");

export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: "No se se recibio token" });
        }
        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Token no proporcionado" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = verifyAccessToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
};