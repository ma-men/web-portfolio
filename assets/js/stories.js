'use strict';
import { language } from './i18n.js';

export const stories = {

    _containerId: 'stories',
    _gridId: 'stories-grid',
    _basePath: 'assets/lang/',
    _data: null,

    init() {
        const section = document.getElementById(stories._containerId);
        if (!section) return;

        section.innerHTML = '';

        // Überschrift mit i18n-Key
        const title = document.createElement('h2');
        title.dataset.i18n = 'ui.stories.title';
        title.textContent = 'Stories';
        section.appendChild(title);

        // Grid-Container
        const grid = document.createElement('div');
        grid.id = stories._gridId;
        grid.classList.add('stories-grid');
        section.appendChild(grid);

        // Texte aus ui_xx.json anwenden
        language.applyTexts(stories._containerId);
    },

    load(lang) {
        const path = `${stories._basePath}stories_${lang}.json`;
        const data = stories._loadJSONSync(path) ||
            stories._loadJSONSync(`${stories._basePath}stories_de.json`) || {};
        stories._data = data;
        stories._render();
    },

    _loadJSONSync(path) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', path, false);
        try {
            xhr.send();
            if (xhr.status >= 200 && xhr.status < 300) {
                return JSON.parse(xhr.responseText);
            }
        } catch { }
        return null;
    },

    _render() {
        const grid = document.getElementById(stories._gridId);
        if (!grid || !stories._data) return;
        grid.innerHTML = '';

        const entries = Array.isArray(stories._data.entries) ? stories._data.entries : [];
        for (let i = 0; i < entries.length; i++) {
            const s = entries[i];

            const card = document.createElement('div');
            card.classList.add('story-card');

            const title = document.createElement('h3');
            title.textContent = s.title || '';

            const text = document.createElement('p');
            text.textContent = s.text || '';

            card.appendChild(title);
            card.appendChild(text);
            grid.appendChild(card);
        }
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

