
import { GoogleGenerativeAI } from "@google/generative-ai";

async function listModels() {
    const apiKey = "AIzaSyCk67hpRwsWQOTnYUOJUcLw6ludzk-zdQg";
    const genAI = new GoogleGenerativeAI(apiKey);
    try {
        const models = await genAI.listModels();
        console.log("Available Gemini Models:");
        models.models.forEach((m) => {
            console.log(`- ${m.name} (Supported: ${m.supportedGenerationMethods.join(", ")})`);
        });
    } catch (err) {
        console.error("Error listing models:", err);
        if (err.response) {
            console.error("Response data:", err.response);
        }
    }
}

listModels();
