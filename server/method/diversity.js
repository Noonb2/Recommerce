var diversity  = function(rank){
    var sum = 0;
    var R = rank.length;
    if(R <= 1){
        return 0;
    }
    rank.forEach(function(element,index) {
        if(index == 0){
            k = element.rate;
        }else{
            sum = sum + Math.sqrt(Math.pow(k-element.rate, 2))
        }
    });
    var div = (2/(R*(R-1)))*sum;

    return div;
}

module.exports = diversity;