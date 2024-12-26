// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const AI_AGENT_URL = 'https://1c7e-83-110-100-152.ngrok-free.app';
const post = async (url: string, data: unknown = {}) => {
  try {
    console.log(`${AI_AGENT_URL}/new-ai-message`);
    const response = await fetch(`${AI_AGENT_URL}/new-ai-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error(error);
  }
};

const notifyMatch = async (match: Match) => {
  await post(`${AI_AGENT_URL}/new-ai-message`, { channel_id: match.id });
};

Deno.serve(async (req) => {
  const { data: matches } = await supabase.from('matches').select('*');
  const selectedMatches = [matches[14], matches[15], matches[16]];
  console.log(selectedMatches);
  await Promise.all(selectedMatches.map(notifyMatch));

  return new Response(JSON.stringify(selectedMatches), {
    headers: { 'Content-Type': 'application/json' },
  });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/automated_messages' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
