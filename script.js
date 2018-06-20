function changeDataLang() {
    for (let j = 0; j < changeLang.length; j++) {
        if (changeLang[j].style.display === 'block') {
            changeLang[j].style.display = 'none'
        } else {
            changeLang[j].style.display = 'block'
        }
    }
}

const langButton = document.querySelectorAll('.lang-button');
const changeLang = document.querySelectorAll('[data-lang]');

for (let i = 0; i < langButton.length; i++) {
    langButton[i].addEventListener('click', changeDataLang);
    console.log('1')
}

