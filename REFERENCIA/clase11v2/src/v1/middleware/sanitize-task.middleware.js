import sanitizeHtml from "sanitize-html";

/**
 * Elimina etiquetas HTML del título de una tarea.
 */
export const sanitizeTaskMiddleware = (
    req,
    res,
    next
) => {
    if (typeof req.body.title === "string") {
        /*
         * allowedTags vacío significa que no permitimos
         * ninguna etiqueta HTML.
         *
         * allowedAttributes vacío significa que tampoco
         * permitimos atributos como onclick u onerror.
         */
        req.body.title = sanitizeHtml(
            req.body.title,
            {
                allowedTags: [],
                allowedAttributes: {}
            }
        ).trim();
    }
    next();
};