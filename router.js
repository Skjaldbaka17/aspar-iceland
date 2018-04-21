const express = require('express');
const util = require('util');
const path = require('path');
const fs = require('fs');
const MarkdownIt = require('markdown-it'); //fyrir að skrifa og rendera md-file
const matter = require('gray-matter');
const bookingRoute = require('./booking')
const { fetchData, runQuery } = require('./db');

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
var tourBooked = false;

var pano = 0;
var panorama;
var allBookings;
var Months = {};


async function fetchBookingsForTour(req, res, next){

    allBookings = await runQuery(`SELECT * FROM months where tourid = '${req.params.tour}' order by year, month, day;`);
    Months = await worker();
    next();
}

async function worker(){
    var t = await[
    January = allBookings.filter((book) => book.month.match(/.*January.*/)),
    February = allBookings.filter((book) => book.month.match(/.*February.*/)),
    March = allBookings.filter((book) => book.month.match(/.*March.*/)),
    April = allBookings.filter((book) => book.month.match(/.*April.*/)),
    May = allBookings.filter((book) => book.month.match(/.*May.*/)),
    June = allBookings.filter((book) => book.month.match(/.*June.*/)),
    July = allBookings.filter((book) => book.month.match(/.*July.*/)),
    August = allBookings.filter((book) => book.month.match(/.*August.*/)),
    September = allBookings.filter((book) => book.month.match(/.*September.*/)),
    October = allBookings.filter((book) => book.month.match(/.*October.*/)),
    November = allBookings.filter((book) => book.month.match(/.*November.*/)),
    December = allBookings.filter((book) => book.month.match(/.*December.*/)),
]

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

    const{
        content,
        data:{
            about,
            title,
            duration,
            peopleMax,
            ageLimit,
            time,
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

    return {
        content,
        about,
        title,
        duration,
        peopleMax,
        ageLimit,
        time,
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
    bookingFailed = false;
    errors = [];
    data = {};

    

    res.render('the-tour', {errors, data, tourBooked, Months, bookingFailed, information, meta, height, image, pictures, above, below});
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

async function thanksForBookingTour(req, res){
    tourBooked = true;
    res.redirect(`/tours/${req.params.tour}`);
}



router.get('/', catchErrors(list));
router.get('/articles/:article', catchErrors(readTheArticle));
router.get('/pictures', catchErrors(pictures));
router.get('/tours', catchErrors(tours));
router.get('/tours/:tour', catchErrors(fetchBookingsForTour), catchErrors(selectedTour));
router.get('/tours/:tour/thanks', catchErrors(fetchBookingsForTour), catchErrors(thanksForBookingTour));
router.get('/about-us', catchErrors(about_us));
router.get('/google0897b145ce65bc52.html', (req,res) => {res.send('google-site-verification: google0897b145ce65bc52.html')})
router.post('/tours/:tour', bookingRoute);



module.exports = router;