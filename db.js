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

async function moveBookingToDb(data, table) {
  const client = new Client({ connectionString });
  
  await client.connect();

  const query = `INSERT INTO ${table}(tourid, tourguide, year, month, day, time, firstname, lastname, email,
  phonenumber, nationality, persons, price, paid, pickup) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 
  $13, $14, $15)`;
  const values = [data.tourid, data.tourGuide, data.year, data.month, data.day, data.time, data.firstName,
  data.lastName, data.email, data.phoneNumber, data.nationality, data.persons, data.price, data.paid, data.pickup];

  try {
    await client.query(query, values);
    await updateMonth(client, data);
  } catch (err) {
    console.error('Error inserting data');
    throw err;
  } finally {
    await client.end();
  }
}

async function updateMonth(client, data){
  var day = parseInt(data.day);
 const query = `Select * from months where tourid = '${data.tourid}' and year = '${data.year}' 
 and month = '${data.month}' and day = ${day}`
 const result = await client.query(query);
 const{ rows } = result;

 if(!rows[0]){
   const query1 = `Insert into months (tourid, year, month, day, seatsTaken,groups) values($1, $2, $3, $4, $5, $6)`;
   const values = [data.tourid, data.year, data.month, data.day, data.persons, 1];
    await client.query(query1, values)
 }
 else{
   const query2 = `Update months set seatsTaken = ${parseInt(data.persons) + parseInt(rows[0].seatstaken)}, 
   groups = ${parseInt(rows[0].groups) + 1} where tourid = '${data.tourid}' and year = '${data.year}' 
   and month = '${data.month}' and day = '${data.day}'`;
    await client.query(query2);
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
  moveBookingToDb,
};
