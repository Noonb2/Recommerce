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

module.exports = nDCG;