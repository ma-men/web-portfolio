'use strict';


import { language } from './i18n.js';
import { navigation } from './nav.js';
import { skills } from './skills.js';
import { cv } from './cv.js';
import { stories } from './stories.js';
import { footer } from './footer.js';



document.addEventListener("DOMContentLoaded", () => {
    console.log("Main initialized...");

    // DOM-Struktur einmalig:
    navigation.init();
    skills.init();
    cv.init();
    stories.init();
    footer.init();

    // Sprache initialisieren und alle Bereiche laden
    language.init();  // // lädt ui/cv/… in i18n.js

    // <- Default-Sprache für Skills
    navigation.load(language.currentLang);
    skills.load(language.currentLang);   
    cv.load(language.currentLang);
    stories.load(language.currentLang);
    footer.load(language.currentLang);

});

