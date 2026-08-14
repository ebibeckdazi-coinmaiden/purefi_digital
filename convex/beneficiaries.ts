import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getBeneficiaries = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const userId = identity.subject;

    return await ctx.db
      .query("beneficiaries")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const createBeneficiary = mutation({
  args: {
    name: v.string(),
    iban: v.string(),
    bankName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const userId = identity.subject;

    const existing = await ctx.db
      .query("beneficiaries")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("iban"), args.iban))
      .first();

    if (existing) return existing._id;
    const colors = [
      "bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/20",
      "bg-soft-gold/10 text-soft-gold border border-soft-gold/20",
      "bg-white/10 text-white border border-white/20",
      "bg-deep-gold/10 text-deep-gold border border-deep-gold/20",
      "bg-charcoal border border-white/10 text-gray-300",
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const id = await ctx.db.insert("beneficiaries", {
      userId,
      name: args.name,
      iban: args.iban,
      bankName: args.bankName,
      color,
      createdAt: Date.now(),
    });

    return id;
  },
});
