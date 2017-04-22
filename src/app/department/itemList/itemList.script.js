console.log("Add to cart");
$(document).ready(function () {
	console.log("hi");
  $('#filter').click(function(){
    console.log('filter click');
  })

  $('.owl-carousel').owlCarousel({
      loop:true,
        margin:10,
        responsiveClass:true,
        responsive:{
            0:{
                items:1,
                nav:true
            },
            600:{
                items:3,
                nav:false
            },
            1000:{
                items:5,
                nav:true,
                loop:false
            }
        }
  });
	// $('#scroll-top').click(function(){
	// 	console.log("hi pagination");
	// 	$("html, body").animate({scrollTop: 0}, 750);
	// })
  // console.log("Alert1");
  // $('#add-cart').click(function () {
  //   // var inputs = $(this).val();
  //   // if (inputs < 2) {
  //   //   swal('Not Valid', 'Enter another', 'warning');
  //   // }
  //   console.log("Alert2");
  //   swal("Good Choice!", "You confirm to add this product", "success");
  // });
});