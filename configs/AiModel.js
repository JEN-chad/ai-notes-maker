import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
// const apikey = 'AIzaSyAa5hCmcm2VHCLaCniq1hv2UlolN_lZ0Y0'
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const generationConfig = { temperature: 1, topP: 0.95, topK: 40, maxOutputTokens: 8192 };


  export const chatSession = model.startChat({ generationConfig, history: [] });
  // const result = await chatSession.sendMessage("Hello, Gemini 2.5!");
  // console.log(result.response.text());



