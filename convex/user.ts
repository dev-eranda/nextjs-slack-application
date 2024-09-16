import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const current = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    // User is not authenticated
    if (userId === null) {
      return null;
    }

    // Fetch user data from the database
    return await ctx.db.get(userId);
  },
});
