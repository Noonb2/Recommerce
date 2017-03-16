const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
var flash    = require('connect-flash');
var passport = require('passport');
var bcrypt   = require('bcrypt-nodejs');
var cookieParser = require('cookie-parser')
var async = require('async');

// var local = require('passport-local');
var session = require('express-session');
var mongoose = require('mongoose');
var User = require('./server/models/user');
var Item = require('./server/models/item');
var Eval = require('./server/models/eval');

// Get our API routes
const api = require('./server/routes/api');
const app = express();

var options = {
  user: 'apiromz',
  pass: '023799640'
}
// var connectionString = 'mongodb://apiromz:023799640@ds133348.mlab.com:33348/recommerce'
var connectionString = 'mongodb://apiromz:023799640@ds129050.mlab.com:29050/test_recommerce'


mongoose.connect(connectionString,{server:{auto_reconnect:true}});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.on('reconnected', function () {
console.log('MongoDB reconnected!');
});
db.on('disconnected', function() {
console.log('MongoDB disconnected!');
mongoose.connect(connectionString, {server:{auto_reconnect:true}});
});
db.once('open', function() {
  console.log("connection successful");
});
///////////////////




app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.post('/login',function(req,res){

	data = {
					login:false
				}
	User.find({'username':req.body.username},function(err,obj){
		if(err) console.log(err);
		if(obj.length!=0){
			if(req.body.password!=""){
				if(bcrypt.compareSync(req.body.password, obj[0].password)){
				obj[0].buys=[];
				obj[0].carts=[];
				data = {
					login:true,
					data :obj[0]
				}
				res.json(data);
				}else{
				res.json(data);
				}
			}
			else{
				res.json(data);
			}
			
		}else{
			res.json(data);
		}
	})
})

app.post('/addCart',function(req,res){
	User.find({'username':req.body.username},function(err,obj){
		if(err)console.log(err);
		obj=obj[0];
		obj.carts.set(obj.carts.length,req.body.item);
		obj.markModified('Object');
		obj.save(function(err,result){
			if(err){
				console.log(err);
				res.send(false);
			} 
			res.send(true);
		});
	});
});
app.post('/api/deleteItem',function(req,res){
    User.find({'username':req.body.username},function(err,obj){
        if(err)console.log(err);
        obj= obj[0];
        obj.carts.splice(req.body.item, 1);
        obj.markModified('Object');
        obj.save();
        res.send(obj.carts);
    });
})
app.post('/register',function(req,res){
	User.find({'username':req.body.username},function(err,obj){
		if(err)console.log('It\'s error : ',err);
		if(obj.length == 0){
			var myPlaintextPassword = req.body.password;
			const saltRounds = 10;
			var salt = bcrypt.genSaltSync(saltRounds);
			var hash = bcrypt.hashSync(myPlaintextPassword, salt);
			var user = new User({
				username:req.body.username,
				password:hash,
				name:req.body.name,
				email:req.body.email,
				gender:req.body.gender,
				buys:[],
				carts:[],
			})
			user.save();
			res.send(true);
		}else{
			console.log('cannot register');
			res.send(false);
		}
	})


})

app.post('/recommend',function(req,res){
	Eval.findById(req.body._id,function(err,obj){
		if(err)console.log(err);
		if(obj.length!=0){
			item_id = obj.concat;
			temp = [];
			item_id.forEach( function(element, index) {
				// statements
				temp.push(element.id);
			});
			method1 = obj.cf_regression;
			method2 = obj.assrule_cf;
			method1.forEach( function(element, index) {
				// statements
				if(!temp.includes(element.id)){
					item_id.push(element);
				}
			});
			method2.forEach( function(element, index) {
				// statements
				if(!temp.includes(element.id)){
					item_id.push(element);
				}
			});
			json = {
				data:item_id
			};
			res.send(json);

		}else{
			///////////////// for store list of recommendation to Eval
		}
	})
})

// var method_cf = require('./server/method/cf-method');
// method_cf("58c40eee80c5000bb852bbf9",5);

//var regression = require('./server/method/linear-regression');
//example to create user
// var test = new User({
// 	username:"apiromz",
// 	password:"023799640",
// 	name:"Sam",
// 	gender:"male",
// 	buys: [],
// });

// test.save(function(err,obj){
// 	if(err)console.log(err);
// });

// Parsers for POST data
// store data
// data=
// data.forEach( function(element, index) {
	// statements
// 	var temp = new Item(element);
// 	temp.save();
// });


var ahp = require('./server/method/AHP');


// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

app.use(express.static(path.join(__dirname,'src')));

// Set our api routes
app.use('/api', api);


app.get('*', (req, res) => {
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