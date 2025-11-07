'use strict';


export const language = {
    currentLang: localStorage.getItem('lang') || 'de',

    appendEventListeners() {
        document.addEventListener('click', (e) => {
            const option = e.target.closest('.lang-option');
            if (!option) return;

            const newLang = option.dataset.lang;
            if (!newLang || newLang === language.currentLang) return;

            language.setLanguage(newLang);
        });
    },

    setLanguage(newLang) {
        language.currentLang = newLang;
        localStorage.setItem('lang', newLang);
        language.setActiveLang(newLang);
        language.reloadSections(newLang);
    },

    setActiveLang(lang) {
        document.querySelectorAll('.lang-option').forEach((el) => {
            el.classList.toggle('active', el.dataset.lang === lang);
        });
    },

    reloadSections(lang) {
        console.log('🔄 Sprache wechseln auf:', lang);

        try { if (window.nav?.load) nav.load(lang); } catch { }
        try { if (window.skills?.load) skills.load(lang); } catch { }
        try { if (window.stories?.load) stories.load(lang); } catch { }
        try { if (window.cv?.load) cv.load(lang); } catch { }
        try { if (window.footer?.load) footer.load(lang); } catch { }
    },

    init() {
        language.setActiveLang(language.currentLang);
        language.reloadSections(language.currentLang);
        language.appendEventListeners();
    }
};




/*
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
*/
