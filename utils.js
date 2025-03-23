const db = require('../config/db');

async function checkExistence(table, column, value) {
  const [result] = await db.query(`SELECT 1 FROM ${table} WHERE ${column} = ?`, [value]);
  return result.length > 0;
}

async function insertData(table, data) {
  const columns = Object.keys(data).join(', ');
  const values = Object.values(data);
  const placeholders = values.map(() => '?').join(', ');

  const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
  const [result] = await db.query(query, values);
  return result.insertId;
}

module.exports = { checkExistence, insertData };
