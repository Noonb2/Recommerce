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
var Item = require('./server/models/item');


// Get our API routes
const api = require('./server/routes/api');
const app = express();

var options = {
  user: 'apiromz',
  pass: '023799640'
}
mongoose.connect('mongodb://apiromz:023799640@ds133348.mlab.com:33348/recommerce',{server:{auto_reconnect:true}});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.on('reconnected', function () {
console.log('MongoDB reconnected!');
});
db.on('disconnected', function() {
console.log('MongoDB disconnected!');
mongoose.connect('mongodb://apiromz:023799640@ds133348.mlab.com:33348/recommerce', {server:{auto_reconnect:true}});
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
// example to create user
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
// [{'rating': [{'quality': 0, 'design': 0, 'sustainability': 0, 'overall': 0, 'price': 0}], 'name': 'กระเป๋าเป้แฟชั่น รุ่น MJY สีขาว', 'category': 'bags', 'count': 0, 'price': 299, 'img': 'http://th-live-02.slatic.net/p/7/kraepaaepaefchan-run-mjy-siikhaaw-2693-92669811-a2674305db7f498b1fc574c257efc434-webp-catalog_233.jpg', 'department': 'men'}, {'rating': [{'quality': 0, 'design': 0, 'sustainability': 0, 'overall': 0, 'price': 0}], 'name': 'Peimm Modello Backpack กระเป๋าเป้สะพายหลัง กันน้ำ มัลติฟังก์ชั่น สไตส์เกาหลี(สีชมพู)', 'category': 'bags', 'count': 0, 'price': 590, 'img': 'http://th-live-01.slatic.net/p/8/peimm-modello-backpack-kraepaaepsaphaayhlang-kannam-maltifangkchan-saitsekaahlii-siichmphuu-3567-3701714-1-webp-catalog_233.jpg', 'department': 'men'}, {'rating': [{'quality': 0, 'design': 0, 'sustainability': 0, 'overall': 0, 'price': 0}], 'name': 'Following กระเป๋าเป้หนัง รุ่น JAA99B (สีดำ)', 'category': 'bags', 'count': 0, 'price': 960, 'img': 'http://th-live-02.slatic.net/p/7/following-kraepaaephnang-run-jaa99b-siidam-3152-8208414-1-webp-catalog_233.jpg', 'department': 'men'}, {'rating': [{'quality': 0, 'design': 0, 'sustainability': 0, 'overall': 0, 'price': 0}], 'name': 'MARINO กระเป๋าเป้สะพายหลัง รุ่น 370 (D.Blue)', 'category': 'bags', 'count': 0, 'price': 499, 'img': 'http://th-live-02.slatic.net/p/7/marino-kraepaaepsaphaayhlang-run-370-d-blue-9728-0756954-4ea348f3bb659286e0bd0d129a81a181-webp-catalog_233.jpg', 'department': 'men'}, {'rating': [{'quality': 0, 'design': 0, 'sustainability': 0, 'overall': 0, 'price': 0}], 'name': 'THREE-BOX กระเป๋าสะพายข้าง Retro Korean Style รุ่น 2330 (สีน้ำตาลเข้ม)', 'category': 'bags', 'count': 0, 'price': 849, 'img': 'http://th-live-03.slatic.net/p/7/three-box-kraepaasaphaaykhaang-retro-korean-style-run-2330-siinamtaalekhm-1259-18595501-e7b932d01c56687e3eb70e09ed80edb4-webp-catalog_233.jpg', 'department': 'men'}, {'rating': [{'quality': 0, 'design': 0, 'sustainability': 0, 'overall': 0, 'price': 0}], 'name': 'Durable Breathable Dumpling Letter Ladder Lock Canvas Chest Waist Messenger Bag', 'category': 'bags', 'count': 0, 'price': 279, 'img': 'http://th-live-03.slatic.net/p/7/durable-breathable-dumpling-letter-ladder-lock-canvas-chest-waist-messenger-bag-6282-1112828-66e6eb9b75760292db8926eca72e38b3-webp-catalog_233.jpg', 'department': 'men'}, {'rating': [{'quality': 0, 'design': 0, 'sustainability': 0, 'overall': 0, 'price': 0}], 'name': 'กระเป๋าสะพายไหล่ ทรงแมสเซนเจอร์ สีเทา - Mono bag grey color', 'category': 'bags', 'count': 0, 'price': 550, 'img': 'http://th-live-02.slatic.net/p/7/kraepaasaphaayaihl-thrngaemsechnecch-r-siiethaa-mono-bag-grey-color-6854-80924621-1527661ecc1b862810807cfed97947d8-webp-catalog_233.jpg', 'department': 'men'}, {'rating': [{'quality': 0, 'design': 0, 'sustainability': 0, 'overall': 0, 'price': 0}], 'name': 'KAKA กระเป๋าเป้อเนกประสงค์ Korean Style รุ่น 2188 (ฟ้าเข้ม)', 'category': 'bags', 'count': 0, 'price': 699, 'img': 'http://th-live-01.slatic.net/p/7/kaka-kraepaaep-enkprasngkh-korean-style-run-2188-faaekhm-2650-6346789-a31f159f8999c02bac328a74400660ea-webp-catalog_233.jpg', 'department': 'men'}, {'rating': [{'quality': 0, 'design': 0, 'sustainability': 0, 'overall': 0, 'price': 0}], 'name': 'กระเป๋าเป้ กระเป๋าสะพายหลังอเนกประสงค์ (สีน้ำตาล)', 'category': 'bags', 'count': 0, 'price': 560, 'img': 'http://th-live-01.slatic.net/p/7/kraepaaep-kraepaasaphaayhlang-enkprasngkh-siinamtaal-2165-53457501-04ff78eaa4b8befcae7f6024d99220e0-webp-catalog_233.jpg', 'department': 'men'}, {'rating': [{'quality': 0, 'design': 0, 'sustainability': 0, 'overall': 0, 'price': 0}], 'name': 'niceEshop Mens Multi-functional Outdoor Sports Chest Bag Pack - intl', 'category': 'bags', 'count': 0, 'price': 299, 'img': 'http://th-live-03.slatic.net/p/7/niceeshop-mens-multi-functional-outdoor-sports-chest-bag-pack-intl-7732-4522452-e6218ffcbd1a0fe3a9ca99a60bd2a559-webp-catalog_233.jpg', 'department': 'men'}, {'rating': [{'quality': 0, 'design': 0, 'sustainability': 0, 'overall': 0, 'price': 0}], 'name': 'Arctic Hunter กระเป๋าสะพายข้าง พาดลำตัวสีดำ ผู้ชาย รุ่นXB13005 กันน้ำ (สีดำ)', 'category': 'bags', 'count': 0, 'price': 699, 'img': 'http://th-live-01.slatic.net/p/7/arctic-hunter-kraepaasaphaaykhaang-phaadlamtawsiidam-phuuchaay-runxb13005-kannam-siidam-5069-99174201-196d4f36f33cbb55fa24b26cecf7a573-webp-catalog_233.jpg', 'department': 'men'}, {'rating': [{'quality': 0, 'design': 0, 'sustainability': 0, 'overall': 0, 'price': 0}], 'name': 'New LT39 กระเป๋าสะพายข้าง หนัง Crazy Horse PU สีน้ำตาลดำ กระเป๋าผู้ชาย(Int: One size)', 'category': 'bags', 'count': 0, 'price': 650, 'img': 'http://th-live-02.slatic.net/p/7/new-lt39-kraepaasaphaaykhaang-hnang-crazy-horse-pu-siinamtaaldam-kraepaaphuuchaay-int-one-size-6282-17836201-557cce064fb957be57fc0526d9a396aa-webp-catalog_233.jpg', 'department': 'men'}, {'rating': [{'quality': 0, 'design': 0, 'sustainability': 0, 'overall': 0, 'price': 0}], 'name': 'Trusty กระเป๋าสะพาย กระเป๋าหนัง รุ่น Videng Polo - สีกาแฟ', 'category': 'bags', 'count': 0, 'price': 859, 'img': 'http://th-live-03.slatic.net/p/7/trusty-kraepaasaphaay-kraepaahnang-run-videng-polo-siikaaaef-8276-3361453-caceec3da6b74bd21ca295ad11de7286-webp-catalog_233.jpg', 'department': 'men'}, {'rating': [{'quality': 0, 'design': 0, 'sustainability': 0, 'overall': 0, 'price': 0}], 'name': 'Leegoal Unisex Preppy Style Canvas Backpack Schoolbag (Army Green)', 'category': 'bags', 'count': 0, 'price': 509, 'img': 'http://th-live-01.slatic.net/p/7/leegoal-unisex-preppy-style-canvas-backpack-schoolbag-army-green-2513-7951549-d6df0d2084a3f41405770342273cc8fd-webp-catalog_233.jpg', 'department': 'men'}, {'rating': [{'quality': 0, 'design': 0, 'sustainability': 0, 'overall': 0, 'price': 0}], 'name': 'New Men`s Crossbody Bag Canvas Leisure Pocket Black', 'category': 'bags', 'count': 0, 'price': 360, 'img': 'http://th-live-03.slatic.net/p/7/new-men-s-crossbody-bag-canvas-leisure-pocket-black-2862-6327775-2ecde6295065a6a814a08664f7e32e08-webp-catalog_233.jpg', 'department': 'men'}, {'rating': [{'quality': 0, 'design': 0, 'sustainability': 0, 'overall': 0, 'price': 0}], 'name': 'Nifty Well กระเป๋าเป้สะพายหลัง Backpack กระเป๋าแฟชั่นรูปแมว สไตล์วัยรุ่นเกาหลี ผ้าแคนวาส ( สีน้ำเงิน )', 'category': 'bags', 'count': 0, 'price': 499, 'img': 'http://th-live-02.slatic.net/p/8/nifty-well-kraepaaepsaphaayhlang-backpack-kraepaaaefchanruupaemw-saitlwayrunekaahlii-phaaaekhnwaas-siinamengin-2857-9741453-ac5b66586573a6d456ce51637829447a-webp-catalog_233.jpg', 'department': 'men'}, {'rating': [{'quality': 0, 'design': 0, 'sustainability': 0, 'overall': 0, 'price': 0}], 'name': 'STAR CHEVRON SPEED BACKPACK', 'category': 'bags', 'count': 0, 'price': 890, 'img': 'http://th-live-01.slatic.net/p/7/star-chevron-speed-backpack-9908-69327011-7ee9cbea483e017668e34282c4d46a73-webp-catalog_233.jpg', 'department': 'men'}]

// data.forEach( function(element, index) {
// 	// statements
// 	var temp = new Item(element);
// 	temp.save();
// });



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