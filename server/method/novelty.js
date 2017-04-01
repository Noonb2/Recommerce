var sortBy = require('sort-by');

var main = function(rank,buys){
	res = [];
	if(rank.length==0){
		return 0;
	}
	rank.forEach(function(i,index_i){
		temp = []
		buys.forEach(function(j,index_j){
			temp.push(distance(i,j));
		})
		temp.sort();
		res.push(temp[0]);
	})
	count = 0;
	sum = 0;
	res.forEach(function(element,index){
		sum = sum+element;
		count +=1;
	})

	return sum/count;
}

function distance(i,j){
	avg_j = (j.myrate.overall+j.myrate.price+j.myrate.quality+j.myrate.design+j.myrate.sustainability)/5;
	avg_i = i.rate;
	dis = Math.sqrt(Math.pow(avg_i-avg_j,2));
	return dis;
}
module.exports = main;