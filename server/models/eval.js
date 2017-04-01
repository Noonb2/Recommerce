var mongoose = require('mongoose');

module.exports = mongoose.model('Eval',{
	id:String,
	concat:Array,
	reAHP:Array,
	weight:Array,
	cf_regression:Array,
	assrule_cf:Array,
	eval_concat:{ 
		ndcg:{type:Number, default:0},
		div:{type:Number, default:0},
		novel:{type:Number, default:0},
	},
	eval_reAHP:{ 
		ndcg:{type:Number, default:0},
		div:{type:Number, default:0},
		novel:{type:Number, default:0},
	},
	eval_weight:{ 
		ndcg:{type:Number, default:0},
		div:{type:Number, default:0},
		novel:{type:Number, default:0},
	},
	eval_cf_regression:{ 
		ndcg:{type:Number, default:0},
		div:{type:Number, default:0},
		novel:{type:Number, default:0},
	},
	eval_assrule_cf:{ 
		ndcg:{type:Number, default:0},
		div:{type:Number, default:0},
		novel:{type:Number, default:0},
	},
});