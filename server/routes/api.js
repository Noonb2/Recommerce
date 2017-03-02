const express = require('express');
const router = express.Router();
var User = require('../models/user');
var Item = require('../models/item');
var mongoose = require('mongoose');
/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});


router.get('/itemlist/:department/:category',function(req,res){

    dep = req.params.department;
    cat = req.params.category;
    switch (dep) {
        case "Women's Fashion":
            // statements_1
            dep = "women";
            break;
        case "Men's Fashion":
            // statements_1
            dep = "men";
            break;
        case "Electronics":
            // statements_1
            dep = "elec";
            break;
        case "Home":
            // statements_1
            dep = "home";
            break;
        default:
            // statements_def
            break;
    }
    switch (cat) {
        case "TV & Home Theatre":
            // statements_1
            cat = "tv";
            break;
        case "Computers & Printers":
            // statements_1
            cat = "comp";
            break;
        case "Mobile Devices":
            // statements_1
            cat = "mobile";
            break;
        case "Living Room":
            // statements_1
            cat = "livingroom"
            break;
        default:
            // statements_def
            break;
    }
    Item.find({'department':dep,'category':cat},function(err,obj){
        if(err)concole.log(err);
        // console.log(obj);
        res.json(obj);
    })
 //    console.log(dep);
	// res.json(data);
})
// router.get('/test',function(req,res){
	
// 	res.json(test);
// })

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

        res.send(obj.carts);
    });
})

router.post('/rating',function(req,res){
    User.find({'username':req.body.username},function(err,obj){
        if(err)console.log(err);
        array = obj[0].buys;
        result= [];
        array.forEach( function(element, index) {
            // statements
            if(element.myrate==undefined){
                result.push(element);
            }
        });
        res.send(result);
    });
})

module.exports = router;