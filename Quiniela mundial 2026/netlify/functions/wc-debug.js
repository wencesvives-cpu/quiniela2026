// Endpoint de diagnóstico — visita /.netlify/functions/wc-debug
exports.handler = async () => {
  const KEY = process.env.FOOTBALL_DATA_KEY;
  if (!KEY) return { statusCode: 500, body: 'Missing FOOTBALL_DATA_KEY' };

  try {
    const r = await fetch(
      'https://api.football-data.org/v4/competitions/WC/matches?season=2026',
      { headers: { 'X-Auth-Token': KEY } }
    );
    const body = await r.json();
    const matches = body.matches || [];

    // Partidos terminados con resultado
    const finished = matches
      .filter(m => m.status === 'FINISHED')
      .map(m => ({ stage: m.stage, date: m.utcDate, home: m.homeTeam?.name, away: m.awayTeam?.name, winner: m.score?.winner }));

    // Partidos de eliminatoria (no GROUP_STAGE) con equipos ya conocidos
    const koScheduled = matches
      .filter(m => m.stage !== 'GROUP_STAGE' && m.homeTeam?.id && m.awayTeam?.id)
      .map(m => ({ stage: m.stage, status: m.status, date: m.utcDate, home: m.homeTeam?.name, homeId: m.homeTeam?.id, away: m.awayTeam?.name, awayId: m.awayTeam?.id }))
      .sort((a,b) => a.date.localeCompare(b.date));

    // Partidos de eliminatoria SIN equipos asignados (TBD)
    const koTBD = matches
      .filter(m => m.stage !== 'GROUP_STAGE' && (!m.homeTeam?.id || !m.awayTeam?.id))
      .map(m => ({ stage: m.stage, status: m.status, date: m.utcDate, home: m.homeTeam?.name, away: m.awayTeam?.name }))
      .sort((a,b) => a.date.localeCompare(b.date));

    // Stage names usados por la API
    const stages = [...new Set(matches.map(m => m.stage))].sort();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ totalMatches: matches.length, stageNames: stages, koScheduled, koTBD, finished }, null, 2)
    };
  } catch(e) {
    return { statusCode: 500, body: e.message };
  }
};
