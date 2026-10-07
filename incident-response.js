"use strict";

document.addEventListener("DOMContentLoaded", () => {

  // ==================================================
  // INCIDENT TYPE EXPAND / COLLAPSE
  // ==================================================

  const incidentButtons =
    document.querySelectorAll(".incident-type-button");


  incidentButtons.forEach(button => {

    button.addEventListener("click", () => {

      const panel =
        document.getElementById(
          button.getAttribute("aria-controls")
        );

      const isOpen =
        button.getAttribute("aria-expanded") === "true";


      // Close all other incident sections
      incidentButtons.forEach(otherButton => {

        if (otherButton === button) {
          return;
        }

        const otherPanel =
          document.getElementById(
            otherButton.getAttribute("aria-controls")
          );

        otherButton.setAttribute(
          "aria-expanded",
          "false"
        );

        if (otherPanel) {
          otherPanel.hidden = true;
        }

      });


      // Toggle the selected section
      button.setAttribute(
        "aria-expanded",
        String(!isOpen)
      );

      if (panel) {
        panel.hidden = isOpen;
      }

    });

  });


  // ==================================================
  // 911 CALL CONFIRMATION
  // ==================================================

  const emergencyCallTrigger =
    document.getElementById("emergencyCallTrigger");

  const emergencyCallConfirm =
    document.getElementById("emergencyCallConfirm");

  const emergencyCallCancel =
    document.getElementById("emergencyCallCancel");


  if (
    emergencyCallTrigger &&
    emergencyCallConfirm &&
    emergencyCallCancel
  ) {

    // First tap only opens the confirmation.
    // It does NOT initiate a phone call.
    emergencyCallTrigger.addEventListener(
      "click",
      () => {

        emergencyCallTrigger.hidden = true;
        emergencyCallConfirm.hidden = false;

        emergencyCallTrigger.setAttribute(
          "aria-expanded",
          "true"
        );

        emergencyCallCancel.focus();

      }
    );


    // "No, Go Back" restores the original Call 911 button.
    emergencyCallCancel.addEventListener(
      "click",
      () => {

        emergencyCallConfirm.hidden = true;
        emergencyCallTrigger.hidden = false;

        emergencyCallTrigger.setAttribute(
          "aria-expanded",
          "false"
        );

        emergencyCallTrigger.focus();

      }
    );

  }


  // ==================================================
  // MOBILE NAVIGATION
  // ==================================================

  const menuButton =
    document.getElementById("menuButton");

  const mainNav =
    document.getElementById("mainNav");


  if (menuButton && mainNav) {

    menuButton.addEventListener(
      "click",
      () => {

        const open =
          mainNav.classList.toggle("open");

        menuButton.setAttribute(
          "aria-expanded",
          String(open)
        );

      }
    );


    mainNav
      .querySelectorAll("a")
      .forEach(link => {

        link.addEventListener(
          "click",
          () => {

            mainNav.classList.remove("open");

            menuButton.setAttribute(
              "aria-expanded",
              "false"
            );

          }
        );

      });

  }

});
