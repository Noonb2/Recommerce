console.log("Add to cart");
$(document).ready(function () {
  console.log("Alert1");
  $('#add-cart').click(function () {
    // var inputs = $(this).val();
    // if (inputs < 2) {
    //   swal('Not Valid', 'Enter another', 'warning');
    // }
    console.log("Alert2");
    swal("Good Choice!", "You confirm to add this product", "success");
  });
});