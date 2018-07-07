$(document).ready(function() {

    $(window).scroll(function() {
        if ($(window).scrollTop() > 500) {
            $('.go-to-top-button').addClass('show');
        } else {
            $('.go-to-top-button').removeClass('show');
        }
    });
});