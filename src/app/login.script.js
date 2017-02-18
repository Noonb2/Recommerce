console.log("Login Script");
$(document).ready(function(){

	// $('#login-menu').click(function(){
 //        console.log("logged in!")
 //        $('#myModal').modal('show');
 //    });
	
	$('#regsubmit').click(function(){
				$('#message').fadeIn('400');
				setTimeout(
				  function() 
				  {
				    $('#message').fadeOut('400');
				    if($('#myModal').hasClass('hidemodal')){
					$('#myModal').modal('hide');
				}
				  }, 1000);
				

		});
	$('#loginsubmit').click(function(){
					$('#loginmessage').fadeIn('400');
					setTimeout(
					  function() 
					  {
					    $('#loginmessage').fadeOut('400');
					    if($('#myModal').hasClass('hidemodal')){
						$('#myModal').modal('hide');
					}
					  }, 1000);
					

			});
});
    
	


	

