import {disableScroll, enableScroll} from './scrollController.js'
//popup պատուհանը
export function popup(popupElem, popupBtn) {
    const popup = document.querySelector(popupElem);
    document.addEventListener('mouseup', function (event) {
        if (event.target.closest(popupBtn)) {
            popup.classList.add('popup_open');
            disableScroll();
        }
        if (event.target === popup || event.target.closest('.popup__close-button')) {
            popup.classList.remove('popup_open');
            setTimeout(() => {
            enableScroll();
            }, 300);
            event.preventDefault();
        }
    });
    // Փակեք popup պատուհանը, երբ սեղմվում է ESC
    window.addEventListener('keydown', (e) => {
        if (e.key === "Escape") {
            popup.classList.remove("popup_open")
        }
    });
};