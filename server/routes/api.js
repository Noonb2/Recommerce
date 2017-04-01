const express = require('express');
const router = express.Router();
var User = require('../models/user');
var Item = require('../models/item');
var Eval = require('../models/eval');
var nDCG = require('../method/nDCG');
var diversity = require('../method/diversity');
var novelty = require('../method/novelty');
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


router.post('/rateRecommend',function(req,res){
    Eval.find({'id':req.body._id},function(err,obj){
        if(err)console.log(err);
        data = obj[0];
        // console.log(req.body.items);

        User.findById(req.body._id,function(err,obj){
            if(err)console.log(err)
            user = obj;
            updateData(data,data.assrule_cf,req.body.items,function(res){
                res.markModified('assrule_cf');
                res.save();
                res.eval_assrule_cf.ndcg = nDCG(res.assrule_cf);
                res.eval_assrule_cf.div = diversity(res.assrule_cf);
                res.eval_assrule_cf.novel = novelty(res.assrule_cf,user.buys);
                res.eval_assrule_cf.cov = res.assrule_cf.length;
                res.markModified('eval_assrule_cf');
                res.save();
            })
            updateData(data,data.cf_regression,req.body.items,function(res){
                res.markModified('cf_regression');
                res.save();
                res.eval_cf_regression.ndcg = nDCG(res.cf_regression);
                res.eval_cf_regression.div = diversity(res.cf_regression);
                res.eval_cf_regression.novel = novelty(res.cf_regression,user.buys);
                res.eval_cf_regression.cov = res.cf_regression.length;
                res.markModified('eval_cf_regression');
                res.save();
            })
            updateData(data,data.concat,req.body.items,function(res){
                res.markModified('concat');
                res.save();
                res.eval_concat.ndcg = nDCG(res.concat);
                res.eval_concat.div = diversity(res.concat);
                res.eval_concat.novel = novelty(res.concat,user.buys);
                res.eval_concat.cov = res.concat.length;
                res.markModified('eval_concat');
                res.save();
            })
            updateData(data,data.reAHP,req.body.items,function(res){
                res.markModified('reAHP');
                res.save();
                res.eval_reAHP.ndcg = nDCG(res.reAHP);
                res.eval_reAHP.div = diversity(res.reAHP);
                res.eval_reAHP.novel = novelty(res.reAHP,user.buys);
                res.eval_reAHP.cov = res.reAHP.length;
                res.markModified('eval_reAHP');
                res.save();
            })
            updateData(data,data.weight,req.body.items,function(res){
                res.markModified('weight');
                res.save();
                res.eval_weight.ndcg = nDCG(res.weight);
                res.eval_weight.div = diversity(res.weight);
                res.eval_weight.novel = novelty(res.weight,user.buys);
                res.eval_weight.cov = res.weight.length;
                res.markModified('eval_weight');
                res.save();
            })

            res.send(true);

        })
        

    })
})

function updateData(obj,list,data,callback){
    list.forEach(function(element1,index1){
        data.forEach(function(element2,index2){
            // console.log("e1 "+element1._id);
            // console.log("e2 "+element2._id);
            // console.log("check "+element1._id.equals(element2._id))
            if(element1._id.equals(element2._id)){
                list[index1].rate = element2.overall;
                // console.log(list[index1]);
            }
        })
    })
    // console.log(list);
    return callback(obj);

} 

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