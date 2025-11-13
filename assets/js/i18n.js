'use strict';


import { about } from './about.js';
import { skills } from './skills.js';
import { cv } from './cv.js';
import { stories } from './stories.js';
import { footer } from './footer.js';






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
        const namespaces = ['ui', 'skills', 'cv', 'stories', 'footer'];
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
    // - data-i18n ist dabei der Pfad im JSON-Objekt, z. B. "skills.section.title (für skills_de.json)"
    // Wenn ein containerId angegeben ist, nur in diesem Bereich
    applyTexts(containerId) {
        const root = containerId
            ? document.getElementById(containerId)
            : document;

        if (!root) return;

        // [data-i18n] ist ein benutzerdefiniertes Attribut, das den Schlüssel für die Übersetzung enthält
        // - es wird in jeder section im header gesetzt:
        //   z.B. in skills.js:
        //                      Überschrift:
        //                      const title = document.createElement('h2');
        //            >>>>>>    title.dataset.i18n = 'ui.skills.title';        <<<<<<<
        //                      title.textContent = 'Skills'; // Fallback
        //                      section.appendChild(title);
        //
        //       im Html:   <div data-i18n="ui.skills.title"></div>

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
                const tag = el.tagName.toLowerCase();

                // === Spezialfälle ===
                if (tag === 'input' || tag === 'textarea') {
                    // Placeholder aktualisieren
                    el.setAttribute('placeholder', textObj);
                } else if (tag === 'a' || tag === 'button') {
                    // Link- oder Buttontext
                    el.textContent = textObj;
                } else if (tag === 'img') {
                    // Alt-Text
                    el.setAttribute('alt', textObj);
                } else {
                    // Standard: Textknoten ersetzen
                    el.textContent = textObj;
                }
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
        about.load();
        skills.load();
        cv.load();
        stories.load();
        footer.load();
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



