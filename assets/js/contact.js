'use strict';

import { language } from './i18n.js';


export const contact = {

    // interne Konfiguration
    _containerId: 'contact-section',
    _basePath: 'assets/lang/',
    _data: null,

    structure: {
        titleId: 'contact-title',
        form: {
            nameLabelId: 'contact-name-label',
            emailLabelId: 'contact-email-label',
            messageLabelId: 'contact-message-label',
            buttonId: 'contact-submit'
        },
        social: {
            connectId: 'contact-connect',
            linkId: 'contact-linkedin'
        }
    },

    // DOM-Struktur aufbauen
    init() {
        
        const section = document.getElementById(contact._containerId);
        if (!section) return;

        // Bestehenden Inhalt leeren
        section.innerHTML = '';
    },
   
    // Sprache laden 
    load() {
        // direkt auf globales i18n-Objekt zugreifen
        const jsonData = language?.data?.ui?.contact;
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
        
        // Bestehenden Inhalt leeren
        section.innerHTML = '';

        // === Titel ===
        const title = document.createElement('h2');
        title.id = contact.structure.titleId;
        section.appendChild(title);

        // === Hauptcontainer ===
        const container = document.createElement('div');
        container.id = 'contact-container';
        

        // === Formular ===
        const form = document.createElement('form');
        form.id = 'contact-form';
        form.method = 'POST';
        form.action = 'https://formspree.io/f/xanaydqq';

        // Name
        form.appendChild(contact._createLabel(contact.structure.form.nameLabelId, 'name'));
        form.appendChild(contact._createInput('text', 'name', contact._data.form.namePlaceholder));

        // Email
        form.appendChild(contact._createLabel(contact.structure.form.emailLabelId, 'email'));
        form.appendChild(contact._createInput('email', 'email', contact._data.form.emailPlaceholder));

        // Nachricht
        form.appendChild(contact._createLabel(contact.structure.form.messageLabelId, 'message'));
        form.appendChild(contact._createTextarea('message', contact._data.form.messagePlaceholder));

        // Button
        const btn = document.createElement('button');
        btn.type = 'submit';
        btn.id = contact._data.form.buttonId;
        form.appendChild(btn);

        const status = document.createElement('p');
        status.id = 'form-status';
        form.appendChild(status);

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            contact._sendForm(form, status, btn);
        });

        // === Social-Bereich ===
        const social = document.createElement('div');
        social.id = 'contact-social';

        const h3 = document.createElement('h3');
        h3.id = contact._data.social.connectId;
        social.appendChild(h3);

        const link = document.createElement('a');
        link.id = contact._data.social.linkId;
        link.target = '_blank';
        link.className = 'linkedin-link';
        social.appendChild(link);

        container.appendChild(form);
        container.appendChild(social);
        section.appendChild(container);
    },

    _sendForm(form, status, btn) {
        status.textContent = 'Sende...';
        btn.disabled = true;

        const formData = new FormData(form);
        const xhr = new XMLHttpRequest();
        xhr.open('POST', form.action, true);
        xhr.setRequestHeader('Accept', 'application/json');

        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                btn.disabled = false;
                if (xhr.status === 200) {
                    status.textContent = '✅ Nachricht erfolgreich gesendet!';
                    form.reset();
                } else {
                    status.textContent = '❌ Fehler beim Senden. Bitte später erneut versuchen.';
                }
            }
        };
        xhr.send(formData);
    },

    /**************************************************************
     * Hilfsfunktionen
     **************************************************************/
    _createLabel(id, forId) {
        const label = document.createElement('label');
        label.id = id;
        label.htmlFor = forId;
        return label;
    },

    _createInput(type, id) {
        const input = document.createElement('input');
        input.type = type;
        input.id = id;
        input.name = id;
        input.required = true;
        return input;
    },

    _createTextarea(id) {
        const textarea = document.createElement('textarea');
        textarea.id = id;
        textarea.name = id;
        textarea.rows = 6;
        textarea.required = true;
        return textarea;
    }
};
