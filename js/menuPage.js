var login = false;
var cardDrawn = false;
var discountTaken = false;

// add enlarge hover effect on all .floating elements
function imgEnlarge() {
	setTimeout(function(){
		$('.floating').addClass('enlarge');
		$('.enlarge').hover(
		function(){
			$(this).css('cursor', 'pointer');
			// $(this).addClass('transition');
			$(this).css('transform', 'scale(1.1)');
			$(this).removeClass('floating');
		}, 
		function(){
			// $(this).removeClass('transition');
			$(this).addClass('floating');
		});
	}, 1000);
}

function getNews() {
	// get news info using ajax
	$.ajax({
		type: 'GET',
		url: 'https://imnight2018backend.ntu.im/sky/news/',
		xhrFields: {
            withCredentials: true
        },
        success: function(data) {
        	// data will be a list of objects: {title, url}
			for (i = 0; i < data.length; i++) {
				let item = '<li class="pl-3"><a href=\"' + data[i].url + '\">' + data[i].title + '</a></li>';
				$('#news').append(item);
			}
		}
	});
}

function getDrawn() {
	$.ajax({
		type: 'GET',
		url: 'https://imnight2018backend.ntu.im/accounts/check/daily/',
		xhrFields: {
            withCredentials: true
        },
        success: function(data) {
			cardDrawn = data.performer_drawn;
			discountTaken = data.voucher_drawn;
		}
	});	
}

function statusChangeCallback(response) {
	console.log('statusChangeCallback');
	console.log(response.authResponse);
	if (response.status === 'connected') {
		// alert('you\'ve logged in!!!');

		// if the user has logged in, check if he has drawn card or taken discount
		// then get news info
		// then remove log in modal
		getDrawn();
		getNews();
		$('#loginModal').remove();
		$('#remindModal').modal('toggle');
	}
	else {
		// alert('you\'ve not logged in!!!');
		$('#remindModal').remove();
		$('#loginModal').modal('toggle');

		$('#fb-btn').on('click', function(){
			FB.login(function(response) {
				// console.log(response);

				if (response.status === 'connected') {
					alert('you\'ve logged in!!!!!');
				}
				else {
					alert('you\'ve cancelled login.')
				}
			});
		});
	}
}

$(function(){
	$('.lazy').Lazy({
		effect: 'fadeIn',
		effectTime: 1000,
		threshold: 0,
        onError: function(element) {
            console.log('error loading ' + element.data('src'));
        }
	});

	// check if the user has logged in (at backend app)
	// $.ajax({
	// 	type: 'GET',
	// 	url: 'https://imnight2018backend.ntu.im/accounts/check/login/',
	// 	xhrFields: {
 //            withCredentials: true
 //        },
 //        success: function(data) {
	// 		login = data.auth_status;

	// 		// if the user has logged in, check if he has drawn card or taken discount
	// 		// then get news info
	// 		// then remove log in modal
	// 		if (login) {
	// 			getDrawn();
	// 			getNews();
	// 			$('#loginModal').remove();
	// 			$('#remindModal').modal('toggle');
	// 		}

	// 		// if the user hasn't logged in, remove remind modal
	// 		else {
	// 			$('#remindModal').remove();
	// 			$('#loginModal').modal('toggle');
	// 		}
	// 	},
	// 	error: function() {
	// 		alert('get login status fail!');
	// 	}
	// });	

	// check if the user has logged in (at facebook app)
	$.ajaxSetup({ cache: true });
	$.getScript('https://connect.facebook.net/en_US/sdk.js', function(){
	    FB.init({
	      appId      : '155420448490917',
	      cookie     : true,
	      xfbml      : true,
	      version    : 'v2.12'
	    });
	    FB.getLoginStatus(statusChangeCallback);
	});

	// FB.getLoginStatus(function(response) {
	//     statusChangeCallback(response);
	// });

	// check if the user has logged in
	// $.ajax({
	// 	type: 'GET',
	// 	url: 'https://imnight2018backend.ntu.im/accounts/check/login/',
	// 	xhrFields: {
 //            withCredentials: true
 //        },
 //        success: function(data) {
	// 		login = data.auth_status;

	// 		// if the user has logged in, check if he has drawn card or taken discount
	// 		// then get news info
	// 		// then remove log in modal
	// 		if (login) {
	// 			getDrawn();
	// 			getNews();
	// 			$('#loginModal').remove();
	// 			$('#remindModal').modal('toggle');
	// 		}

	// 		// if the user hasn't logged in, remove remind modal
	// 		else {
	// 			$('#remindModal').remove();
	// 			$('#loginModal').modal('toggle');

	// 			// 註冊fb-btn click event (ajax)
	// 			// $('#fb-btn').on('click', function() {
	// 			// 	$.ajax({
	// 			// 		type: 'GET',
	// 			// 		url: 'https://imnight2018backend.ntu.im/accounts/social/facebook/login/',
	// 			// 		xhrFields: {
	// 			// 			withCredentials: true
	// 			// 		},
	// 			// 		success: function(data) {
	// 			// 			console.log(data);
	// 			// 		}
	// 			// 	});
	// 			// });
	// 		}
	// 	},
	// 	error: function() {
	// 		alert('get login status fail!');
	// 	}
	// });

	$('#rule-title').fadeTo(1000, 0.7, 'swing', function() {
		$('#rule-space').show("blind", 800, function() {
			var h = $('body').height();
			$('#content-background').css('height', h);
		});
	});

})

var login_modal = new Vue({
	el: '#loginModal',
	data: {
		message: '',
		loggedIn: login
	}
})

var remind_modal = new Vue({
	el: '#remindModal',
	data: {
		message: '',
		loggedIn: login,
		drawnCard: cardDrawn,
		takenDiscount: discountTaken
	}
})
// alert('fuck');
imgEnlarge();
