'use strict';

import { language } from './i18n.js';


export const navigation = {

    // interne Konfiguration
    _containerId: 'nav-container',

    // Menüpunkte (werden über createElement erzeugt)
    _menuItems: [
        { id: 'about-section', i18n: 'ui.menu_about', default: 'Über mich' },
        { id: 'skills-section', i18n: 'ui.menu_skills', default: 'Fähigkeiten' },
        { id: 'cv-section', i18n: 'ui.menu_cv', default: 'Lebenslauf' },
        { id: 'stories-section', i18n: 'ui.menu_stories', default: 'Projekte' },
        { id: 'contact', i18n: 'ui.menu_contact', default: 'Kontakt' }
    ],

    // Icons oder feste Werte, falls du z. B. noch Symbole o.Ä. ergänzen willst
    _icons: {
        hamburger: ['<span></span>', '<span></span>', '<span></span>'].join('')
    },

    init() {
        const container = document.getElementById(navigation._containerId);
        if (!container) return;

        // Bestehenden Inhalt leeren
        container.innerHTML = '';

        // Navigation erzeugen
        const nav = document.createElement('nav');
        nav.classList.add('main-nav');

        // Hamburger-Menü
        const hamburger = document.createElement('div');
        hamburger.classList.add('hamburger');
        hamburger.innerHTML = navigation._icons.hamburger;

        // UL für Links
        const ul = document.createElement('ul');
        ul.classList.add('nav-links');

        for (let i = 0; i < navigation._menuItems.length; i++) {
            const item = navigation._menuItems[i];
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `#${item.id}`;
            a.dataset.i18n = item.i18n;
            a.textContent = item.default; // Platzhalter bis Sprache geladen ist
            li.appendChild(a);
            ul.appendChild(li);
        }

        // Sprachumschalter
        const langSwitcher = navigation._createLanguageSwitcher();

        // Zusammenbauen
        nav.appendChild(hamburger);
        nav.appendChild(ul);
        nav.appendChild(langSwitcher);
        container.appendChild(nav);

        // Sticky Verhalten
        window.addEventListener('scroll', () => {
            if (window.scrollY > 0) nav.classList.add('sticky');
            else nav.classList.remove('sticky');
        });

        // Hamburger-Logik
        hamburger.addEventListener('click', () => {
            ul.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Sprachumschalter aktivieren
        navigation._activateLanguageSwitcher(langSwitcher);

        // Nach dem Aufbau Texte aus JSON einsetzen
        language.applyTexts('nav-container');
    },

    // Sprachumschalter erzeugen
    _createLanguageSwitcher() {
        const wrapper = document.createElement('div');
        wrapper.classList.add('lang-switcher');

        const de = document.createElement('span');
        de.classList.add('lang-option');
        de.dataset.lang = 'de';
        de.textContent = 'DE';

        const sep = document.createElement('span');
        sep.classList.add('lang-separator');
        sep.textContent = '|';

        const en = document.createElement('span');
        en.classList.add('lang-option');
        en.dataset.lang = 'en';
        en.textContent = 'EN';

        wrapper.appendChild(de);
        wrapper.appendChild(sep);
        wrapper.appendChild(en);

        return wrapper;
    },

    // Sprachumschalter-Ereignisse
    _activateLanguageSwitcher(langSwitcher) {
        const opts = langSwitcher.querySelectorAll('.lang-option');

        for (let i = 0; i < opts.length; i++) {
            const opt = opts[i];
            opt.addEventListener('click', () => {
                const newLang = opt.dataset.lang;
                language.setLanguage(newLang); // handled zentral in i18n.js
            });
        }
    }
};



    /*

    // Sprachumschalter erzeugen (nur DOM)
    createLanguageSwitcher() {
        const langSwitcher = document.createElement('div');
        langSwitcher.classList.add('lang-switcher');

        const de = document.createElement('span');
        de.classList.add('lang-option');
        de.dataset.lang = 'de';
        de.textContent = 'DE';

        const sep = document.createElement('span');
        sep.classList.add('lang-separator');
        sep.textContent = '|';

        const en = document.createElement('span');
        en.classList.add('lang-option');
        en.dataset.lang = 'en';
        en.textContent = 'EN';

        langSwitcher.appendChild(de);
        langSwitcher.appendChild(sep);
        langSwitcher.appendChild(en);

        return langSwitcher;
    },

    // Navigation erzeugen
    init() {
        const navContainer = document.getElementById('nav-container');
        if (!navContainer) return;

        // Navigationselement
        const nav = document.createElement('nav');
        nav.classList.add('main-nav');

        // Hamburger Menü
        const hamburger = document.createElement('div');
        hamburger.classList.add('hamburger');
        hamburger.innerHTML = '<span></span><span></span><span></span>';

        // UL-Element für Menüeinträge
        const ul = document.createElement('ul');
        ul.classList.add('nav-links');

        // Menüeinträge
        const menuItems = [
            { id: 'about-section', i18n: 'ui.menu_about' },
            { id: 'skills-section', i18n: 'ui.menu_skills' },
            { id: 'cv-section', i18n: 'ui.menu_cv' },
            { id: 'stories-section', i18n: 'ui.menu_stories' },
            { id: 'contact', i18n: 'ui.menu_contact' }
        ];

        for (let i = 0; i < menuItems.length; i++) {
            const item = menuItems[i];
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `#${item.id}`;
            a.dataset.i18n = item.i18n;
            a.textContent = item.i18n; // Platzhalter, bis Sprache geladen
            li.appendChild(a);
            ul.appendChild(li);
        }

        // Sprachumschalter erzeugen
        const langSwitcher = navigation.createLanguageSwitcher();

        // Alles zusammensetzen
        nav.appendChild(hamburger);
        nav.appendChild(ul);
        nav.appendChild(langSwitcher);
        navContainer.appendChild(nav);

        // Sticky-Funktionalität (wie im Projekt)
        window.addEventListener('scroll', () => {
            if (window.scrollY > 0) {
                nav.classList.add('sticky');
            } else {
                nav.classList.remove('sticky');
            }
        });

        // Hamburger-Logik
        hamburger.addEventListener('click', () => {
            ul.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Sprachumschalter aktiviert zentralen Sprachwechsel
        const langOptions = langSwitcher.querySelectorAll('.lang-option');
        for (let i = 0; i < langOptions.length; i++) {
            const opt = langOptions[i];
            opt.addEventListener('click', () => {
                const newLang = opt.dataset.lang;
                language.setLanguage(newLang); // handled komplett in i18n.js
            });
        }

        // Nach dem Aufbau Texte aus JSON einsetzen
        language.applyTexts('nav-container');
    }
};
*/

/*
export const navigation = {

  // Sprachumschalter erzeugen (nur DOM)
  createLanguageSwitcher() {
    const langSwitcher = document.createElement("div");
    langSwitcher.classList.add("lang-switcher");
    langSwitcher.innerHTML = `
      <span class="lang-option" data-lang="de">DE</span>
      <span class="lang-separator">|</span>
      <span class="lang-option" data-lang="en">EN</span>
    `;
    return langSwitcher;
  },

  addEventListener("DOMContentLoaded", () => {
    const navContainer = document.getElementById("nav-container");

    const menuItems = [
      { id: "about-section", i18n: "menu-about" },
      { id: "skills-section", i18n: "menu-skills" },
      { id: "cv-section", i18n: "menu-cv" },
      { id: "stories-section", i18n: "menu-stories" },
      { id: "contact", i18n: "menu-contact" }
    ];

  // Navigation erzeugen
  const nav = document.createElement("nav");

  // Hamburger-Icon
  const hamburger = document.createElement("div");
  hamburger.classList.add("hamburger");
  hamburger.innerHTML = "<span></span><span></span><span></span>";

  // UL-Element
  const ul = document.createElement("ul");
  ul.classList.add("nav-links");

  // Platzhalter-Texte, werden durch JSON ersetzt
  menuItems.forEach(item => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `#${item.id}`;
    a.dataset.i18n = item.i18n;
    a.textContent = item.i18n;
    li.appendChild(a);
    ul.appendChild(li);
  });

  // Sprachumschalter
  const langSwitcher = createLanguageSwitcher();

  // Navigation zusammensetzen
  nav.appendChild(hamburger);
  nav.appendChild(ul);
  nav.appendChild(langSwitcher);
  navContainer.appendChild(nav);

  // Hamburger-Menü-Logik
  hamburger.addEventListener("click", () => {
    ul.classList.toggle("active");
    hamburger.classList.toggle("active");
  });

  // Sprachumschalter-Logik
  const langOptions = langSwitcher.querySelectorAll(".lang-option");
  langOptions.forEach(opt => {
    opt.addEventListener("click", () => {
      const lang = opt.dataset.lang;
      langOptions.forEach(o => (o.style.fontWeight = "500"));
      opt.style.fontWeight = "900";
      loadLanguage(lang);
    });
  });

  // Sprache laden
  async function loadLanguage(lang) {
    try {
      const res = await fetch(`ui_${lang}.json`);
      const data = await res.json();
      document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.dataset.i18n;
        if (data[key]) el.textContent = data[key];
      });
    } catch (e) {
      console.error("Fehler beim Laden der Sprachdatei:", e);
    }
  }

  // Standardmäßig Deutsch laden
  loadLanguage("de");
});
*/