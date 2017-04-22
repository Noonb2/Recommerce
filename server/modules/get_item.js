var mongoose = require('mongoose');
var Rule = require('../models/rules');
var Item = require('../models/item');
var User = require('../models/user');

var list = function(user_id,option){
	return new Promise(function(resolve,reject){
		User.findById(user_id,function(err,obj){
	    if(err)console.log(err);
	    user = obj;
        if(option=='buys'){
            userBuys = obj.buys;
        }else if(option=='carts'){
            userBuys = obj.carts;
        }
	    // userBuys = obj.buys;
	    list= [];
        temp = [];
        dep=[];
	    userBuys.forEach( function(element, index) {
	        // statements
	        list.push(mongoose.Types.ObjectId(element._id));
            temp.push(element._id);
            dep.push(element.department);

	    });
	    result = getItem(list,"rules",temp);
	    result.then(function(res){
	        itemRes = getItem(res,"item_res");
	        itemRes.then(function(result){
	           item_res = result;
               item_res.forEach(function(element,index){
                    list.push(element._id);
               })
               if(option!="carts"){
                    sex = "both";
                   if(dep.indexOf('woman')>0){
                        sex = "man";
                   }else if(dep.indexOf('man')>0){
                        sex="woman";
                   }else{
                        sex="both";
                   }
                   Item.find({
                        count:{
                            $gte:1,$lte:2
                        },
                        _id:{
                            $nin:list,
                        },
                        department:{
                            $ne:sex,
                        }
                   },function(err,obj){
                    if(err)console.log(err);
                    item_longtail = obj;
                    list=[user,item_res,item_longtail];
                    resolve(list);
                    
                   })
               }else{
                    list=[[],item_res,[]];
                    resolve(list);
               }
               
	        })
	    })
	   

	    })
	})
	
}

function getItem(list,option,temp){
    return new Promise(
        function(resolve,reject){
            if(option=="rules"){
               Rule.find({},function(err,obj){
                if(err)console.log(err);
                array = [];
                t=[];
                obj.forEach( function(element1, index1) {
                    // statements
                    list.forEach( function(element2, index2) {
                        // statements
                        id1 =element2;
                        id2 =element1.r1;
                        if(id1.equals(id2) && temp.indexOf(element1.r2.toString())<0 && t.indexOf(element1.r2.toString())<0 ){

                            array.push(element1.r2);
                            t.push(element1.r2.toString());
                        }
                    });
                    
                });
                resolve(array);
                }) 
            }
            else if(option=="item_res"){
                Item.find({},function(err,obj){
                if(err)console.log(err);
                array = [];
                obj.forEach( function(element1, index1) {
                    // statements
                    list.forEach( function(element2, index2) {
                        // statements
                        id1 =element2
                        id2 =element1._id;
                        if(id1.equals(id2)){
                            array.push(element1);
                        }
                    });
                    
                });
                resolve(array);
                }) 
            }
            
        }
    );
    
}

module.exports = list;
// console.log(list[0]);
// console.log(list[1]);
// console.log(list[2]);
