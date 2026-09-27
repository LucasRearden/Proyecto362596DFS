// Importamos el modelo de Gemini previamente configurado.
// El archivo ia.config.js debe exportar iaModel como export default.
import iaModel from "../config/ia.config.js";

/**
 * Función auxiliar para esperar una cantidad determinada de tiempo.
 *
 * Se utiliza antes de reintentar una petición que falló.
 *
 * @param {number} milliseconds Tiempo de espera en milisegundos.
 * @returns {Promise<void>}
 */
const wait = (milliseconds) =>
    new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });

/**
 * Embellece un texto utilizando inteligencia artificial.
 *
 * Si Gemini falla temporalmente, la función vuelve a intentarlo.
 * Si se terminan los intentos, devuelve el texto original para evitar
 * que falle toda la petición HTTP.
 *
 * @param {string} text Texto que se quiere transformar.
 * @param {string} tone Tono que deberá aplicar la IA.
 * @param {number} maximumAttempts Cantidad máxima de intentos.
 *
 * @returns {Promise<string>} Texto transformado o texto original.
 */
export const embellishText = async (
    text,
    tone = "elegante",
    maximumAttempts = 2
) => {
    // Recorremos los intentos desde 1 hasta maximumAttempts.
    for (
        let attempt = 1;
        attempt <= maximumAttempts;
        attempt++
    ) {
        try {
            /*
             * Construimos la instrucción que recibirá Gemini.
             *
             * Usamos el texto y el tono enviados a la función.
             * trim() elimina los espacios y saltos de línea sobrantes
             * del principio y del final.
             */
            const prompt = `
Transforma el siguiente texto con un tono ${tone}.
Devuelve únicamente el texto transformado.

Texto:
${text}
            `.trim();

            // Enviamos el prompt al modelo de Gemini.
            const result = await iaModel.generateContent(prompt);

            /*
             * Obtenemos solamente el texto de la respuesta.
             *
             * trim() elimina espacios y saltos de línea innecesarios.
             */
            const transformedText = result.response
                .text()
                .trim();

            /*
             * Si Gemini devuelve contenido, retornamos el texto transformado.
             *
             * Si por algún motivo devuelve una cadena vacía, retornamos el
             * texto original para que la aplicación siempre tenga contenido.
             */
            return transformedText || text;
        } catch (error) {
            // Registramos el intento que falló para poder revisarlo
            // posteriormente en los logs de Vercel.
            console.error(
                `Error de IA. Intento ${attempt}/${maximumAttempts}:`,
                error.message
            );

            /*
             * Determinamos si el error puede ser temporal:
             *
             * 429: se superó momentáneamente la cuota o límite de solicitudes.
             * 500: ocurrió un error interno en el servidor de Gemini.
             * 503: el servicio de Gemini no está disponible temporalmente.
             */
            const canRetry =
                error.message?.includes("429") ||
                error.message?.includes("500") ||
                error.message?.includes("503");

            /*
             * Reintentamos únicamente cuando:
             *
             * 1. El error puede ser temporal.
             * 2. Todavía no alcanzamos el máximo de intentos.
             */
            if (
                canRetry &&
                attempt < maximumAttempts
            ) {
                /*
                 * Espera progresiva:
                 *
                 * Primer intento fallido: espera 1 segundo.
                 * Segundo intento fallido: espera 2 segundos.
                 * Tercer intento fallido: espera 3 segundos.
                 *
                 * En este caso maximumAttempts vale 2 de forma predeterminada,
                 * por lo que solamente habrá una espera y un reintento.
                 */
                const delay = attempt * 1000;

                console.log(
                    `Reintentando petición a Gemini en ${delay} ms...`
                );

                await wait(delay);

                // Saltamos al siguiente ciclo del for para volver a intentarlo.
                continue;
            }

            /*
             * Si el error no es temporal o ya agotamos los intentos,
             * devolvemos el texto original.
             *
             * Esto evita que una caída de Gemini provoque un error 500
             * en nuestra API.
             */
            console.warn(
                "Gemini no está disponible. Se devuelve el texto original."
            );

            return text;
        }
    }

    /*
     * Retorno de seguridad.
     *
     * Normalmente nunca se llega a esta línea porque la función retorna
     * dentro del try o del catch. Se conserva para garantizar que siempre
     * se devuelva un string.
     */
    return text;
};