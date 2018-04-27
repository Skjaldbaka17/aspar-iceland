require('dotenv').config();
const xss = require('xss');
const express = require('express');
const { check, validationResult } = require('express-validator/check');
const { sanitize } = require('express-validator/filter');
const router = express.Router();
const { moveBookingToDb } = require('./db');

/**Settu þetta inn í router.js og notaðu sem middleware þegar síður fyrir túra eru kallaðar!
var allBookings;
var Months = {};


async function fetchBookingsForTour(req, res, next){

    allBookings = await runQuery(`SELECT * FROM months where tourid = '${req.params.tour}' order by year, month, day;`);
    Months = await worker();
    next();
}

async function worker(){
    var t = await[*/
//    January = allBookings.filter((book) => book.month.match(/.*January.*/)),
//  February = allBookings.filter((book) => book.month.match(/.*February.*/)),
//March = allBookings.filter((book) => book.month.match(/.*March.*/)),
//April = allBookings.filter((book) => book.month.match(/.*April.*/)),
//May = allBookings.filter((book) => book.month.match(/.*May.*/)),
//June = allBookings.filter((book) => book.month.match(/.*June.*/)),
//July = allBookings.filter((book) => book.month.match(/.*July.*/)),
//August = allBookings.filter((book) => book.month.match(/.*August.*/)),
//September = allBookings.filter((book) => book.month.match(/.*September.*/)),
//October = allBookings.filter((book) => book.month.match(/.*October.*/)),
//November = allBookings.filter((book) => book.month.match(/.*November.*/)),
//December = allBookings.filter((book) => book.month.match(/.*December.*/)),
/*]

var b = [];

var s = 0;
t.forEach((month) =>{
var k = [];
for(var i = 1; i <= 31; i++){
    var booked = month.find((day) => day.day === i)
    if(booked)  k[i] = booked.seatstaken;
    else k[i] = 0;
}
b[s] = k;
s++;
});


return b;
}
 * 
 */

/* inni í module db.js
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
 */


var meta = false;
var formSent = false;
var height = '400px';
var image = '../img/pano1234/pano4.JPG';


const formValidation = [

    check('time')
    .custom((value) => value.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/))
    .withMessage('Please choose time of tour'),

    check('persons')
    .custom((value) => value.match(/^[1-9][0-9]*$/))
    .withMessage('Please choose how many tickets you want to book'),

    check('price')
    .custom((value) => value.match(/^[1-9][0-9]*$/))
    .withMessage('Please don\'t mess with the pricing'),


  check('firstName')
    .isLength({ min: 1 })
    .withMessage('Please enter your name.'),

  check('email')
    .isLength({ min: 1 })
    .withMessage('Please fill out email.'),

  check('email')
    .isEmail()
    .withMessage('Is this your email?'),

  /*check('phoneNumber')
  .isMobilePhone()*/

  sanitize('name').trim(),
];

async function formPost(req, res) {
  // fá öll gögn úr formi
  const {
    body: {
      tourGuide = '',
      date = '',
      firstName = '',
      lastName = '',
      email = '',
      phoneCountry = '',
      fullPhoneNumber = '',
      shortPhoneNumber = '',
      countryData='',
      nationality = '',
      persons = '',
      price = '',
      pickup = true,
      timeTour = '',
      timeAvailable = '',
    } = {},
  } = req;

  //console.log(req.body);

  // öll gögn hreinsuð úr formi
  const data = {
    tourid: req.params.tour,
    tourGuide: xss(tourGuide),
    date: xss(date),
    firstName: xss(firstName),
    lastName: xss(lastName),
    email: xss(email),
    phoneCountry: xss(phoneCountry),
    fullPhoneNumber: xss(fullPhoneNumber),
    phoneNumber: xss(shortPhoneNumber),
    nationality: xss(nationality),
    persons: xss(persons),
    price: xss(price),
    paid: false,
    pickup: xss(pickup),
    timeAvailable: xss(timeAvailable),
  };

  const validation = validationResult(req);


  const information = {
      time: timeTour,
      guide: tourGuide,
      price: parseFloat(data.price),
      timeAvailable: timeAvailable,
  }

  /*Handle Errors!*/
  if (!validation.isEmpty()) {
    const errors = validation.array();
    bookingFailed = true;
    //return res.render('calendarBooking', { bookingFailed, information, meta, height, image, errors, data});
    return res.redirect('/tours');
  }


  
  await moveBookingToDb(data, 'bookings');

  return res.redirect(`/tours/${data.tourid}/thanks`);
}



router.post('/tours/:tour', formValidation, formPost);

module.exports = router;