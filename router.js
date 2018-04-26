const express = require('express');
const util = require('util');
const path = require('path');
const fs = require('fs');
const MarkdownIt = require('markdown-it'); //fyrir að skrifa og rendera md-file
const matter = require('gray-matter');
const { runQuery } = require('./db');
const booking = require('./booking');

const router = express.Router();
const readdirAsync = util.promisify(fs.readdir);
const readFileAsync = util.promisify(fs.readFile);

const md = new MarkdownIt();

const picturesPath = './public/img';
const theTour = './tours/';
const peoplePath = "./people";
const toursPath = "./tours/all_tours";
const homePath = './home';
var meta = false;

var pano = 0;
var panorama;

var allBookings;
var Months = {};
var tourBooked = false;




async function fetchBookingsForTour(req, res, next){

    allBookings = await runQuery(`SELECT * FROM months where tourid = '${req.params.tour}' order by date;`);
    Months = await worker();
    next();
}

async function worker(){
    var datein = new Date();
    var t = await[
        January = allBookings.filter((book) => book.date.getMonth() === 0),
        February = allBookings.filter((book) => book.date.getMonth() === 1),
        March = allBookings.filter((book) => book.date.getMonth() === 2),
        April = allBookings.filter((book) =>book.date.getMonth() === 3),
        May = allBookings.filter((book) => book.date.getMonth() === 4),
        June = allBookings.filter((book) => book.date.getMonth() === 5),
        July = allBookings.filter((book) => book.date.getMonth() === 6),
        August = allBookings.filter((book) => book.date.getMonth() === 7),
        September = allBookings.filter((book) => book.date.getMonth() === 8),
        October = allBookings.filter((book) => book.date.getMonth() === 9),
        November = allBookings.filter((book) => book.date.getMonth() === 10),
        December = allBookings.filter((book) => book.date.getMonth() === 11),
    ]

var b = [];

var s = 0;
t.forEach((month) =>{
var k = [];
for(var i = 1; i <= 31; i++){
    var booked = month.filter((day) => day.date.getDate() === i)

    if(booked) { 
        var difTime = [];
        var l = 0;
        booked.forEach((time) => { difTime[l++] = {timeBooked: time.date.getHours() + ':' + (time.date.getMinutes()<10?'0':'') 
        + time.date.getMinutes(), seatstaken: time.seatstaken }});
        k[i] = difTime;
    }
}
b[s] = k;
s++;
});
return b;
}


async function readPano(){
    panorama = (await readdirAsync('./public/img/pano1234')).filter(file => !file.match(".DS_Store"));
}

function catchErrors(fn) {
    return (req, res, next) => fn(req, res, next).catch(next);
  }

async function readArticle(filePath){
    const file = await readFileAsync(filePath);
  
    const data = matter(file);
  
    const {
      content,
      data: { // gray-matter pakki skilar efni í content og lýsigögnum í data
        title,
        description,
        id,
        href,
        slug,
        image,
        position,
      },
    } = data;
  
    return {
      content: md.render(content),
      title,
      description,
      id,
      href,
      slug,
      image,
      position,
      path: filePath,
    };
}

async function readPeople(filePath){
    const file = await readFileAsync(filePath);

    const data = matter(file);

    const{
        content,
        data: {
            nafn,
            who,
            image,
        },
    } = data;

    return {
        content,
        nafn,
        who,
        image,
    };
}

async function readToursList(thePath){
    const files = await readdirAsync(thePath);

    
    const articles = files
      .filter(file => path.extname(file) === '.md')
      .map(file => readArticle(`${path.join(thePath, file)}`));

    return Promise.all(articles);
}

async function readPeopleList(){
    const files = await readdirAsync(peoplePath);

    const people = files   
        .filter(file => path.extname(file) === '.md')
        .map(file => readPeople(`${path.join(peoplePath, file)}`))

        return Promise.all(people);
}

async function list(req, res){
    if(!panorama) await readPano();
    
    const files = await readToursList(homePath);

    const articles = files
        .sort((a,b) => a.position > b.position);

    var height = '700px';
    var image = '/img/pano1234/' + panorama[pano];
    pano = (pano+1)%panorama.length;

    meta = true;
    res.render('home', {meta, height, image, articles});
}


async function pictures(req, res){
    if(!panorama) await readPano();
    const tours = await readToursList(homePath);
    const pictures = (await readdirAsync((theTour + 'img')))
    .filter(file => (!file.match(/.*\.DS_Store.*/)));
           
            
    
    var height = '400px';
    var image = '/img/pano1234/' + panorama[pano];
    pano = (pano+1)%panorama.length;

    meta = false;
    
    res.render('pictures', {meta, height, image, pictures});
}

async function readInformation(filePath){
    const file = await readFileAsync(filePath);

    const data = matter(file);

    const MONTH_NAMES = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
    ];

    const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const{
        content,
        data:{
            about,
            title,
            duration,
            peopleMax,
            ageLimit,
            time,
            monthsAvailable='',
            weekdaysAvailable='',
            timeAvailable='',
            available,
            difficulty,
            price,
            tourGuide,
        whoAmI,
        guidePic,
        facebook,
        instagram,
        guide,
        },
    } = data;

    var newWeekdaysAvailable;
    var newMonthsAvailable;
if(weekdaysAvailable.match(/^all/)) newWeekdaysAvailable = [0,1,2,3,4,5,6];
else newWeekdaysAvailable = weekdaysAvailable.split(",");
if(monthsAvailable.match(/^all/)) newMonthsAvailable = [0,1,2,3,4,5,6,7,8,9,10,11];
else newMonthsAvailable = monthsAvailable.split(",");

    return {
        content,
        about,
        title,
        duration,
        peopleMax,
        ageLimit,
        monthsAvailable: newMonthsAvailable,
        weekdaysAvailable: newWeekdaysAvailable,
        time,
        timeAvailable: timeAvailable.split(","),
        available,
        difficulty,
        price,
        tourGuide,
        whoAmI,
        guidePic,
        facebook,
        instagram,
        guide,
    };
}

async function selectedTour(req, res){
    if(!panorama) await readPano();
    const { tour } = req.params;
    var regex = new RegExp(tour);
    const files = (await readdirAsync((theTour + 'img')))
.filter((file) => file.match(regex));
    const information = await readInformation((theTour + tour + '/informationTour.md'));
    const above = await readInformation(theTour + tour + '/above.md');
    const below = await readInformation(theTour + tour + '/below.md');


    var height = '400px';
    var image = '/img/pano1234/' + panorama[pano];
    pano = (pano+1)%panorama.length;

    const pictures = files
        .filter(picture => picture !== '.DS_Store' && !picture.match(/aspar.*/) && !picture.match(/pano.*/))
        meta = false;

    //bookingFailed, information, meta, height, image, errors, data}

    const bookingFailed = false;
    const errors = [];

    res.render('the-tour', { tourBooked, Months, bookingFailed, errors, tourBooked, information, meta, height, image, pictures, above, below});
    tourBooked = false;
}

async function tours(req, res){
    if(!panorama) await readPano();
    const files = await readToursList(toursPath);

    const articles = files
        .sort((a,b) => a.position > b.position);

    var height = '400px';
    var image = '/img/pano1234/' + panorama[pano];
    
    pano = (pano+1)%panorama.length;

    meta = false;

    
    

    res.render('tours', {meta, height, image, articles});
}

async function about_us(req, res){  
    if(!panorama) await readPano();
    const people = await readPeopleList();

    var height = '400px';
    var image = '/img/pano1234/' + panorama[pano];
    pano = (pano+1)%panorama.length;

meta = false;
    res.render('about-us', {meta, height, image, people});
}

async function readTheArticle(req, res){
    if(!panorama) await readPano();
    const files = await readToursList(articlesPath);
    const { article } = req.params;

    const theArticle = files
        .find((a) => a.id === article);


    var height = '400px';
    var image = '/img/pano1234/' + panorama[pano];
    pano = (pano+1)%panorama.length;
meta = false;
    res.render('article', {meta, height, image, theArticle});
}

async function thanksForBooking(req, res, next){
    tourBooked = true;
    res.redirect(`/tours/${req.params.tour}`);
}




router.get('/', catchErrors(list));
router.get('/articles/:article', catchErrors(readTheArticle));
router.get('/pictures', catchErrors(pictures));
router.get('/tours', catchErrors(tours));
router.get('/tours/:tour', catchErrors(fetchBookingsForTour), catchErrors(selectedTour));
router.get('/about-us', catchErrors(about_us));
router.get('/google0897b145ce65bc52.html', (req,res) => {res.send('google-site-verification: google0897b145ce65bc52.html')})
router.get('/tours/:tour/thanks', catchErrors(thanksForBooking));
router.post('/tours/:tour', booking);



module.exports = router;