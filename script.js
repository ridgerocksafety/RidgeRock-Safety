
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const data = safetyHubData;

  const activeReports =
    data.reports.filter(item => item.active !== false);

  const activeResources =
    data.resources.filter(item => item.active !== false);

  const activeTalks = data.toolboxTalks
    .filter(item => item.active !== false)
    .sort((a, b) => a.number - b.number);

  const currentTalk = activeTalks.at(-1);

  const $ = selector =>
    document.querySelector(selector);

  const escapeHTML = value =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const numberLabel = number =>
    String(number).padStart(3, "0");

  const pdfURL = fileName =>
    `toolbox-talks/${encodeURIComponent(fileName)}`;


  /*
    INTERNAL VS EXTERNAL LINKS

    Internal Safety Hub pages stay in the
    same tab.

    External websites, Microsoft Forms,
    PDFs, etc. open in a new tab.
  */
  const isInternalLink = url => {
    if (!url) return false;

    return (
      url.startsWith("#") ||
      url.startsWith("/") ||
      url.startsWith("./") ||
      url.startsWith("../") ||
      !/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(url)
    );
  };


  $("#lastUpdated").textContent =
    `Last updated: ${data.lastUpdated}`;

  $("#reportCount").textContent =
    `${activeReports.length} reporting options`;

  $("#resourceCount").textContent =
    `${activeResources.length} resources`;

  $("#toolboxCount").textContent =
    `${activeTalks.length} talks available`;


  /* QUICK LINKS */

  $("#quickLinks").innerHTML =
    data.quickLinks
      .map(item => `
        <a
          class="quick-card"
          href="${escapeHTML(item.target)}"
        >
          <span class="quick-icon">
            ${escapeHTML(item.icon)}
          </span>

          <span>
            ${escapeHTML(item.label)}
          </span>

          <span aria-hidden="true">
            →
          </span>
        </a>
      `)
      .join("");


  /* REPORT + RESOURCE CARDS */

  const createCard = item => {
    const linkClass =
      item.disabled
        ? "button button-muted"
        : "button button-primary";

    let attributes = "";

    let arrow = "";

    if (item.disabled) {
      attributes =
        'aria-disabled="true" tabindex="-1"';
    }

    else if (isInternalLink(item.url)) {
      attributes = "";
      arrow =
        '<span aria-hidden="true">→</span>';
    }

    else {
      attributes =
        'target="_blank" rel="noopener noreferrer"';

      arrow =
        '<span aria-hidden="true">↗</span>';
    }

    return `
      <article
        class="info-card theme-${escapeHTML(item.theme || "blue")}"
      >

        <div class="info-icon">
          ${escapeHTML(item.icon || "•")}
        </div>

        <div class="info-copy">
          <h3>
            ${escapeHTML(item.title)}
          </h3>

          <p>
            ${escapeHTML(item.description)}
          </p>
        </div>

        <a
          class="${linkClass}"
          href="${escapeHTML(item.url)}"
          ${attributes}
        >
          ${escapeHTML(item.buttonText)}
          ${arrow}
        </a>

      </article>
    `;
  };


  $("#reportGrid").innerHTML =
    activeReports
      .map(createCard)
      .join("");

  $("#resourceGrid").innerHTML =
    activeResources
      .map(createCard)
      .join("");


  /* CURRENT TOOLBOX TALK */

  if (currentTalk) {
    $("#currentTalk").innerHTML = `
      <div class="current-number">

        <span>
          Current Talk
        </span>

        <strong>
          ${numberLabel(currentTalk.number)}
        </strong>

      </div>

      <div class="current-copy">

        <span class="pill">
          ${escapeHTML(currentTalk.category)}
        </span>

        <h3>
          ${escapeHTML(currentTalk.title)}
        </h3>

        <p>
          ${escapeHTML(currentTalk.description)}
        </p>

        <div class="current-actions">

          <a
            class="button button-warning"
            href="${pdfURL(currentTalk.fileName)}"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Current Talk
            <span aria-hidden="true">↗</span>
          </a>

          <a
            class="button button-outline"
            href="https://forms.cloud.microsoft/r/Q3wMn0mKvE"
            target="_blank"
            rel="noopener noreferrer"
          >
            Complete Documentation
            <span aria-hidden="true">↗</span>
          </a>

        </div>

      </div>
    `;
  }


  /* TOOLBOX LIBRARY COUNT */

  const libraryTalkCount =
    $("#libraryTalkCount");

  if (libraryTalkCount) {
    libraryTalkCount.textContent =
      `${activeTalks.length} ${
        activeTalks.length === 1
          ? "talk"
          : "talks"
      } in library`;
  }


  /* CONTACTS */

  $("#contactGrid").innerHTML =
    data.contacts
      .map(contact => `

        <article class="contact-card">

          <div class="avatar">
            ${
              escapeHTML(
                contact.name
                  .split(" ")
                  .map(part => part[0])
                  .join("")
                  .slice(0, 2)
              )
            }
          </div>

          <div>

            <h3>
              ${escapeHTML(contact.name)}
            </h3>

            <p class="contact-role">
              ${escapeHTML(contact.role)}
            </p>

            <a
              href="tel:${contact.phone.replace(/[^\d+]/g, "")}"
            >
              ${escapeHTML(contact.phone)}
            </a>

            <a
              href="mailto:${escapeHTML(contact.email)}"
            >
              ${escapeHTML(contact.email)}
            </a>

          </div>

        </article>

      `)
      .join("");


  /* MOBILE MENU */

  const menuButton =
    $("#menuButton");

  const mainNav =
    $("#mainNav");

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


  /*
    ==========================================
    SAFETY ANNOUNCEMENTS
    ==========================================

    Announcements are managed in data.js.

    Only active announcements within their
    start and end dates are displayed.
  */

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parseLocalDate = value => {
    if (!value) return null;

    const [year, month, day] =
      value.split("-").map(Number);

    return new Date(year, month - 1, day);
  };

  const isAnnouncementActive = item => {
    if (item.active === false) return false;

    const start = parseLocalDate(item.startDate);
    const end = parseLocalDate(item.endDate);

    if (start && today < start) return false;
    if (end && today > end) return false;

    return true;
  };

  const activeAnnouncements =
    (data.announcements || [])
      .filter(isAnnouncementActive)
      .sort((a, b) =>
        Number(Boolean(b.featured)) -
        Number(Boolean(a.featured))
      );


  /*
    ANNOUNCEMENT LINKS
  */

  const announcementLink = item => {
    if (!item.url || item.url === "#") {
      return "";
    }

    const external =
      !isInternalLink(item.url);

    return `
      <a
        class="button button-primary"
        href="${escapeHTML(item.url)}"
        ${
          external
            ? 'target="_blank" rel="noopener noreferrer"'
            : ""
        }
      >
        ${escapeHTML(item.buttonText || "Learn More")}

        <span aria-hidden="true">
          ${external ? "↗" : "→"}
        </span>
      </a>
    `;
  };


  /*
    RENDER HOMEPAGE ANNOUNCEMENTS
  */

  const announcementsGrid =
    $("#announcementsGrid");

  const announcementsSection =
    $("#announcements");

  if (announcementsGrid) {

    if (activeAnnouncements.length === 0) {
      if (announcementsSection) {
        announcementsSection.hidden = true;
      }
    }

    else {
      announcementsGrid.innerHTML =
        activeAnnouncements
          .map(item => `

            <article
              class="announcement-card ${
                item.featured
                  ? "announcement-featured"
                  : ""
              }"
            >

              <div class="announcement-card-top">

                <span class="announcement-category">
                  ${escapeHTML(item.category || "Announcement")}
                </span>

                ${
                  item.featured
                    ? `
                      <span class="announcement-featured-label">
                        Featured
                      </span>
                    `
                    : ""
                }

              </div>

              <h3>
                ${escapeHTML(item.title)}
              </h3>

              <p>
                ${escapeHTML(item.description)}
              </p>

              ${announcementLink(item)}

            </article>

          `)
          .join("");
    }
  }


  /*
    ==========================================
    ANNOUNCEMENT POPUP SYSTEM
    ==========================================

    popup: true
      Enables the notification.

    popupType: "corner"
      Small notification at the side.

    popupType: "modal"
      Large centered announcement.

    popupVersion:
      Increase the version to show an
      updated popup again after dismissal.
  */

  const popup =
    $("#announcementPopup");

  const popupPanel =
    $("#announcementPopupPanel");

  const popupBackdrop =
    $("#announcementPopupBackdrop");

  const popupTitle =
    $("#announcementPopupTitle");

  const popupDescription =
    $("#announcementPopupDescription");

  const popupLink =
    $("#announcementPopupLink");

  const popupClose =
    $("#announcementPopupClose");

  const popupDismiss =
    $("#announcementPopupDismiss");


  const getPopupStorageKey = item =>
    `ridgeRockPopup:${item.id}:v${item.popupVersion || 1}`;


  const wasPopupDismissed = item => {
    try {
      return (
        localStorage.getItem(
          getPopupStorageKey(item)
        ) === "dismissed"
      );
    } catch {
      return false;
    }
  };


  const rememberPopupDismissal = item => {
    try {
      localStorage.setItem(
        getPopupStorageKey(item),
        "dismissed"
      );
    } catch {
      // Popup still closes if browser storage is disabled.
    }
  };


  const popupAnnouncements =
    activeAnnouncements.filter(item =>
      item.popup === true &&
      !wasPopupDismissed(item)
    );


  if (
    popup &&
    popupPanel &&
    popupTitle &&
    popupDescription &&
    popupLink &&
    popupClose &&
    popupDismiss &&
    window.location.hash.toLowerCase() !== "#toolbox" &&
    popupAnnouncements.length > 0
  ) {

    /*
      Show only one popup per visit.
      Centered announcements have priority.
    */

    popupAnnouncements.sort((a, b) => {
      const aPriority =
        a.popupType === "modal" ? 1 : 0;

      const bPriority =
        b.popupType === "modal" ? 1 : 0;

      return bPriority - aPriority;
    });

    const announcement =
      popupAnnouncements[0];

    const isModal =
      announcement.popupType === "modal";

    popupTitle.textContent =
      announcement.title;

    popupDescription.textContent =
      announcement.description;

    if (
      announcement.url &&
      announcement.url !== "#"
    ) {
      popupLink.href =
        announcement.url;

      popupLink.textContent =
        announcement.buttonText || "Learn More";

      if (isInternalLink(announcement.url)) {
        popupLink.removeAttribute("target");
        popupLink.removeAttribute("rel");
      } else {
        popupLink.target = "_blank";
        popupLink.rel = "noopener noreferrer";
      }

      popupLink.hidden = false;
    }

    else {
      popupLink.hidden = true;
    }


    /*
      APPLY POPUP STYLE
    */

    popup.classList.remove(
      "popup-corner",
      "popup-modal"
    );

    popup.classList.add(
      isModal
        ? "popup-modal"
        : "popup-corner"
    );

    popupPanel.setAttribute(
      "aria-modal",
      String(isModal)
    );

    if (popupBackdrop) {
      popupBackdrop.hidden = !isModal;
    }


    /*
      CLOSE POPUP
    */

    const previousFocus =
      document.activeElement;

    const closePopup = () => {
      popup.hidden = true;

      document.body.classList.remove(
        "announcement-modal-open"
      );

      rememberPopupDismissal(
        announcement
      );

      document.removeEventListener(
        "keydown",
        handlePopupKeys
      );

      if (
        isModal &&
        previousFocus &&
        typeof previousFocus.focus === "function"
      ) {
        previousFocus.focus();
      }
    };


    /*
      KEYBOARD ACCESSIBILITY
    */

    const handlePopupKeys = event => {
      if (event.key === "Escape") {
        closePopup();
        return;
      }

      if (
        event.key !== "Tab" ||
        !isModal
      ) {
        return;
      }

      const focusable =
        Array.from(
          popupPanel.querySelectorAll(
            'button:not([disabled]), a[href]:not([hidden])'
          )
        ).filter(element =>
          !element.hidden
        );

      if (!focusable.length) return;

      const first = focusable[0];
      const last =
        focusable[focusable.length - 1];

      if (
        event.shiftKey &&
        document.activeElement === first
      ) {
        event.preventDefault();
        last.focus();
      }

      else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    };


    popupClose.addEventListener(
      "click",
      closePopup
    );

    popupDismiss.addEventListener(
      "click",
      closePopup
    );

    popupLink.addEventListener(
      "click",
      closePopup
    );

    if (popupBackdrop) {
      popupBackdrop.addEventListener(
        "click",
        closePopup
      );
    }

    document.addEventListener(
      "keydown",
      handlePopupKeys
    );


    /*
      DISPLAY POPUP
    */

    popup.hidden = false;

    if (isModal) {
      document.body.classList.add(
        "announcement-modal-open"
      );

      popupClose.focus();
    }
  }

});
