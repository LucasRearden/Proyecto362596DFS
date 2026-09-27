import Joi from 'joi';
import { Roles } from '../constants/role.constants.js';

//esquema de validacion para body registro
export const registerBodySchema = Joi.object({
    name: Joi.string().min(3).max(30).label("nombre").required(),
    username: Joi.string().alphanum().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(30).required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
    role: Joi.string().valid(...Roles).required() //no es muy realista pasarle el rol porque puede elegir admin pero para probar
})

//validar el rol de la persona en el body sea valido por ejemplo
export const roleSchema = Joi.object({
    role: Joi.string().valid(...Roles).required()
})