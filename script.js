// GitHub API Projekte laden
async function loadProjects() {
  const username = "deinusername"; // <<-- GitHub-Name eintragen
  const url = `https://api.github.com/users/${username}/repos?sort=updated`;

  // Whitelist: nur bestimmte Repos anzeigen
  const allowedRepos = [
    "miniwss-javafx",
    "playwright-tests",
    "api-tests",
    "python-apps"
  ];

  try {
    const response = await fetch(url);
    const repos = await response.json();

    const container = document.getElementById("projects-grid");
    container.innerHTML = "";

    repos.forEach(repo => {
      if (!allowedRepos.includes(repo.name)) return;

      const card = document.createElement("div");
      card.className = "project-card";

      card.innerHTML = `
        <h3>${repo.name}</h3>
        <p>${repo.description || "Keine Beschreibung verfügbar."}</p>
        <p><strong>Sprache:</strong> ${repo.language || "–"}</p>
        <a href="${repo.html_url}" target="_blank" class="btn">GitHub Repo</a>
      `;

      container.appendChild(card);
    });

    if (container.innerHTML.trim() === "") {
      container.innerHTML = "<p>Keine Projekte aus der Whitelist gefunden.</p>";
    }
  } catch (error) {
    console.error("Fehler beim Laden der Repos:", error);
    document.getElementById("projects-grid").innerHTML = "<p>Fehler beim Laden der Projekte.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadProjects);

document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
});




document.querySelectorAll('.story-card').forEach(card => {
  const content = card.querySelector('.story-content');
  const fade = card.querySelector('.fade-out');
  const btn = card.querySelector('.toggle-btn');

  // prüfen, ob Inhalt höher ist als max-height
  if (content.scrollHeight > content.clientHeight) {
    card.classList.add('needs-expand');
  } else {
    // wenn nicht nötig → Button und Fade ausblenden
    fade.style.display = 'none';
    btn.style.display = 'none';
  }

  btn.addEventListener('click', () => {
    card.classList.toggle('expanded');
    if (card.classList.contains('expanded')) {
      btn.textContent = 'Weniger anzeigen';
      fade.style.display = 'none';
    } else {
      btn.textContent = 'Mehr anzeigen';
      fade.style.display = 'block';
    }
  });
});
