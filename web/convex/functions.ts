import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const saveScan = mutation({
  args: {
    mealName: v.string(), totalCalories: v.number(),
    protein: v.number(), carbs: v.number(), fat: v.number(), fiber: v.number(),
    items: v.array(v.object({ name: v.string(), calories: v.number(), protein: v.number(), carbs: v.number(), fat: v.number(), portion: v.string() })),
    healthScore: v.number(), tip: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("mealScans", { ...args, createdAt: Date.now() });
  },
});

export const getRecentScans = query({
  args: {},
  handler: async (ctx) => await ctx.db.query("mealScans").order("desc").take(30),
});

export const getStatus = query({ args: {}, handler: async () => ({ status: "Online", timestamp: Date.now() }) });
