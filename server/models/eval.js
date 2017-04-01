var mongoose = require('mongoose');

module.exports = mongoose.model('Eval',{
	id:String,
	concat:Array,
	reAHP:Array,
	weight:Array,
	cf_regression:Array,
	assrule_cf:Array,
	ndcg_concat:{ type: Number, default: 0 },
	ndcg_reAHP:{ type: Number, default: 0 },
	ndcg_weight:{ type: Number, default: 0 },
	ndcg_cf_regression:{ type: Number, default: 0 },
	ndcg_assrule_cf:{ type: Number, default: 0 },
});