//import express module 
var express = require('express');
//create an express app
var app = express();
//require express middleware body-parser
var bodyParser = require('body-parser');
//require express session
var session = require('express-session');
var cookieParser = require('cookie-parser');

//set the view engine to ejs
app.set('view engine', 'ejs');
//set the directory of views
app.set('views', './views');
//specify the path of static directory
app.use(express.static(__dirname + '/public'));

//use body parser to parse JSON and urlencoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//use cookie parser to parse request headers
app.use(cookieParser());
//use session to store user data between HTTP requests
app.use(session({
    secret: 'cmpe_273_secure_string',
    resave: false,
    saveUninitialized: true
}));

//Only user allowed is admin
var Users = [{
    "username": "admin",
    "password": "admin"
}];
//By Default we have 3 books
var books = [
    { "BookID": "1", "Title": "Book 1", "Author": "Author 1" },
    { "BookID": "2", "Title": "Book 2", "Author": "Author 2" },
    { "BookID": "3", "Title": "Book 3", "Author": "Author 3" }
]
//route to root
app.get('/', function (req, res) {
    //check if user session exits
    if (req.session.user) {
        res.render('home', {
            books: books
        });
    } else {
        res.render('login', {
            error :false
        });
    }
});

app.post('/login', function (req, res) {
    if (req.session.user) {
        res.render('home', {
            books: books
        });
    } else {
        let flag = false;
        console.log("Req Body : ", req.body);
        Users.filter(user => {
            if (user.username === req.body.username && user.password === req.body.password) {
                req.session.user = user;
                flag = true;
                res.redirect('/home');
            }
        });
        if(!flag) {
            res.render('login', {
                error:true
            });
        }  
    }
});

app.get('/home', function (req, res) {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        console.log("Session data : ", req.session);
        res.render('home', {
            books: books
        });
    }
});

app.get('/create', function (req, res) {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        res.render('create', {
            error:false
        });
    }
});

app.post('/create', function (req, res) {
    let newBook = req.body;
    console.log(newBook);
    let flag = false;
    for(let book of books){
        if(book.BookID == newBook.BookID){
            flag = true;
            res.render('create', {
                error:true
            })
        }
    }
    if(!flag){
        books.push(newBook);
        console.log(books);
        res.render('home', {
            books : books
        });
    }
});

app.get('/delete', function (req, res) {
    console.log("Session Data : ", req.session.user);
    if (!req.session.user) {
        res.redirect('/');
    } else {
        res.render('delete', {
            error:false
        });
    }
});

app.post('/delete', function (req, res) {
    // console.log(req.body);
    let {BookID} = req.body;
    console.log(BookID);
    let flag = false;
    let books1 = [];
    for(let book of books) {
        if(book.BookID != BookID) {
            books1.push(book);
        }
    }
    if(books.length == books1.length) {
        res.render('delete', {
            error:true
        });
    }
    else {
        books = books1;
        res.render('home', {
            books : books1
        });
    }
})

app.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/');
});

var server = app.listen(3000, function () {
    console.log("Server listening on port 3000");
});