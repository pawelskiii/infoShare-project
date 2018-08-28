$(document).ready(function () {
    $('a[href^="#"]').click(function () {
        $('html').animate({scrollTop: $($(this).attr('href')).offset().top}, 1000);
    });
});