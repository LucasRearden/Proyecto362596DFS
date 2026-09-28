import { mensajesJoi } from "../config/joi-message.js";

export const velidateRequest = (schema, reqKey) => {
    return (req, res, next) => {
        const objetoAValidar = req[reqKey];
        const { error, value } = schema.validate(objetoAValidar, {
            abortEarly: false,
            messages: mensajesJoi,
            errors: { //saca las doble comillas de los label
                wrap: {
                    label: false
                }
            }
        });

        if (error) {
            return next(error);
        }
        if (reqKey === "query") {
            // Express 5 no permite asignar req.query. El controlador lee este valor convertido.
            res.locals.validatedQuery = value;
        } else {
            req[reqKey] = value;
        }
        return next();
    }
}



