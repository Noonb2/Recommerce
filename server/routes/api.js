const express = require('express');
const router = express.Router();

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});

data = [{
		name:"test1",
		description:"descript1",
		img:"wb1.png",
	},
	{
		name:"test2",
		description:"descript2",
		img:"wb2.png",
	},
	{
		name:"test3",
		description:"descript3",
		img:"wb3.png",
	},
	]
router.get('/itemlist',function(req,res){
	
	res.json(data);
})

router.get('/itemlist/:department/:category',function(req,res){
	console.log(req.params.department);
	console.log(req.params.category);
	res.json(data);
})

module.exports = router;