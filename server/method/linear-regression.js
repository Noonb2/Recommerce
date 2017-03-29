var regression = require('regression');
var linear = require('linear-solve');


// var data = [[1,4],[1,4],[1,3],[1,4],[1,3],[2,3],[2,2],[2,4],[2,3],[2,2]];
// var result = regression('linear', data);
// var slope = result.equation[0];
// var yIntercept = result.equation[1];
// console.log(result);

console.log(linear.solve([[ 2, 2,8,8],[ 5,5,9,9],[0,0,0,0],[1,1,1,1]], [5, 7,0,1]))