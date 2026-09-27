import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.IA_API_KEY;

if (!apiKey) {
    throw new Error("Falta la variable IA_API_KEY");
}

const genAI = new GoogleGenerativeAI(apiKey);

const iaModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",

    systemInstruction: {
        role: "system",
        parts: [
            {
                text: "Eres un editor de estilo experto. Tu única función es embellecer el texto que recibas. Devuelve solo el texto corregido, sin introducciones ni despedidas."
            }
        ]
    }
});

export default iaModel;