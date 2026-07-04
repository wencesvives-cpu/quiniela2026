module.exports = async function handler(req, res) {
  const KEY = process.env.FOOTBALL_DATA_KEY;
  if (!KEY) return res.status(500).send('Missing FOOTBALL_DATA_KEY');

  try {
    const r = await fetch(
      'https://api.football-data.org/v4/competitions/WC/matches?season=2026',
      { headers: { 'X-Auth-Token': KEY } }
    );
    const body = await r.json();
    const matches = body.matches || [];

    const finished = matches
      .filter(m => m.status === 'FINISHED')
      .map(m => ({ stage: m.stage, date: m.utcDate, home: m.homeTeam?.name, away: m.awayTeam?.name, winner: m.score?.winner }));

    const koScheduled = matches
      .filter(m => m.stage !== 'GROUP_STAGE' && m.homeTeam?.id && m.awayTeam?.id)
      .map(m => ({ stage: m.stage, status: m.status, date: m.utcDate, home: m.homeTeam?.name, away: m.awayTeam?.name }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const koTBD = matches
      .filter(m => m.stage !== 'GROUP_STAGE' && (!m.homeTeam?.id || !m.awayTeam?.id))
      .map(m => ({ stage: m.stage, status: m.status, date: m.utcDate }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const stages = [...new Set(matches.map(m => m.stage))].sort();

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({ totalMatches: matches.length, stageNames: stages, koScheduled, koTBD, finished });
  } catch (e) {
    return res.status(500).send(e.message);
  }
};
