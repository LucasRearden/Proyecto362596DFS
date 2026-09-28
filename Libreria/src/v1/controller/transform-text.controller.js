import * as textService from '../services/embellish-text.service.js';
import { constructorError } from '../utils/contructor.error.js';

export const transformTextController = async (req, res, next) => {
    try {
        const { texto, tono, maximumAttempts } = req.body;
        if (!texto) return next(constructorError("El campo 'texto' es obligatorio.", 400));
        const resultado = await textService.embellishText(texto, tono, maximumAttempts);
        return res.json({ success: true, data: resultado });
    } catch (error) { return next(error); }
};
