var regression = require('regression');

var data = [[0,4],[1,4],[2,3],[3,4],[4,3]];
var result = regression('linear', data);
var slope = result.equation[0];
var yIntercept = result.equation[1];
console.log(yIntercept);

