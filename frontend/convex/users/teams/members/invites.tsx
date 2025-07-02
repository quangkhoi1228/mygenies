import { Resend } from 'resend';
import { v, ConvexError } from 'convex/values';

import { Id } from '../../../_generated/dataModel';
import { action } from '../../../_generated/server';
import { api, internal } from '../../../_generated/api';
import { INVITE_PARAM } from '../../../../src/app/constants';
import { query, mutation, internalMutation } from '../../../functions';
import { viewerHasPermission, viewerHasPermissionX } from '../../../permissions';

export const list = query({
  args: {
    teamId: v.optional(v.id('teams')),
  },
  async handler(ctx, { teamId }) {
    if (
      teamId === undefined ||
      ctx.viewer === null ||
      !(await viewerHasPermission(ctx, teamId, 'Read Members'))
    ) {
      return null;
    }

    return ctx
      .table('teams')
      .getX(teamId)
      .edge('invites')
      .map(async (invite) => ({
        _id: invite._id,
        email: invite.email,
        role: (await invite.edge('role')).name,
      }));
  },
});

export const deleteInvite = mutation({
  args: {
    inviteId: v.id('invites'),
  },
  async handler(ctx, { inviteId }) {
    const invite = await ctx.table('invites').getX(inviteId);
    await viewerHasPermissionX(ctx, invite.teamId, 'Manage Members');
    await ctx.table('invites').getX(inviteId).delete();
  },
});

// To enable sending emails, set
// - `RESEND_API_KEY`
// - `HOSTED_URL` to the URL where your site is hosted
// on your Convex dashboard:
// https://dashboard.convex.dev/deployment/settings/environment-variables
// To test emails, override the email address by setting
// `OVERRIDE_INVITE_EMAIL`.
export const send = action({
  args: {
    teamId: v.id('teams'),
    email: v.string(),
    roleId: v.id('roles'),
  },
  async handler(ctx, { teamId, email, roleId }) {
    const { inviterEmail, teamName } = await ctx.runMutation(
      internal.users.teams.members.invites.prepare,
      { teamId }
    );
    const inviteId = await ctx.runMutation(internal.users.teams.members.invites.create, {
      teamId,
      email,
      roleId,
      inviterEmail,
    });
    try {
      await sendInviteEmail({ email, inviteId, inviterEmail, teamName });
    } catch (error) {
      await ctx.runMutation(api.users.teams.members.invites.deleteInvite, {
        inviteId,
      });
      throw error;
    }
  },
});

export const prepare = internalMutation({
  args: {
    teamId: v.id('teams'),
  },
  async handler(ctx, { teamId }) {
    await viewerHasPermissionX(ctx, teamId, 'Manage Members');
    return {
      inviterEmail: ctx.viewerX().email,
      teamName: (await ctx.table('teams').getX(teamId)).name,
    };
  },
});

export const create = internalMutation({
  args: {
    teamId: v.id('teams'),
    email: v.string(),
    roleId: v.id('roles'),
    inviterEmail: v.string(),
  },
  async handler(ctx, { teamId, email, roleId, inviterEmail }) {
    return ctx.table('invites').insert({
      teamId,
      email,
      roleId,
      inviterEmail,
    });
  },
});

async function sendInviteEmail({
  email,
  inviteId,
  inviterEmail,
  teamName,
}: {
  email: string;
  inviteId: Id<'invites'>;
  inviterEmail: string;
  teamName: string;
}) {
  if (process.env.RESEND_API_KEY === undefined || process.env.HOSTED_URL === undefined) {
    console.error('Set up `RESEND_API_KEY` and `HOSTED_URL` to send invite emails');
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: 'My App <onboarding@resend.dev>',
    to: [process.env.OVERRIDE_INVITE_EMAIL ?? email],
    subject: `${inviterEmail} invited you to join them in My App`,
    react: (
      <div>
        <strong>{inviterEmail}</strong> invited you to join team <strong>{teamName}</strong> in My
        App. Click{' '}
        <a href={`${process.env.HOSTED_URL}/t?${INVITE_PARAM}=${inviteId}`}>here to accept</a> or
        log in to My App.
      </div>
    ),
  });

  if (error) {
    throw new ConvexError('Could not send invitation email');
  }
}
