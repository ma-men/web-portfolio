



document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
});



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
