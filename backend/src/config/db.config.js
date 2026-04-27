const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// MySQL Compatibility Wrapper
// Converts '?' to '$1, $2...' and handles return format [rows]
const db = {
  query: async (text, params) => {
    let pgText = text;
    if (params && params.length > 0) {
      let index = 1;
      pgText = text.replace(/\?/g, () => `$${index++}`);
    }
    
    // Postgres 'INSERT IGNORE' equivalent is 'ON CONFLICT DO NOTHING'
    pgText = pgSqlFix(pgText);

    const start = Date.now();
    try {
      const res = await pool.query(pgText, params);
      const duration = Date.now() - start;
      // console.log('executed query', { pgText, duration, rows: res.rowCount });
      
      // Mimic mysql2 return: [rows, fields]
      return [res.rows, res.fields];
    } catch (err) {
      console.error('❌ Database Query Error:', err.message);
      throw err;
    }
  },
  execute: (text, params) => db.query(text, params),
  pool
};

// Internal helper for minor SQL syntax fixes
function pgSqlFix(sql) {
  return sql
    .replace(/INSERT IGNORE/gi, 'INSERT') // + ON CONFLICT (if we knew columns)
    .replace(/NOW\(\)/gi, 'CURRENT_TIMESTAMP');
}

module.exports = db;
