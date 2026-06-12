exports.handler = async (event) => {
  const key = process.env.FOOTBALL_DATA_KEY;
  if (!key) {
    return { statusCode: 500, body: JSON.stringify({ message: 'API key not set' }) };
  }
  const type = event.queryStringParameters?.type || 'scorers';
  const season = event.queryStringParameters?.season || '2026';
  const endpoints = {
    scorers:   `https://api.football-data.org/v4/competitions/WC/scorers?season=${season}`,
    standings: `https://api.football-data.org/v4/competitions/WC/standings?season=${season}`,
    matches:   `https://api.football-data.org/v4/competitions/WC/matches?season=${season}`,
  };
  const url = endpoints[type];
  if (!url) return { statusCode: 400, body: JSON.stringify({ message: 'Invalid type' }) };
  try {
    const res = await fetch(url, { headers: { 'X-Auth-Token': key } });
    const data = await res.json();
    return {
      statusCode: res.status,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(data),
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ message: e.message }) };
  }
};
