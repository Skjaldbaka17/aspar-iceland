const express = require('express');
const util = require('util');
const path = require('path');
const fs = require('fs');
const MarkdownIt = require('markdown-it'); //fyrir að skrifa og rendera md-file
const matter = require('gray-matter');
const { runQuery, saveAuthorToDB } = require('./db');
const booking = require('./booking');

const router = express.Router();
const md = new MarkdownIt();
const readdirAsync = util.promisify(fs.readdir);
const readFileAsync = util.promisify(fs.readFile);

const picturesPath = './public/img';
const theTour = './tours/';
const peoplePath = "./people";
const toursPath = "./tours/all_tours";
const homePath = './home';

var meta = false, tourBooked = false; /*meta: if true then the header.ejs file will display meta-data, the
description of the page. tourBooked: if true then the thankYouMessage is displayed to the client, giving him the 
info he needs about the trip he has just booked (is true immediately after client has confirmed a booking.*/
var panorama, height, image; /*panorama: an array of panorama-pictures, the pictures in the header of the page.
height: height in pixels of panopic (header of each page). Image: What pano, from panorama-array, is displayed on current
page.*/
var Months = {};
var pano = 0;

//Reads in all panoramaPictures. (HeaderPhotos).
async function readPano(){
    panorama = (await readdirAsync('./public/img/pano1234')).filter(file => !file.match(".DS_Store"));
}

async function fetchBookingsForTour(req, res, next){
    try{
        const allBookings = await runQuery(`SELECT * FROM months where tourid = '${req.params.tour}' order by date;`);
        Months = await worker(allBookings);
    } catch(err){
        console.error(err);
    } finally{
        next();
    }
}

async function worker(allBookings){
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

//Reads a md-file and returns an object of strings found in file.
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
        nafn,
        who,
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
      nafn,
      who,
      path: filePath,
    };
}

/*Reads information about a specific tour, from a md-file. And 
    Returns an object of the information.*/
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

//Read all md-files in a folder and return an array of objects representing each file.
async function readList(thePath){
    const files = await readdirAsync(thePath);
    
    const articles = files
      .filter(file => path.extname(file) === '.md')
      .map(file => readArticle(`${path.join(thePath, file)}`));

    return Promise.all(articles);
}


//Sets up the home page. 
async function home(req, res){
    if(!panorama) await readPano();
    const files = await readList(homePath);

    const articles = files
        .sort((a,b) => a.position > b.position);

    await constStuff(true);

    res.render('home', {meta, height, image, articles});
}

//Sets up the pictures page.
async function pictures(req, res){
    if(!panorama) await readPano();
    const tours = await readList(homePath);

    const pictures = (await readdirAsync((theTour + 'img')))
    .filter(file => (!file.match(/.*\.DS_Store.*/)));

    await constStuff(false);
    
    res.render('pictures', {meta, height, image, pictures});
}

//Sets up the-tour page.
async function selectedTour(req, res){
    if(!panorama) await readPano();
    const { tour } = req.params;
    var regex = new RegExp(tour);
    const files = (await readdirAsync((theTour + 'img'))).filter((file) => file.match(regex));
    const information = await readInformation((theTour + tour + '/informationTour.md'));
    const above = await readInformation(theTour + tour + '/above.md');
    const below = await readInformation(theTour + tour + '/below.md');

    await constStuff(false);

    const pictures = files.filter(picture => picture !== '.DS_Store' && !picture.match(/aspar.*/) && !picture.match(/pano.*/));
    
    const bookingFailed = false;
    const errors = [];

    res.render('the-tour', { tourBooked, Months, bookingFailed, errors, 
        tourBooked, information, meta, height, image, pictures, above, below});
    
    tourBooked = false;
}

//Set the variables needed for rendering (ejs-variables).
async function constStuff(frontPage){
    if(frontPage){ 
        height = '700px';
        meta = true;
    }
    else {
        height = '400px';
        meta = false;
    }
    image = '/img/pano1234/' + panorama[pano];
    pano = (pano+1)%panorama.length;
}

//Sets up the tours-page
async function tours(req, res){
    if(!panorama) await readPano();
    const files = await readList(toursPath);
    const articles = files
        .sort((a,b) => a.position > b.position);

    await constStuff(false);

    res.render('tours', {meta, height, image, articles});
}

//Sets up the about-us page.
async function about_us(req, res){  
    if(!panorama) await readPano();
    const people = await readList(peoplePath);

    await constStuff(false);

    res.render('about-us', {meta, height, image, people});
}

//Redirect when client has booked a trip with us, sets tourBooked to 'true' so html will display thankyouMessage.
async function thanksForBooking(req, res, next){
    tourBooked = true;
    res.redirect(`/tours/${req.params.tour}`);
}

function catchErrors(fn) {
    return (req, res, next) => fn(req, res, next).catch(next);
  }

  async function authorQuotes(req, res){
    const { author } = req.params;
    const json = await readFileAsync("AuthorsPutTogether/" + author.charAt(0).toUpperCase() + ".json")
    const jsonObj = JSON.parse(json);
    saveAuthorToDB(author)
    return res.end(JSON.stringify(jsonObj[author]))
  }
  async function icelandicAuthorQuotes(req, res){
    const { author } = req.params;
    const json = await readFileAsync("IcelandicAuthorsPutTogether/" + author.charAt(0).toUpperCase() + ".json")
    const jsonObj = JSON.parse(json);
    saveAuthorToDB(author)
    return res.end(JSON.stringify(jsonObj[author]))
  }

  async function privacyPolicy(req, res){

    const file = (await readFileAsync('./Skilmálar.txt')).toString();
    const policy = file
    try {
        res.render('privacyPolicy', {policy})
        res.end()
    } catch (error) {
        console.log(error)
    }
}

router.get('/', catchErrors(home));
router.get('/pictures', catchErrors(pictures));
router.get('/tours', catchErrors(tours));
router.get('/tours/:tour', catchErrors(fetchBookingsForTour), catchErrors(selectedTour));
router.get('/about-us', catchErrors(about_us));
router.get('/google0897b145ce65bc52.html', (req,res) => {res.send('google-site-verification: google0897b145ce65bc52.html')})
router.get('/tours/:tour/thanks', catchErrors(thanksForBooking));
router.post('/tours/:tour', booking);
router.get('/quotes/english/:author',catchErrors(authorQuotes))
router.get('/quotes/icelandic/:author',catchErrors(icelandicAuthorQuotes))
router.get('/quotes/skilmalar', catchErrors(privacyPolicy))




module.exports = router;