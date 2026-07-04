module.exports = async function handler(req, res) {
  const KEY = process.env.FOOTBALL_DATA_KEY;
  if (!KEY) {
    return res.status(500).json({ error: 'Missing FOOTBALL_DATA_KEY env var' });
  }
  try {
    const resp = await fetch(
      'https://api.football-data.org/v4/competitions/WC/matches?season=2026',
      { headers: { 'X-Auth-Token': KEY } }
    );
    const data = await resp.json();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=300');
    return res.status(resp.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
