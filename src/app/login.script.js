
$(document).ready(function(){

	// $('#login-menu').click(function(){
 //        console.log("logged in!")
 //        $('#myModal').modal('show');
 //    });
	
	$('#regsubmit').click(function(){
		setTimeout(function(){
			setTimeout(
			  function() 
			  {
			    if($('#message')[0].childNodes[1].className!="alert alert-warning"){
				$('#myModalSignIn').modal('hide');
				
			}
			  }, 1000);
		},500);
	});
	$('#loginsubmit').click(function(){
		setTimeout(function(){
			$('#loginmessage').fadeIn('400');
			setTimeout(
			  function() 
			  {
			    if($('#loginmessage')[0].childNodes[1].className!="alert alert-warning"){
					$('#myModalSignIn').modal('hide');
				}
			  }, 1000);
		},500);
	});
	$('#signOut').click(function(){
		$('#myModalSignOut').modal('hide');
	})
});
    
	


	

