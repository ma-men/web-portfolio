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

    
    language.init();  // // lädt ui/cv/… in i18n.js

    // <- Default-Sprache für Skills
    navigation.load();
    skills.load();   
    cv.load();
    stories.load();
    footer.load();
});

