const WC_LEAGUE = 1;      // API-Football の W杯 league ID
const WC_SEASON = 2026;

exports.handler = async (event) => {
  const key = process.env.API_FOOTBALL_KEY;
  if (!key) {
    return { statusCode: 500, body: JSON.stringify({ message: 'API key not set' }) };
  }

  const type = event.queryStringParameters?.type || 'standings';

  const endpoints = {
    standings:  `https://v3.football.api-sports.io/standings?league=${WC_LEAGUE}&season=${WC_SEASON}`,
    matches:    `https://v3.football.api-sports.io/fixtures?league=${WC_LEAGUE}&season=${WC_SEASON}`,
    scorers:    `https://v3.football.api-sports.io/players/topscorers?league=${WC_LEAGUE}&season=${WC_SEASON}`,
  };

  const url = endpoints[type];
  if (!url) return { statusCode: 400, body: JSON.stringify({ message: 'Invalid type' }) };

  try {
    const res = await fetch(url, {
      headers: {
        'x-apisports-key': key,
        'x-rapidapi-key':  key,
      }
    });
    const data = await res.json();
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(data),
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ message: e.message }) };
  }
};
