require('dotenv').config();
const xss = require('xss');
const express = require('express');
const { check, validationResult } = require('express-validator/check');
const { sanitize } = require('express-validator/filter');
const router = express.Router();
const { saveToDb } = require('./db');


var meta = false;
var formSent = false;
var height = '400px';
var image = '../img/pano1234/pano4.JPG';


const formValidation = [
  check('name')
    .isLength({ min: 1 })
    .withMessage('Please enter your name.'),

  check('email')
    .isLength({ min: 1 })
    .withMessage('Please fill out email.'),

  check('email')
    .isEmail()
    .withMessage('Is this your email?'),

  check('about')
  .isLength({ min: 1 }),

  sanitize('name').trim(),
];

function form(req, res) {
    const data = {};
    var errors = '';
  res.render('form.ejs', { meta, formSent, height, image,errors,  data, title: 'Form' });
}

async function formPost(req, res) {
  // fá öll gögn úr formi
  const {
    body: {
      name = '',
      email = '',
      subject = '',
      about = '',
    } = {},
  } = req;

  // öll gögn hreinsuð úr formi
  const data = {
    name: xss(name),
    email: xss(email),
    subject: xss(subject),
    about: xss(about),
  };

  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    const errors = validation.array();
    return res.render('form', { meta, formSent, height, image, errors, data, title: 'Form' });
  }

  
  await saveToDb(data, 'contact_us');



  return res.render('form', {meta, height, image, formSent: true});
}



//End of EmailSending

function thanks(req, res) {
  return res.redirect('/');
}


router.get('/', form);
router.post('/', formValidation, formPost);
router.get('/thanks', thanks);

module.exports = router;
