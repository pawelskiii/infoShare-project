$(document).ready(function () {
    let topButton = $('.go-to-top-button');
    $(window).scroll(function() {
        if ($(window).scrollTop() > 500) {
            topButton.addClass('show');
        } else {
            topButton.removeClass('show');
        }
    });
});