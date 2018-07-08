// $.localScroll({
//     duration: 1000,
// });

// $(document).ready(function () {
//     $('a[href^="#"]').on('click', function () {
//         let target = $($(this).attr('href'));
//         if (target.length) {
//             $('html').animate({scrollTop: target.offset().top}, 1000);
//         }
//     });
// });

$(document).ready(function () {
    $('a').click(function () {
        $('html').animate({scrollTop: $($(this).attr('href')).offset().top}, 1000);
    });
});