"use strict";
document.addEventListener("DOMContentLoaded", () => {
  const dropdowns = [...document.querySelectorAll(".nav-dropdown")];
  const menuButton = document.querySelector("#menuButton");
  const mainNav = document.querySelector("#mainNav");
  const closeDropdowns = except => dropdowns.forEach(d => { if (d !== except) d.open = false; });
  dropdowns.forEach(dropdown => dropdown.addEventListener("toggle", () => {
    if (dropdown.open) closeDropdowns(dropdown);
  }));
  document.addEventListener("click", event => {
    if (!event.target.closest(".nav-dropdown")) closeDropdowns();
  });
  document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    const openDropdown = dropdowns.find(d => d.open);
    if (openDropdown) {
      openDropdown.open = false;
      openDropdown.querySelector("summary")?.focus();
    } else if (mainNav?.classList.contains("open")) {
      mainNav.classList.remove("open");
      menuButton?.setAttribute("aria-expanded", "false");
      menuButton?.focus();
    }
  });
  menuButton?.addEventListener("click", () => closeDropdowns());
});
