if (window.innerWidth > 768) {
  const cursor = document.getElementById('cursor');
  document.addEventListener('mousemove', (e) => {
    cursor.style.top = `${e.clientY}px`;
    cursor.style.left = `${e.clientX}px`;
  });
}

const toggleButton = document.getElementById('theme-toggle');
const languageDropdown = document.getElementById('language-dropdown');
const currentLanguage = document.getElementById('current-language');
const languageList = document.getElementById('language-list');
const body = document.body;

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
let currentTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
body.setAttribute('data-theme', currentTheme);

const path = window.location.pathname;
let defaultLang;

if (path.startsWith('/en')) {
  defaultLang = 'en';
} else if (path.startsWith('/ru')) {
  defaultLang = 'ru';
} else {
  const userLang = navigator.language || navigator.userLanguage;
  defaultLang = userLang.startsWith('ru') ? 'ru' : 'en';
  window.history.replaceState(null, '', `/${defaultLang}`);
}

loadLanguage(defaultLang).then(() => {
  currentLanguage.textContent = defaultLang === 'en' ? 'English' : 'Русский';
  toggleButton.textContent = currentTheme === 'dark' ? translations['theme-toggle-light'] : translations['theme-toggle-dark'];

  const head = document.head;
  const linkEn = document.createElement('link');
  linkEn.rel = 'alternate';
  linkEn.hreflang = 'en';
  linkEn.href = 'https://rebullet.ch/en';
  head.appendChild(linkEn);

  const linkRu = document.createElement('link');
  linkRu.rel = 'alternate';
  linkRu.hreflang = 'ru';
  linkRu.href = 'https://rebullet.ch/ru';
  head.appendChild(linkRu);
}).catch(err => {
  console.error('Failed to load initial language:', err);
  currentLanguage.textContent = 'English';
  toggleButton.textContent = currentTheme === 'dark' ? 'Go Light' : 'Go Dark';
});

toggleButton.addEventListener('click', () => {
  currentTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  body.setAttribute('data-theme', currentTheme);
  toggleButton.textContent = currentTheme === 'dark' ? translations['theme-toggle-light'] : translations['theme-toggle-dark'];
  localStorage.setItem('theme', currentTheme);
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    currentTheme = e.matches ? 'dark' : 'light';
    body.setAttribute('data-theme', currentTheme);
    toggleButton.textContent = currentTheme === 'dark' ? translations['theme-toggle-light'] : translations['theme-toggle-dark'];
  }
});

languageDropdown.addEventListener('click', (e) => {
  e.stopPropagation();
  languageList.classList.toggle('show');
});

languageList.querySelectorAll('li').forEach(item => {
  item.addEventListener('click', (e) => {
    e.stopPropagation();
    const lang = e.target.getAttribute('data-lang');
    loadLanguage(lang).then(() => {
      currentLanguage.textContent = lang === 'en' ? 'English' : 'Русский';
      toggleButton.textContent = currentTheme === 'dark' ? translations['theme-toggle-light'] : translations['theme-toggle-dark'];
      const currentPath = window.location.pathname;
      const newPath = currentPath.includes('/error') ? `/${lang}/error` : `/${lang}`;
      window.history.pushState(null, '', newPath);
    });
    languageList.classList.remove('show');
  });
});

document.addEventListener('click', (e) => {
  if (!languageDropdown.contains(e.target)) {
    languageList.classList.remove('show');
  }
});