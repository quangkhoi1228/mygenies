import { entsTableFactory, scheduledDeleteFactory } from 'convex-ents';
import { customCtx, customQuery, customMutation } from 'convex-helpers/server/customFunctions';

import { entDefinitions } from './schema';
import {
  query as baseQuery,
  QueryCtx as BaseQueryCtx,
  mutation as baseMutation,
  MutationCtx as BaseMutationCtx,
  internalQuery as baseInternalQuery,
  internalMutation as baseInternalMutation,
} from './_generated/server';

export const query = customQuery(
  baseQuery,
  customCtx(async (baseCtx) => queryCtx(baseCtx))
);

export const internalQuery = customQuery(
  baseInternalQuery,
  customCtx(async (baseCtx) => queryCtx(baseCtx))
);

export const mutation = customMutation(
  baseMutation,
  customCtx(async (baseCtx) => mutationCtx(baseCtx))
);

export const internalMutation = customMutation(
  baseInternalMutation,
  customCtx(async (baseCtx) => mutationCtx(baseCtx))
);

async function queryCtx(baseCtx: BaseQueryCtx) {
  const ctx = {
    ...baseCtx,
    db: undefined,
    table: entsTableFactory(baseCtx, entDefinitions),
  };
  const identity = await ctx.auth.getUserIdentity();
  const viewer =
    identity === null
      ? null
      : await ctx.table('users').get('tokenIdentifier', identity.tokenIdentifier);
  const viewerX = () => {
    if (viewer === null) {
      throw new Error('Expected authenticated viewer');
    }
    return viewer;
  };
  return { ...ctx, viewer, viewerX };
}

async function mutationCtx(baseCtx: BaseMutationCtx) {
  const ctx = {
    ...baseCtx,
    db: undefined,
    table: entsTableFactory(baseCtx, entDefinitions),
  };
  const identity = await ctx.auth.getUserIdentity();
  const viewer =
    identity === null
      ? null
      : await ctx.table('users').get('tokenIdentifier', identity.tokenIdentifier);
  const viewerX = () => {
    if (viewer === null) {
      throw new Error('Expected authenticated viewer');
    }
    return viewer;
  };
  return { ...ctx, viewer, viewerX };
}

export const scheduledDelete = scheduledDeleteFactory(entDefinitions);
