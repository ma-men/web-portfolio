'use strict';

import { language } from './i18n.js';


export const contact = {

    // interne Konfiguration
    _containerId: 'contact-section',
    _basePath: 'assets/lang/',
    _data: null,

    // contact.structure.legal.legalLinksId;
    structure: {
        titleId: 'contact-title',
        form: {
            formId: 'contact-form',
            nameLabelId: 'contact-name-label',
            emailLabelId: 'contact-email-label',
            messageLabelId: 'contact-message-label',
            buttonId: 'contact-submit'
        },
        social: {
            connectId: 'contact-connect',
            linkId: 'contact-linkedin'
        },
        legal: {
            legalLinksId: 'legal-links'
        },
    },

    // DOM-Struktur aufbauen
    init() {

        const section = document.getElementById(contact._containerId);
        if (!section) return;

        // Bestehenden Inhalt leeren
        section.innerHTML = '';

        // === Titel ===
        const title = document.createElement('h2');
        title.dataset.i18n = 'ui.contact.title';
        title.textContent = 'Kontakt';
        section.appendChild(title);

        // === Hauptcontainer ===
        const container = document.createElement('div');
        container.classList.add('contact-container');
        section.appendChild(container);
    },

    // Sprache laden 
    load() {
        // direkt auf globales i18n-Objekt zugreifen
        const jsonData = language?.data?.contact?.contact;

        // Der doppelte contact ist hier technisch korrekt, weil:
        // im Namespace „contact“ steht (language.data.contact = JSON.parse(...)),
        // und in der Datei selbst das Objekt {"contact": {...}} steht.
        if (!jsonData) {
            console.warn('⚠️ Keine Sprachdaten für den Kontaktbereich gefunden');
            return;
        }

        contact._data = jsonData;
        contact._render();

        // Sprache anwenden (Überschrift etc.)
        language.applyTexts(contact._containerId);
    },


    _render() {
        const section = document.getElementById(contact._containerId);
        if (!section || !contact._data) return;

        // Container-Referenz
        const container = section.querySelector('.contact-container');
        if (!container) return;

        // Bestehenden Inhalt leeren
        container.innerHTML = '';
        

        // === Formular ===
        const form = document.createElement('form');
        form.id = contact.structure.form.formId;
        form.method = 'POST';
        form.action = 'https://formspree.io/f/xanaydqq';

        // Name
        form.appendChild(contact._createLabel(contact.structure.form.nameLabelId, 'name'));
        form.appendChild(contact._createInput('text', 'name'));

        // Email
        form.appendChild(contact._createLabel(contact.structure.form.emailLabelId, 'email'));
        form.appendChild(contact._createInput('email', 'email'));

        // Nachricht
        form.appendChild(contact._createLabel(contact.structure.form.messageLabelId, 'message'));
        form.appendChild(contact._createTextarea('message'));



        // Button
        const btn = document.createElement('button');
        btn.type = 'submit';
        btn.id = contact.structure.form.buttonId;
        btn.dataset.i18n = 'contact.form.submit';
        form.appendChild(btn);

        const status = document.createElement('p');
        status.id = 'form-status';
        form.appendChild(status);

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            contact._sendForm(form, status, btn);
        });
        container.appendChild(form);

        // Legal Links
        const legalLinks = document.createElement('div');
        legalLinks.id = contact.structure.legal.legalLinksId;

        const a1 = document.createElement('a');
        a1.href = '#';
        a1.dataset.i18n = 'contact.legal.impressum';
        legalLinks.appendChild(a1);

        const sep = document.createElement('span');
        sep.textContent = ' • ';
        legalLinks.appendChild(sep);

        const a2 = document.createElement('a');
        a2.href = '#';
        a2.dataset.i18n = 'contact.legal.datenschutz';
        legalLinks.appendChild(a2);

        container.appendChild(legalLinks);

        // Footer
        const footer = document.createElement('div');
        footer.id = 'page-footer';
        container.appendChild(footer);

        // Overlay für Impressum
        container.appendChild(contact._createModal('impressum'));
        // Overlay für Datenschutz
        container.appendChild(contact._createModal('datenschutz'));

        // Events für Overlays
        contact._initModals();
    },

    _sendForm(form, status, btn) {
        // Sprachabhängige Status-Texte laden
        const txt = language?.data?.contact?.formStatus || {
            sending: 'Sende...',
            success: '✅ Nachricht erfolgreich gesendet!',
            error: '❌ Fehler beim Senden.'
        };

        status.textContent = txt.sending;
        btn.disabled = true;

        const data = new FormData(form);
        const xhr = new XMLHttpRequest();
        xhr.open('POST', form.action, true);
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                btn.disabled = false;
                if (xhr.status === 200) {
                    status.textContent = txt.success;
                    form.reset();
                } else {
                    status.textContent = txt.error;
                }
            }
        };
        xhr.send(data);
    },

    /**************************************************************
     * Hilfsfunktionen
     **************************************************************/
    _createLabel(id, forId) {
        const label = document.createElement('label');
        label.id = id;
        label.htmlFor = forId;
        
        if(forId === 'name') label.dataset.i18n = 'contact.form.nameLabel';
        if(forId === 'email') label.dataset.i18n = 'contact.form.emailLabel';
        if(forId === 'message') label.dataset.i18n = 'contact.form.messageLabel';
        return label;
    },

    _createInput(type, id) {
        const input = document.createElement('input');
        input.type = type;
        input.id = id;
        input.name = id;
        input.required = true;

        if(id === 'name') input.dataset.i18n = 'contact.form.namePlaceholder';
        if(id === 'email') input.dataset.i18n = 'contact.form.emailPlaceholder';
        return input;
    },

    _createTextarea(id, placeholder) {
        const textarea = document.createElement('textarea');
        textarea.id = id;
        textarea.name = id;
        textarea.rows = 6;
        textarea.required = true;
        textarea.dataset.i18n = 'contact.form.messagePlaceholder';
        return textarea;
    },

    _createModal(type) {
        const modal = document.createElement('div');
        modal.className = 'modal-backdrop';
        modal.id = `modal-${type}`;

        const card = document.createElement('div');
        card.className = 'modal-card';

        const header = document.createElement('div');
        header.className = 'modal-header';

        const title = document.createElement('h2');
        title.className = 'modal-title';
        title.id = `${type}-title`;
        header.appendChild(title);

        const close = document.createElement('button');
        close.className = 'modal-close';
        close.textContent = '×';
        close.setAttribute('data-close', type);
        header.appendChild(close);

        const content = document.createElement('div');
        content.className = 'modal-content';
        content.id = `modal-content-${type}`;

        card.appendChild(header);
        card.appendChild(content);
        modal.appendChild(card);

        return modal;
    },

    _initModals() {
        const impr = document.getElementById('modal-impressum');
        const ds = document.getElementById('modal-datenschutz');
        const openImpr = document.getElementById('open-impressum');
        const openDs = document.getElementById('open-datenschutz');

        const open = (modal) => modal.classList.add('active');
        const close = (modal) => modal.classList.remove('active');

        openImpr.addEventListener('click', e => { e.preventDefault(); open(impr); });
        openDs.addEventListener('click', e => { e.preventDefault(); open(ds); });

        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                const which = btn.getAttribute('data-close');
                if (which === 'impressum') close(impr);
                if (which === 'datenschutz') close(ds);
            });
        });

        [impr, ds].forEach(modal => {
            modal.addEventListener('click', e => {
                if (e.target === modal) close(modal);
            });
        });

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                close(impr);
                close(ds);
            }
        });
    }
};
