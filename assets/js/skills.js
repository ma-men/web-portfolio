'use strict';

import { language } from './i18n.js';

export const skills = {

    // interne Konfiguration 
    _containerId: 'skills-section',
    _gridId: 'skills-grid',
    _basePath: 'assets/lang/',
    _data: null,

    // JSON-Struktur-Konfiguration
    structure: {
        root: 'groups',       // oberste Liste in der JSON-Datei
        subgroup: 'skills',   // Unterliste innerhalb jeder Gruppe
        fields: {
            groupName: 'group', // Name der Skillgruppe
            skillName: 'name',  // Skillbezeichnung
            rating: 'rating',   // Bewertung (0–5)
            desc: 'desc',       // Beschreibungstext
            certs: 'certs',     // Zertifikate-Liste
            certLabel: 'label', // Text der Zertifikatsbeschreibung
            certFile: 'file'    // Dateiname
        }
    },


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
 
    },

    /* Von außen aufrufen (z. B. in i18n.js): skills.load(language.current) */
    load(lang) {
        const path = `${skills._basePath}skills_${lang}.json`;
        // JSON-Daten laden (Fallback auf Deutsch)
        const data = skills._loadJSONSync(path) || skills._loadJSONSync(`${skills._basePath}skills_de.json`);
        // In-Memory-Daten setzen
        skills._data = data || {};

        // Skill Bereich komplett aufbauen inkl. der dynamischen Strukturen aus dem JSON
        _render()
        
        // spracheabhängige Texte anwenden
        language.applyTexts(skills._containerId);
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

    // Daten anzeigen
    _render() {
        const cfg = skills.structure; // Kürzerer Zugriff
        const grid = document.getElementById(skills._gridId);
        if (!grid || !skills._data) return;

        grid.innerHTML = '';

        const groups = Array.isArray(skills._data[cfg.root]) ? skills._data[cfg.root] : [];

        if (groups.length === 0) {
            const p = document.createElement('p');
            p.classList.add('skills-empty');
            p.textContent = 'Keine Skill-Daten gefunden.';
            grid.appendChild(p);
            return;
        }

        for (let i = 0; i < groups.length; i++) {
            const g = groups[i];

            // Skill-Card (entspricht .skill-card im CSS)
            const card = document.createElement('div');
            card.classList.add('skill-card');

            // Überschrift der Gruppe
            const groupTitle = document.createElement('h3');
            groupTitle.textContent = g[cfg.fields.groupName] || 'Gruppe';
            card.appendChild(groupTitle);


            const skillsArr = Array.isArray(g[cfg.subgroup]) ? g[cfg.subgroup] : [];
            for (let j = 0; j < skillsArr.length; j++) {
                const s = skillsArr[j];

                // Skill-Zeile (.skill-row)
                const row = document.createElement('div');
                row.classList.add('skill-row');

                const name = document.createElement('span');
                name.classList.add('skill-name');
                name.textContent = s[cfg.fields.skillName] || '';

                const stars = skills._renderStars(Number(s[cfg.fields.rating]) || 0);
                stars.classList.add('stars');

                row.appendChild(name);
                row.appendChild(stars);
                card.appendChild(row);

                // Beschreibung
                const desc = document.createElement('p');
                desc.classList.add('skill-desc');
                desc.textContent = s[cfg.fields.desc] || '';
                card.appendChild(desc);

                // Zertifikate (cert-list)
                const certList = s[cfg.fields.certs];
                if (Array.isArray(certList) && certList.length > 0) {
                    const ulCert = document.createElement('ul');
                    ulCert.classList.add('cert-list');

                    for (let k = 0; k < certList.length; k++) {
                        const c = certList[k];
                        const liCert = document.createElement('li');

                        const label = c[cfg.fields.certLabel] || '';
                        const file = c[cfg.fields.certFile] || '';

                        if (file.trim() !== '') {
                            const link = document.createElement('a');
                            link.href = `assets/certs/${file}`;
                            link.target = '_blank';
                            link.textContent = label;
                            liCert.appendChild(link);
                        } else {
                            liCert.textContent = label;
                        }
                        ulCert.appendChild(liCert);
                    }
                    card.appendChild(ulCert);
                }
            }
            grid.appendChild(card);
        }
    },

    _renderStars(level) {
        const span = document.createElement('span');
        const full = Math.floor(level);
        const half = level - full >= 0.5;
        const total = 5;

        for (let i = 0; i < total; i++) {
            const img = document.createElement('img');
            if (i < full) {
                img.src = skills.starIcons.full;
            } else if (i === full && half) {
                img.src = skills.starIcons.half;
            } else {
                img.src = skills.starIcons.empty;
            }
            span.appendChild(img);
        }

        return span;
    }
};