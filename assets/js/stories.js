'use strict';
/* stories.js
   Lädt und rendert die Stories-Sektion basierend auf der ausgewählten Sprache.
*/

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

