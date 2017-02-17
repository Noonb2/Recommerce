const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
var flash    = require('connect-flash');
var passport = require('passport');
var bcrypt   = require('bcrypt-nodejs');
var cookieParser = require('cookie-parser')


// var local = require('passport-local');
var session = require('express-session');
var mongoose = require('mongoose');
var User = require('./server/models/user');
// var MongoStore = require('connect-mongostore')(express);
// Get our API routes
const api = require('./server/routes/api');
const app = express();

//connect to mongo
mongoose.connect('mongodb://localhost:27017/Recommerce');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("connection successful");
});
///////////////////




app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(express.session({
//     secret: 'my secret',
//     store: new MongoStore({'db': 'sessions'})
//   }));


app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// for encrpyt password
// var myPlaintextPassword = "023799640";
// const saltRounds = 10;
// var salt = bcrypt.genSaltSync(saltRounds);
// var hash = bcrypt.hashSync(myPlaintextPassword, salt);
// console.log(hash);
// var check = bcrypt.compareSync(myPlaintextPassword, hash);
// console.log(check);

app.post('/login',function(req,res){
	console.log("login checking processing..");
	User.find({'username':req.body.username},function(err,obj){
		if(err) console.log(err);
		if(bcrypt.compareSync(req.password, hash)){
			res.send(true);
		}else{
			res.send(false);
		}
	})
})


app.post('/register',function(req,res){
	console.log("Register checking processing..");
	User.find({'username':req.body.username},function(err,obj){
		if(err)console.log(err);
		if(obj.length == 0){
			res.send(true);
		}else{
			res.send(false);
		}
	})
})
// example to create user
// var test = new User({
// 	username:"apiromz",
// 	password:hash,
// 	name:"Sam",
// 	gender:"male",
// 	buys: [],
// });

// test.save();

// Parsers for POST data





// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

app.use(express.static(path.join(__dirname,'src')));

// Set our api routes
app.use('/api', api);


app.get('*', (req, res) => {
	  // res.cookie('name','value');
	  res.cookie('login',{
	  	'id':'apiromz',
	  	'password':'023799640'
	  })
	  console.log('Cookies: ', req.cookies);
      res.sendFile(path.join(__dirname, 'dist/index.html'));
    });

// Catch all other routes and return the index file

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));