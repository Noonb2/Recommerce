const express = require('express');
const router = express.Router();

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});
router.get('/itemlist',function(req,res){
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
	res.json(data);
})
module.exports = router;