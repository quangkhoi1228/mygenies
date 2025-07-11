import { v } from 'convex/values';
import { mutation } from './_generated/server';

export const sendImage = mutation({
  args: { storageId: v.id('_storage'), author: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert('messages', {
      body: args.storageId,
      author: args.author,
      format: 'image',
    });
  },
});
