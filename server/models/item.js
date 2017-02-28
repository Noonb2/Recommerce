var mongoose = require('mongoose');

module.exports = mongoose.model('Item',{
	department:String,
	category:String,
	name:String,
	price:String,
	img:String,
	rating:[{
		overall:Number,
		price:Number,
		quality:Number,
		design:Number,
		sustainability:Number
	}],
	count:Number,

});