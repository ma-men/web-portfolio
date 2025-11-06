'use strict';

document.addEventListener("DOMContentLoaded", () => {
    const navContainer = document.getElementById("nav-container");

    // Menüstruktur (Texte kommen aus JSON, siehe unten)
    const menuItems = [
        { id: "about-section", i18n: "menu-about" },
        { id: "skills-section", i18n: "menu-skills" },
        { id: "cv-section", i18n: "menu-cv" },
        { id: "stories-section", i18n: "menu-stories" },
        { id: "contact", i18n: "menu-contact" }
    ];

    // Navigation erzeugen
    const nav = document.createElement("nav");
    nav.classList.add("nav");

    const container = document.createElement("div");
    container.classList.add("container", "nav-container");

    // Hamburger
    const hamburger = document.createElement("div");
    hamburger.classList.add("hamburger");
    hamburger.innerHTML = '<i class="fas fa-bars"></i>';

    // UL-Element
    const ul = document.createElement("ul");
    ul.classList.add("nav-links");

    // Menüpunkte einfügen
    menuItems.forEach(item => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = `#${item.id}`;
        a.dataset.i18n = item.i18n;
        a.textContent = item.i18n; // Platzhalter, wird später durch i18n ersetzt
        li.appendChild(a);
        ul.appendChild(li);
    });

    // Sprachumschalter (modern, z. B. Icons)
    const langSwitcher = document.createElement("div");
    langSwitcher.classList.add("lang-switcher");

    langSwitcher.innerHTML = `
    <div class="lang-toggle">
      <span class="lang-option" data-lang="de">🇩🇪</span>
      <span class="lang-option" data-lang="en">🇬🇧</span>
    </div>
  `;

    // Zusammenbauen
    container.appendChild(hamburger);
    container.appendChild(ul);
    container.appendChild(langSwitcher);
    nav.appendChild(container);
    navContainer.appendChild(nav);

    // Hamburger-Logik
    hamburger.addEventListener("click", () => {
        ul.classList.toggle("active");
    });

    // Sprachwechsel
    langSwitcher.querySelectorAll(".lang-option").forEach(opt => {
        opt.addEventListener("click", () => {
            const lang = opt.dataset.lang;
            loadLanguage(lang);
        });
    });

    // Sprachdateien laden (Beispiel)
    function loadLanguage(lang) {
        fetch(`ui_${lang}.json`)
            .then(res => res.json())
            .then(data => {
                document.querySelectorAll("[data-i18n]").forEach(el => {
                    const key = el.dataset.i18n;
                    if (data[key]) el.textContent = data[key];
                });
            });
    }

    // Standardmäßig Deutsch laden
    loadLanguage("de");
});
