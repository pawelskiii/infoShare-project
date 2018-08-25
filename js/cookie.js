

let cookieWarn = document.querySelector('#cookie-warn-ok');

$().ready(function() {
    if (localStorage.getItem("cookieWarn", 'accepted')) {
        $("#cookie-warn").hide();
    }
    else {
        $("#cookie-warn").show();
        showCookies();
    };
    ;
});

function showCookies() {
    $("#cookie-warn-ok").click (function () {
        let cookieAccepted = localStorage.setItem('cookieWarn', 'accepted');
        $("#cookie-warn").hide("slow");
    });

    $(".cookie-warn-not-ok").click (function () {
        $("#cookie-warn").hide("slow");
        let cookieNotAccepted = !localStorage.setItem('cookieWarn');
    });

    var time = Date.now();
    var month = 30 * 24 * 60 * 60 * 1000;

    if(localStorage.getItem("cookieWarn", 'accepted') - time > month) {
        localStorage.removeItem('cookieWarn', 'accepted');
    }
};

