'use strict';
/* i18n.js
   Lädt und rendert die UI-Elemente basierend auf der ausgewählten Sprache.
*/

const loadUI = async (lang) => {
  try {
    const res = await fetch(`assets/lang/ui_${lang}.json`);
    const data = await res.json();

    // Menüeinträge aktualisieren
    document.querySelector('[data-i18n="menu-about"]').textContent = data.header.menu.about;
    document.querySelector('[data-i18n="menu-skills"]').textContent = data.header.menu.skills;
    document.querySelector('[data-i18n="menu-cv"]').textContent = data.header.menu.cv;
    document.querySelector('[data-i18n="menu-stories"]').textContent = data.header.menu.stories;
    document.querySelector('[data-i18n="menu-contact"]').textContent = data.header.menu.contact;

    // Footer
    document.querySelector('[data-i18n="footer-copy"]').textContent = data.footer.copyright;
    document.querySelector('[data-i18n="footer-imprint"]').textContent = data.footer.imprint;
    document.querySelector('[data-i18n="footer-privacy"]').textContent = data.footer.privacy;
  } catch (error) {
    console.error("Fehler beim Laden der Sprachdatei:", error);
  }
};

document.addEventListener("languageChanged", (e) => {
  loadUI(e.detail);
});
