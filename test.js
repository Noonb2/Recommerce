var mongoose = require('mongoose');
var Rule = require('./server/models/rules');
var Item = require('./server/models/item');
var User = require('./server/models/user');
var connectionString = 'mongodb://apiromz:023799640@ds129050.mlab.com:29050/test_recommerce';
mongoose.connect(connectionString,{server:{auto_reconnect:true}});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.on('reconnected', function () {
console.log('MongoDB reconnected!');
});
db.on('disconnected', function() {
console.log('MongoDB disconnected!');
mongoose.connect(connectionString, {server:{auto_reconnect:true}});
});
db.once('open', function() {
  console.log("connection successful");
});
///////////////////


function getItem(callback){

	Rule.find({},function(err,obj){
    	if(err)console.log(err);
    	array = [];
    	find(obj,array,function(res){
    		console.log(res);
    		console.log(res.length);
    	})
    	// obj.forEach( function(element1, index1) {
     //    	// statements
     //    	User.findById("58c40eee80c5000bb852bbfc",function(err,obj1){
     //    		if(err)console.log(err);
     //    		obj1.buys.forEach( function(element2, index2) {
     //    			// statements
     //    			if(element1.r1.equals(element2._id)){
	    //         		array.push(element1.r2);
	    //     		}

     //    		});
     //    	})
    	// });
    
		// callback(array);    
    
    }) 
}
function find(obj,array,callback){

	obj.forEach( function(element1, index1) {
    	// statements
    	(function(){
		
		User.findById("58c40eee80c5000bb852bbfc",function(err,obj){
    		if(err)console.log(err);
    		obj.buys.forEach( function(element2, index2) {
    			// statements
    			if(element1.r1.equals(element2._id)){
            		array.push(element1.r2);
        		}

    		});
    		callback(array);
    	})

		
		})();
    	
	});
	
}
getItem(function(res){

});