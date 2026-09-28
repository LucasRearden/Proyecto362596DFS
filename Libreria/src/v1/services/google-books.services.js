import axios from "axios";
import { constructorError } from "../utils/contructor.error.js";

const urlExternaBase = "https://www.googleapis.com/books/v1";

const googleBooksApi = axios.create({
    baseURL: urlExternaBase,
    timeout: 5000
});

export const buscarEnGoogleBooksService = async (query) => {
    try {
        const params = { q: query };
        if (process.env.GOOGLE_BOOKS_API_KEY) {
            params.key = process.env.GOOGLE_BOOKS_API_KEY;
        }

        const response = await googleBooksApi.get("/volumes", { params });

        const items = response.data.items ?? [];
        return items.slice(0, 5).map((item) => {
            const info = item.volumeInfo ?? {};
            return {
                titulo: info.title ?? null,
                autor: info.authors?.[0] ?? null,
                sinopsis: info.description ?? null,
                portadaUrl: info.imageLinks?.thumbnail ?? null,
                editorial: info.publisher ?? null,
                fechaPublicacion: info.publishedDate ?? null
            };
        });
    } catch (error) {
        console.error("Google Books no disponible:", error.message);
        throw constructorError("El servicio de búsqueda externa no está disponible en este momento", 503);
    }
};