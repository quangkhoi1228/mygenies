import { v } from 'convex/values';
import { query, mutation } from './_generated/server';

export const list = query({
  args: {},
  handler: async (ctx) => {
    const chatMessages = await ctx.db.query('chatMessages').collect();
    return Promise.all(
      chatMessages.map(async (message) => ({
        ...message,
        // Retrieve URL for storage types (image, audio, file)
        ...(message.format === 'image' || message.format === 'audio' || message.format === 'file'
          ? { url: await ctx.storage.getUrl(message.body) }
          : {}),
      }))
    );
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => ctx.storage.generateUploadUrl(),
});

export const getAudioUrl = query({
  args: { storageId: v.id('_storage') },
  handler: async (ctx, args) => ctx.storage.getUrl(args.storageId),
});
export const sendMedia = mutation({
  args: {
    storageId: v.id('_storage'),
    name: v.string(),
    format: v.union(v.literal('image'), v.literal('audio'), v.literal('file')),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('chatMessages', {
      body: args.storageId,
      name: args.name,
      format: args.format,
    });

    const url = await ctx.storage.getUrl(args.storageId);
    return { storageId: args.storageId, url, name: args.name };
  },
});

export const sendMessage = mutation({
  args: { body: v.string(), name: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert('chatMessages', {
      body: args.body,
      name: args.name,
      format: 'text',
    });
  },
});
