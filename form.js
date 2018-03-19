const xss = require('xss');
const express = require('express');
const { check, validationResult } = require('express-validator/check');
const { sanitize } = require('express-validator/filter');
const nodemailer = require('nodemailer');
const router = express.Router();


var formSent = false;
var height = '400px';
var image = '../img/pano1234/pano4.JPG';


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'aspariceland@gmail.com',
      pass: 'DanielAgusts081096'
    }
  });

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
  res.render('form.ejs', { formSent, height, image,errors,  data, title: 'Form' });
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
    return res.render('form', { formSent, height, image, errors, data, title: 'Form' });
  }

  
  await send(data)



  return res.render('form', {height, image, formSent: true});
}

//Start of email-sending
async function send(data){
    var mailOptions = {
        from: 'aspariceland@gmail.com',
        to: 'aspariceland@gmail.com',
        subject: `${data.subject}`,
        text: `name of person: ${data.name}
        email of person: ${data.email}
        their question: ${data.about}`
      };
      
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          return true;
        }
      });
}

//End of EmailSending

function thanks(req, res) {
    console.log("redi");
  return res.redirect('/');
}


router.get('/', form);
router.post('/', formValidation, formPost);
router.get('/thanks', thanks);

module.exports = router;
