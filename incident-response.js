"use strict";
document.addEventListener("DOMContentLoaded", () => {
  const incidentButtons = document.querySelectorAll(".incident-type-button");
  incidentButtons.forEach(button => {
    button.addEventListener("click", () => {
      const panel = document.getElementById(button.getAttribute("aria-controls"));
      const isOpen = button.getAttribute("aria-expanded") === "true";
      incidentButtons.forEach(otherButton => {
        if (otherButton === button) return;
        const otherPanel = document.getElementById(otherButton.getAttribute("aria-controls"));
        otherButton.setAttribute("aria-expanded", "false");
        if (otherPanel) otherPanel.hidden = true;
      });
      button.setAttribute("aria-expanded", String(!isOpen));
      if (panel) panel.hidden = isOpen;
    });
  });
  const menuButton = document.getElementById("menuButton");
  const mainNav = document.getElementById("mainNav");
  if (menuButton && mainNav) {
    menuButton.addEventListener("click", () => {
      const open = mainNav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(open));
    });
    mainNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }
});
