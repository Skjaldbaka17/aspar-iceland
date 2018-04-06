const express = require('express');
const util = require('util');
const path = require('path');
const fs = require('fs');
const MarkdownIt = require('markdown-it'); //fyrir að skrifa og rendera md-file
const matter = require('gray-matter');

const router = express.Router();
const readdirAsync = util.promisify(fs.readdir);
const readFileAsync = util.promisify(fs.readFile);

const md = new MarkdownIt();

const picturesPath = './public/img';
const theTour = './tours/';
const peoplePath = "./people";
const toursPath = "./tours/all_tours";
const homePath = './home';

var pano = 0;
var panorama;



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
    if(!panorama) panorama = (await readdirAsync('./public/img/pano1234')).filter(file => !file.match(".DS_Store"));
    
    const files = await readToursList(homePath);

    const articles = files
        .sort((a,b) => a.position > b.position);

    var height = '700px';
    var image = '/img/pano1234/' + panorama[pano];
    pano = (pano+1)%panorama.length;


    res.render('home', {height, image, articles});
}


async function pictures(req, res){
    const tours = await readToursList(homePath);
    const pictures = (await readdirAsync((theTour + 'img')))
    .filter(file => (!file.match(/.*\.DS_Store.*/)));
           
            
    
    var height = '400px';
    var image = '/img/pano1234/' + panorama[pano];
    pano = (pano+1)%panorama.length;

    
    res.render('pictures', {height, image, pictures});
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
    };
}

async function selectedTour(req, res){
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

    res.render('the-tour', {height, image, pictures, information, above, below});
}

async function tours(req, res){
    const files = await readToursList(toursPath);

    const articles = files
        .sort((a,b) => a.position > b.position);

    var height = '400px';
    var image = '/img/pano1234/' + panorama[pano];
    pano = (pano+1)%panorama.length;


    res.render('tours', {height, image, articles});
}

async function about_us(req, res){  
    const people = await readPeopleList();

    var height = '400px';
    var image = '/img/pano1234/' + panorama[pano];
    pano = (pano+1)%panorama.length;


    res.render('about-us', {height, image, people});
}

async function readTheArticle(req, res){
    const files = await readToursList(articlesPath);
    const { article } = req.params;

    const theArticle = files
        .find((a) => a.id === article);


    var height = '400px';
    var image = '/img/pano1234/' + panorama[pano];
    pano = (pano+1)%panorama.length;

    res.render('article', {height, image, theArticle});
}


router.get('/', catchErrors(list));
router.get('/articles/:article', catchErrors(readTheArticle));
router.get('/pictures', catchErrors(pictures));
router.get('/tours', catchErrors(tours));
router.get('/tours/:tour', catchErrors(selectedTour));
router.get('/about-us', catchErrors(about_us));

module.exports = router;