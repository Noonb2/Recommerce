
	$(document).ready(function(){
		$('#testbutton').click(function(){
				$('#message').fadeIn('400');
				setTimeout(
				  function() 
				  {
				    $('#message').fadeOut('400');
				
				  }, 1000);
				

		});
		$('#department-menu').click(function(){
			console.log("menu clicked")
			$('.department-containner').fadeToggle(500);
		});
		$('.sub-cat-menu').click(function(){
			
			$('.department-containner').fadeOut(500);
			$("html, body").animate({scrollTop: 0}, 750);
			});
		$('.menu-hamburger-open').click(function(){
			$('.menu-hamburger-open,#others').css('display','none');
			$('.menu-hamburger-close').css('display','block');
			$('#others').css('display','none');
			$('#mySidenav').css('width','250px');
			
			$('body').css('background','rgba(0,0,0,0.4)');
			$('body').css('overflow','hidden');
			// $('body').css('margin-left','250px');

			
		});
		$('.menu-hamburger-close,.closebtn,#sub-cat').click(function(){
			$('.menu-hamburger-close').css('display','none');
			$('.menu-hamburger-open,#others').css('display','block');
			$('#mySidenav').css('width','0');
			
			$('body').css('background','white');
			$('body').css('overflow','initial');
			// $('body').css('margin-left','0');

		});
		$(document).on("scroll",function(){
			
				if($(document).scrollTop()>100){

					$(".department-containner").fadeOut(500);
				} else{

				}
		});
		//  $('body').click(function(evt){
		//  		console.log($(event.target).attr('class'));
		//     	if($(event.target).attr('class')!="col-md-2 menu-navbar menu-hamburger-open" && $(event.target).attr('class')!="sidenav" && $(event.target).attr('class')!="glyphicon glyphicon-menu-hamburger"){
		// 			$('.menu-hamburger-close').css('display','none');
		// 			$('.menu-hamburger-open').css('display','block');
		// 			$('#mySidenav').css('width','0');
		// 			$('#main').css('margin-left','0');
		// 			$('body').css('background','white');
		// 		}
		// });
		// $('.closebtn').click(function(){
		// 	$('.menu-hamburger-close').css('display','none');
		// 	$('.menu-hamburger-open').css('display','block');
		// 	$('#mySidenav').css('width','0');
		// 	$('#main').css('margin-left','0');
		// 	$('body').css('background','white');
		// });
		var delay = 200;
		$('#women-menu').click(function(){
			
			$('#men').fadeOut(delay);
			$('#electronic').fadeOut(delay);
			$('#home').fadeOut(delay);
			$('#women').fadeToggle(delay);
		})
		$('#men-menu').click(function(){
			
			$('#women').fadeOut(delay);
			$('#electronic').fadeOut(delay);
			$('#home').fadeOut(delay);
			$('#men').fadeToggle(delay);
		})
		$('#elec-menu').click(function(){
			
			$('#men').fadeOut(delay);
			$('#women').fadeOut(delay);
			$('#home').fadeOut(delay);
			$('#electronic').fadeToggle(delay);
		})
		$('#home-menu').click(function(){
			
			$('#men').fadeOut(delay);
			$('#electronic').fadeOut(delay);
			$('#women').fadeOut(delay);
			$('#home').fadeToggle(delay);
		})
	})