const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
var flash    = require('connect-flash');
var passport = require('passport');
var bcrypt   = require('bcrypt-nodejs');
var cookieParser = require('cookie-parser')
var async = require('async');

var session = require('express-session');
var mongoose = require('mongoose');
var User = require('./server/models/user');
var Item = require('./server/models/item');
var Eval = require('./server/models/eval');
var method_cf = require('./server/method/cf-method');
var ahp = require('./server/method/AHP');
var moduleItem = require('./server/modules/get_item');
var cfpearson = require('./server/method/cf-pearson');

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
// method_cf("58de0cc5b4b8022420bd5617",5,function(result){
// 	// console.log(result);
// })

app.post('/recommend',function(req,res){
	Eval.findById(req.body._id,function(err,obj){
		if(err)console.log(err);
		if(obj!=undefined){
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
			moduleItem(req.body.id).then(function(list){
				targetUser = list[0];
				item_res = list[1];
				// console.log(item_res);
				item_longtail = list[2];
			// console.log(item_res);
			// ahp(targetUser,item_res,item_longtail);
				method_cf(req.body.id,5,function(result){
					cf_list = result;
					cfpearson(targetUser,function(list){
						cfpearson_list = list;
						if(item_res.length!=0){
						ahp_list = ahp(targetUser,item_res,item_longtail);
						concat_list = ahp_list[0];
						reAHP_list = ahp_list[1];
						weight_list = ahp_list[2];
						}
						else{
							concat_list = []
							reAHP_list = [];
							weight_list = [];
						}
						
						list = ahp_list[0].slice(0,ahp_list[0].length);
						temp = [];
						list.forEach( function(element, index) {
							// statements
							temp.push(element._id);
						});
						console.log("cf list : "+cf_list.length);
						console.log("cfpearson : "+cfpearson_list.length);
						console.log("list : "+list.length);

						list = addList(list,cf_list,temp);
						list = addList(list,cfpearson_list,temp);
						console.log("final list : "+list.length);
						var eval = new Eval({
							id:req.body.id,
							concat:concat_list,
							reAHP:reAHP_list,
							weight:weight_list,
							cf_regression:cf_list,
							assrule_cf:cfpearson_list
						});
						eval.save();
						json = {
							data:list
						}
						res.send(json);
					})
					

				});
			
				function addList(list,insertedList,temp){
					insertedList.forEach( function(element1, index1) {
						// statements
						var count = 0;
						temp.forEach( function(element2, index2) {
							// statements
							if(element1._id.equals(element2)){
								count = count+1;
							}

						});
						if(count==0){
							temp.push(element1._id);
							list.push(element1);
						}
					});
					return list;
				}
			// console.log(ahp_list);
			})

		}
	})
})






// var ahp = require('./server/method/AHP');
// moduleItem("58c40eee80c5000bb852bbf7").then(function(list){
// 	targetUser = list[0];
// 	item_res = list[1];
// 	// console.log(item_res.length)
// 	item_longtail = list[2];
// 	cfpearson(targetUser,function(res){
// 		console.log(res);
// 	})
// })


// var ahp = require('./server/method/AHP');

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