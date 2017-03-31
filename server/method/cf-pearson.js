var User = require('../models/user');
var Rule = require('../models/rules-CF');
var Item = require('../models/item');
var sortBy = require('sort-by');

var method = function(targetuser,callback){
    User.find({},function(err,obj){
         if(err) console.log(err);
         users = obj;
         Rule.find({}, function(err,obj){
            if(err) console.log(err);
            rules = obj;
            // console.log(rules);
            Item.find({}, function(err,obj){
                if(err) console.log(err);
                items = obj;
                var assRules = []
                var temp = [];
                var t = 0;
                rules.forEach(function(element,index){
                    items.forEach(function(element2,index2){
                        if(element2._id.equals(element.r)){
                            if(!temp.includes(element2._id)){
                                temp.push(element2._id);
                                assRules.push(element2)
                            }
                        }
                    })
                })
                // console.log('Ass --> ', assRules);
                // console.log('\n')

                sets = restructureData(users, assRules);
                sets.forEach(function(element3,index3){
                    // console.log('userID --> ',element3._id,'\t','items --> ', element3.items)
                })
                // console.log('\n')

                sim = PearsonCorrelation(targetuser, sets, assRules);
                // console.log('Sim --> ', sim);
                // console.log('\n')

                item_list = findItemList(targetuser, assRules, sets);
                // console.log('item_list --> ', item_list);
                // console.log('\n')

                predict = predictRate(item_list, sim, sets);
                rank = predict.sort(sortBy('-rate'));
                // console.log(rank);
                res = []
                rank.forEach(function(element4,index4){
                    items.forEach(function(element5,index5){
                        if(element5._id.equals(element4.itemID)){
                            json = {
                                _id:element5._id,
                                category:element5.category,
                                department:element5.department,
                                name:element5.name,
                                price:element5.price,
                                count:element5.count,
                                img:element5.img,
                                rating:element5.rating,
                                score:element4.rate
                            }
                            res.push(json);
                        }
                    })
                })
                return callback(res);
                // console.log('Predict --> ', res);
                // console.log('\n')

                // nDCG = nDCG(rank);
                // console.log('nDCG --> ', nDCG);
    
            })
    
        })
    
     })
}

var restructureData = function(users, items){
    var res = [];
    users.forEach(function(element,index) {
        var temp = {};
        var avg = 0;
        temp._id = element._id;
        temp.items = [];

        element.buys.forEach(function(element2,index2){
            items.forEach(function(element3,index3) {
                if(element3._id.equals(element2._id)){
                    avg = (
                        element2.myrate.overall + 
                        element2.myrate.price +
                        element2.myrate.quality +
                        element2.myrate.design +
                        element2.myrate.sustainability)/5;
                    item_id = element3._id;
                    temp.items.push({'item_id':item_id, 'avgRate':avg});  
                };
            });
        })
        res.push(temp);
    }); 
    return res;
} 

var PearsonCorrelation = function(targetuser, sets, items){
    var similarityToTargetUser = [];
    var N = items.length;
    var sumX = 0;
    var sumXX = 0;
    var sumX2 = 0;
    var targetuser_obj;

    sets.forEach(function(element,index){
        if(element._id.equals(targetuser._id)){
            element.items.forEach(function(element2,index2){
                sumX = sumX + element2.avgRate;
                sumXX = sumXX + Math.pow(element2.avgRate, 2);
            })
            targetuser_obj = element;
            // console.log('targetuser_obj --> ', targetuser_obj);
            // console.log('\n')
        }
        else{
            sumX = sumX + 0;
        }
    })
    sumX2 = Math.pow(sumX, 2);
    
    sets.forEach(function(element2,index2){
        if(!element2._id.equals(targetuser._id)){
            var sumXY = 0;
            var sumY = 0;
            var sumYY = 0;
            var sumY2 = 0;
            var r = 0;
            // console.log('userID --> ',element2._id)
            element2.items.forEach(function(element3, index3){
                // console.log('avgRate --> ',element3.avgRate);
                sumY = sumY + element3.avgRate;
                sumYY = sumYY + Math.pow(element3.avgRate, 2);  
                targetuser_obj.items.forEach(function(element4,index4){
                    if(element4.item_id.equals(element3.item_id)){
                        // console.log('/// Equals ///')
                        sumXY = sumXY + (element4.avgRate * element3.avgRate);
                    }
                    else{
                        sumXY = sumXY + 0;
                    }
                })
            })
            sumY2 = Math.pow(sumY, 2);

            // console.log('(N:',N,'* sumXY:',sumXY,'- sumX:',sumX, '* sumY:', sumY,')')  
            // console.log('(N:',N,'* sumXX:',sumXX,'- sumX2:',sumX2,')*(','N:',N,'* sumYY:',sumYY,'- sumY2:',sumY2,')')
            // console.log('A --> ', (N * sumXY - sumX * sumY))
            // console.log('B --> ', (N * sumXX - sumX2))
            // console.log('C --> ', (N * sumYY - sumY2))
            // console.log('Math.sqrt --> ', Math.sqrt((N * sumXX - sumX2) * (N * sumYY - sumY2)))
         
            try{
               r = (N * sumXY - sumX * sumY) / Math.sqrt((N * sumXX - sumX2) * (N * sumYY - sumY2)); 
            //    console.log('R --> ',r)
            } catch(err){
               r = -1000; 
            //    console.log('R --> ', r)
            }  
            if(r != -1000){
                similarityToTargetUser.push({'userID': element2._id, 'sim': r, 'index': index2});
            }
            // console.log('\n')
        }
    })
    
    return similarityToTargetUser;
}

var findItemList = function(targetuser, items, sets){
    var item_rec = [];
    var temp = [];
    sets.forEach(function(element,index){
        if(element._id.equals(targetuser._id)){
            element.items.forEach(function(element2,index2){
                temp.push(element2.item_id);
            })
        }
    })
    items.forEach(function(element3,index3){
        if(!temp.includes(element3._id)){
            item_rec.push(element3._id);
        }
    })
    return item_rec;
}

var predictRate = function(item_list, sim, sets){
    var rank = [];
    item_list.forEach(function(element,index){
        var sum = 0;
        var count = 0;
        sim.forEach(function(element2,index2){
            sets.forEach(function(element3,index3){
                if(isNaN(element2.sim)==false && element2.userID.equals(element3._id)){
                    element3.items.forEach(function(element4,index4){
                        if(element4.item_id.equals(element)){
                            try{
                                sum = sum + element4.avgRate * element2.sim;
                                data = element3;
                                // console.log('item --> ', element)
                                // console.log('avgRate: ',element4.avgRate, '* sim: ',element2.sim, '--> ', element4.avgRate * element2.sim,'\t', 'Sum --> ', sum, '\n')
                                count = count + 1;
                            }
                            catch(err){
                                sum = sum + 0;
                            } 
                        }
                    })
                }
            })
            
        })
        if(count != 0){
            rank.push({'itemID':element, 'rate':sum/count})
        }
    })
    return rank;
}

var nDCG = function(rank){
    var sum = 0;
    rank.forEach(function(element,index){
        if(index == 0){
            sum = element.rate;
        }
        else{
            sum = sum+(element.rate/Math.log2(index+1))
        }
    })
    return sum;
}

module.exports = method;