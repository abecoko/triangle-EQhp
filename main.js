console.log('Triangle EQ Website Loaded');

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle Logic
    const toggle = document.querySelector('.header__mobile-toggle');
    const nav = document.querySelector('.header__nav');

    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            nav.classList.toggle('active');
        });
    }
});
