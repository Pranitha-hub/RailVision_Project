import express from 'express';
import cors from 'cors';
import pg from 'pg';

const { Pool } = pg;
const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: 'postgresql://postgres:270806@localhost:5432/railvision_db'
});

async function setupDB() {
  try {
    const client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS trains (
        train_id VARCHAR PRIMARY KEY,
        train_name VARCHAR,
        source VARCHAR,
        destination VARCHAR,
        departure_time TIMESTAMP
      );
    `);
    
    const cnt = await client.query('SELECT COUNT(*) FROM trains');
    if (parseInt(cnt.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO trains (train_id, train_name, source, destination, departure_time) VALUES
        ('train-12000', 'Delhi-Mumbai Rajdhani', 'NDLS', 'CSMT', NOW()),
        ('train-12002', 'Delhi-Kolkata Shatabdi', 'NDLS', 'HWH', NOW() + interval '1 hour'),
        ('train-12004', 'Mumbai-Chennai Garib Rath', 'CSMT', 'MAS', NOW() + interval '2 hours'),
        ('train-12006', 'Bangalore-Delhi Sampark Kranti', 'SBC', 'NDLS', NOW() + interval '3 hours')
      `);
      console.log('Seeded database with trains');
    }
    client.release();
  } catch (e) {
    console.log('Database error:', e.message);
  }
}
setupDB();

app.get('/trains', async (req, res) => {
  try {
    const rs = await pool.query('SELECT * FROM trains');
    res.json({ data: rs.rows });
  } catch(e) {
    res.json({ data: [], error: e.message });
  }
});

app.get('/crowd/:train_id', (req, res) => {
  res.json({ data: [] });
});

app.listen(8000, () => {
  console.log('Backend listening on port 8000');
});
