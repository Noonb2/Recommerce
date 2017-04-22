var Matrix = require('matrix-js'); 
var sortBy = require('sort-by');
var mongoose = require('mongoose');
var Rule = require('../models/rules');
var Item = require('../models/item');
var User = require('../models/user');



function findAVGUser(user){
    avgRating = {
        "overall":0,
        "price":0,
        "quality":0,
        "design":0,
        "sustainability":0
    }
    count = 0;
    user.buys.forEach( function(element, index) {
        // statements
        if(element.myrate!=undefined){
            avgRating.overall = avgRating.overall + element.myrate.overall;
            avgRating.price = avgRating.price + element.myrate.price;
            avgRating.quality = avgRating.quality + element.myrate.quality;
            avgRating.design = avgRating.design + element.myrate.design;
            avgRating.sustainability = avgRating.sustainability + element.myrate.sustainability;
            count = count+1;
        }
    });
    if(count!=0){
        avgRating.overall = avgRating.overall/count;
        avgRating.price = avgRating.price/count;
        avgRating.quality = avgRating.quality/count;
        avgRating.design = avgRating.design/count;
        avgRating.sustainability = avgRating.sustainability/count;
    }
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
    // console.log("weight_item : ",weight_item());
    // console.log("rank : ",rank);
    list = convertWeight(rank,rank.length);
    temp = []
    for(var i=0;i<list.length;i++){
        temp.push({
            '_id':item[i]._id,
            'name':item[i].name,
            'score':list[i],
            'count':item[i].count,
            'img':item[i].img,
            'rating':[{
                "overall":item[i].rating[0].overall,
                "price":item[i].rating[0].price,
                "quality":item[i].rating[0].quality,
                "design":item[i].rating[0].design,
                "sustainability":item[i].rating[0].sustainability
            }],
            'price':item[i].price

        })
    }
    temp = temp.sort(sortBy('-score'));
    return temp
}

var main = function (user,item_res,item_longtail){

    weight_user = Matrix(getWeightUser(user));
    // console.log(weight_user());
    weight_item = Matrix(getWeightItem(item_res));
    itemList = AHPranking(weight_user,weight_item,item_res);
    if(itemList.length>3){
        itemList = itemList.slice(0,3);
    }
    insertedItem = distance(item_res,item_longtail,5-itemList.length);

    // console.log('InsertedItem --> ', insertedItem);
    concate_list = concate(itemList,insertedItem);
    

    weight_reAHP = Matrix(getWeightItem(concate_list));
    reAHP_list = AHPranking(weight_user,weight_reAHP,concate_list);
    // console.log(reAHP_list);

    weight_list = weightList(concate_list,weight_user);
    // console.log(weight_list);

    list = [concate_list,reAHP_list,weight_list];
    return list;



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
            "img":item_longtail[i].img,
            "rating":[{
                "overall":item_longtail[i].rating[0].overall,
                "price":item_longtail[i].rating[0].price,
                "quality":item_longtail[i].rating[0].quality,
                "design":item_longtail[i].rating[0].design,
                "sustainability":item_longtail[i].rating[0].sustainability
            }],
            price:item_longtail[i].price
        });
    }
    matrix = matrix.sort(sortBy('-distance'));
    matrix = insertedItemNumber(matrix,num);
    return matrix;
}

function insertedItemNumber(data,num){
    list= [];
    index = Math.round(data.length/2);
    for(var i=index;i<index+num ;i++){
        list.push(data[i]);
    }
    // console.log(list);
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
            "img":concate_list[i].img,
            "rating":concate_list[i].rating,
            "weight_rate":rate,
            "price":concate_list[i].price
        })
    }
    wList = wList.sort(sortBy('-weight_rate'));
    return wList;
}

// main("58c40eee80c5000bb852bbfc");

module.exports = main;
