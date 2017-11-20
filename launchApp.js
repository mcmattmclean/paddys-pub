// File: launchApp.js
// Course: CS290-400 (F2017)
// Assignment: Project
// Name: Matthew McLean
// Due Date: November 19, 2017

var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout: 'main'});
var bodyParser = require('body-parser');
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 7728);
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/static', express.static('public'));
var storeData = {};
storeData.feedback = [];
var testFeedback = {};
testFeedback.name = "Bob";
testFeedback.rating = 5;
testFeedback.comment = "Food was terrible, beer okay.";
storeData.feedback.push(testFeedback);

app.get('/', function(req,res){
    res.render('home');
});

app.get('/restaurant', function(req,res){
    res.render('restaurant');
});

app.get('/guestbook', function(req,res){
    res.render('guestbook', storeData);
});

app.post('/guestbook', function(req,res){
    var newFeedback = {};
    newFeedback.name = req.body.name;
    if(newFeedback.name == ""){
        newFeedback.name = "Anonymous";
    }
    newFeedback.rating = req.body.rating;
    newFeedback.comment = req.body.comment;
    storeData.feedback.push(newFeedback);
    res.render('guestbook', storeData);
});

app.get('/products', function(req,res){
    storeData.productList = regenBeers();    
    res.render('products', storeData);
});

app.get('/outside-links', function(req,res){
    res.render('outside-links');
})

// Error handling
app.use(function(req,res){
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
});
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    res.send('500 - Server Error');
});

// Start app on assigned port
app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});

// Generate product list, to be replaced by MySQL at a later time
function regenBeers(){
    var adjectives = ["Spicy", "Rowdy", "Saucy", "Unnecessary", "Cantankerous", "Bodacious", "Yellow-bellied", "Blue-footed", "Poorly-made", "Ill-conceived"];
    var nouns = ["Moonshine", "Citrus", "Nasty", "Boffish", "Stank", "Mocha", "Watermelon", "Bourbon", "California-Style"];
    var types = ["IPA", "Imperial IPA", "Lager", "Stout", "Porter", "Pale Ale", "Sour Ale", "Saison"];
    var availabilities = ["Year-round", "Seasonal", "Limited"];
    var userReviews =["It was okay I guess.", "I'm not sure who asked for this, but there you have it.", "I'm not really a beer fan but I guess it was nice?", "Terrible smell, strange aftertaste, and the lacing was beyond subpar. 0/10", "Please stop making me drink this.", "Surprisingly not awful.", "...", "Their only good beer."];
    var userFirstName = ["Cindy", "Bruce", "Balthazar", "David", "Jessica", "Melissa", "Jeb", "Frederick"];
    var userLastName = ["Bush", "Wayne", "S. Pumpkins", "of the Dark Forest, the Unseen Horror", "MacDonald", "Douglas", "(no last name)", "Jones"];
    var products = [];
    var numProducts = types.length;
    function getRandomAndRemove(list){
        var index = Math.floor(Math.random() * list.length);
        random = list[index];
        list.splice(index, 1);
        return random;
    }
    for(var i = 0; i < numProducts; i++){
        var type = types[i];
        var noun = getRandomAndRemove(nouns);
        var adjective = getRandomAndRemove(adjectives);
        var firstN = getRandomAndRemove(userFirstName);
        var lastN = getRandomAndRemove(userLastName);
        var review = getRandomAndRemove(userReviews);
        var newProduct = {}
        newProduct.review = {};
        newProduct.review.firstN = firstN;
        newProduct.review.lastN = lastN;
        newProduct.review.content = review;
        newProduct.name = adjective + ' ' + noun + ' ' + type;
        newProduct.type = type;
        newProduct.id = i + 1;
        newProduct.availability = availabilities[Math.floor(Math.random() * availabilities.length)];
        newProduct.alc = (Math.random() * (12 - 4 + 1) + 4).toFixed(1);
        newProduct.ibu = Math.floor(Math.random() * (100 - 45 + 1) + 45);
        products.push(newProduct);
    }
    return products;    
}