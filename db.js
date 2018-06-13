require('dotenv').config();
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

async function saveAuthorToDB(author){
  const client = new Client({ connectionString });
  await client.connect();

  const query = `Select * from authors where author = '${author}';`
 const result = await client.query(query);
 const{ rows } = result;
 try {
 if(!rows[0]){
  const query1 = `Insert into authors (author, searches) values($1, $2)`;
  const values = [author, 1];
   await client.query(query1, values)
 } else {
  const query2 = `Update authors set searches = ${1 + rows[0]} where author = '${author}';`;
   await client.query(query2);
 }
} catch (err) {
  console.error('Error inserting data');
  throw err;
} finally {
  await client.end();
}
}

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

  const query = `INSERT INTO ${table}(tourid, tourguide, date, firstname, lastname, email,
  phoneCountry, fullPhoneNumber, phonenumber, nationality, persons, price, paid, pickup) VALUES($1, $2, $3, $4, 
    $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`;
  const values = [data.tourid, data.tourGuide, data.date, data.firstName,
  data.lastName, data.email, data.phoneCountry, data.fullPhoneNumber, data.phoneNumber, data.nationality, 
  data.persons, data.price, data.paid, data.pickup];
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
 const query = `Select * from months where tourid = '${data.tourid}' and date='${data.date}';`
 const result = await client.query(query);
 const{ rows } = result;

 if(!rows[0]){
   const query1 = `Insert into months (tourid, date,  seatsTaken,groups) values($1, $2, $3, $4)`;
   const values = [data.tourid, data.date, data.persons, 1];
    await client.query(query1, values)
 }
 else{
   const query2 = `Update months set seatsTaken = ${parseInt(data.persons) + parseInt(rows[0].seatstaken)}, 
   groups = ${parseInt(rows[0].groups) + 1} where tourid = '${data.tourid}' and date='${data.date}'`;
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
  saveAuthorToDB,
};
