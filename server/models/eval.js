var mongoose = require('mongoose');

module.exports = mongoose.model('Eval',{
	id:String,
	concat:Array,
	reAHP:Array,
	weight:Array,
	cf_regression:Array,
	assrule_cf:Array
});