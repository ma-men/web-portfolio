'use strict';
/* Sills.js
   Lädt und rendert die Fähigkeiten-Sektion basierend auf der ausgewählten Sprache.
*/


const starIcons = {
  full: "assets/icons/star-full.svg",
  half: "assets/icons/star-half.svg",
  empty: "assets/icons/star-empty.svg",
};

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
