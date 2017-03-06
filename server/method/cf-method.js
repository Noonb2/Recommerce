var Item = require('../models/item');
var User = require('../models/user');
var regression = require('regression');

var method = function(targetUser_id,numList){
	User.findById(targetUser_id,function(err,obj){
		if(err) console.log(err);
		buys = obj.buys;
		avgRate = getAVGrate(buys);
		Item.find({}).where('count').gt(0).exec(function(err,obj){
			if(err)console.log(err);
			// console.log(obj);
			itemList = itemWithRate(obj);
			simList = getListSim(avgRate,itemList);
			rank = getRank(simList,numList);
			rank = predictRate(rank);
			console.log(rank);

		})
	})
	
}

function predictRate(rank){
	for (var i = 0; i < rank.length; i++) {
		predictrate = linear_regression(rank[i]);
		rank[i].prediction = predictrate; 
	}
	return rank
}

function linear_regression(object){
	var data = [
	[0,object.overall],
	[1,object.price],
	[2,object.quality],
	[3,object.design],
	[4,object.sustainability]];
	var result = regression('linear', data);
	var slope = result.equation[0];
	var yIntercept = result.equation[1];
	return yIntercept;
}
var getAVGrate = function(buys){
	var len = buys.length;
	var count = 0;
	var json = {
		'overall':0,
		'price':0,
		'quality':0,
		'design':0,
		'sustainability':0
	}
	for (var i = 0; i < len; i++) {
		if (buys[i].myrate != undefined){
			json.overall = json.overall + buys[i].myrate.overall;
			json.price = json.price + buys[i].myrate.price;
			json.quality = json.quality + buys[i].myrate.quality;
			json.design = json.design + buys[i].myrate.design;
			json.sustainability = json.sustainability + buys[i].myrate.sustainability;
			count = count +1;
		}
		
	}
	if (count!=0){
		json.overall = json.overall/count;
		json.price = json.price/count;
		json.quality = json.quality/count;
		json.design = json.design/count;
		json.sustainability = json.sustainability/count;
	}
	
	return json;
}

var itemWithRate = function(obj){
	

	var list = [];
	len = obj.length;
	for (var i = 0; i < len; i++) {
		var count = obj[i].count;
		var temp = {
			'_id' : "",
			'overall':0,
			'price':0,
			'quality':0,
			'design':0,
			'sustainability':0
		}
		temp._id = obj[i]._id;
		temp.overall = obj[i].rating[0].overall/count;
		temp.price = obj[i].rating[0].price/count;
		temp.quality = obj[i].rating[0].quality/count;
		temp.design = obj[i].rating[0].design/count;
		temp.sustainability = obj[i].rating[0].sustainability/count;
		list.push(temp);
	}
	return list;
}


var getListSim = function(a,b_obj){
	var list = [];
	for (var i = 0; i < b_obj.length; i++) {
		var temp = similarity(a,b_obj[i]);
		list.push(temp);
	}
	return list;
}
var similarity = function(a,b){
	var json={
		'_id':b._id,
		'similarity':0,
		'overall':b.overall,
		'price':b.price,
		'quality':b.quality,
		'design':b.design,
		'sustainability':b.sustainability
	}
	var dist = distance(a,b);
	var sim = 1/(1+dist);
	json.similarity = sim;
	return json;
}

function distance(a,b){
	var sum = 0 ;
	var overall = Math.pow(a.overall - b.overall,2);
	var price = Math.pow(a.price - b.price,2);
	var quality = Math.pow(a.quality - b.quality,2);
	var design = Math.pow(a.design - b.design,2);
	var sustainability = Math.pow(a.sustainability - b.sustainability,2);
	sum = overall + price + quality + design + sustainability;
	return Math.sqrt(sum)
}

function getRank(simList,numList){
	var list = []
	for (var i = 0; i < simList.length; i++) {
		var max = 0;
		var index = -1;
		for(var j = i;j<simList.length; j++) {
			if(simList[j].similarity>max){
				max = simList[j].similarity;
				index = j;
			}
		}
		list.push(simList[index]);
		numList = numList-1;
		if(numList==0){
			break;
		}
		simList.splice(index,1);
		max = 0;
	}
	return list;
}
module.exports = method;