exports.handler = async () => {
  const KEY = process.env.FOOTBALL_DATA_KEY;
  if (!KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Missing FOOTBALL_DATA_KEY env var' }) };
  }

  try {
    const resp = await fetch(
      'https://api.football-data.org/v4/competitions/WC/matches?season=2026',
      { headers: { 'X-Auth-Token': KEY } }
    );
    const data = await resp.json();
    return {
      statusCode: resp.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300'
      },
      body: JSON.stringify(data)
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
