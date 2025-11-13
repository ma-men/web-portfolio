'use strict';

import { language } from './i18n.js';


export const about = {
    _containerId: 'about-section',
    _textBlockId: 'about-text',
    _headerId: 'hero',
    _basePath: 'assets/lang/',
    _data: null,

    init() {
        const section = document.getElementById(about._containerId);
        const header = document.getElementById(about._headerId);
        if (!section || !header) return;

        // Überschrift (wird per i18n ersetzt)
        const title = document.createElement('h2');
        title.dataset.i18n = 'ui.about.title';
        title.id = `${about._containerId}-title`;
        section.appendChild(title);

        // Textblock 
        const container = document.createElement('div');
        container.id = about._textBlockId;
        section.appendChild(container);

        container.innerHTML = '';
    },

    // Sprache laden 
    load() {
        // direkt auf globales i18n-Objekt zugreifen
        const jsonData = language?.data?.ui?.about;
        if (!jsonData) {
            console.warn('⚠️ Keine Sprachdaten für den About-Text gefunden');
            return;
        }

        about._data = jsonData;
        about._render();

        // Sprache anwenden (Überschrift etc.)
        language.applyTexts(about._containerId);
    },

    _render() {
        const textBlock = document.getElementById(about._textBlockId);
        const title = document.getElementById(`${about._containerId}-title`);

        if (!textBlock) return;

        // Alles neu aufbauen
        textBlock.innerHTML = '';

        // h2 Überschrift
        title.textContent = about._data.title;

        // Absätze: unterstützt String oder Array
        const paragraphs = Array.isArray(about._data.paragraphs)
            ? about._data.paragraphs
            : [about._data.paragraphs || ''];

        paragraphs.forEach(t => {
            if (!t) return;
            const p = document.createElement('p');
            p.textContent = t;
            textBlock.appendChild(p);
        });
    }
};
