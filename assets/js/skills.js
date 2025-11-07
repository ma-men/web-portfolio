'use strict';

import { language } from './i18n.js';

export const skills = {

    // interne Konfiguration / „Konstanten“
    _containerId: 'skills',
    _titleId: 'skills-title',
    _gridId: 'skills-grid',
    _basePath: 'assets/lang/',
    _data: null,

    // Pfade zu Stern-Icons (optional: du kannst auch Unicode-Sterne verwenden)
    starIcons: {
        full: 'assets/icons/star-full.svg',
        half: 'assets/icons/star-half.svg',
        empty: 'assets/icons/star-empty.svg'
    },

    // DOM-Struktur aufbauen 
    init() {
        const section = document.getElementById(skills._containerId);
        if (!section) return;

        section.innerHTML = '';

        // Überschrift – kann später durch UI-JSON oder Skills-JSON überschrieben werden
        const title = document.createElement('h2');
        title.id = skills._titleId;
        // Optional: wenn du den Titel aus ui_xx.json pflegen willst, setze einen i18n-Key:
        // title.dataset.i18n = 'ui.skills.title';
        title.textContent = 'Skills';
        section.appendChild(title);

        // Grid-Container für Karten
        const grid = document.createElement('div');
        grid.id = skills._gridId;
        grid.classList.add('skills-grid');
        section.appendChild(grid);

        // spracheabhängige Texte anwenden
        language.applyTexts(skills._containerId);
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

    // Karten aus den geladenen Daten zeichnen
    _render() {
        const grid = document.getElementById(skills._gridId);
        const titleEl = document.getElementById(skills._titleId);
        if (!grid || !titleEl) return;

        grid.innerHTML = '';

        const data = skills._data || {};
        // Titel aus skills_<lang>.json, falls vorhanden
        if (typeof data.title === 'string' && data.title.trim().length > 0) {
            titleEl.textContent = data.title;
        }

        const categories = Array.isArray(data.categories) ? data.categories : [];
        if (categories.length === 0) {
            const p = document.createElement('p');
            p.classList.add('skills-empty');
            p.textContent = 'Keine Skill-Daten gefunden.';
            grid.appendChild(p);
            return;
        }

        for (let i = 0; i < categories.length; i++) {
            const cat = categories[i];

            const card = document.createElement('div');
            card.classList.add('skill-card');

            // Kategoriename
            const catTitle = document.createElement('h3');
            catTitle.textContent = typeof cat.name === 'string' ? cat.name : 'Kategorie';
            card.appendChild(catTitle);

            // Liste von Items
            const ul = document.createElement('ul');
            ul.classList.add('skill-list');

            const items = Array.isArray(cat.items) ? cat.items : [];
            for (let j = 0; j < items.length; j++) {
                const it = items[j];

                const li = document.createElement('li');

                const nameSpan = document.createElement('span');
                nameSpan.classList.add('skill-name');
                nameSpan.textContent = typeof it.name === 'string' ? it.name : 'Skill';

                const starsSpan = skills._renderStars(typeof it.level === 'number' ? it.level : 0);

                li.appendChild(nameSpan);
                li.appendChild(starsSpan);
                ul.appendChild(li);
            }

            card.appendChild(ul);
            grid.appendChild(card);
        }
    },

    // Sterne-Rendering (unterstützt Ganzzahl und .5 → halb)
    _renderStars(levelNumber) {
        const span = document.createElement('span');
        span.classList.add('skill-stars');

        const fullCount = Math.floor(levelNumber);
        const hasHalf = levelNumber - fullCount >= 0.5;
        const total = 5;

        for (let i = 0; i < total; i++) {
            const img = document.createElement('img');
            img.classList.add('star');

            if (i < fullCount) {
                img.src = skills.starIcons.full;
                img.alt = '★';
            } else if (i === fullCount && hasHalf) {
                img.src = skills.starIcons.half;
                img.alt = '☆'; // optional: '½'
            } else {
                img.src = skills.starIcons.empty;
                img.alt = '☆';
            }

            span.appendChild(img);
        }

        return span;
    }
};

/*
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
*/
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

