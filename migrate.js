const { Client } = require('pg');
require('dotenv').config();
const fs = require('fs');

const sql = fs.readFileSync('./backend/setup_db.sql', 'utf8');

// Convert MySQL to Postgres
const pgSql = sql
  .replace(/CREATE DATABASE IF NOT EXISTS eventify;/g, '')
  .replace(/USE eventify;/g, '')
  .replace(/INT AUTO_INCREMENT PRIMARY KEY/gi, 'SERIAL PRIMARY KEY')
  .replace(/DATETIME/gi, 'TIMESTAMP')
  .replace(/ENUM\([^)]*\)/gi, 'TEXT')
  .replace(/CREATE TABLE IF NOT EXISTS/gi, 'CREATE TABLE IF NOT EXISTS');

async function migrate() {
  console.log("Starting migration...");
  
  const client = new Client({
    host: 'db.edycznwtlfeptwkcsrhr.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'Sahil@2005@Bergal',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("✅ Connected to Supabase.");
    
    // Split by semicolon to run multiple statements if needed
    await client.query(pgSql);
    console.log("✅ Schema migrated successfully to Supabase.");
  } catch (err) {
    console.error("❌ Migration failed!");
    console.error("Error Name:", err.name);
    console.error("Error Message:", err.message);
    if (err.stack) console.error("Stack:", err.stack);
  } finally {
    try {
      await client.end();
    } catch (e) {}
  }
}

migrate();
