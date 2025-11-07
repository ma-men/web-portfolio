'use strict';

import { language } from './i18n.js';

export const skills = {

    // interne Konfiguration 
    _containerId: 'skills',
    _gridId: 'skills-grid',
    _basePath: 'assets/lang/',
    _data: null,

    // Pfade zu Stern-Icons 
    starIcons: {
        full: 'assets/icons/star-full.svg',
        half: 'assets/icons/star-half.svg',
        empty: 'assets/icons/star-empty.svg'
    },

    // DOM-Struktur aufbauen 
    init() {
        const section = document.getElementById(skills._containerId);
        if (!section) return;

        section.innerHTML = '';

        // Überschrift 
        const title = document.createElement('h2');
        title.dataset.i18n = 'ui.skills.title';
        title.textContent = 'Skills';
        section.appendChild(title);

        // Grid-Container für Karten
        const grid = document.createElement('div');
        grid.id = skills._gridId;
        grid.classList.add('skills-grid');
        section.appendChild(grid);

        // spracheabhängige Texte anwenden
        language.applyTexts(skills._containerId);
    },

    /* Von außen aufrufen (z. B. in i18n.js): skills.load(language.current) */
    load(lang) {
        const path = `${skills._basePath}skills_${lang}.json`;
        // JSON-Daten laden (Fallback auf Deutsch)
        const data = skills._loadJSONSync(path) || skills._loadJSONSync(`${skills._basePath}skills_de.json`);
        // In-Memory-Daten setzen
        skills._data = data || {};
        // Neu rendern
        skills._render();
    },

    // JSON-Datei  laden
    _loadJSONSync(path) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', path, false);
        try {
            xhr.send();
            if (xhr.status >= 200 && xhr.status < 300 && xhr.responseText) {
                return JSON.parse(xhr.responseText);
            }
        } catch {
            // Fehler ignorieren
            console.log('Fehler beim Laden der Skills-Datei:', path);
        }
        return null;
    },

    // Karten aus den geladenen Daten zeichnen
    _render() {
        const grid = document.getElementById(skills._gridId);
        if (!grid || !skills._data) return;
        // Vorherigen Inhalt löschen
        grid.innerHTML = '';

        const data = skills._data;
        const categories = Array.isArray(data.categories) ? data.categories : [];

        // Titel aus skills_<lang>.json, falls vorhanden
        if (data.title) {
            const titleEl = document.querySelector(`#${skills._containerId} h2`);
            if (titleEl) {
                titleEl.textContent = data.title;
            }
        }
        
        if (categories.length === 0) {
            const p = document.createElement('p');
            p.classList.add('skills-empty');
            p.textContent = 'Keine Skill-Daten gefunden.';
            grid.appendChild(p);
            return;
        }
       

        for (let i = 0; i < categories.length; i++) {
            const cat = categories[i];

            const card = document.createElement('div');
            card.classList.add('skill-card');

            // Kategoriename
            const catTitle = document.createElement('h3');
            catTitle.textContent = cat.name || '';
            card.appendChild(catTitle);

            // Liste von Items
            const ul = document.createElement('ul');
            ul.classList.add('skill-list');

            for (let j = 0; j < items.length; j++) {
                const item = cat.items[j];
                const li = document.createElement('li');

                const nameSpan = document.createElement('span');
                nameSpan.classList.add('skill-name');
                nameSpan.textContent = item.name || '';

                const starsSpan = skills._renderStars(item.level || 0);

                li.appendChild(nameSpan);
                li.appendChild(starsSpan);
                ul.appendChild(li);
            }

            card.appendChild(ul);
            grid.appendChild(card);
        }
    },

    // Sterne-Rendering (unterstützt Ganzzahl und .5 → halb)
    _renderStars(levelNumber) {
        const span = document.createElement('span');
        span.classList.add('skill-stars');

        const fullCount = Math.floor(levelNumber);
        const hasHalf = levelNumber - fullCount >= 0.5;
        const total = 5;

        for (let i = 0; i < total; i++) {
            const img = document.createElement('img');
            img.classList.add('star');

            if (i < fullCount) {
                img.src = skills.starIcons.full;
                img.alt = '★';
            } else if (i === fullCount && hasHalf) {
                img.src = skills.starIcons.half;
                img.alt = '☆'; // optional: '½'
            } else {
                img.src = skills.starIcons.empty;
                img.alt = '☆';
            }

            span.appendChild(img);
        }

        return span;
    }
};

