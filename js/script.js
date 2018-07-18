$('.navbar-nav>li>a').on('click', function () {
    $('.navbar-collapse').collapse('hide');
});

$(window).scroll(function(){
        if ($(window).scrollTop() > 150 && $('nav').hasClass('expanded') == 1) {
            $('nav').removeClass('expanded')
        } else if ($(window).scrollTop() < 150  && $('nav').hasClass('expanded') != 1) {
            $('nav').addClass('expanded')
        };
    })

$(document).ready(function () {
    $(document).on("scroll", onScroll);
function onScroll(event){
    var scrollPos = $(document).scrollTop();
    $('#navigation a').each(function () {
        var currLink = $(this);
        var refElement = $(currLink.attr("href"));
        if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
            $('#navigation ul li a').removeClass("active");
            currLink.addClass("active");
        } else if (Math.floor($(window).scrollTop()) + ($(window).height()) == ($(document).height()-1)) {
            currLink.removeClass("active");
            $('#lastMenuItem').addClass("active")
        } else {
            currLink.removeClass("active");
        }
    });
}})
