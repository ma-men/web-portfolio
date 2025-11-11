'use strict';

import { language } from './i18n.js';

export const cv = {

    // interne Konfiguration
    _containerId: 'cv-section',
    _basePath: 'assets/lang/',
    _data: null,

    // JSON-Struktur-Konfiguration
    structure: {
        root: 'experience',       // Liste aller Stationen
        fields: {
            year: 'year',
            company: 'company',
            title: 'title',
            description: 'description',
            subroles: 'subroles',
            subYear: 'year',
            subTitle: 'title',
            certificate: 'certificate',
            certLabel: 'label',
            certFile: 'file'
        },
        header: {
            name: 'name',
            subtitle: 'subtitle'
        }
    },

    // DOM-Struktur aufbauen
    init() {
        const section = document.getElementById(cv._containerId);
        if (!section) return;

        section.innerHTML = '';

        // Überschrift (wird per i18n ersetzt)
        const title = document.createElement('h2');
        title.dataset.i18n = 'ui.cv.title';
        title.textContent = 'Lebenslauf';
        section.appendChild(title);

        // Hauptcontainer
        const container = document.createElement('div');
        container.classList.add('cv-container');
        section.appendChild(container);

        
    },

    /* Von außen aufrufen (z. B. in i18n.js): cv.load(language.current) */
    load(lang) {
        const path = `${cv._basePath}cv_${lang}.json`;

        // JSON-Daten laden (Fallback auf Deutsch)
        const data = cv._loadJSONSync(path) || cv._loadJSONSync(`${cv._basePath}cv_de.json`);
        
         // In-Memory-Daten setzen
        cv._data = data || {};

        // CV Bereich komplett aufbauen inkl. der dynamischen Strukturen aus dem JSON
        cv._render();

        // sprachabhängige Texte anwenden
        language.applyTexts(cv._containerId);
    },

    // JSON-Datei laden (synchron)
    _loadJSONSync(path) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', path, false);
        try {
            xhr.send();
            if (xhr.status >= 200 && xhr.status < 300 && xhr.responseText) {
                return JSON.parse(xhr.responseText);
            }
        } catch {
            console.log('Fehler beim Laden der CV-Datei:', path);
        }
        return null;
    },

    // Rendering der CV-Daten
    _render() {
        const cfg = cv.structure;
        const section = document.getElementById(cv._containerId);
        if (!section || !cv._data) return;

        // Container-Referenz
        const container = section.querySelector('.cv-container');
        if (!container) return;

        container.innerHTML = '';

        // Header
        const header = document.createElement('header');
        header.classList.add('cv-header');

        const h1 = document.createElement('h1');
        h1.textContent = cv._data[cfg.header.name] || '';
        const p = document.createElement('p');
        p.textContent = cv._data[cfg.header.subtitle] || '';

        header.appendChild(h1);
        header.appendChild(p);
        container.appendChild(header);

        // Timeline
        const timeline = document.createElement('div');
        timeline.classList.add('cv-timeline');

        const line = document.createElement('div');
        line.classList.add('cv-timeline-line');
        timeline.appendChild(line);

        const items = Array.isArray(cv._data[cfg.root]) ? cv._data[cfg.root] : [];

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const isLeft = i % 2 === 0;

            const itemDiv = document.createElement('div');
            itemDiv.classList.add('cv-item');
            itemDiv.classList.add(isLeft ? 'left' : 'right');

            const point = document.createElement('div');
            point.classList.add('cv-point');
            itemDiv.appendChild(point);

            const card = cv._createCard(item, cfg.fields);
            itemDiv.appendChild(card);
            timeline.appendChild(itemDiv);
        }

        container.appendChild(timeline);
    },

    _createCard(item, f) {
        const card = document.createElement('div');
        card.classList.add('cv-card');

        // Jahr, Titel, Firma, Beschreibung
        if (item[f.year]) {
            const year = document.createElement('span');
            year.classList.add('cv-year');
            year.textContent = item[f.year];
            card.appendChild(year);
        }

        if (item[f.title]) {
            const title = document.createElement('h3');
            title.classList.add('cv-title');
            title.textContent = item[f.title];
            card.appendChild(title);
        }

        if (item[f.company]) {
            const company = document.createElement('p');
            company.classList.add('cv-company');
            company.textContent = item[f.company];
            card.appendChild(company);
        }

        if (item[f.description]) {
            const desc = document.createElement('p');
            desc.classList.add('cv-desc');
            desc.textContent = item[f.description];
            card.appendChild(desc);
        }

        // Mini-Timeline (subroles)
        const subs = Array.isArray(item[f.subroles]) ? item[f.subroles] : [];
        if (subs.length > 0) {
            const subContainer = document.createElement('div');
            subContainer.classList.add('cv-subroles');

            for (let j = 0; j < subs.length; j++) {
                const sr = subs[j];
                const row = document.createElement('div');
                row.classList.add('cv-subrole');

                const y = document.createElement('span');
                y.classList.add('cv-subrole-year');
                y.textContent = sr[f.subYear] || '';

                const t = document.createElement('span');
                t.classList.add('cv-subrole-title');
                t.textContent = sr[f.subTitle] || '';

                row.appendChild(y);
                row.appendChild(t);
                subContainer.appendChild(row);
            }

            card.appendChild(subContainer);
        }

        // Arbeitszeugnis-Link (certificate)
        if (item[f.certificate] && item[f.certificate][f.certFile]) {
            const certBox = document.createElement('div');
            certBox.classList.add('cv-certificate');

            const label = item[f.certificate][f.certLabel] || 'Arbeitszeugnis';
            const file = item[f.certificate][f.certFile];

            const link = document.createElement('a');
            link.href = `assets/certs/${file}`;
            link.target = '_blank';
            link.textContent = label;

            certBox.appendChild(link);
            card.appendChild(certBox);
        }

        return card;
    },
};
