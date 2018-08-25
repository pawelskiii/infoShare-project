(function() {
    const $langButton = $('div.lang-button');
    const $translationsText = $('[data-lang]');
    const $translationsFormPlaceholder = $('[data-langplaceholder]');
    const $translationsFormTitle = $('[data-langtitle]');
    let prevLang;

    function languageSwitch() {

        $translationsText.each(function() {
            prevLang = $(this).html();
            $(this).html($(this).attr('data-lang'));
            $(this).attr('data-lang', prevLang)
        })
        $translationsFormPlaceholder.each(function() {
            prevLang = $(this).attr('placeholder');
            $(this).attr('placeholder', ($(this).attr('data-langplaceholder')));
            $(this).attr('data-langplaceholder', prevLang)
        })
        $translationsFormTitle.each(function() {
            prevLang = $(this).attr('title');
            $(this).attr('title', ($(this).attr('data-langtitle')));
            $(this).attr('data-langtitle', prevLang)
        })

        if (localStorage.language === 'english') {
            localStorage.setItem('language', 'polish');
        } else {
            localStorage.setItem('language', 'english');
        }

    }

    $langButton.click(languageSwitch);

    if (localStorage.language === 'english') {
        languageSwitch();
        localStorage.setItem('language', 'english');
    }

}) ();