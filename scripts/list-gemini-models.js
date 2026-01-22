
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: ".env.local" });

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        const models = await genAI.listModels();
        console.log("Available Gemini Models:");
        models.models.forEach((m) => {
            console.log(`- ${m.name} (Supported: ${m.supportedGenerationMethods.join(", ")})`);
        });
    } catch (err) {
        console.error("Error listing models:", err);
    }
}

listModels();
