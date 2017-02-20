const express = require('express');
const router = express.Router();
var User = require('../models/user');
var mongoose = require('mongoose');
/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

data = [{
		name:"test1",
		description:"descript1",
		img:"wb1.png",
	},
	{
		name:"test2",
		description:"descript2",
		img:"wb2.png",
	},
	{
		name:"test3",
		description:"descript3",
		img:"wb3.png",
	},
	]
test=[
    {
        "name": "../../img/women/bags/wb1.png"
    },
    {
        "name": "../../img/women/bags/wb2.png"
    },
    {
        "name": "../../img/women/bags/wb3.png"
    },
    {
        "name": "../../img/women/bags/wb4.png"
    },
    {
        "name": "../../img/women/bags/wb5.png"
    },
    {
        "name": "../../img/women/bags/wb6.png"
    },
    {
        "name": "../../img/women/bags/wb7.png"
    },
    {
        "name": "../../img/women/bags/wb8.png"
    },
    {
        "name": "../../img/women/bags/wb9.png"
    },
    {
        "name": "../../img/women/bags/wb10.png"
    },
    {
        "name": "../../img/women/bags/wb11.png"
    },
    {
        "name": "../../img/women/bags/wb12.png"
    },
    {
        "name": "../../img/women/bags/wb13.png"
    },
    {
        "name": "../../img/women/bags/wb14.png"
    },
    {
        "name": "../../img/women/bags/wb15.png"
    },
    {
        "name": "../../img/women/bags/wb16.png"
    },
    {
        "name": "../../img/women/bags/wb17.png"
    },
    {
        "name": "../../img/women/bags/wb18.png"
    },
    {
        "name": "../../img/women/bags/wb19.png"
    },
    {
        "name": "../../img/women/bags/wb20.png"
    },
    {
        "name": "../../img/women/bags/wb21.png"
    },
    {
        "name": "../../img/women/bags/wb22.png"
    },
    {
        "name": "../../img/women/bags/wb23.png"
    },
    {
        "name": "../../img/women/bags/wb24.png"
    },
    {
        "name": "../../img/women/bags/wb25.png"
    },
    {
        "name": "../../img/women/bags/wb26.png"
    },
    {
        "name": "../../img/women/bags/wb27.png"
    },
    {
        "name": "../../img/women/bags/wb28.png"
    },
    {
        "name": "../../img/women/bags/wb29.png"
    },
    {
        "name": "../../img/women/bags/wb30.png"
    },
    {
        "name": "../../img/women/bags/wb31.png"
    },
    {
        "name": "../../img/women/bags/wb32.png"
    },
    {
        "name": "../../img/women/bags/wb33.png"
    },
    {
        "name": "../../img/women/bags/wb34.png"
    },
    {
        "name": "../../img/women/bags/wb35.png"
    },
];
router.get('/itemlist',function(req,res){
	
	res.json(data);
})

router.get('/itemlist/:department/:category',function(req,res){

	res.json(data);
})
router.get('/test',function(req,res){
	
	res.json(test);
})

router.post('/myCarts',function(req,res){
    User.find({'username':req.body.username},function(err,obj){
        if(err)console.log(err);
        res.send(obj[0].carts);
    });
})
router.post('/checkout',function(req,res){

    User.find({'username':req.body.username},function(err,obj){
        if(err)console.log(err);
        obj = obj[0];
        array = req.body.item;
        console.log(array);
        array.forEach( function(element, index) {
            // statements
            obj.buys.push(element);
        });
        // array.forEach( function(element, index) {
        //     // statements
        //     obj.carts.obj.carts.splice(index, 1);
        // });
        obj.carts=[];
        obj.save();
        console.log(obj);
        res.send(obj.carts);
    });
})

module.exports = router;