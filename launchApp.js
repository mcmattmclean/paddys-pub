var storeData = {};
var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout: 'main'});
var bodyParser = require('body-parser');
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/static', express.static('public'));

app.get('/', function(req,res){
    res.render('home');
});

app.get('/restaurant', function(req,res){
    res.render('restaurant');
});

app.get('/guestbook', function(req,res){
    res.render('guestbook');
});

app.get('/products', function(req,res){
    storeData.productList = regenBeers();    
    res.render('products', storeData);
});

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
    var adjectives = ["Spicy", "Rowdy", "Glorious", "Humble", "Saucy", "Unnecessary", "Cantankerous", "Bodacious", "Yellow-bellied", "Blue-footed", "Poorly-made", "Ill-conceived"];
    var nouns = ["Moonshine", "Citrus", "Nasty", "Boffish", "Stank", "Mocha", "Celebration", "Watermelon", "Bourbon", "Classic", "California-Style"];
    var types = ["IPA", "Imperial IPA", "Lager", "Stout", "Porter", "Pale Ale", "Sour"];
    var availabilities = ["Year-round", "Seasonal", "Limited"];
    var products = [];
    var numProducts = types.length;
    for(var i = 0; i < numProducts; i++){
        var type = types[i];
        // Get random word for noun and remove
        var nounIndex = Math.floor(Math.random() * nouns.length);
        var noun = nouns[nounIndex];
        nouns.splice(nounIndex, 1);
        // Get random word for adjective and remove
        var adjIndex = Math.floor(Math.random() * adjectives.length);
        var adjective = adjectives[adjIndex];
        adjectives.splice(adjIndex, 1);
        var newProduct = {}
        newProduct.name = adjective + ' ' + noun + ' ' + type;
        newProduct.type = type;
        newProduct.description = "Everything you need to know about our amazing " + newProduct.name + ":\nLorem ipsum dolor sit amet consectetur adipisicing elit. Quidem minima tempora asperiores, ipsum quae ipsam blanditiis, at aliquam ex dolorum delectus dolore ut quo fugit explicabo ipsa tenetur, cumque ducimus?";
        newProduct.id = i + 1;
        newProduct.availability = availabilities[Math.floor(Math.random() * availabilities.length)];
        newProduct.alc = (Math.random() * (12 - 4 + 1) + 4).toFixed(1);
        newProduct.ibu = Math.floor(Math.random() * (100 - 45 + 1) + 45);
        products.push(newProduct);
    }
    return products;    
}