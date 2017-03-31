var mongoose = require('mongoose');
var Item = require('../models/item');
var User = require('../models/user');
var regression = require('regression');
var sortBy = require('sort-by');
var linear = require('linear-solve');
var method = function(targetUser_id,numList,callback){
	User.findById(targetUser_id,function(err,obj){
		if(err) console.log(err);
		buys = obj.buys;
		targetUser = obj;
		Id_buys = [];
		buys.forEach( function(element, index) {
			// statements
			Id_buys.push(mongoose.Types.ObjectId(element._id));
		});
		avgRate = getAVGrate(buys);
		// console.log(Id_buys);
		_id = mongoose.Types.ObjectId(targetUser_id);
		User.find({
				_id:{
					$ne:_id
				},
				buys:{
					$elemMatch:{
						_id:{	$in:Id_buys }
					}
				}
			},function(err,obj){
				if(err)console.log(err);
				neighbor = obj;
				if(neighbor.length!=0){
					index_neighbor = similarityUser(targetUser,neighbor)[0].user;
					rank = predictItem(targetUser,neighbor[index_neighbor]);
				}else{
					rank = [];
				}
				return callback(rank);


		})
		// Item.find({}).where('count').ne("0").where('_id').nin(Id_buys).exec(function(err,obj){
		// 	if(err)console.log(err);
		// 	itemList = itemWithRate(obj);
		// 	simList = getListSim(avgRate,itemList);
		// 	rank = getRank(simList,numList);
		// 	rank = predictRate(rank);
		// 	rank = rank.sort(sortBy('-prediction'));
		// 	return callback(rank);

		// })
	})
	
}
function similarityUser(target,users){
	var sim_neighbor = [];
	users.forEach( function(user, number) {
		// statements
		user.buys.forEach( function(itemUser, indexUser) {
			// statements
			var sim = 0;
			var count = 0;
			target.buys.forEach( function(itemTarget, indexTarget) {
				// statements
				
				if(itemUser._id.equals(itemTarget._id)){
					sim += similarityItem(itemUser,itemTarget);
					count += 1;
				}
			});

			if(count>0){
				json = {
					user:number,
					similarity:sim/count
				}
				sim_neighbor.push(json);
			}

		});

	});
	sim_neighbor.sort(sortBy('-similarity'));
	return sim_neighbor;
}


function similarityItem(a,b){
	var sum = 0 ;
	var overall = Math.pow(a.myrate.overall - b.myrate.overall,2);
	var price = Math.pow(a.myrate.price - b.myrate.price,2);
	var quality = Math.pow(a.myrate.quality - b.myrate.quality,2);
	var design = Math.pow(a.myrate.design - b.myrate.design,2);
	var sustainability = Math.pow(a.myrate.sustainability - b.myrate.sustainability,2);
	sum = overall + price + quality + design + sustainability;
	dist = Math.sqrt(sum);
	sim = 1/(1+dist);
	return sim;
}

function predictItem(targetUser,neighbor){
	list = []
	matrixLeft = [];
	matrixRight = [];
	neighbor.buys.forEach( function(element, index) {
		// statements
		matrixLeft.push([element.myrate.price,element.myrate.quality,element.myrate.design,element.myrate.sustainability]);
		matrixRight.push(element.myrate.overall);
	});
	
	aggregation_function = linear.solve(matrixLeft,matrixRight);
	// console.log(aggregation_function);
	neighbor.buys.forEach( function(itemNeighbor, index) {
		// statements
		var check = 0;

		targetUser.buys.forEach( function(itemTarget, index) {
			// statements
			if(itemNeighbor._id.equals(itemTarget._id)){
				// console.log('have');
				check += 1;
				
			}
		});
		if(check ==0){
			// predictrate = linearRegression(itemNeighbor);
			predictrate = itemNeighbor.myrate.price*aggregation_function[0]+
						itemNeighbor.myrate.quality*aggregation_function[1]+
						itemNeighbor.myrate.design*aggregation_function[2]+
						itemNeighbor.myrate.sustainability*aggregation_function[3]
			itemNeighbor.predictRate = predictrate;
			list.push(itemNeighbor);
		}
	});
	list.sort(sortBy('-predictRate'));
	return list;
}
function predictRate(rank){
	for (var i = 0; i < rank.length; i++) {
		predictrate = linear_regression(rank[i]);
		rank[i].prediction = predictrate; 
	}
	return rank
}

function linearRegression(object){
	var data = [
	[0,object.myrate.overall],
	[1,object.myrate.price],
	[2,object.myrate.quality],
	[3,object.myrate.design],
	[4,object.myrate.sustainability]];
	var result = regression('linear', data);
	var slope = result.equation[0];
	var yIntercept = result.equation[1];
	return yIntercept;
}
function linear_regression(object){
	var data = [
	[0,object.rating.overall],
	[1,object.rating.price],
	[2,object.rating.quality],
	[3,object.rating.design],
	[4,object.rating.sustainability]];
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
			'name':obj[i].name,
			'img':obj[i].img,
			'price':obj[i].price,
			'rating':{
				'overall':0,
				'price':0,
				'quality':0,
				'design':0,
				'sustainability':0
			}
			
		}
		temp._id = obj[i]._id;
		temp.rating.overall = obj[i].rating[0].overall/count;
		temp.rating.price = obj[i].rating[0].price/count;
		temp.rating.quality = obj[i].rating[0].quality/count;
		temp.rating.design = obj[i].rating[0].design/count;
		temp.rating.sustainability = obj[i].rating[0].sustainability/count;
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
		'name':b.name,
		'img':b.img,
		'price':b.price,
		'similarity':0,
		'rating':{
			'overall':b.rating.overall,
			'price':b.rating.price,
			'quality':b.rating.quality,
			'design':b.rating.design,
			'sustainability':b.rating.sustainability
		}
		
	}
	var dist = distance(a,b);
	var sim = 1/(1+dist);
	json.similarity = sim;
	return json;
}

function distance(a,b){
	var sum = 0 ;
	var overall = Math.pow(a.overall - b.rating.overall,2);
	var price = Math.pow(a.price - b.rating.price,2);
	var quality = Math.pow(a.quality - b.rating.quality,2);
	var design = Math.pow(a.design - b.rating.design,2);
	var sustainability = Math.pow(a.sustainability - b.rating.sustainability,2);
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