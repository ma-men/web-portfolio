'use strict';

document.addEventListener("DOMContentLoaded", () => {
    const navContainer = document.getElementById("nav-container");

    // Menüstruktur
    const menuItems = [
        { id: "about-section", text: "Über mich", en: "About" },
        { id: "skills-section", text: "Fähigkeiten", en: "Skills" },
        { id: "cv-section", text: "Lebenslauf", en: "CV" },
        { id: "stories-section", text: "Stories", en: "Stories" },
        { id: "contact", text: "Kontakt", en: "Contact" }
    ];

    // Navigation erzeugen
    const nav = document.createElement("nav");

    // Hamburger-Icon (3 Linien)
    const hamburger = document.createElement("div");
    hamburger.classList.add("hamburger");
    hamburger.innerHTML = "<span></span><span></span><span></span>";

    // UL-Element
    const ul = document.createElement("ul");
    ul.classList.add("nav-links");

    menuItems.forEach(item => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = `#${item.id}`;
        a.textContent = item.text;
        li.appendChild(a);
        ul.appendChild(li);
    });

    // Sprachumschalter (DE | EN)
    const langSwitcher = document.createElement("div");
    langSwitcher.classList.add("lang-switcher");
    langSwitcher.innerHTML = `
                                    <span class="lang-option" data-lang="de">DE</span>
                                    <span class="lang-separator">|</span>
                                    <span class="lang-option" data-lang="en">EN</span>
     `;

    // Zusammenbauen
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
            updateLanguage(lang);
        });
    });

    function updateLanguage(lang) {
        menuItems.forEach((item, index) => {
            const link = ul.children[index].querySelector("a");
            link.textContent = lang === "en" ? item.en : item.text;
        });
    }
});