const { pool, poolConnect } = require('../database');

const getApprovedVisits = async () => {
  await poolConnect;
  const result = await pool.request().query(`
   SELECT 
  v.visit_ID,
  vis.first_name + ' ' + vis.last_name AS visitor_name,
  p.first_name + ' ' + p.last_name AS prisoner_name,
  v.relationship,
  v.visit_date
FROM visits v
JOIN visitors vis ON v.visitor_ID = vis.visitor_ID
JOIN prisoners p ON v.prisonerID = p.prisonerID
ORDER BY v.visit_date DESC;
  `);
  return result.recordset;
};

module.exports = {
  getApprovedVisits,
};
