export const stories = {

     // === Grundkonfiguration ===
    _containerId: 'stories-section', // ID des HTML-Elements, in dem die Stories erscheinen sollen
    _gridId: 'stories-grid',         // ID des Grid-Containers für die Story-Karten
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
        grid.id = stories._gridId;
        container.appendChild(grid);

        // spracheabhängige Texte anwenden
        language.applyTexts(stories._containerId);
    },

    /* Von außen aufrufen (z. B. in i18n.js): stories.load(language.current) */
    load(lang) {
        const path = `${stories._basePath}stories_${lang}.json`;
        // JSON-Daten laden (Fallback auf Deutsch)
        const data = stories._loadJSONSync(path) || stories._loadJSONSync(`${stories._basePath}stories_de.json`);
        // In-Memory-Daten setzen
        stories._data = data || {};
        // Neu rendern
        stories._render();
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
            console.log('Fehler beim Laden der Stories-Datei:', path);
        }
        return null;
    },
      

    _render() {
        // === Kürzel für die JSON-Struktur-Definition ===
        const cfg = stories.structure;      
        
        // === Metadaten aus JSON laden (Titel, Labels) ===
        const sectionData = stories._data[cfg.fields.section];

        // === Array der einzelnen Stories holen ===
        const storiesArr = stories._data[cfg.root];

        // === Ziel-Container im DOM finden ===
        const grid = document.getElementById(stories._gridId);

        // === Sicherheitsprüfung: Wenn keine Daten oder kein Container, Abbruch ===
        if (!grid || !storiesArr) return;

        // === Vorherige Inhalte entfernen ===
        grid.innerHTML = '';

        // === Haupttitel der Sektion setzen ===
        const titleElem = document.getElementById(stories._containerId + '-title');
        if (titleElem && sectionData?.title) {
            titleElem.textContent = sectionData.title;
        }

        // === Jede Story-Card erzeugen ===
        for (let i = 0; i < storiesArr.length; i++) {
            const s = storiesArr[i]; // aktuelle Story

            // --- Card-Grundelement ---
            const card = document.createElement('article');
            card.className = 'story-card';

            // --- Toggle-Link („mehr…“ / „weniger…“) ---
            const toggle = document.createElement('a');
            toggle.href = '#';
            toggle.className = 'story-card__toggle';
            toggle.textContent = sectionData.labels.more;

            // Klick-Event → Card auf-/zuklappen
            toggle.addEventListener('click', function (e) {
                e.preventDefault(); // kein Seiten-Sprung
                const expanded = card.classList.toggle('expanded'); // CSS-Klasse umschalten
                toggle.textContent = expanded
                    ? sectionData.labels.less
                    : sectionData.labels.more;
            });


            // --- Story-Titel ---
            const title = document.createElement('h3');
            title.className = 'story-card__title';
            title.textContent = s[f.title];

            // --- Story-Text ---
            const body = document.createElement('p');
            body.className = 'story-card__body';
            body.textContent = s[f.body];

            // --- Zusammenbauen ---
            card.append(toggle, title, body);
            grid.appendChild(card);
        }
    }
};
