import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { api } from './_generated/api';

const http = httpRouter();

http.route({
  path: '/sendFile',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    // Step 1: Store the file
    const blob = await request.blob();
    const storageId = await ctx.storage.store(blob);

    // Step 2: Save the storage ID to the database via a mutation
    const author = new URL(request.url).searchParams.get('author');
    await ctx.runMutation(api.messages.sendImage, {
      storageId,
      author: author || '',
    });

    const url = await ctx.storage.getUrl(storageId);
    // Step 3: Return a response with the correct CORS headers
    return new Response(JSON.stringify({ storageId, url }), {
      status: 200,
      // CORS headers
      headers: new Headers({
        // e.g. https://mywebsite.com, configured on your Convex dashboard
        'Access-Control-Allow-Origin': '*',
        Vary: 'origin',
      }),
    });
  }),
});

// Pre-flight request for /sendImage
http.route({
  path: '/sendFile',
  method: 'OPTIONS',
  handler: httpAction(async (_, request) => {
    // Make sure the necessary headers are present
    // for this to be a valid pre-flight request
    const headers = request.headers;
    if (
      headers.get('Origin') !== null &&
      headers.get('Access-Control-Request-Method') !== null &&
      headers.get('Access-Control-Request-Headers') !== null
    ) {
      return new Response(null, {
        headers: new Headers({
          // e.g. https://mywebsite.com, configured on your Convex dashboard
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type, Digest',
          'Access-Control-Max-Age': '86400',
        }),
      });
    } else {
      return new Response();
    }
  }),
});

export default http;
