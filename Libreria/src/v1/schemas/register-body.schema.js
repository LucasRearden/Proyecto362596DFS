import Joi from 'joi';

export const registerBodySchema = Joi.object({
    username: Joi.string().alphanum().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(30).required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required()
});