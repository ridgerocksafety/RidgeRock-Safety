"use strict";

document.addEventListener("DOMContentLoaded", () => {

  // ==================================================
  // 911 CARD VISUAL REFINEMENTS
  // ==================================================
  //
  // These styles intentionally override the earlier
  // incident-response styles so the Emergency card:
  //
  // 1. Matches the Richard Payne card dimensions.
  // 2. Does not resize when confirmation appears.
  // 3. Keeps the confirmation clean and compact.
  // 4. Uses "Call 911" and "Cancel" as the actions.
  //

  const emergencyStyle = document.createElement("style");

  emergencyStyle.textContent = `
    .incident-call-actions {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      align-items: stretch;
    }

    .emergency-call-wrap {
      min-width: 0;
      min-height: 84px;
      display: flex;
      align-self: stretch;
    }

    .emergency-call-trigger {
      width: 100%;
      min-height: 84px;
      height: 100%;
      margin: 0;
      border: 0;
      font: inherit;
      text-align: left;
      cursor: pointer;
    }

    .emergency-call-trigger[hidden],
    .emergency-call-confirm[hidden] {
      display: none !important;
    }

    .emergency-call-confirm {
      width: 100%;
      min-height: 84px;
      height: 100%;

      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;

      align-items: center;

      gap: 16px;

      padding: 14px 16px 14px 20px;

      border-radius: 14px;

      background: var(--red-600);
      color: white;

      box-shadow: none;
    }

    .emergency-confirm-copy {
      min-width: 0;

      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .emergency-confirm-copy .call-label {
      margin-bottom: 3px;
      color: #ffdadd;
    }

    .emergency-confirm-copy strong {
      font-size: 16px;
      line-height: 1.2;
    }

    .emergency-confirm-actions {
      display: flex;
      align-items: center;

      gap: 7px;
    }

    .emergency-confirm-yes,
    .emergency-confirm-no {
      min-height: 42px;

      display: inline-flex;

      align-items: center;
      justify-content: center;

      padding: 0 13px;

      border-radius: 9px;

      font: inherit;

      font-size: 12px;
      font-weight: 850;

      line-height: 1;

      text-align: center;
      text-decoration: none;

      white-space: nowrap;

      cursor: pointer;

      transition: .18s ease;
    }

    .emergency-confirm-yes {
      border: 2px solid white;

      background: white;

      color: var(--red-600);
    }

    .emergency-confirm-yes:hover {
      background: #fff3f4;

      transform: translateY(-1px);
    }

    .emergency-confirm-no {
      border: 1px solid rgba(255, 255, 255, .68);

      background: transparent;

      color: white;
    }

    .emergency-confirm-no:hover {
      background: rgba(255, 255, 255, .12);

      transform: translateY(-1px);
    }

    .emergency-call-trigger:focus-visible,
    .emergency-confirm-yes:focus-visible,
    .emergency-confirm-no:focus-visible {
      outline: 3px solid rgba(36, 95, 150, .35);

      outline-offset: 3px;
    }


    /* ==============================================
       TABLET / PHONE
       ============================================== */

    @media (max-width: 760px) {

      .incident-call-actions {
        grid-template-columns: 1fr;
      }

      .emergency-call-wrap,
      .emergency-call-trigger,
      .emergency-call-confirm {
        min-height: 76px;
      }

      .emergency-call-confirm {
        grid-template-columns: minmax(0, 1fr) auto;

        gap: 12px;

        padding: 12px 14px 12px 18px;
      }

      .emergency-confirm-copy strong {
        font-size: 15px;
      }

      .emergency-confirm-actions {
        gap: 6px;
      }

      .emergency-confirm-yes,
      .emergency-confirm-no {
        min-height: 40px;

        padding: 0 11px;

        font-size: 11px;
      }

    }


    /* ==============================================
       SMALL PHONE
       ============================================== */

    @media (max-width: 560px) {

      .emergency-call-confirm {
        grid-template-columns: 1fr;

        gap: 10px;

        padding: 14px 16px;
      }

      .emergency-confirm-actions {
        display: grid;

        grid-template-columns: 1fr 1fr;
      }

      .emergency-confirm-yes,
      .emergency-confirm-no {
        width: 100%;
      }

    }
  `;

  document.head.appendChild(emergencyStyle);


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


      // Toggle selected section
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

  const emergencyCallYes =
    document.querySelector(".emergency-confirm-yes");


  // Clean up the wording from the HTML.
  //
  // Old:
  // Yes, Continue
  // No, Go Back
  //
  // New:
  // Call 911
  // Cancel

  if (emergencyCallYes) {
    emergencyCallYes.textContent = "Call 911";
  }

  if (emergencyCallCancel) {
    emergencyCallCancel.textContent = "Cancel";
  }


  if (
    emergencyCallTrigger &&
    emergencyCallConfirm &&
    emergencyCallCancel
  ) {

    // ------------------------------------------------
    // FIRST TAP
    //
    // The first tap NEVER initiates a phone call.
    // It only changes the red card to confirmation.
    // ------------------------------------------------

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


    // ------------------------------------------------
    // CANCEL
    //
    // Return to the normal Call 911 card.
    // ------------------------------------------------

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
