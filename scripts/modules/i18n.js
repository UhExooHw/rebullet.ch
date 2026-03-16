function getByPath(source, path) {
  return path.split(".").reduce((obj, key) => (obj ? obj[key] : undefined), source);
}

const localeCache = new Map();

async function loadLocale(locale) {
  if (localeCache.has(locale)) {
    return localeCache.get(locale);
  }

  const response = await fetch(`locales/${locale}.json`);
  if (!response.ok) {
    throw new Error(`Failed to load locale: ${locale}`);
  }

  const dict = await response.json();
  localeCache.set(locale, dict);
  return dict;
}

function applyTranslations(dict, root = document) {
  const elements = root.querySelectorAll("[data-i18n]");
  elements.forEach((element) => {
    const key = element.getAttribute("data-i18n");
    if (!key) return;

    const translation = getByPath(dict, key);
    if (typeof translation === "string") {
      element.textContent = translation;
    }
  });

  const altElements = root.querySelectorAll("[data-i18n-alt]");
  altElements.forEach((element) => {
    const key = element.getAttribute("data-i18n-alt");
    if (!key) return;

    const translation = getByPath(dict, key);
    if (typeof translation === "string") {
      element.setAttribute("alt", translation);
    }
  });

  const titleElements = root.querySelectorAll("[data-i18n-title]");
  titleElements.forEach((element) => {
    const key = element.getAttribute("data-i18n-title");
    if (!key) return;

    const translation = getByPath(dict, key);
    if (typeof translation === "string") {
      element.setAttribute("title", translation);
    }
  });

  const ariaLabelElements = root.querySelectorAll("[data-i18n-aria-label]");
  ariaLabelElements.forEach((element) => {
    const key = element.getAttribute("data-i18n-aria-label");
    if (!key) return;

    const translation = getByPath(dict, key);
    if (typeof translation === "string") {
      element.setAttribute("aria-label", translation);
    }
  });
}

function renderListValue(container, value) {
  if (!Array.isArray(value)) return;

  const tag = container.getAttribute("data-list-tag") || "li";
  const itemClass = container.getAttribute("data-list-class");
  container.innerHTML = "";

  value.forEach((item) => {
    const node = document.createElement(tag);
    if (itemClass) {
      node.className = itemClass;
    }

    node.textContent = String(item);
    container.appendChild(node);
  });
}

function renderEntryList(container, value) {
  if (!Array.isArray(value)) return;

  container.innerHTML = "";
  value.forEach((entry) => {
    if (!entry || typeof entry !== "object") return;

    const li = document.createElement("li");
    li.className = "company-item";

    const icon = document.createElement("div");
    icon.className = "company-icon";
    const iconValue = String(entry.icon || "•");
    const isImageIcon = /\.(png|jpg|jpeg|webp|svg)$/i.test(iconValue);
    if (isImageIcon) {
      const iconImage = document.createElement("img");
      iconImage.src = iconValue;
      iconImage.alt = entry.title || "";
      icon.appendChild(iconImage);
    } else {
      icon.textContent = iconValue;
    }

    const content = document.createElement("div");

    const title = document.createElement("div");
    title.className = "company-title";
    title.textContent = entry.title || "";

    const meta = document.createElement("div");
    meta.className = "company-meta";
    meta.textContent = entry.meta || "";

    const description = document.createElement("div");
    description.className = "company-description";
    description.textContent = entry.description || "";

    content.appendChild(title);
    if (meta.textContent) content.appendChild(meta);
    if (description.textContent) content.appendChild(description);

    li.appendChild(icon);
    li.appendChild(content);
    container.appendChild(li);
  });
}

function applyCollectionTranslations(dict, root = document) {
  const containers = root.querySelectorAll("[data-i18n-list]");
  containers.forEach((container) => {
    const key = container.getAttribute("data-i18n-list");
    if (!key) return;

    const value = getByPath(dict, key);
    renderListValue(container, value);
  });

  const entryContainers = root.querySelectorAll("[data-i18n-entries]");
  entryContainers.forEach((container) => {
    const key = container.getAttribute("data-i18n-entries");
    if (!key) return;

    const value = getByPath(dict, key);
    renderEntryList(container, value);
  });
}

function markActiveLang(locale, root = document) {
  const buttons = root.querySelectorAll("[data-lang]");
  buttons.forEach((button) => {
    button.classList.toggle("active", button.getAttribute("data-lang") === locale);
  });
}

export async function initI18n(defaultLocale = "en") {
  const savedLocale = localStorage.getItem("site-locale");
  const locale = savedLocale || defaultLocale;
  let currentLocale = locale;

  const dict = await loadLocale(locale);
  document.documentElement.lang = locale;
  applyTranslations(dict);
  applyCollectionTranslations(dict);
  markActiveLang(locale);

  document.addEventListener("click", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (!target.matches("[data-lang]")) return;

    const nextLocale = target.getAttribute("data-lang");
    if (!nextLocale) return;
    if (nextLocale === currentLocale) return;

    const nextDict = await loadLocale(nextLocale);
    localStorage.setItem("site-locale", nextLocale);
    document.documentElement.lang = nextLocale;
    applyTranslations(nextDict);
    applyCollectionTranslations(nextDict);
    markActiveLang(nextLocale);
    currentLocale = nextLocale;
  });
}
