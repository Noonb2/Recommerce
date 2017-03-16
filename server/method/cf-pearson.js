var item_AssRule = require('');
var User = require('../models/user');
var targetuser;
var _ = require('underscore');

var mathod = function(users, item_AssRule, targetuser){
    User.findById(tergetuser,function(err,obj){
         if(err) console.log(err);
         item_AssRule.find({}).where('count').gt(0).exec(function(err,obj){
             if(err)console.log(err);
               sets = restructureData(users, item_AssRule);
               sim = PearsonCorrelation(targetuser, sets, item_AssRule);
               item_list = findItemList(targetuser, item_AssRule, sets);
               predict = predictRate(item_list, sim, sets);
         })
     })
}

var restructureData = function(users, items){
    var res = [];
    for(var i in users){
        var temp = {};
        var avg = 0;
        temp['username'] = i['username'];
        for(var j in i['buys']){
            if(j['itemID'] in items) {
                avg = sum(j['rating'])/4;
                temp[j['itemID']] = avg;
            }
        } 
        res.push(temp);
    } 
    return res;
} 

var PearsonCorrelation = function(targetuser, sets, items){
    var similarityToTargetUser = [];
    var N = length(items);
    var sumX = 0;
    var sumXX = 0;
    var sumX2 = 0;
    for(var i in items){
        try{
            sumX = sumX + sets[targetuser][i];
            sumXX = sumXX + sets[targetuser][i] ** 2;
        } catch(err) {
            sumX = sumX + 0;
        }
    } sumX2 = sumX ** 2;
    for(var i in Range(length(sets))){
        if(i != targetuser) {
            var sumXY = 0;
            var sumY = 0;
            var sumYY = 0;
            var r = 0;
            for(var j in items){
                try{
                    sumY = sumY + sets[i][j];
                    sumYY = sumYY + sets[i][j] ** 2;
                    sumXY = sumXY + sets[targetuser][j] * sets[i][j];
                } catch(err){
                    sumXY = sumXY + 0;
                } sumY2 = sumY ** 2;
            }
            try{
                r = (N * sumXY - sumX * sumY) / math.sqrt((N * sumXX - sumX2) * (N * sumYY - sumY2));    
            } catch(err){
                r = -1000;
            }
            if(r != -1000){
                similarityToTargetUser.push((sets[i]['username'], r, i));
            }
        }
    }
    return similarityToTargetUser;
}

var findItemList = function(targetuser, items, sets){
    var item_rec = [];
    var temp;
    for( var i in items){
       try{
           temp = sets[targetuser][i];
       } catch(err){
           item_rec.push(i);
       }
    }
    return item_rec;
}

var predictRate = function(item_list, sim, sets){
    var rank = [];
    for(var i in item_list){
        var sum = 0;
        var count = 0;
        var t = 0;
        for(var j in sim){
            try{
                t = sets[j[2]][i] * j[1];
                sum = sum + sets[j[2]][i] * j[1];
                count = count + 1;
            } catch(err){
                sum = sum + 0;
            }
        }
        if(count != 0){
            rank.push((i, sum/count));
        }
    } 
    return rank;
}

module.exports = method;