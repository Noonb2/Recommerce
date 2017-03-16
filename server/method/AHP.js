var Matrix = require('matrix-js'); 
var sortBy = require('sort-by');
var mongoose = require('mongoose');
var Rule = require('../models/rules');
var Item = require('../models/item');
var User = require('../models/user');


function getItem(list,option){
    return new Promise(
        function(resolve,reject){
            if(option=="rules"){
               Rule.find({},function(err,obj){
                if(err)console.log(err);
                array = [];
                obj.forEach( function(element1, index1) {
                    // statements
                    list.forEach( function(element2, index2) {
                        // statements
                        id1 =element2
                        id2 =element1.r1;
                        if(id1.equals(id2)){
                            array.push(element1.r2);
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
function findAVGUser(user){
    avgRating = {
        "overall":0,
        "price":0,
        "quality":0,
        "design":0,
        "sustainability":0
    }

    user.buys.forEach( function(element, index) {
        // statements
        avgRating.overall = avgRating.overall + element.myrate.overall;
        avgRating.price = avgRating.price + element.myrate.price;
        avgRating.quality = avgRating.quality + element.myrate.quality;
        avgRating.design = avgRating.design + element.myrate.design;
        avgRating.sustainability = avgRating.sustainability + element.myrate.sustainability;

    });
    avgRating.overall = avgRating.overall/user.buys.length;
    avgRating.price = avgRating.price/user.buys.length;
    avgRating.quality = avgRating.quality/user.buys.length;
    avgRating.design = avgRating.design/user.buys.length;
    avgRating.sustainability = avgRating.sustainability/user.buys.length;
    return avgRating;
}

function AHPweightMatrix(array){
    
    matrix = [];
    for( var i = 0;i<array.length;i++){
        matrix.push([]);
        for(var j = 0;j<array.length;j++){
            matrix[i].push(array[i]/array[j]);
        }

    }
    weight = getWeight(matrix,array.length);
    return weight;
}

function getWeight(compareMatrix,len){
    var compareMatrix = Matrix(compareMatrix);
    pow_matrix = Matrix(compareMatrix.prod(compareMatrix));
    

    matrix_one_row = Matrix(createMatrix_row(1,len));
    matrix_one_column = Matrix(createMatrix_col(1,len));
    sum_matrix = Matrix(pow_matrix.prod(matrix_one_row));
    sum_matrix = Matrix(sum_matrix([],0));
    sum_all = Matrix(matrix_one_column.prod(sum_matrix));
    sum_all = Matrix(createMatrix_row(sum_all([],0)[0],len));
    weight = sum_matrix.div(sum_all);
    return weight;
}

function createMatrix_row(data,len){
    temp = [];
    for(var i = 0 ;i<len;i++){
        temp.push([data]);
    }
    return temp;
}

function createMatrix_col(data,len){
    temp = [];
    for(var i = 0 ;i<len;i++){
        temp.push(data);
    }
    list = [];
    list.push(temp)
    return list;
}

function getWeightUser(user){
    object = findAVGUser(user);
    array = [object.overall,object.price,object.quality,object.design,object.sustainability];
    weight = AHPweightMatrix(array);
    return weight;
}

function convertWeight(weight,len){
    res = [];
    for(var i=0;i<len;i++){
        res.push(weight[i][0]);
    }
    return res;
}

function getWeightItem(item){
    overall = [];
    price = [];
    quality = [];
    design = [];
    sustainability = [];
    for(var i = 0;i<item.length;i++){
        overall.push(item[i].rating[0].overall/item[i].count);
        price.push(item[i].rating[0].price/item[i].count);
        quality.push(item[i].rating[0].quality/item[i].count);
        design.push(item[i].rating[0].design/item[i].count);
        sustainability.push(item[i].rating[0].sustainability/item[i].count);
    }
    overall = convertWeight(AHPweightMatrix(overall),item.length);
    price = convertWeight(AHPweightMatrix(price),item.length);
    quality = convertWeight(AHPweightMatrix(quality),item.length);
    design = convertWeight(AHPweightMatrix(design),item.length);
    sustainability = convertWeight(AHPweightMatrix(sustainability),item.length);
    weight_item = []
    for (var i =0;i<item.length;i++){
        weight_item.push([overall[i],price[i],quality[i],design[i],sustainability[i]]);
    }
    return weight_item;
}

function AHPranking(weight_user,weight_item,item){
    rank = Matrix(weight_item.prod(weight_user));
    rank = rank([],0);
    list = convertWeight(rank,rank.length);
    temp = []
    for(var i=0;i<list.length;i++){
        temp.push({
            '_id':item[i]._id,
            'name':item[i].name,
            'score':list[i],
            'count':item[i].count,
            'rating':[{
                "overall":item[i].rating[0].overall,
                "price":item[i].rating[0].price,
                "quality":item[i].rating[0].quality,
                "design":item[i].rating[0].design,
                "sustainability":item[i].rating[0].sustainability
            }]

        })
    }
    temp = temp.sort(sortBy('-score'));
    return temp
}

var main = function (user_id){

    User.findById(user_id,function(err,obj){
    if(err)console.log(err);
    user = obj;
    userBuys = obj.buys;
    list= [];
    userBuys.forEach( function(element, index) {
        // statements
        list.push(element._id);

    });
    result = getItem(list,"rules");
    result.then(function(res){
        itemRes = getItem(res,"item_res");
        itemRes.then(function(result){
           item_res = result;
           Item.find({}).where('count').eq(1).exec(function(err,obj){
            if(err)console.log(err);
            item_longtail = obj;
            weight_user = Matrix(getWeightUser(user));
            weight_item = Matrix(getWeightItem(item_res));
            itemList = AHPranking(weight_user,weight_item,item_res);
            insertedItem = distance(item_res,item_longtail,3);

            concate_list = concate(itemList,insertedItem);
            console.log(concate_list);

            weight_reAHP = Matrix(getWeightItem(concate_list));
            reAHP_list = AHPranking(weight_user,weight_reAHP,concate_list);
            console.log(reAHP_list);

            weight_list = weightList(concate_list,weight_user);
            console.log(weight_list);
           })
        })
    })
   

    })
    

}

function disimilarity(item_res,item_longtail){
    matrix1 = Matrix([item_res]);
    matrix2 = Matrix(Matrix([item_longtail]).trans());
    top = Matrix(matrix1.prod(matrix2))([],0)[0][0];
    matrix1_pow = Matrix(Matrix(matrix1.prod(Matrix(matrix1.trans())))([],0));
    matrix2_pow = Matrix(Matrix(Matrix(Matrix(matrix2.trans()).prod(matrix2))([],0)).trans());
    bottom = matrix1_pow.prod(matrix2_pow)[0][0];
    bottom = Math.sqrt(bottom);
    res = top/bottom;
    res = 1-res;
    return res;

}

function distance(item_res,item_longtail,num){
    matrix = [];
    for (var i =0;i<item_longtail.length;i++){
        sum = 0;
        for(var j=0;j<item_res.length;j++){
            count_res = item_res[j].count;
            count_longtail = item_longtail[i].count;
            array_item_res = [
            item_res[j].rating[0].overall/count_res,
            item_res[j].rating[0].price/count_res,
            item_res[j].rating[0].quality/count_res,
            item_res[j].rating[0].design/count_res,
            item_res[j].rating[0].sustainability/count_res
            ];
            array_item_longtail = [
            item_longtail[i].rating[0].overall/count_longtail,
            item_longtail[i].rating[0].price/count_longtail,
            item_longtail[i].rating[0].quality/count_longtail,
            item_longtail[i].rating[0].design/count_longtail,
            item_longtail[i].rating[0].sustainability/count_longtail,
            ]
            dist = disimilarity(array_item_res,array_item_longtail);
            sum = sum+dist;
        }
        sum = sum/array_item_res.length;
        matrix.push({
            "_id":item_longtail[i]._id,
            "name":item_longtail[i].name,
            "distance":sum,
            "count":item_longtail[i].count,
            "rating":[{
                "overall":item_longtail[i].rating[0].overall,
                "price":item_longtail[i].rating[0].price,
                "quality":item_longtail[i].rating[0].quality,
                "design":item_longtail[i].rating[0].design,
                "sustainability":item_longtail[i].rating[0].sustainability
            }]
        });
    }
    matrix = matrix.sort(sortBy('-distance'));
    matrix = insertedItemNumber(matrix,num);
    return matrix;
}

function insertedItemNumber(data,num){
    list= [];
    for(var i=0;i<num;i++){
        list.push(data[i]);
    }
    return list;
}





function concate(itemList,insertedItem){
    for(var i =0;i<insertedItem.length;i++){
        itemList.push(insertedItem[i]);
    }
    return itemList;
}
function weightList(concate_list,weight_user){
    wList = [];
    for(var i=0;i<concate_list.length;i++){
        count = concate_list[i].count;
        rating = [
        concate_list[i].rating[0].overall/count,
        concate_list[i].rating[0].price/count,
        concate_list[i].rating[0].quality/count,
        concate_list[i].rating[0].design/count,
        concate_list[i].rating[0].sustainability/count
        ];

        rating= Matrix([rating]);
        rate = Matrix(rating.prod(weight_user))([],0)[0][0];
        wList.push({
            "_id":concate_list[i]._id,
            "name":concate_list[i].name,
            "count":concate_list[i].count,
            "rating":concate_list[i].rating,
            "weight_rate":rate
        })
    }
    wList = wList.sort(sortBy('-weight_rate'));
    return wList;
}

main("58c40eee80c5000bb852bbfc");

module.exports = main;
