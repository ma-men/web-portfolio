'use strict';

import { language } from './i18n.js';


export const footer = {

    // interne Konfiguration
    _containerId: 'footer-section',
    _basePath: 'assets/lang/',
    _data: null,

    // Aufruf Beispiel: footer.structure.contact.formStatus.status;
    structure: {
        section: '',
        contact: {
            form: {
                formId: 'contact-form',
                nameLabelId: 'contact-name-label',
                emailLabelId: 'contact-email-label',
                messageLabelId: 'contact-message-label',
                buttonId: 'contact-submit'
            },
            formStatus: {
                statusId: 'form-status'
            },
            social: {
                connectId: 'contact-connect',
                linkId: 'contact-linkedin'
            },
        },
        legal: {
            legalLinksId: 'legal-links',
            impressumId: 'open-impressum',
            datenschutzId: 'open-datenschutz'
        },
        copyright: '',
        modals: {
            impressum: {
                title: '',
                content: ''
            },
            datenschutz: {
                title: '',
                content: ''
            }
        }
    },

    // DOM-Struktur aufbauen
    init() {

        const section = document.getElementById(footer._containerId);
        if (!section) return;

        // Bestehenden Inhalt leeren
        section.innerHTML = '';

        // === Titel ===
        const title = document.createElement('h2');
        title.dataset.i18n = 'ui.footer.title';
        title.id = `${footer._containerId}-title`;
        section.appendChild(title);

        // === Hauptcontainer ===
        const container = document.createElement('div');
        container.classList.add('footer-container');
        section.appendChild(container);
    },

    // Sprache laden 
    load() {
        // direkt auf globales i18n-Objekt zugreifen
        const jsonData = language?.data?.footer;

        // Der doppelte contact ist hier technisch korrekt, weil:
        // im Namespace „contact“ steht (language.data.contact = JSON.parse(...)),
        // und in der Datei selbst das Objekt {"contact": {...}} steht.
        if (!jsonData) {
            console.warn('⚠️ Keine Sprachdaten für den Footerbereich gefunden');
            return;
        }

        footer._data = jsonData;
        footer._render();

        // Sprache anwenden (Überschrift etc.)
        language.applyTexts(footer._containerId);
    },


    _render() {
        const section = document.getElementById(footer._containerId);
        if (!section || !footer._data) return;

        // Container-Referenz
        const container = section.querySelector('.footer-container');
        if (!container) return;

        // Bestehenden Inhalt leeren
        container.innerHTML = '';
        
        // === Haupttitel der Sektion setzen ===
        const titleElem = document.getElementById(`${footer._containerId}-title`);
        if (titleElem) titleElem.textContent = footer._data.section.title;


        
        // === Formular ===
        const form = document.createElement('form');
        form.id = footer.structure.contact.form.formId;
        form.method = 'POST';
        form.action = 'https://formspree.io/f/xanaydqq';

        // Name
        form.appendChild(footer._createLabel(footer.structure.contact.form.nameLabelId, 'name'));
        form.appendChild(footer._createInput('text', 'name'));

        // Email
        form.appendChild(footer._createLabel(footer.structure.contact.form.emailLabelId, 'email'));
        form.appendChild(footer._createInput('email', 'email'));

        // Nachricht
        form.appendChild(footer._createLabel(footer.structure.contact.form.messageLabelId, 'message'));
        form.appendChild(footer._createTextarea('message'));



        // Button
        const btn = document.createElement('button');
        btn.type = 'submit';
        btn.id = footer.structure.contact.form.buttonId;
        btn.dataset.i18n = 'footer.contact.form.submit';
        form.appendChild(btn);

        const status = document.createElement('p');
        status.id = footer.structure.contact.formStatus.statusId;
        form.appendChild(status);

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            contact._sendForm(form, status, btn);
        });
        container.appendChild(form);

        // social
        const social = footer._createSocial();
        if (social) {
            container.appendChild(social);
        }

        // Legal Links
        const legalLinks = document.createElement('div');
        legalLinks.id = footer.structure.legal.legalLinksId;

        const a1 = document.createElement('a');
        a1.href = '#';
        a1.dataset.i18n = 'footer.legal.impressum';
        a1.id = footer.structure.legal.impressumId;
        legalLinks.appendChild(a1);

        const sep = document.createElement('span');
        sep.textContent = ' • ';
        legalLinks.appendChild(sep);

        const a2 = document.createElement('a');
        a2.href = '#';
        a2.dataset.i18n = 'footer.legal.datenschutz';
        a2.id = footer.structure.legal.datenschutzId;
        legalLinks.appendChild(a2);

        container.appendChild(legalLinks);

        // Copyright
        const copyright = document.createElement('div');
        copyright.id = 'copyright';
        container.appendChild(copyright);

        // Overlay für Impressum
        container.appendChild(footer._createModal('impressum'));
        // Overlay für Datenschutz
        container.appendChild(footer._createModal('datenschutz'));

        // Events für Overlays
        footer._initModals();

        // fülle die modals
        footer._fillModals();
    },

    _sendForm(form, status, btn) {
        // Sprachabhängige Status-Texte laden
        const txt = language?.data?.footer?.contact?.formStatus || {
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
        
        if(forId === 'name') label.dataset.i18n = 'footer.contact.form.nameLabel';
        if(forId === 'email') label.dataset.i18n = 'footer.contact.form.emailLabel';
        if(forId === 'message') label.dataset.i18n = 'footer.contact.form.messageLabel';
        return label;
    },

    _createInput(type, id) {
        const input = document.createElement('input');
        input.type = type;
        input.id = id;
        input.name = id;
        input.required = true;

        if(id === 'name') input.dataset.i18n = 'footer.contact.form.namePlaceholder';
        if(id === 'email') input.dataset.i18n = 'footer.contact.form.emailPlaceholder';
        return input;
    },

    _createTextarea(id, placeholder) {
        const textarea = document.createElement('textarea');
        textarea.id = id;
        textarea.name = id;
        textarea.rows = 6;
        textarea.required = true;
        textarea.dataset.i18n = 'footer.contact.form.messagePlaceholder';
        return textarea;
    },

    _createSocial() {
        const socialData = footer._data.contact.social;
        if (!socialData) return null;

        const wrapper = document.createElement('div');
        wrapper.id = 'social-links';

        const heading = document.createElement('h3');
        heading.dataset.i18n = 'footer.contact.social.connect';
        heading.textContent = socialData.connect || 'Vernetzen Sie sich mit mir';
        wrapper.appendChild(heading);

        const links = socialData.links;
        for (const key in links) {
            const info = links[key];
            const a = document.createElement('a');
            a.href = info.url;
            a.target = '_blank';
            a.rel = 'noopener';

            a.style.display = 'flex';
            a.style.alignItems = 'center';
            a.style.gap = '0.45rem';
            a.style.fontSize = '1.05rem';
            a.style.color = '#1a0dab';
            a.style.fontWeight = '500';
            a.style.textDecoration = 'none';

            a.onmouseenter = () => a.style.textDecoration = 'underline';
            a.onmouseleave = () => a.style.textDecoration = 'none';

            // ICON
            const icon = document.createElement('span');
            icon.textContent = info.iconText;
            icon.style.display = 'inline-flex';
            icon.style.justifyContent = 'center';
            icon.style.alignItems = 'center';
            icon.style.width = '22px';
            icon.style.height = '22px';
            icon.style.borderRadius = '4px';
            icon.style.fontSize = '0.8rem';
            icon.style.fontWeight = 'bold';
            icon.style.color = '#fff';
            icon.style.background = info.iconBg;

            // TEXT
            const text = document.createElement('span');
            text.textContent = info.text;

            a.appendChild(icon);
            a.appendChild(text);
            wrapper.appendChild(a);
        }
        return wrapper;
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
    },

    _fillModals() {
        const data = footer._data.modals;
        const impr = document.getElementById('modal-impressum');
        const ds = document.getElementById('modal-datenschutz');
        if (impr && data.impressum) {
            impr.querySelector('.modal-content').innerHTML = data.impressum.content;
        }
        if (ds && data.datenschutz) {
            ds.querySelector('.modal-content').innerHTML = data.datenschutz.content;
        }
    }
};
