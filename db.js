require('dotenv').config();
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;


async function saveToDb(data, table) {
  const client = new Client({ connectionString });

  await client.connect();

  const query = `INSERT INTO ${table}(name, email, subject, about) VALUES($1, $2, $3, $4)`;
  const values = [data.name, data.email, data.subject, data.about];

  try {
    await client.query(query, values);
  } catch (err) {
    console.error('Error inserting data');
    throw err;
  } finally {
    await client.end();
  }
}

async function fetchData(table) {
  const client = new Client({ connectionString });
  await client.connect();

  try {
    const result = await client.query('SELECT * FROM '+table);

    const { rows } = result;
    return rows;
  } catch (err) {
    console.error('Error selecting form data');
    throw err;
  } finally {
    await client.end();
  }
}

async function runQuery(query) {
  const client = new Client({ connectionString });

  await client.connect();

  try {
    const result = await client.query(query);

    const { rows } = result;
    return rows;
  } catch (err) {
    console.error('Error running query');
    throw err;
  } finally {
    await client.end();
  }
}

module.exports = {
  saveToDb,
  fetchData,
  runQuery,
};
