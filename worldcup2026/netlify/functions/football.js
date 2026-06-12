exports.handler = async (event) => {
  const key = process.env.FOOTBALL_DATA_KEY;
  if (!key) {
    return { statusCode: 500, body: JSON.stringify({ message: 'API key not set' }) };
  }

  const type = event.queryStringParameters?.type || 'standings';

  const endpoints = {
    standings: `https://api.football-data.org/v4/competitions/WC/standings`,
    matches:   `https://api.football-data.org/v4/competitions/WC/matches`,
  };

  const url = endpoints[type];
  if (!url) return { statusCode: 400, body: JSON.stringify({ message: 'Invalid type' }) };

  try {
    const res = await fetch(url, {
      headers: { 'X-Auth-Token': key }
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
