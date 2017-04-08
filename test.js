var linear = require('linear-solve');


mleft = [ [ 3, 5, 5, 3 ],[ 2, 5, 5, 4 ],[ 4, 5, 5, 1 ],[ 3,4,4, 3 ],[ 5, 5, 5, 3 ] ];

mright = [ 4,4,5,4,4 ];

aggregation_function = linear.solve(mleft,mright);

console.log(aggregation_function);

