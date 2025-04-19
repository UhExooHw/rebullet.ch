let translations = {};

async function loadLanguage(lang) {
  try {
    const response = await fetch(`/lang/${lang}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load language file: /lang/${lang}.json`);
    }
    translations = await response.json();
    
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (translations[key]) {
        element.innerHTML = translations[key];
      }
    });

    document.documentElement.lang = lang;
    return translations;
  } catch (error) {
    console.error('Error loading language:', error);
    if (lang !== 'en') {
      return loadLanguage('en');
    }
    return {};
  }
}