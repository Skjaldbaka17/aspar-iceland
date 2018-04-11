
const express = require('express');
const path = require('path');
const app = express();
const router = require('./router');
const formRouter = require('./form');

app.set('x-powered-by', false); //Security risk prevention.

//can also do this: app.disable('x-powered-by');

app.set('view engine', 'ejs');
app.set('port', (process.env.PORT || 5000));

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'tours')));
app.use(express.static(path.join(__dirname, 'people')));
app.use(express.static(path.join(__dirname, 'home')));


app.get('*',function (req, res) {
  res.redirect('https://<domain>' + req.url);
});
/*function enforceHttps(req, res, next) {
  if (!req.secure &&
    req.get("x-forwarded-proto") !== "https" &&
    process.env.NODE_ENV === "production") {
    res.redirect(301, `https://${req.get("host")}${req.url}`);
  } else {
    next();
  }
}

app.use(enforceHttps);*/

app.use('/', router);
app.use('/contact-us', formRouter);





// hjálparfall fyrir view
app.locals.isInvalid = (param, errors) => {
  if (!errors) {
    return false;
  }

  return Boolean(errors.find(i => i.param === param)) ? 'field-invalid': '';
};




function notFoundHandler(req, res, next) { // eslint-disable-line
    const title = 'Fannst ekki';
    const message = 'Sorry, this page is currently under construction.';
    res.status(404).render('error', {message });
  }
  
  function errorHandler(err, req, res, next) { // eslint-disable-line
    console.error(err);
    const title = 'Villa kom upp';
    const message = '';
    res.status(500).render('error', { message });
  }

  app.use(notFoundHandler);
app.use(errorHandler);

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
  });