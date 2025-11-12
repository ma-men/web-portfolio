'use strict';

import { language } from './i18n.js';


export const skills = {

    // interne Konfiguration 
    _containerId: 'skills-section',
    _gridId: 'skills-grid',
    _data: null, // wird später aus language.data.skills bezogen

    // JSON-Struktur-Konfiguration
    structure: {
        root: 'groups',
        subgroup: 'skills',
        fields: {
            groupName: 'group',
            skillName: 'name',
            rating: 'rating',
            desc: 'desc',
            certs: 'certs',
            certLabel: 'label',
            certFile: 'file'
        }
    },

    // Pfade zu Stern-Icons 
    starIcons: {
        full: 'assets/icons/star-full.svg',
        half: 'assets/icons/star-half.svg',
        empty: 'assets/icons/star-empty.svg'
    },

    // ----------------------------------------------------
    // DOM-Struktur statisch aufbauen (einmalig)
    // ----------------------------------------------------
    init() {
        const section = document.getElementById(skills._containerId);
        if (!section) return;

        section.innerHTML = '';

        // Überschrift 
        const title = document.createElement('h2');
        title.dataset.i18n = 'ui.skills.title';
        title.id = `${skills._containerId}-title`;
        section.appendChild(title);

        // Grid-Container für Karten
        const grid = document.createElement('div');
        grid.id = skills._gridId;
        grid.classList.add('skills-grid');
        section.appendChild(grid);
    },

    // Sprache laden 
    load() {
        // direkt auf globales i18n-Objekt zugreifen
        const jsonData = language?.data?.skills;
        if (!jsonData) {
            console.warn('⚠️ Keine Sprachdaten für Skills gefunden');
            return;
        }

        skills._data = jsonData;
        skills._render();

        // Sprache anwenden (Überschrift etc.)
        language.applyTexts(skills._containerId);
    },

    // ----------------------------------------------------
    // Anzeige rendern
    // ----------------------------------------------------
    _render() {
        const cfg = skills.structure;
        const grid = document.getElementById(skills._gridId);
        const data = skills._data;

        if (!grid || !data) return;
        grid.innerHTML = '';

        const groups = Array.isArray(data[cfg.root]) ? data[cfg.root] : [];

        if (groups.length === 0) {
            const p = document.createElement('p');
            p.classList.add('skills-empty');
            p.textContent = 'Keine Skill-Daten gefunden.';
            grid.appendChild(p);
            return;
        }

        // alle Gruppen erzeugen
        for (let i = 0; i < groups.length; i++) {
            const g = groups[i];
            const card = document.createElement('div');
            card.classList.add('skill-card');

            // Gruppentitel
            const groupTitle = document.createElement('h3');
            groupTitle.textContent = g[cfg.fields.groupName] || 'Gruppe';
            card.appendChild(groupTitle);

            const skillsArr = Array.isArray(g[cfg.subgroup]) ? g[cfg.subgroup] : [];
            for (let j = 0; j < skillsArr.length; j++) {
                const s = skillsArr[j];

                // Skill-Zeile
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

                // Zertifikate
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

    // ----------------------------------------------------
    // Sterneanzeige rendern
    // ----------------------------------------------------
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
