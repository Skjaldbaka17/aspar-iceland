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

const articlesPath = './articles';
const picturesPath = './public/img';
const glymurPicturesPath = './theTour/img';
const peoplePath = "./people";


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
        slug,
        image,
        position,
      },
    } = data;
  
    
    return {
      content,
      title,
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

async function readArticlesList(){
    const files = await readdirAsync(articlesPath);

    const articles = files
      .filter(file => path.extname(file) === '.md')
      .map(file => readArticle(`${path.join(articlesPath, file)}`));

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
    const files = await readArticlesList();

    const articles = files
        .sort((a,b) => a.position > b.position);

    var height = '700px';
    var image = 'img/pano1234/pano4.JPG';


    res.render('articles', {height, image, articles});
}

async function pictures(req, res){
    const files = await readdirAsync(picturesPath);
    
    var height = '400px';
    var image = 'img/pano1234/pano3.JPG';

    const pictures = files
        .filter(picture => picture !== '.DS_Store' && !picture.match(/aspar.*/) && !picture.match(/pano.*/))
    
    res.render('pictures', {height, image, pictures});
}

async function theTour(req, res){
    const files = await readdirAsync(glymurPicturesPath);

    var height = '400px';
    var image = 'img/pano1234/pano4.JPG';

    const pictures = files
        .filter(picture => picture !== '.DS_Store' && !picture.match(/aspar.*/) && !picture.match(/pano.*/))

    res.render('the-tour', {height, image, pictures});
}

async function about_us(req, res){  
    const people = await readPeopleList();

    var height = '400px';
    var image = 'img/pano1234/pano4.JPG';


    res.render('about-us', {height, image, people});
}


router.get('/', catchErrors(list));
router.get('/pictures', catchErrors(pictures));
router.get('/the-tour', catchErrors(theTour));
router.get('/about-us', catchErrors(about_us));
module.exports = router;