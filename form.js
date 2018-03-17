const xss = require('xss');
const express = require('express');
const { check, validationResult } = require('express-validator/check');
const { sanitize } = require('express-validator/filter');
const nodemailer = require('nodemailer');
const router = express.Router();

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'thoragusts@gmail.com',
      pass: 'NikolaT10071856'
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
  res.render('form', { data, title: 'Form' });
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
    return res.render('form', { errors, data, title: 'Form' });
  }

  await send(data);

  return res.redirect('/thanks');
}

//Start of email-sending
async function send(data){
    var mailOptions = {
        from: 'thoragusts@gmail.com',
        to: 'thoragusts@gmail.com',
        subject: `${data.subject}`,
        text: `${data}`
      };
      
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

//End of EmailSending

function thanks(req, res) {
  return res.render('thanks', { title: 'Takk fyrir' });
}

router.get('/contact-us', form);
router.post('/contact-us', formValidation, formPost);
router.get('/thanks', thanks);

module.exports = router;
