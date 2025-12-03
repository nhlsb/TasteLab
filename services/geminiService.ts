import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

// Helper to safely get the API key
const getApiKey = (): string | undefined => {
  return process.env.API_KEY;
};

export const getFoodRecommendation = async (
  userQuery: string,
  availableProducts: Product[]
): Promise<string> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    return "API Key 未配置。请在环境设置中添加 API_KEY 以启用 AI 推荐功能。";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Construct a context-aware prompt
    const productContext = availableProducts.map(p => 
      `- ID: ${p.id}, Name: ${p.name}, Tags: ${p.tags.join(', ')}, Description: ${p.description}, Spicy: ${p.spicyLevel}/5, Sweet: ${p.sweetLevel}/5`
    ).join('\n');

    const prompt = `
      你是一个专业的食品试吃顾问（AI Sommelier）。
      你的任务是根据用户的口味偏好，从现有的试吃列表中推荐最合适的产品。
      
      现有产品列表如下：
      ${productContext}

      用户需求： "${userQuery}"

      请遵循以下规则：
      1. 只能推荐列表中的产品。
      2. 解释推荐理由（比如口味匹配度、热门程度等）。
      3. 语气要热情、诱人，像美食博主一样。
      4. 如果用户需求很模糊，可以推荐"热门榜单"中的高分产品。
      5. 回复请控制在 150 字以内。
      6. 请用中文回复。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "抱歉，我现在无法进行推荐，请稍后再试。";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 服务暂时不可用，请稍后再试。";
  }
};