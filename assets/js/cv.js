'use strict';
/* cv.js
   Lädt und rendert die Lebenslauf-Sektion basierend auf der ausgewählten Sprache.
*/

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
