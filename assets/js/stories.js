'use strict';


import { language } from './i18n.js';


export const stories = {

    // === Basiskonfiguration ===
    _containerId: 'stories-section',   // ID des HTML-Containers
    _basePath: 'assets/lang/',         // Pfad zu den JSON-Dateien
    _data: null,                       // geladene JSON-Daten
    _lang: 'de',                       // aktuelle Sprache

    // JSON-Struktur-Konfiguration
    _structure: {
        root: 'stories',               // Liste der Stories
        fields: {
            section: 'section',        // Abschnittsmetadaten
            title: 'title',
            subtitle: 'subtitle',
            excerpt: 'excerpt',
            body: 'body',
            id: 'id'
        }
    },

    // === Initialisierung ===
    init() {
        const container = document.getElementById(this._containerId);
        if (!container) {
            console.warn(`[Stories] Container #${this._containerId} nicht gefunden.`);
            return;
        }

        // Container leeren und vorbereiten
        container.innerHTML = '';
        this._createStructure(container);

        // Initiale Sprache laden (Default: de)
        this.load(this._lang);
    },

    // === JSON laden ===
    load(lang) {
        this._lang = lang;
        const filePath = `${this._basePath}stories_${lang}.json`;
        this._data = this.loadJSON(filePath);

        if (!this._data) {
            console.error(`[Stories] Keine Daten in ${filePath} geladen.`);
            return;
        }

        this.render();

        // Sprachtexte anwenden (globales Modul)
        if (typeof language !== 'undefined' && language.applyTexts) {
            language.applyTexts(this._containerId);
        }
    },


    // === JSON über XMLHttpRequest laden ===
    loadJSON(path) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', path, false); // synchron (wie bei Skills)
        xhr.send(null);

        if (xhr.status === 200) {
            try {
                return JSON.parse(xhr.responseText);
            } catch (e) {
                console.error(`[Stories] JSON-Parsing-Fehler in ${path}`, e);
                return null;
            }
        } else {
            console.error(`[Stories] Fehler beim Laden von ${path}: ${xhr.status}`);
            return null;
        }
    },

    // === Struktur im DOM vorbereiten ===
    _createStructure(container) {
        // Titel
        const title = document.createElement('h2');
        title.id = `${this._containerId}-title`;
        title.setAttribute('data-lang-key', 'stories_title');
        container.appendChild(title);

        // Grid
        const grid = document.createElement('div');
        grid.className = 'stories-grid';
        grid.id = `${this._containerId}-grid`;
        container.appendChild(grid);

        // Modalcontainer
        const modalContainer = document.createElement('div');
        modalContainer.id = `${this._containerId}-modal`;
        modalContainer.className = 'stories-modal';
        document.body.appendChild(modalContainer);
    },



    // === Cards rendern ===
    render() {
        const f = this._structure.fields;
        const rootKey = this._structure.root;
        const sectionData = this._data[f.section];
        const stories = this._data[rootKey];
        const grid = document.getElementById(`${this._containerId}-grid`);
        const modalContainer = document.getElementById(`${this._containerId}-modal`);

        if (!grid) return;

        grid.innerHTML = '';

        // Titeltext aktualisieren
        const titleElem = document.getElementById(`${this._containerId}-title`);
        if (titleElem && sectionData?.title) {
            titleElem.textContent = sectionData.title;
        }

        // Karten rendern
        stories.forEach((story) => {
            const card = document.createElement('article');
            card.className = 'story-card';
            card.innerHTML = `
                <div class="story-card__inner">
                    <h3>${story[f.title]}</h3>
                    <p class="story-subtitle">${story[f.subtitle] ?? ''}</p>
                    <p class="story-excerpt">${story[f.excerpt] ?? ''}</p>
                    <button class="story-readmore" data-id="${story[f.id]}">
                        ${sectionData?.labels?.readMore || 'Mehr lesen'}
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });

        // Modal-Events aktivieren
        grid.querySelectorAll('.story-readmore').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const story = stories.find(s => s[f.id] === id);
                if (story) this._openModal(story, sectionData);
            });
        });

        // Falls Modal noch nicht existiert
        if (!modalContainer.querySelector('.stories-modal__panel')) {
            this._createModal(modalContainer, sectionData);
        }
    },

    // === Modal erzeugen ===
    _createModal(modalContainer, sectionData) {
        modalContainer.innerHTML = `
            <div class="stories-modal__panel">
                <button class="stories-modal__close" aria-label="${sectionData?.labels?.close || 'Schließen'}">×</button>
                <h3 class="stories-modal__title"></h3>
                <div class="stories-modal__body"></div>
            </div>
        `;

        // Events
        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer) this._closeModal();
        });

        modalContainer.querySelector('.stories-modal__close').addEventListener('click', () => this._closeModal());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this._closeModal();
        });
    },

    // === Modal öffnen ===
    _openModal(story, sectionData) {
        const f = this._structure.fields;
        const modalContainer = document.getElementById(`${this._containerId}-modal`);
        const title = modalContainer.querySelector('.stories-modal__title');
        const body = modalContainer.querySelector('.stories-modal__body');

        title.textContent = story[f.title];
        body.innerHTML = `
            <p class="story-modal__subtitle">${story[f.subtitle] ?? ''}</p>
            <p class="story-modal__bodytext">${story[f.body] ?? ''}</p>
        `;

        modalContainer.classList.add('is-open');
    },

    // === Modal schließen ===
    _closeModal() {
        const modalContainer = document.getElementById(`${this._containerId}-modal`);
        if (modalContainer) modalContainer.classList.remove('is-open');
    }
};







/*

const loadStories = async (lang) => {
  const container = document.getElementById("stories-grid");
  if (!container) return;

  try {
    const res = await fetch(`assets/lang/stories_${lang}.json`);
    const data = await res.json();
    renderStories(data.stories, data.title);
  } catch (err) {
    console.error("Fehler beim Laden der Stories:", err);
  }
};

const renderStories = (stories, title) => {
  const titleElement = document.getElementById("stories-title");
  titleElement.textContent = title;

  const container = document.getElementById("stories-grid");
  container.innerHTML = "";

  stories.forEach((story) => {
    const card = document.createElement("div");
    card.className = "story-card";

    card.innerHTML = `
      <h3>${story.title}</h3>
      <p><em>${story.year}</em></p>
      <p>${story.summary}</p>
      <details>
        <summary>Mehr erfahren</summary>
        <p>${story.details}</p>
      </details>
    `;

    container.appendChild(card);
  });
};

document.addEventListener("languageChanged", (e) => loadStories(e.detail));

*/

