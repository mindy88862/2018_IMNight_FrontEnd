var resource = new Vue({
    el: '.main',
    data: {
		courseMorethanFour:false,
        classes: []
    },
    methods: {
        move: function(k) {
            k = String(k);
            /*initiate others*/
            for (var i = 1; i <= this.classes.length; i++) {
                if (i == Number(k)) {
                    $('#card' + k).toggleClass('lift');
                    $('#back' + k).toggleClass('transform-active');
                    $('#cb' + k).toggleClass('moveRight');
                } else {
                    $('#card' + String(i)).removeClass('lift');
                    $('#back' + String(i)).removeClass('transform-active');
                    $('#cb' + String(i)).removeClass('moveRight');
                }
            }
        },
        crack: function(k,label) {
            /* need to add 1 point*/
            k = String(k);
            $('#egg' + k).addClass('hide');

            $('#eggDown' + k).removeClass('hide');
            $('#eggDown' + k).addClass('downAnimate');

            $('#eggUp' + k).removeClass('hide');
            $('#eggUp' + k).addClass('upAnimate');
			
			$.ajax({
				type: 'POST',
				url: 'https://imnight2018backend.ntu.im/lottery/finish/',
				xhrFields: {
					withCredentials: true
				},
				data: JSON.stringify({"label":label}),
				contentType: "application/json",
				crossDomain: true,
				beforeSend: function(request) {
					var csrftoken = Cookies.get('csrftoken');
					request.setRequestHeader("X-CSRFTOKEN", csrftoken);
				},
				success: function(data) {
					console.log("label: "+label);
				},
				error: function(data) {
					alert("fail POST" + data);
				}
			});
        },
		showCourse: function(label,id) {
			$.ajax({
				url: 'https://imnight2018backend.ntu.im/sky/course/'+String(label)+'/',
				type: 'GET',
				xhrFields: {
					withCredentials: true
				},
				success: function(data) {
					console.log(data,id);
					$('#des'+id).html(data[0].more);
					$('#content'+id).html(data[0].content);
				},
				error: function(data) {
					alert("fail showCourse" + data);
				}
			});
		},
		
    }
});

$(function(){
	$('.lazy').Lazy({
		effect: 'fadeIn',
		effectTime: 1000,
		threshold: 0,
        onError: function(element) {
            console.log('error loading ' + element.data('src'));
        }
	});	
})

$(function() {
    $.ajax({
        url: 'https://imnight2018backend.ntu.im/sky/list/courses/',
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        success: function(data) {
            //console.log(data);
			if(data.length > 4){
				resource.courseMorethanFour = true;
				for (var i = 0; i < 4; i++) {
					resource.classes.push(data[i]);
				}
			}else{
				for (var i = 0; i < data.length; i++) {
					resource.classes.push(data[i]);
				}
			}
        },
        error: function(data) {
            alert("fail" + data);
        }
    });
});

function showMoreCourse(){
    $.ajax({
        url: 'https://imnight2018backend.ntu.im/sky/list/courses/',
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        success: function(data) {
			for (var i = 5; i < data.length; i++) {
				resource.classes.push(data[i]);
			}
        },
        error: function(data) {
            alert("fail" + data);
        }
    });
	resource.courseMorethanFour = false;
}