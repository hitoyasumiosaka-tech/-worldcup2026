export async function onRequestGet(context) {
  const { request, env } = context;
  const key = env.FOOTBALL_DATA_KEY;
  if (!key) {
    return new Response(JSON.stringify({ message: 'API key not set' }), { status: 500 });
  }

  const url = new URL(request.url);
  const type = url.searchParams.get('type') || 'scorers';
  const season = url.searchParams.get('season') || '2026';

  const endpoints = {
    scorers:   `https://api.football-data.org/v4/competitions/WC/scorers?season=${season}`,
    standings: `https://api.football-data.org/v4/competitions/WC/standings?season=${season}`,
    matches:   `https://api.football-data.org/v4/competitions/WC/matches?season=${season}`,
  };

  const apiUrl = endpoints[type];
  if (!apiUrl) {
    return new Response(JSON.stringify({ message: 'Invalid type' }), { status: 400 });
  }

  try {
    const res = await fetch(apiUrl, { headers: { 'X-Auth-Token': key } });
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ message: e.message }), { status: 500 });
  }
}
