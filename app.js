const express = require('express');
const morgan = require('morgan'); // Charge le middleware de logging
const static = require('serve-static'); // Charge le middleware de favicon
const mysql = require('mysql');
const session = require('express-session');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');
const parseurl = require('parseurl');

// Database
let connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "azotown"
  });

const app = express();

app.use(morgan('combined'))

app.use(session({
    expires: false,
	secret: 'azotown',
	resave: false,
	saveUninitialized: true
}))
.use(bodyParser({ extended: true }))
.use(bodyParser.json())
.use(static(__dirname + '/public')) //indique que le site contient des fichiers statique dans le dossier '/public'
// .use(favicon(__dirname + '/public/favicon.ico')) // Active la favicon indiquée

// password hasher
const saltRounds = 10;

// compteur de vues
app.use(function (req, res, next) {
    if (!req.session.views) {
      req.session.views = {}
    }
   
    // get the url pathname
    let pathname = parseurl(req).pathname;
   
    // count the views
    req.session.views[pathname] = (req.session.views[pathname] || 0) + 1;
   
    next()
  })

app.all('/', function(req, res) {
    // // Update views
    req.session.views = (req.session.views || 0) + 1

    res.render('index.ejs', {view: req.session.views, loggedin: req.session.loggedin, auth: null});
})

.all('/course', function(req, res){
    res.setHeader('Content-type', 'text/html');
    res.render('course.ejs')
})

.get('/membership', function(req, res){
    res.render('membership.ejs', {is_connected: req.session.loggedin, email: req.session.email});
})

// tous sur l'espace membre

// renvoi la page contenant le formulaire d'inscription
.get('/signup', function(req, res){
    res.sendFile(path.join(__dirname + '/views/signup.html'));
})

// traitement de l'inscription
.post('/sign', function(req, res){
    // insertion
    connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    let sql = "INSERT INTO users (firstname, lastname, email, phone, addresse, password) VALUES ?";      
    let values = [
        [req.body.firstname, req.body.lastname, req.body.email, req.body.phone, req.body.addresse, bcrypt.hash(req.body.password)],
    ];
  
    connection.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("record inserted" + result.affectedRows);
        req.session.loggedin = true;
        req.session.email = req.body.email;
        res.render('index.ejs', {loggedin: req.session.loggedin, email: req.session.email});
    })});
})


.get('/login', function(req, res){
    res.sendFile(path.join(__dirname + '/views/login.html'));
})

.post('/auth', function(request, response) {
        connection.connect(function(err){
            let email = request.body.email;
            let password = request.body.password;

            let sql ="SELECT * FROM users WHERE email = ? LIMIT 1";

            connection.query(sql, [email], function(error, result){
               if(result.length > 1){
                if(bcrypt.compare(password, result[0].password)){
                    request.session.reload(function(){
                        response.render('membership.ejs', {loggedin: req.session.loggedin, email: req.session.email, prenom: result[0].firstname});
                        response.end();
                    })
                   
                }
               }
               response.end();
            })
        })
});



// gestion des pages non existants
app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable !');
});


app.listen(8080);