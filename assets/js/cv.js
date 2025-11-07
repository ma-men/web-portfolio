'use strict';

import { language } from './i18n.js';


export const cv = {

    _containerId: 'cv',
    _timelineId: 'cv-timeline',
    _basePath: 'assets/lang/',
    _data: null,

    init() {
        const section = document.getElementById(cv._containerId);
        if (!section) return;

        section.innerHTML = '';

        // Überschrift mit i18n-Key
        const title = document.createElement('h2');
        title.dataset.i18n = 'ui.cv.title';
        title.textContent = 'Lebenslauf';
        section.appendChild(title);

        // Timeline-Container
        const timeline = document.createElement('div');
        timeline.id = cv._timelineId;
        timeline.classList.add('cv-timeline');
        section.appendChild(timeline);

        // Texte aus ui_de.json / ui_en.json setzen
        language.applyTexts(cv._containerId);
    },

    load(lang) {
        const path = `${cv._basePath}cv_${lang}.json`;
        const data = cv._loadJSONSync(path) ||
            cv._loadJSONSync(`${cv._basePath}cv_de.json`) || {};
        cv._data = data;
        cv._render();
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
        const timeline = document.getElementById(cv._timelineId);
        if (!timeline || !cv._data) return;
        timeline.innerHTML = '';

        const entries = Array.isArray(cv._data.entries) ? cv._data.entries : [];
        for (let i = 0; i < entries.length; i++) {
            const e = entries[i];

            const item = document.createElement('div');
            item.classList.add('cv-item');

            const job = document.createElement('h3');
            job.textContent = e.job || '';

            const company = document.createElement('h4');
            company.textContent = e.company || '';

            const period = document.createElement('p');
            period.classList.add('cv-period');
            period.textContent = e.period || '';

            const tasks = document.createElement('p');
            tasks.classList.add('cv-tasks');
            tasks.textContent = e.tasks || '';

            item.appendChild(job);
            item.appendChild(company);
            item.appendChild(period);
            item.appendChild(tasks);
            timeline.appendChild(item);
        }
    }
};




/*
const loadCV = async (lang) => {
  const container = document.getElementById("cv-timeline");
  if (!container) return;
  container.innerHTML = "<p>Loading...</p>";

  try {
    const res = await fetch(`assets/lang/cv_${lang}.json`);
    const data = await res.json();
    renderCV(data.timeline, data.title);
  } catch (err) {
    console.error("Fehler beim Laden des Lebenslaufs:", err);
  }
};

const renderCV = (entries, title) => {
  const container = document.getElementById("cv-timeline");
  const titleElement = document.getElementById("cv-title");
  titleElement.textContent = title;
  container.innerHTML = "";

  entries.forEach((entry) => {
    const item = document.createElement("div");
    item.className = "cv-item";

    const header = document.createElement("h3");
    header.textContent = `${entry.company} (${entry.from} – ${entry.to})`;

    const list = document.createElement("ul");
    entry.positions.forEach((pos) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${pos.role}:</strong> ${pos.details}`;
      list.appendChild(li);
    });

    item.appendChild(header);
    item.appendChild(list);
    container.appendChild(item);
  });
};

document.addEventListener("languageChanged", (e) => loadCV(e.detail));
*/
