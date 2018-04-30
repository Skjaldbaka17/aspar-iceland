require('dotenv').config();
const xss = require('xss');
const express = require('express');
const { check, validationResult } = require('express-validator/check');
const { sanitize } = require('express-validator/filter');
const router = express.Router();
const { moveBookingToDb } = require('./db');

var meta = false; //Sends always false so the html will not be written with the meta tag (with description of the site).
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