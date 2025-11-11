'use strict';

import { language } from './i18n.js';

export const stories = {

     // === Grundkonfiguration ===
    _containerId: 'stories-section', // ID des HTML-Elements, in dem die Stories erscheinen sollen
    _basePath: 'assets/lang/',       // Pfad zum Ordner mit den Sprachdateien (JSON)
    _data: null,                     // Variable für die geladenen JSON-Daten
      
    // === Strukturdefinition der JSON-Datei ===
    structure: {
        root: 'stories', // oberster Schlüssel in der JSON-Datei, der das Array aller Stories enthält
        fields: {        // interne Feldnamenzuordnung
            section: 'section', // Schlüssel für Metadaten der Sektion (Titel, Labels)
            id: 'id',           // Story-ID
            title: 'title',     // Story-Titel
            body: 'body'        // Haupttext der Story
        }
    },

    // === Initialisierung der Story-Sektion ===
    init() {
        const container = document.getElementById(stories._containerId);
        if (!container) {
            console.warn('[Stories] Container nicht gefunden:', stories._containerId);
            return;
        }

        // Container-Inhalt leeren (falls zuvor schon geladen)
        container.innerHTML = '';

        // Überschrift (wird per i18n ersetzt)
        const title = document.createElement('h2');
        title.dataset.i18n = 'ui.stories.title';
        title.id = `${stories._containerId}-title`;
        title.textContent = 'Stories & Projekte';
        container.appendChild(title);

        // Grid-Container für Karten
        const grid = document.createElement('div');
        grid.id = `${stories._containerId}-grid`;
        grid.className = 'stories-grid'; // CSS-Klasse für Layout
        container.appendChild(grid);

        
    },

    // Sprache laden 
    load() {
        // direkt auf globales i18n-Objekt zugreifen
        const jsonData = language?.data?.stories;
        if (!jsonData) {
            console.warn('⚠️ Keine Sprachdaten für Stories gefunden');
            return;
        }

        stories._data = jsonData;
        stories._render();

        // Sprache anwenden (Überschrift etc.)
        language.applyTexts(stories._containerId);
    },
     

    _render() {
        // === Kürzel für die JSON-Struktur-Definition ===
        const cfg = stories.structure;      // z. B. { root: 'stories', fields: { ... } }
        const f = cfg.fields;               // Felder wie title, body usw.

        // === Metadaten aus JSON laden (Titel, Labels) ===
        const sectionData = stories._data[f.section];

        // === Array der einzelnen Stories holen ===
        const storiesArr = stories._data[cfg.root];

        // === Ziel-Container im DOM finden ===
        const grid = document.getElementById(`${stories._containerId}-grid`);

        // === Sicherheitsprüfung: Wenn keine Daten oder kein Container, Abbruch ===
        if (!grid || !storiesArr) return;

        // === Vorherige Inhalte entfernen ===
        grid.innerHTML = '';

        // === Haupttitel der Sektion setzen ===
        const titleElem = document.getElementById(`${stories._containerId}-title`);
        if (titleElem && sectionData?.title) titleElem.textContent = sectionData.title;

        // === Jede Story-Card erzeugen ===
        for (let i = 0; i < storiesArr.length; i++) {
            const s = storiesArr[i]; // aktuelle Story

            // --- Card-Grundelement ---
            const card = document.createElement('article');
            card.className = 'story-card';

            // --- Toggle-Link ("Mehr...") ---
            const toggle = document.createElement('a');
            toggle.href = '#';
            toggle.className = 'story-card__toggle';
            toggle.textContent = sectionData.labels.readMore; 

            // Klick-Event → Card auf-/zuklappen
           toggle.addEventListener('click', function (e) {
                e.preventDefault();

                // === Overlay erzeugen ===
                const overlay = document.createElement('div');
                overlay.className = 'story-overlay';

                // === Card klonen ===
                const clone = card.cloneNode(true);
                clone.className = 'story-card--overlay';
                clone.classList.add('expanded');

                // === "Mehr..."-Link im Klon ausblenden ===
                const toggleLink = clone.querySelector('.story-card__toggle');
                if (toggleLink) toggleLink.style.display = 'none';

                // === Fester Close-Button (×) ===
                const closeBtn = document.createElement('button');
                closeBtn.textContent = '×';
                closeBtn.className = 'story-close';
                clone.appendChild(closeBtn);

                // === Card ins Overlay einfügen ===
                overlay.appendChild(clone);
                document.body.appendChild(overlay);

                // === Overlay aktivieren mit leichtem Delay (für Transition) ===
                setTimeout(() => {
                    overlay.classList.add('active');
                }, 10);

                // === Scrollen im Hintergrund deaktivieren ===
                document.body.style.overflow = 'hidden';

                // === Schließen-Funktion ===
                const close = () => {
                    overlay.classList.remove('active');
                    document.body.style.overflow = '';
                    setTimeout(() => overlay.remove(), 400);
                };

                // === Button schließt Overlay ===
                closeBtn.addEventListener('click', close);

                // === Klick auf Hintergrund schließt ===
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) close();
                });

                // === ESC-Taste schließt Overlay ===
                document.addEventListener('keydown', function escClose(evt) {
                    if (evt.key === 'Escape') {
                        close();
                        document.removeEventListener('keydown', escClose);
                    }
                });
            });





            // --- Story-Titel ---
            const title = document.createElement('h3');
            title.className = 'story-card__title';
            title.textContent = s[f.title];

            // --- Story-Text ---
            const body = document.createElement('div');
            body.className = 'story-card__body';

            // Prüfen, ob body ein Array (mehrere Absätze) ist
            if (Array.isArray(s[f.body])) {
                s[f.body].forEach(txt => {
                    const p = document.createElement('p');
                    p.textContent = txt;
                    body.appendChild(p);
                });
            } else {
                // Falls kein Array, einfachen Text verwenden
                const p = document.createElement('p');
                p.textContent = s[f.body];
                body.appendChild(p);
            }

            // --- Zusammenbauen ---
            card.append(toggle, title, body);
            grid.appendChild(card);
        }
    }

};
