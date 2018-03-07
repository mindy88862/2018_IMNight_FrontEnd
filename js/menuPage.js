var login = false;
var cardDrawn = false;
var discountTaken = false;

// declare vue objects
var remind_modal = new Vue({
	el: '#remindModal',
	data: {
		message: '',
		drawnCard: false,
		takenDiscount: false
	}
})

var card = new Vue({
	el: "#card",
	data:{
		title:"副召",
		name:"陳漢威",
		work:"work at home",
		intro:"人稱花蓮王",
		img:"https://scontent-tpe1-1.xx.fbcdn.net/v/t1.0-9/15590541_1356940990991726_7189281157210729010_n.jpg?oh=8eb3d7c7e8aa9659f2a308bfc32195a1&oe=5B4981FD"
		// img: "https://i.imgur.com/67A5cyq.jpg"
	}
});

var coupon = new Vue({
	el: "#coupon",
	data:{
		name:"季丼屋",
		content:"海苔溫玉牛丼(大) 9折",
		deadline:"2018年02月14號",
		img:"http://pic.gomaji.com/products/588/160588/160588_4_r.jpg?1501638246"
	}
})

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
			remind_modal.drawnCard = data.performer_drawn;
			remind_modal.takenDiscount = data.voucher_drawn;
		}
	});	
}

// if the user has logged in, check if he has drawn card or taken discount
// then get news info
function is_login_init() {
	// change navbar description

	var username="使用者", point = 0;
	$.ajax({
		type: 'GET',
		url: 'https://imnight2018backend.ntu.im/human/user/self/',
		xhrFields: {
            withCredentials: true
        },
        success: function(result) {
			console.log(result.username);
			username = result.username;
			point = result.profile.point;
			$('#login-text').html('<span>'+username+'，又見面了，您目前累積'+point+'點</span>');
		}
	});

	getDrawn();
	getNews();

	$('#loginModal').remove();
	$('#remindModal').modal('toggle');
}

function draw_card() {
	$.ajax({
		type: 'GET',
		url: 'https://imnight2018backend.ntu.im/human/daily/',
		xhrFields: {
            withCredentials: true
        },
        success: function(result) {
			console.log('draw card result:');
			console.log(result);
		}
	});	

	// TODO
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// get csrftoken
var csrftoken = getCookie('csrftoken');

function draw_coupon() {
	$.ajax({
		type: 'GET',
		url: 'https://imnight2018backend.ntu.im/earth/daily/',
		xhrFields: {
            withCredentials: true
        },
        success: function(result) {
			console.log('draw coupon result:');
			console.log(result);
		}
	});

	// TODO
	$.ajax({
		type: 'post',
		url: 'https://imnight2018backend.ntu.im/earth/use/vocher/',
		xhrFields: {
			withCredentials: true
		},
		data: {"label":123},
		// beforeSend: function(xhr) {
		// 	xhr.setRequestHeader('X-CSRFToken', 'fiNBvAwG0HrLcnTXCVDZBGeRO2GZeXRLxzKXfXXrlb3gZn0gZtmAKpGsCzZEVVOE');
		// },
		beforeSend: function(request) {
   			 request.setRequestHeader("X-CSRFTOKEN", csrftoken);
  		},
		crossDomain: true,
		success: function(result) {
			console.log(result);
		}
	});

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

	// check if the user has logged in
	$.ajax({
		type: 'GET',
		url: 'https://imnight2018backend.ntu.im/accounts/check/login/',
		xhrFields: {
            withCredentials: true
        },
        success: function(data) {
        	console.log('login status: ' + data.auth_status);

			if (data.auth_status) {
				is_login_init();
			}

			// if the user hasn't logged in, remove remind modal
			else {
				$('#remindModal').remove();
				$('#loginModal').modal('toggle');
			}
		},
		error: function() {
			alert('get login status fail!');
		}
	});

	$('#rule-title').fadeTo(1000, 0.7, 'swing', function() {
		$('#rule-space').show("blind", 800, function() {
			var h = $('body').height();
			$('#content-background').css('height', h);
		});
	});

	// add enlarge hover effect on all .floating elements
	imgEnlarge();
	// draw card and draw coupon events
	$('#draw-card').on('click', draw_card);
	$('#draw-discount').on('click', draw_coupon);
})

// function statusChangeCallback(response) {
// 	console.log('statusChangeCallback');
// 	console.log(response.authResponse);
// 	if (response.status === 'connected') {
// 		// alert('you\'ve logged in!!!');

// 		// if the user has logged in, check if he has drawn card or taken discount
// 		// then get news info
// 		// then remove log in modal
// 		getDrawn();
// 		getNews();
// 		$('#loginModal').remove();
// 		$('#remindModal').modal('toggle');
// 	}
// 	else {
// 		// alert('you\'ve not logged in!!!');
// 		$('#remindModal').remove();
// 		$('#loginModal').modal('toggle');

// 		// $('#fb-btn').on('click', function(){
// 		// 	FB.login(function(response) {
// 		// 		// console.log(response);

// 		// 		if (response.status === 'connected') {
// 		// 			alert('you\'ve logged in!!!!!');
// 		// 		}
// 		// 		else {
// 		// 			alert('you\'ve cancelled login.')
// 		// 		}
// 		// 	});
// 		// });
// 	}
// }

// var login_modal = new Vue({
// 	el: '#loginModal',
// 	data: {
// 		message: '',
// 		loggedIn: false
// 	}
// })


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
	// $.ajaxSetup({ cache: true });
	// $.getScript('https://connect.facebook.net/en_US/sdk.js', function(){
	//     FB.init({
	//       appId      : '155420448490917',
	//       cookie     : true,
	//       xfbml      : true,
	//       version    : 'v2.12'
	//     });
	//     FB.getLoginStatus(statusChangeCallback);
	// });
