var mongoose = require('mongoose');

module.exports = mongoose.model('Eval',{
	id:String,
	concat:Array,
	reAHP:Array,
	weight:Array,
	cf_regression:Array,
	assrule_cf:Array,
	eval_concat:{ 
		ndcg_concat:{type:Number, default:0},
		div_concat:{type:Number, default:0},
		novel_concat:{type:Number, default:0},
	},
	eval_reAHP:{ 
		ndcg_concat:{type:Number, default:0},
		div_concat:{type:Number, default:0},
		novel_concat:{type:Number, default:0},
	},
	eval_weight:{ 
		ndcg_concat:{type:Number, default:0},
		div_concat:{type:Number, default:0},
		novel_concat:{type:Number, default:0},
	},
	eval_cf_regression:{ 
		ndcg_concat:{type:Number, default:0},
		div_concat:{type:Number, default:0},
		novel_concat:{type:Number, default:0},
	},
	eval_assrule_cf:{ 
		ndcg_concat:{type:Number, default:0},
		div_concat:{type:Number, default:0},
		novel_concat:{type:Number, default:0},
	},
});