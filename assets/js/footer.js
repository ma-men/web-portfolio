'use strict';
import { language } from './i18n.js';

export const footer = {

    _containerId: 'footer',
    _data: null,

    init() {
        const footerEl = document.getElementById(footer._containerId);
        if (!footerEl) return;

        footerEl.innerHTML = '';

        const container = document.createElement('div');
        container.classList.add('footer-container');

        const copy = document.createElement('p');
        copy.dataset.i18n = 'ui.footer.copyright';
        copy.textContent = '© 2025 Martin Mengersen – Portfolio';

        const links = document.createElement('div');
        links.classList.add('footer-links');

        const imprint = document.createElement('a');
        imprint.href = '#impressum';
        imprint.dataset.i18n = 'ui.footer.imprint';
        imprint.textContent = 'Impressum';

        const sep = document.createElement('span');
        sep.classList.add('footer-separator');
        sep.textContent = '|';

        const privacy = document.createElement('a');
        privacy.href = '#datenschutz';
        privacy.dataset.i18n = 'ui.footer.privacy';
        privacy.textContent = 'Datenschutz';

        links.append(imprint, sep, privacy);
        container.append(copy, links);
        footerEl.appendChild(container);

        language.applyTexts(footer._containerId);
    },

    load(lang) {
        // keine eigene JSON, nur Texte aus ui_xx.json
        language.applyTexts(footer._containerId);
    }
};