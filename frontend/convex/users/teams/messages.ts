import { v } from 'convex/values';
import { paginationOptsValidator } from 'convex/server';

import { query, mutation } from '../../functions';
import { viewerHasPermission, viewerWithPermissionX } from '../../permissions';

export const list = query({
  args: {
    teamId: v.id('teams'),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { teamId, paginationOpts }) => {
    if (ctx.viewer === null || !(await viewerHasPermission(ctx, teamId, 'Contribute'))) {
      return {
        page: [],
        isDone: true,
        continueCursor: '',
      };
    }
    return ctx
      .table('teams')
      .getX(teamId)
      .edge('messages')
      .order('desc')
      .paginate(paginationOpts)
      .map(async (message) => {
        const member = await message.edge('member');
        const user = await member.edge('user');
        return {
          _id: message._id,
          _creationTime: message._creationTime,
          text: message.text,
          author: user.firstName ?? user.fullName,
          authorPictureUrl: user.pictureUrl,
          isAuthorDeleted: member.deletionTime !== undefined,
        };
      });
  },
});

export const create = mutation({
  args: {
    teamId: v.id('teams'),
    text: v.string(),
  },
  handler: async (ctx, { teamId, text }) => {
    const member = await viewerWithPermissionX(ctx, teamId, 'Contribute');
    if (text.trim().length === 0) {
      throw new Error('Message must not be empty');
    }
    await ctx.table('messages').insert({
      text,
      teamId,
      memberId: member._id,
    });
  },
});
