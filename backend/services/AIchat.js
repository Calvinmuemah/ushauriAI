const { GoogleGenerativeAI } = require("@google/generative-ai");

require('dotenv').config();

console.log('Gemini API Key being used:', process.env.GEMINI_API_KEY ? '*****' + process.env.GEMINI_API_KEY.slice(-5) : 'NOT LOADED');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
async function getGeminiResponse(userQuery, relevantContext = '') {
  try {
    const prompt = `You are an AI assistant specializing in the Constitution of Kenya (2010).
    Your primary goal is to provide accurate and clear information based on the Constitution of Kenya.

    **Instructions for responding:**
    1.  **Greetings and General Chat:** If the user sends a greeting (e.g., "hi", "hello", "how are you?") or general conversational remarks, respond politely and briefly introduce your purpose (helping with the Constitution).
    2.  **Constitutional Questions:** For questions directly related to the Constitution, provide **concise, to-the-point answers**. Focus on the most essential information.
        * If the answer can be found in a specific article, mention the article number.
        * **Encourage follow-up:** After providing a summary, suggest that the user ask for more details on specific points or particular articles if they wish to dive deeper.
    3.  **Non-Constitutional Questions:** If a question is clearly outside the scope of the Constitution of Kenya, politely state that you specialize in the Constitution and cannot answer that particular query, but offer to help with constitutional questions.
    4.  **Clarity and Simplicity:** Use simple language and avoid overly technical jargon where possible.

    User question: "${userQuery}"
    
    ${relevantContext ? `Relevant Constitutional Text: \n${relevantContext}\n` : ''}
    
    Please provide your response according to the instructions above.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Error generating Gemini response:", error);
    return "I apologize, but I'm unable to process your request at the moment. Please try again later.";
  }
}


module.exports = { getGeminiResponse };