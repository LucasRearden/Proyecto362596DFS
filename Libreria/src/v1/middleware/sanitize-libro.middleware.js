import sanitizeHtml from "sanitize-html";

const sanitizarCampo = (valor) =>
    sanitizeHtml(valor, { allowedTags: [], allowedAttributes: {} }).trim();

export const sanitizeLibroMiddleware = (req, res, next) => {
    if (typeof req.body.titulo === "string") {
        req.body.titulo = sanitizarCampo(req.body.titulo);
    }
    if (typeof req.body.autor === "string") {
        req.body.autor = sanitizarCampo(req.body.autor);
    }
    if (typeof req.body.sinopsis === "string") {
        req.body.sinopsis = sanitizarCampo(req.body.sinopsis);
    }
    next();
};