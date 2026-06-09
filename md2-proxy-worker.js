const SUPA_URL = 'https://zlsnqewkhaaubqbbbclf.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpsc25xZXdraGFhdWJxYmJiY2xmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NzM2NzEsImV4cCI6MjA5MzA0OTY3MX0.ypPE_7om0eJ5kixt_g9-ab6v66YhLUQ9Zv9ibiO8K1A';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': '*',
};

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    const url = new URL(request.url);
    const supaPath = url.searchParams.get('path');
    const token = url.searchParams.get('token') || SUPA_KEY;

    if (!supaPath) {
      return new Response(JSON.stringify({ error: 'Missing path param' }), {
        status: 400, headers: { ...CORS, 'Content-Type': 'application/json' }
      });
    }

    const isAuth = supaPath.startsWith('auth/');
    const baseUrl = isAuth ? SUPA_URL : `${SUPA_URL}/rest/v1`;
    const fullPath = isAuth ? supaPath.replace('auth/', '') : supaPath;

    const res = await fetch(`${baseUrl}/${fullPath}`, {
      method: request.method,
      headers: {
        'apikey': SUPA_KEY,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: request.method !== 'GET' ? await request.text() : undefined,
    });

    const text = await res.text();
    return new Response(text, {
      status: res.status,
      headers: { ...CORS, 'Content-Type': 'application/json' }
    });
  }
};
