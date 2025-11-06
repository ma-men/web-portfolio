'use strict';

document.addEventListener("DOMContentLoaded", () => {
  const navContainer = document.getElementById("nav-container");

  const menuItems = [
    { id: "about-section", i18n: "menu-about" },
    { id: "skills-section", i18n: "menu-skills" },
    { id: "cv-section", i18n: "menu-cv" },
    { id: "stories-section", i18n: "menu-stories" },
    { id: "contact", i18n: "menu-contact" }
  ];

  // Navigation erzeugen
  const nav = document.createElement("nav");

  // Hamburger-Icon
  const hamburger = document.createElement("div");
  hamburger.classList.add("hamburger");
  hamburger.innerHTML = "<span></span><span></span><span></span>";

  // UL-Element
  const ul = document.createElement("ul");
  ul.classList.add("nav-links");

  // Platzhalter-Texte, werden durch JSON ersetzt
  menuItems.forEach(item => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `#${item.id}`;
    a.dataset.i18n = item.i18n;
    a.textContent = item.i18n;
    li.appendChild(a);
    ul.appendChild(li);
  });

  // Sprachumschalter
  const langSwitcher = document.createElement("div");
  langSwitcher.classList.add("lang-switcher");
  langSwitcher.innerHTML = `
    <span class="lang-option" data-lang="de">DE</span>
    <span class="lang-separator">|</span>
    <span class="lang-option" data-lang="en">EN</span>
  `;

  // Navigation zusammensetzen
  nav.appendChild(hamburger);
  nav.appendChild(ul);
  nav.appendChild(langSwitcher);
  navContainer.appendChild(nav);

  // Hamburger-Menü-Logik
  hamburger.addEventListener("click", () => {
    ul.classList.toggle("active");
    hamburger.classList.toggle("active");
  });

  // Sprachumschalter-Logik
  const langOptions = langSwitcher.querySelectorAll(".lang-option");
  langOptions.forEach(opt => {
    opt.addEventListener("click", () => {
      const lang = opt.dataset.lang;
      langOptions.forEach(o => (o.style.fontWeight = "500"));
      opt.style.fontWeight = "900";
      loadLanguage(lang);
    });
  });

  // Sprache laden
  async function loadLanguage(lang) {
    try {
      const res = await fetch(`ui_${lang}.json`);
      const data = await res.json();
      document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.dataset.i18n;
        if (data[key]) el.textContent = data[key];
      });
    } catch (e) {
      console.error("Fehler beim Laden der Sprachdatei:", e);
    }
  }

  // Standardmäßig Deutsch laden
  loadLanguage("de");
});