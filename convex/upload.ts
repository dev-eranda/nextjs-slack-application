import { mutation } from "./_generated/server";

export const generalUploadUrl = mutation(async (ctx) => {
   return await ctx.storage.generateUploadUrl();
});
