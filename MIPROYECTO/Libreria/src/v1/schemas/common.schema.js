import Joi from "joi";


export const paramsIdTareaSchema = Joi.object({
    idTarea: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
})



