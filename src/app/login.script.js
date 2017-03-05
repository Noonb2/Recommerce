
$(document).ready(function(){
	$('#regsubmit').click(function(){
		var loops = setInterval(function(){
			if($('#message')[0].childNodes[1].className=="alert regis-success"){
				$('#myModalSignIn').modal('hide');
				clearInterval(loops);				
			}
		}, 250);
	});
	$('#loginsubmit').click(function(){
		var loops = setInterval(function(){
			if($('#loginmessage')[0].childNodes[1].className=="alert login-success"){
				$('#myModalSignIn').modal('hide');
				clearInterval(loops);
				
			}
		}, 250);
	});
	$('#signOut').click(function(){
		$('#myModalSignOut').modal('hide');
	})
});
    
	


	

