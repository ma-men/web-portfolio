'use strict';

import { language } from './i18n.js';

import { skills } from './skills.js';




export const language = {
    currentLang: localStorage.getItem('lang') || 'de',
    data: {},

    // Einstiegspunkt
    init() {
        language.loadLanguage(language.currentLang);
        language.appendEventListeners();
        language.updateActiveSwitcher(language.currentLang);

        // Nach dem Laden einmal Texte einfügen
        language.applyTexts();
    },

    // Lädt alle JSON-Sprachdateien (synchron)
    loadLanguage(lang) {
        const namespaces = ['ui', 'skills', 'cv', 'stories'];
        const basePath = 'assets/lang/';
        language.data = {};

        for (let i = 0; i < namespaces.length; i++) {
            const ns = namespaces[i];
            const xhr = new XMLHttpRequest();
            const path = basePath + ns + '_' + lang + '.json';
            xhr.open('GET', path, false);
            try {
                xhr.send();
                if (xhr.status >= 200 && xhr.status < 300) {
                    language.data[ns] = JSON.parse(xhr.responseText);
                } else {
                    language.data[ns] = {};
                }
            } catch {
                console.warn(`Fehler beim Laden: ${path}`);
                language.data[ns] = {};
            }
        }

        console.log('Sprache geladen:', lang);
    },

    // Setzt alle Texte basierend auf data-i18n
    // Wenn ein containerId angegeben ist, nur in diesem Bereich
    applyTexts(containerId) {
        const root = containerId
            ? document.getElementById(containerId)
            : document;

        if (!root) return;

        const elements = root.querySelectorAll('[data-i18n]');
        for (let i = 0; i < elements.length; i++) {
            const el = elements[i];
            const key = el.getAttribute('data-i18n');
            if (!key) continue;

            // Beispiel-Key: ui.header.menu.about
            const parts = key.split('.');
            const ns = parts.shift(); // "ui"
            let textObj = language.data[ns];

            // gehe rekursiv tiefer durch das JSON-Objekt
            for (let j = 0; j < parts.length; j++) {
                if (textObj && typeof textObj === 'object') {
                    textObj = textObj[parts[j]];
                } else {
                    textObj = null;
                    break;
                }
            }

            if (typeof textObj === 'string') {
                el.textContent = textObj;
            }
        }
    },


    // Sprache wechseln
    setLanguage(newLang) {
        if (newLang === language.current) return;

        language.current = newLang;
        localStorage.setItem('lang', newLang);

        // Sprachdateien laden
        language.loadLanguage(newLang);
        language.updateActiveSwitcher(newLang);

        // Texte auf ganzer Seite aktualisieren
        language.applyTexts();

        // Zusätzlich Module nachladen (z. B. Skills neu rendern)
        if (window.skills && typeof window.skills.load === 'function') {
            skills.load(newLang);
        }
        if (window.cv && typeof window.cv.load === 'function') {
            cv.load(newLang);
        }
        if (window.stories && typeof window.stories.load === 'function') {
            stories.load(newLang);
        }
        if (window.contact && typeof window.contact.load === 'function') {
            contact.load(newLang);
        }
        if (window.footer && typeof window.footer.load === 'function') {
            footer.load(newLang);
        }

    },

    // Aktiven Sprachschalter hervorheben
    updateActiveSwitcher(lang) {
        const opts = document.querySelectorAll('.lang-option');
        for (let i = 0; i < opts.length; i++) {
            opts[i].classList.toggle('active', opts[i].dataset.lang === lang);
        }
    },

    // Klick-Events für Sprachumschalter
    appendEventListeners() {
        document.addEventListener('click', (e) => {
            const option = e.target.closest('.lang-option');
            if (!option) return;

            const newLang = option.dataset.lang;

            if (newLang) {
                language.setLanguage(newLang);
            }
        });
    }
};





/*


    appendEventListeners() {
        document.addEventListener('click', (e) => {
            const option = e.target.closest('.lang-option');
            if (!option) return;

            const newLang = option.dataset.lang;
            if (!newLang || newLang === language.currentLang) return;

            language.setLanguage(newLang);
        });
    },

    setLanguage(newLang) {
        language.currentLang = newLang;
        localStorage.setItem('lang', newLang);
        language.setActiveLang(newLang);
        language.reloadSections(newLang);
    },

    setActiveLang(lang) {
        document.querySelectorAll('.lang-option').forEach((el) => {
            el.classList.toggle('active', el.dataset.lang === lang);
        });
    },

    reloadSections(lang) {
        console.log('🔄 Sprache wechseln auf:', lang);

        try { if (window.nav?.load) nav.load(lang); } catch { }
        try { if (window.skills?.load) skills.load(lang); } catch { }
        try { if (window.stories?.load) stories.load(lang); } catch { }
        try { if (window.cv?.load) cv.load(lang); } catch { }
        try { if (window.footer?.load) footer.load(lang); } catch { }
    },

    
};


*/

/*
const loadUI = async (lang) => {
  try {
    const res = await fetch(`assets/lang/ui_${lang}.json`);
    const data = await res.json();

    // Menüeinträge aktualisieren
    document.querySelector('[data-i18n="menu-about"]').textContent = data.header.menu.about;
    document.querySelector('[data-i18n="menu-skills"]').textContent = data.header.menu.skills;
    document.querySelector('[data-i18n="menu-cv"]').textContent = data.header.menu.cv;
    document.querySelector('[data-i18n="menu-stories"]').textContent = data.header.menu.stories;
    document.querySelector('[data-i18n="menu-contact"]').textContent = data.header.menu.contact;

    // Footer
    document.querySelector('[data-i18n="footer-copy"]').textContent = data.footer.copyright;
    document.querySelector('[data-i18n="footer-imprint"]').textContent = data.footer.imprint;
    document.querySelector('[data-i18n="footer-privacy"]').textContent = data.footer.privacy;
  } catch (error) {
    console.error("Fehler beim Laden der Sprachdatei:", error);
  }
};

document.addEventListener("languageChanged", (e) => {
  loadUI(e.detail);
});
*/
