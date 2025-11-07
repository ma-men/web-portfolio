'use strict';
import { language } from './i18n.js';

export const footer = {

    _containerId: 'footer',

    init() {
        const footerEl = document.getElementById(footer._containerId);
        if (!footerEl) return;

        footerEl.innerHTML = '';

        // Container für Footer-Inhalte
        const container = document.createElement('div');
        container.classList.add('footer-container');

        // Impressum-Link
        const imprint = document.createElement('a');
        imprint.href = '#impressum'; // oder modales Fenster, je nach Projekt
        imprint.dataset.i18n = 'ui.footer.imprint';
        imprint.textContent = 'Impressum';

        // Datenschutz-Link
        const privacy = document.createElement('a');
        privacy.href = '#datenschutz';
        privacy.dataset.i18n = 'ui.footer.privacy';
        privacy.textContent = 'Datenschutz';

        // Trennzeichen
        const sep = document.createElement('span');
        sep.classList.add('footer-separator');
        sep.textContent = '|';

        // Copyright
        const copy = document.createElement('p');
        copy.dataset.i18n = 'ui.footer.copyright';
        copy.textContent = '© 2025 Martin Mengersen – Portfolio';

        // Aufbau der Struktur
        const linksWrapper = document.createElement('div');
        linksWrapper.classList.add('footer-links');
        linksWrapper.appendChild(imprint);
        linksWrapper.appendChild(sep);
        linksWrapper.appendChild(privacy);

        container.appendChild(copy);
        container.appendChild(linksWrapper);
        footerEl.appendChild(container);

        // Nach dem Aufbau Texte aus JSON anwenden
        language.applyTexts('footer');
    }
};
