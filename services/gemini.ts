import { GoogleGenAI } from "@google/genai";

export const generateDescription = async (itemName: string, categoryLabel: string): Promise<string> => {
  try {
    if (!process.env.API_KEY) {
      return "يرجى إضافة مفتاح API لتفعيل الذكاء الاصطناعي.";
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      اكتب وصفاً قصيراً وشهياً (جملة أو جملتين كحد أقصى) لقائمة طعام في مطعم لهذا الصنف:
      الاسم: ${itemName}
      التصنيف: ${categoryLabel}
      
      اجعل الوصف جذاباً باللغة العربية ويجعل العميل يرغب في طلبه فوراً. لا تضع علامات تنصيص.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "وصف لذيذ ومميز محضر بعناية.";
  }
};