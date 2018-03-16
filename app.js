const express = require('express');
const path = require('path');
const app = express();
const router = require('./router');

app.set('view engine', 'ejs');
app.set('port', (process.env.PORT || 5000));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', router);


app.use(express.static(path.join(__dirname, 'articles')));
app.use(express.static(path.join(__dirname, 'theTour')));
app.use(express.static(path.join(__dirname, 'people')));




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