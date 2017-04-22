var mongoose = require('mongoose');
var schema = mongoose.Schema({
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
})

schema.index({name:'text'})

module.exports = mongoose.model('Item',schema);