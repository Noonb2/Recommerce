// var Rule = require('../models/rules');
var User = require('../models/user');
var targetuser = { _id: '58c40eee80c5000bb852bbfc',
    name: 'U7',
    email: '1234',
    username: 'U7',
    password: '1234',
    cart: [],
    __v: 23,
    carts: [],
    buys:
    [ { _id: '58c5f897dde5ba2c38bb001b',
        myrate: {
                "design": 4,
                "overall": 3,
                "price": 2,
                "quality": 4,
                "sustainability": 4
            },
        category: 'apparels',
        name: 'MAp3',
        department: 'men' },
        { _id: '58c5f897dde5ba2c38bb002a',
        myrate: {
                "design": 3,
                "overall": 3,
                "price": 2,
                "quality": 3,
                "sustainability": 4
            },
        category: 'bags',
        name: 'MB2',
        department: 'men' },
        { _id: '58c5f897dde5ba2c38bb0013',
        myrate: {
                "design": 4,
                "overall": 3,
                "price": 2,
                "quality": 3,
                "sustainability": 3
            },
        category: 'shoes',
        name: 'MS1',
        department: 'men' },
        { _id: '58c5f897dde5ba2c38bb002b',
        myrate: {
                "design": 4,
                "overall": 3,
                "price": 3,
                "quality": 4,
                "sustainability": 3
            },
        category: 'mobile',
        name: 'Mo2',
        department: 'elec' },
        { _id: '58c5f897dde5ba2c38bb0023',
        myrate: {
                "design": 5,
                "overall": 3,
                "price": 3,
                "quality": 3,
                "sustainability": 3
            },
        category: 'livingroom',
        name: 'Liv3',
        department: 'Home' } 
    ] };
var Rule = [ { _id: '58c5f897dde5ba2c38bb0016',
    category: 'bathroom',
    department: 'home',
    name: 'Bath3',
    price: '200',
    count: 2,
    img: 'http://th-live-02.slatic.net/p/8/zazzy-dolls-aephkhkhuunaalikaa-chuue-1-aethm-1-run-zd-0112-rg-rg-siiphingokld-frii-taanghuuephchrcz-run-bg-e0006-5-cl-sudfrungfring-naalikaakh-muue-phuuhying-naalikaasaitlekaahlii-naalikaaaefchan-naalikaaekaahlii-naalikaaaephkhkhuu-6175-97266011-29f8dc7069fc4390b8f9fa2a28452eac-catalog_233.jpg',
    rating: [ {
            "overall": 6,
            "price": 5,
            "quality": 8,
            "design": 8,
            "sustainability": 4} ] },
  { _id: '58c5f897dde5ba2c38bb0024',
    category: 'apparels',
    department: 'men',
    name: 'MAp1',
    price: '200',
    count: 2,
    img: 'http://th-live-01.slatic.net/p/2/gadgets-guru-aihmpii-2017-2gb-16gb-s905x-quad-core-6-0-h-265-4k-tx5-pro-android-tv-box-ae-phduuhnang-b-l-kiilaa-kaartuun-chiiriiy-thiiwiidicchit-l-yuuthuup-efchbukh-aela-uuen-ekuue-b-70-ae-ph-hdmi-remote-adapter-khuumuue-tidtangaelaaichngaan-thaan-aaa-4-k-n-7236-15355301-8460ed3d5cce842bb498305dd1f1293a-catalog_233.jpg',
    rating: [ [{
            "overall": 8,
            "price": 9,
            "quality": 6,
            "design": 4,
            "sustainability": 8}] ] },
  { _id: '58c5f897dde5ba2c38bb0026',
    category: 'cameras',
    department: 'elec',
    name: 'Cam3',
    price: '200',
    count: 3,
    img: 'http://th-live-03.slatic.net/p/2/i-smart-mini-led-projecteur-800x480-pixels-1200-lumens-home-cinema-hdmi-usb-vga-av-runc6-black-7105-6677687-007d336af418656e1235f371135999ea-catalog_233.jpg',
    rating: [ [{
            "overall": 9,
            "price": 8,
            "quality": 13,
            "design": 11,
            "sustainability": 10}] ] }];

var method = function(users, item_AssRule, targetuser){
    User.findById(tergetuser,function(err,obj){
         if(err) console.log(err);
         Rule.find({}).where('coun').gt(0).exec(function(err,obj){
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
                avg = sum(j['rating'])/5;
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