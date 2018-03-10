var resource = new Vue({
    el: '.main',
    data: {
        checked: false,
        coupons: []
    },
    methods: {
        delayShow: function(k) {
            $('#back' + k).removeClass('hide');
            $('#front' + k).addClass('shrink');
            $('#modal-content' + k).addClass('changeBg');
        },
        dcheck: function(k) {
            $('#back' + k).addClass('hide');
            $('#front' + k).removeClass('shrink');
            $('#modal-content' + k).removeClass('changeBg');
        },
        submit: function(k) {
            this.dcheck(k);
            $.ajax({
                url: 'https://imnight2018backend.ntu.im/earth/use/vocher/',
                type: 'POST',
                xhrFields: {
                    withCredentials: true
                },
                data: "", //hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
                success: function(data) {},
                error: function(data) {
                    console.log("fail submit");
                }
            });
        },
        grow: function(k) {
            k = String(k);
            $('#orb' + k).toggleClass('showUp');
            $('#star' + k).toggleClass('rainbow');
            if ($('#star' + k).hasClass('moveV')) {
                $('#star' + k).addClass('moveback');
                $('#star' + k).removeClass('moveV');
            } else {
                $('#star' + k).removeClass('moveback');
                $('#star' + k).addClass('moveV');
            }
        }
    }
})

$(function() {
    $('.lazy').Lazy({
        effect: 'fadeIn',
        effectTime: 1000,
        threshold: 0,
        onError: function(element) {
            console.log('error loading ' + element.data('src'));
        }
    });
})

function showAllVocher() {
	console.log("showAllVocher");
    $.ajax({
        url: 'https://imnight2018backend.ntu.im/earth/list/vocher/',
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        success: function(data) {
            console.log(data);
            for (var i = 0; i < data.length; i++) {
                resource.coupons.push(data[i]);
				console.log("showAllVocher :"+i+" "+ data[i].img);
            }
        },
        error: function(data) {
            alert("fail showAllVocher" + data);
        }
    });
}


function showUserVocher() {
    $.ajax({
        url: 'https://imnight2018backend.ntu.im/earth/vocher/',
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        success: function(data) {
            console.log(data);
            for (var i = 0; i < data.length; i++) {
                resource.coupons.push(data[i]);
				console.log("showUserVocher " +data[i].img);
            }
        },
        error: function(data) {
            alert("fail showUserVocher" + data);
        }
    });
}

/* clear array for new page */
function clear() {
    resource.coupons = [];
}

function switchCase() {
    //console.log(resource.checked);
    if (resource.checked == true) {
        clear();
        showAllVocher();
    } else {
        clear();
        showUserVocher();
    }
}

switchCase();