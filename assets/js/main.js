'use strict';


import { language } from './i18n.js';
import { nav } from './nav.js';
import { skills } from './skills.js';
import { cv } from './cv.js';
import { stories } from './stories.js';
import { footer } from './footer.js';



document.addEventListener("DOMContentLoaded", () => {
    console.log("Main initialized...");

    /*************************************************************************************
     *  globale Funktionen registrieren, damit i18n.js sie aufrufen kann
     * 
     *  window.loadXYZ ist notwendig, weil i18n.js dynamisch diese Funktionen aufruft,
     *  ohne sie direkt zu importieren (damit bleibt i18n.js unabhängig von allen Modulen).
     *************************************************************************************/
    window.nav = nav;
    window.skills = skills;
    window.cv = cv;
    window.stories = stories;
    window.footer = footer;

    // Sprache initialisieren und alle Bereiche laden
    language.init();

});








/*
const init = () => {

  language.init(); // Startet Sprache, markiert aktive, ruft reloadSections() auf

  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}




const getCurrentLang = () => localStorage.getItem("lang") || "de";

const setLang = (lang) => {
  localStorage.setItem("lang", lang);
  document.dispatchEvent(new CustomEvent("languageChanged", { detail: lang }));
};

const initLanguageSwitcher = () => {
  const select = document.getElementById("lang");
  if (!select) return;

  const currentLang = getCurrentLang();
  select.value = currentLang;

  select.addEventListener("change", (e) => setLang(e.target.value));
};

document.addEventListener("DOMContentLoaded", () => {
  initLanguageSwitcher();
  document.dispatchEvent(new CustomEvent("languageChanged", { detail: getCurrentLang() }));
});
*/