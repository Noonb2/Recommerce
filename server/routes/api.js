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
        res.json(obj);
    })
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
        array.forEach( function(element, index) {
            // statements
            obj.buys.push(element);
        });
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
                element.myrate={
                    overall:0,
                    price:0,
                    quality:0,
                    design:0,
                    sustainability:0
                }
                result.push(element);
            }
        });
        res.send(result);
    });
})

router.post('/rateItem',function(req,res){
    User.find({'username':req.body.username},function(err,obj){
        if(err)console.log(err);
        obj = obj[0]
        items = req.body.items;
        obj.buys.forEach( function(element1, index1) {
            // statements
            items.forEach( function(element2, index2) {
                // statements
                if(element1._id == element2._id){
                    obj.buys[index1].myrate = element2.myrate;
                }
            });

        });
        obj.markModified('buys');
        obj.save(function(err,obj){

        });
        
    })
    req.body.items.forEach( function(element, index) {
        // statements
        Item.findById(element._id,function(err,obj){
            obj.count = obj.count+1;
            obj.rating[0].overall = obj.rating[0].overall + element.myrate.overall;
            obj.rating[0].price = obj.rating[0].price + element.myrate.price;
            obj.rating[0].quality = obj.rating[0].quality + element.myrate.quality;
            obj.rating[0].design = obj.rating[0].design + element.myrate.design;
            obj.rating[0].sustainability = obj.rating[0].sustainability + element.myrate.sustainability;
            obj.save(function(err,obj){
            
        });
        
        })
        
    });
    res.send(true);
})
module.exports = router;