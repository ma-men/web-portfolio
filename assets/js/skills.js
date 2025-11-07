'use strict';
/* Sills.js
   Lädt und rendert die Fähigkeiten-Sektion basierend auf der ausgewählten Sprache.
*/

import { language } from './i18n.js';

export const skills = {

    // interne „Konstanten“ und Pfade
    basePath: 'assets/lang/',
    starIcons: {
        full: 'assets/icons/star-full.svg',
        half: 'assets/icons/star-half.svg',
        empty: 'assets/icons/star-empty.svg'
    },
    _containerId: 'skills',
    _gridId: 'skills-grid',
    _data: null,

    init() {
        const section = document.getElementById(skills._containerId);
        if (!section) return;

        section.innerHTML = '';
        const title = document.createElement('h2');
        title.id = 'skills-title';
        section.appendChild(title);

        const grid = document.createElement('div');
        grid.id = skills._gridId;
        grid.classList.add('skills-grid');
        section.appendChild(grid);
    },
    /* Von außen aufrufen (z. B. in i18n.js): skills.load(language.current) */
    load(lang) {
        const path = skills.basePath + 'skills_' + lang + '.json';
        const xhr = new XMLHttpRequest();
        xhr.open('GET', path, false);
        try {
            xhr.send();
            if (xhr.status >= 200 && xhr.status < 300) {
                skills._data = JSON.parse(xhr.responseText);
            }
        } catch {
            skills._data = null;
        }

        skills._render();
    },

    _render() {
        const grid = document.getElementById(skills._gridId);
        if (!grid) return;

        grid.innerHTML = '';

        const data = skills._data;
        if (!data || !Array.isArray(data.categories)) {
            grid.textContent = 'Keine Daten gefunden.';
            return;
        }

        for (let i = 0; i < data.categories.length; i++) {
            const cat = data.categories[i];
            const card = document.createElement('div');
            card.classList.add('skill-card');

            const h3 = document.createElement('h3');
            h3.textContent = cat.name;
            card.appendChild(h3);

            const ul = document.createElement('ul');
            for (let j = 0; j < cat.items.length; j++) {
                const it = cat.items[j];
                const li = document.createElement('li');

                const nameSpan = document.createElement('span');
                nameSpan.textContent = it.name;
                nameSpan.classList.add('skill-name');

                const stars = skills._renderStars(it.level);
                li.appendChild(nameSpan);
                li.appendChild(stars);
                ul.appendChild(li);
            }

            card.appendChild(ul);
            grid.appendChild(card);
        }
    },

    _renderStars(level) {
        const span = document.createElement('span');
        span.classList.add('skill-stars');

        for (let i = 0; i < 5; i++) {
            const img = document.createElement('img');
            img.src = i < level
                ? skills.starIcons.full
                : skills.starIcons.empty;
            img.alt = i < level ? '★' : '☆';
            img.classList.add('star');
            span.appendChild(img);
        }

        return span;
    }

};

/*
const loadSkills = async (lang) => {
const container = document.getElementById("skills-grid");
if (!container) return;
container.innerHTML = "<p>Loading...</p>";

try {
  const response = await fetch(`assets/lang/skills_${lang}.json`);
  const data = await response.json();
  renderSkills(data.groups);
} catch (err) {
  console.error("Fehler beim Laden der Skills:", err);
  container.innerHTML = "<p>Fehler beim Laden der Daten.</p>";
}
};




const renderSkills = (groups) => {
const container = document.getElementById("skills-grid");
container.innerHTML = "";

groups.forEach((group) => {
  const card = document.createElement("div");
  card.className = "skill-card";

  const title = document.createElement("h3");
  title.textContent = group.group;
  card.appendChild(title);

  group.skills.forEach((skill) => {
    const row = document.createElement("div");
    row.className = "skill-row";

    const name = document.createElement("span");
    name.className = "skill-name";
    name.textContent = skill.name;

    const stars = document.createElement("div");
    stars.className = "stars";

    for (let i = 1; i <= 5; i++) {
      const img = document.createElement("img");
      img.className = "star";
      img.src =
        skill.rating >= i
          ? starIcons.full
          : skill.rating >= i - 0.5
          ? starIcons.half
          : starIcons.empty;
      stars.appendChild(img);
    }

    row.appendChild(name);
    row.appendChild(stars);
    card.appendChild(row);

    if (skill.desc) {
      const p = document.createElement("p");
      p.className = "skill-desc";
      p.textContent = skill.desc;
      card.appendChild(p);
    }

    if (skill.certs) {
      const ul = document.createElement("ul");
      ul.className = "cert-list";
      skill.certs.forEach((cert) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = `assets/certs/${cert.file}`;
        a.target = "_blank";
        a.textContent = cert.label;
        li.appendChild(a);
        ul.appendChild(li);
      });
      card.appendChild(ul);
    }
  });

  container.appendChild(card);
});
};

// 🔁 Auf Sprachwechsel reagieren
document.addEventListener("languageChanged", (e) => {
loadSkills(e.detail);
});
*/

