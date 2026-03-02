import { action } from "./_generated/server";
import { v } from "convex/values";

export const analyzeMeal = action({
    args: { imageBase64: v.string() },
    handler: async (_ctx, args) => {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) throw new Error("OPENAI_API_KEY not configured");

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: `You are CalorieCam, an expert nutritionist AI. Analyze food photos and provide accurate macro breakdowns. Be specific about portion sizes. Output valid JSON only.` },
                    {
                        role: "user", content: [
                            {
                                type: "text", text: `Analyze this meal photo. Return JSON:
{
  "mealName": "<descriptive meal name>",
  "totalCalories": <number>,
  "protein": <grams>, "carbs": <grams>, "fat": <grams>, "fiber": <grams>,
  "items": [{ "name": "<item>", "calories": <n>, "protein": <n>, "carbs": <n>, "fat": <n>, "portion": "<e.g. 1 cup>" }],
  "healthScore": <1-10>,
  "tip": "<one actionable nutrition tip>"
}` },
                            { type: "image_url", image_url: { url: args.imageBase64 } },
                        ]
                    },
                ],
                temperature: 0.3,
                max_tokens: 1500,
                response_format: { type: "json_object" },
            }),
        });

        if (!response.ok) throw new Error(`OpenAI error: ${await response.text()}`);
        const data = (await response.json()) as any;
        const content = data.choices?.[0]?.message?.content ?? "";
        const parsed = JSON.parse(content);
        return {
            mealName: parsed.mealName || "Unknown Meal",
            totalCalories: parsed.totalCalories || 0,
            protein: parsed.protein || 0, carbs: parsed.carbs || 0,
            fat: parsed.fat || 0, fiber: parsed.fiber || 0,
            items: parsed.items || [],
            healthScore: parsed.healthScore || 5,
            tip: parsed.tip || "Eat more vegetables!",
        };
    },
});
