'use strict';


import { language } from './i18n.js';
import { nav } from './nav.js';
import { skills } from './skills.js';
import { cv } from './cv.js';
import { stories } from './stories.js';
import { footer } from './footer.js';



document.addEventListener("DOMContentLoaded", () => {
    console.log("Main initialized...");

    // DOM-Struktur einmalig:
    nav.init();
    skills.init();

    // Sprache initialisieren und alle Bereiche laden
    language.init();  // // lädt ui/cv/… in i18n.js

    // <- Default-Sprache für Skills
    nav.load(language.current);
    skills.load(language.current);   

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