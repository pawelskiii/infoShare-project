(function() {

    function nameReminder() {
        if ($('.form-name')[0].value === '') {
            $('.form-reminder-name').show();
        } else {
            $('.form-reminder-name').hide();
        }
    }
    function mailReminder() {
        if ($('.form-mail')[0].value === '') {
            $('.form-reminder-mail').show();
        } else {
            $('.form-reminder-mail').hide();
        }
    }
    function reminderHide() {
        $('.form-reminder-name').hide();
        $('.form-reminder-mail').hide();
    }

    $('.form-name').blur(reminderHide)
    $('.form-mail').blur(reminderHide)
    $('.form-phone').blur(reminderHide)
    $('.form-message').blur(reminderHide)

    $('.form-mail').focus(nameReminder)
    $('.form-phone').focus(nameReminder)
    $('.form-message').focus(nameReminder)

    $('.form-phone').focus(mailReminder)
    $('.form-message').focus(mailReminder)

})()
