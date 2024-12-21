// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { StreamChat } from 'npm:stream-chat';

const serverClient = StreamChat.getInstance(
  Deno.env.get('STREAM_API_KEY'),
  Deno.env.get('STREAM_SECRET_KEY')
  );

Deno.serve(async (req) => {
  const data = await req.json();
  const agent = data?.record;
  
  if (!agent?.id) {
    return new Response(JSON.stringify({ error: 'User ID is required' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const user: any = {
    id: agent.id,
    name: agent.name,
    role: 'admin',
  };

  if (agent.imageurl) {
    user.image = `https://pxoacjnmdmqrqklbaxup.supabase.co/storage/v1/object/public/ai-agent-avatars/${agent.imageurl}`;
  }

  await serverClient.upsertUsers([user]);
  console.log('user created in stream');

  return new Response(
    JSON.stringify({ message: 'Agent synced to Stream!'}),
    { headers: { "Content-Type": "application/json" } },
  )
});

