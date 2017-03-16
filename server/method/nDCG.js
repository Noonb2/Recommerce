var nDCG = function(list){
    var sum = list[0][1];
    for(var i in Range(1,length(list))){
        sum = sum + (list[i][1]/Math.log2(i+1));
    }
    return sum;
}
