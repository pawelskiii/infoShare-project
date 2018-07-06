// $.localScroll({
//     duration: 1000,
// });

// $(document).ready(function () {
//
//     $('a[href^="#"]').on('click', function (event) {
//
//         let target = $($(this).attr('href'));
//         if (target.length) {
//             event.preventDefault();
//             $('html, body').animate({
//                 scrollTop: target.offset().top
//             }, 1000);
//         }
//     });
// });

$('a').click(function () {
    $('html').animate({
        scrollTop: $($(this).attr('href')).offset().top
    }, 1000);
});