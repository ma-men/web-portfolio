'use strict';

import { language } from './i18n.js';


export const navigation = {

    // interne Konfiguration
    _containerId: 'nav-container',
    _data: null,
     
    
    // DOM-Struktur aufbauen
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
        hamburger.innerHTML = '<span></span><span></span><span></span>';

        // Menüeinträge
        const ul = document.createElement('ul');
        ul.classList.add('nav-links');

        const menuItems = [
            { id: 'about-section', i18n: 'ui.header.menu.about', default: 'Über mich' },
            { id: 'skills-section', i18n: 'ui.header.menu.skills', default: 'Fähigkeiten' },
            { id: 'cv-section', i18n: 'ui.header.menu.cv', default: 'Lebenslauf' },
            { id: 'stories-section', i18n: 'ui.header.menu.stories', default: 'Stories' },
            { id: 'contact', i18n: 'ui.header.menu.contact', default: 'Kontakt' }
            ];

        for (let i = 0; i < menuItems.length; i++) {
            const item = menuItems[i];
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
            nav.classList.toggle('sticky', window.scrollY > 0);
        });

        // Hamburger-Logik
        hamburger.addEventListener('click', () => {
            ul.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Sprachumschalter aktivieren
        navigation._activateLanguageSwitcher(langSwitcher);
    },


    /* Von außen aufrufen (z. B. in i18n.js) */
    load() {
        // Hier ist kein JSON nötig, die Texte kommen aus ui_xx.json direkt in i18n.js
        language.applyTexts(navigation._containerId);
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
