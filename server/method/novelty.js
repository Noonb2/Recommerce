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
		sum = 0;
		count=0;
		temp.forEach(function(element,index){
			sum += element;
			count +=1;
		})
		res.push(sum/count);
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
	// console.log(i);
	avg_j = (j.myrate.overall+j.myrate.price+j.myrate.quality+j.myrate.design+j.myrate.sustainability)/5;
	if(i.count == 0){
		avg_i = i.rate;
	}
	else{
		avg_i = (
			i.rating[0].overall+
			i.rating[0].price+
			i.rating[0].quality+
			i.rating[0].design+
			i.rating[0].sustainability
		)
		avg_i = avg_i/((i.count)*5);
	}
	
	dis = Math.sqrt(Math.pow(avg_i-avg_j,2));
	return dis;
}
module.exports = main;