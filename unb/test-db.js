import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://postgres.cjhmpelcnihipkhnrjlw:Nusabangsa205@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres';

const client = new Client({
  connectionString,
});

async function test() {
  try {
    await client.connect();
    const res = await client.query('SELECT 1');
    console.log('Connection successful!', res.rows);
  } catch (err) {
    console.error('Connection failed:', err);
  } finally {
    await client.end();
  }
}

test();
