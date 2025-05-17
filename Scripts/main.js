document.addEventListener('DOMContentLoaded', () => {
    fetch('Language/language0.json')
        .then(response => response.json())
        .then(data => {
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                element.textContent = data[key] || key;
            });
        });
});
