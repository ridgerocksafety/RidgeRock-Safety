"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const data = safetyHubData;

  const activeTalks = data.toolboxTalks
    .filter(item => item.active !== false)
    .sort((a, b) => a.number - b.number);

  const currentTalk = activeTalks.at(-1);

  const categoryOrder = [
    "Vehicle Safety",
    "Heavy Equipment",
    "PPE",
    "Distraction Awareness",
    "Excavation",
    "Fall Prevention",
    "Heat & Weather",
    "Tools & Equipment",
    "Environmental Safety",
    "Hazard Communication",
    "Fire Prevention",
    "Traffic Control",
    "Lifting & Rigging",
    "Material Handling",
    "Injury Prevention",
    "Electrical Safety",
    "Housekeeping",
    "Emergency Response",
    "Health & Wellness",
    "General Safety",
    "Work Zone Safety",
    "Concrete & Asphalt",
    "Utility Safety",
    "Confined Space"
  ];

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

  const searchInput =
    $("#librarySearch");

  const clearSearchButton =
    $("#libraryClearSearch");

  const categoryGrid =
    $("#categoryGrid");

  const categoryReset =
    $("#categoryReset");

  const categorySection =
    $("#categorySection");

  const talkGrid =
    $("#libraryTalkGrid");

  const emptyState =
    $("#libraryEmptyState");

  const resultsSection =
    $("#libraryResults");

  const backToCategories =
    $("#backToCategories");

  /*
    "all" means every Toolbox Talk is displayed.
  */
  let selectedCategory = "all";


  /* GENERAL PAGE DATA */

  $("#lastUpdated").textContent =
    `Last updated: ${data.lastUpdated}`;

  $("#libraryTotal").textContent =
    activeTalks.length;


  /* CATEGORY COUNTS */

  const categoryCounts =
    activeTalks.reduce((counts, talk) => {
      counts[talk.category] =
        (counts[talk.category] || 0) + 1;

      return counts;
    }, {});

  const usedCategories = categoryOrder
    .filter(category =>
      categoryCounts[category] > 0
    )
    .concat(
      Object.keys(categoryCounts)
        .filter(category =>
          !categoryOrder.includes(category)
        )
        .sort((a, b) =>
          a.localeCompare(b)
        )
    );


  /* SCROLL TO RESULTS */

  function scrollToResults() {
    if (!resultsSection) return;

    setTimeout(() => {
      resultsSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 100);
  }


  /* CATEGORY BUTTONS */

  function renderCategories() {
    const allSelected =
      selectedCategory === "all";

    const allTalksButton = `
      <button
        class="category-card ${allSelected ? "is-selected" : ""}"
        type="button"
        data-category="all"
        aria-pressed="${allSelected}"
      >
        <span class="category-card-name">
          ${allSelected ? "✓ " : ""}
          All Talks
        </span>

        <span class="category-card-count">
          <strong>${activeTalks.length}</strong>
          ${activeTalks.length === 1 ? "talk" : "talks"}
        </span>
      </button>
    `;

    const categoryButtons =
      usedCategories
        .map(category => {
          const count =
            categoryCounts[category];

          const selected =
            selectedCategory === category;

          return `
            <button
              class="category-card ${selected ? "is-selected" : ""}"
              type="button"
              data-category="${escapeHTML(category)}"
              aria-pressed="${selected}"
            >
              <span class="category-card-name">
                ${selected ? "✓ " : ""}
                ${escapeHTML(category)}
              </span>

              <span class="category-card-count">
                <strong>${count}</strong>
                ${count === 1 ? "talk" : "talks"}
              </span>
            </button>
          `;
        })
        .join("");

    categoryGrid.innerHTML =
      allTalksButton + categoryButtons;

    categoryReset.hidden =
      selectedCategory === "all";

    categoryGrid
      .querySelectorAll(".category-card")
      .forEach(button => {
        button.addEventListener(
          "click",
          () => {
            selectedCategory =
              button.dataset.category;

            renderCategories();
            renderResults();
            scrollToResults();
          }
        );
      });
  }


  /* TOOLBOX TALK CARDS */

  function createTalkCard(talk) {
    const isCurrent =
      currentTalk &&
      talk.number === currentTalk.number;

    return `
      <article class="talk-card ${isCurrent ? "is-current" : ""}">

        <div class="talk-card-top">

          <span class="talk-number">
            ${numberLabel(talk.number)}
          </span>

          <span class="talk-category">
            ${escapeHTML(talk.category)}
          </span>

        </div>

        <div>

          <div class="title-row">

            <h3>
              ${escapeHTML(talk.title)}
            </h3>

            ${
              isCurrent
                ? '<span class="current-label">Current</span>'
                : ""
            }

          </div>

          <p>
            ${escapeHTML(talk.description)}
          </p>

        </div>

        <a
          class="button button-outline"
          href="${pdfURL(talk.fileName)}"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open Toolbox Talk
          <span aria-hidden="true">↗</span>
        </a>

      </article>
    `;
  }


  /* FILTER TALKS */

  function getFilteredTalks() {
    const query =
      searchInput.value
        .trim()
        .toLowerCase();

    return activeTalks.filter(talk => {
      const matchesCategory =
        selectedCategory === "all" ||
        talk.category === selectedCategory;

      const haystack = [
        numberLabel(talk.number),
        talk.title,
        talk.category,
        talk.description,
        talk.keywords || ""
      ]
        .join(" ")
        .toLowerCase();

      const words =
        query
          .split(/\s+/)
          .filter(Boolean);

      const matchesSearch =
        words.every(word =>
          haystack.includes(word)
        );

      return (
        matchesCategory &&
        matchesSearch
      );
    });
  }


  /* RESULTS */

  function renderResults() {
    const query =
      searchInput.value.trim();

    const filtered =
      getFilteredTalks();

    clearSearchButton.hidden =
      query.length === 0;

    /*
      Always newest to oldest.
    */
    const talksToShow =
      [...filtered]
        .sort(
          (a, b) =>
            b.number - a.number
        );


    /* ALL TALKS */

    if (
      selectedCategory === "all" &&
      !query
    ) {
      $("#resultsEyebrow").textContent =
        "Toolbox Talk Archive";

      $("#resultsTitle").textContent =
        "All Toolbox Talks";

      $("#resultsDescription").textContent =
        `${talksToShow.length} ${
          talksToShow.length === 1
            ? "talk"
            : "talks"
        }, newest to oldest.`;
    }


    /* SEARCHING ALL TALKS */

    else if (
      selectedCategory === "all" &&
      query
    ) {
      $("#resultsEyebrow").textContent =
        "Search Results";

      $("#resultsTitle").textContent =
        "Matching Toolbox Talks";

      $("#resultsDescription").textContent =
        `${talksToShow.length} ${
          talksToShow.length === 1
            ? "talk"
            : "talks"
        } matching "${query}".`;
    }


    /* CATEGORY + SEARCH */

    else if (
      selectedCategory !== "all" &&
      query
    ) {
      $("#resultsEyebrow").textContent =
        "Filtered Results";

      $("#resultsTitle").textContent =
        selectedCategory;

      $("#resultsDescription").textContent =
        `${talksToShow.length} ${
          talksToShow.length === 1
            ? "talk"
            : "talks"
        } in this category matching "${query}".`;
    }


    /* CATEGORY ONLY */

    else {
      $("#resultsEyebrow").textContent =
        "Toolbox Talk Archive";

      $("#resultsTitle").textContent =
        selectedCategory;

      $("#resultsDescription").textContent =
        `${talksToShow.length} ${
          talksToShow.length === 1
            ? "talk"
            : "talks"
        } in this category.`;
    }

    talkGrid.innerHTML =
      talksToShow
        .map(createTalkCard)
        .join("");

    emptyState.hidden =
      talksToShow.length > 0;
  }


  /* SEARCH EVENTS */

  searchInput.addEventListener(
    "input",
    () => {
      renderResults();
    }
  );

  clearSearchButton.addEventListener(
    "click",
    () => {
      searchInput.value = "";
      renderResults();
      searchInput.focus();
    }
  );


  /* CLEAR CATEGORY */

  categoryReset.addEventListener(
    "click",
    () => {
      selectedCategory = "all";

      renderCategories();
      renderResults();
    }
  );


  /* FLOATING BACK TO CATEGORIES BUTTON */

  function updateBackToCategoriesButton() {
    if (
      !categorySection ||
      !backToCategories
    ) {
      return;
    }

    const categoryBottom =
      categorySection
        .getBoundingClientRect()
        .bottom;

    /*
      Show the button once the user has
      scrolled below the category filters.

      Hide it again when the categories
      are visible.
    */
    const shouldShow =
      categoryBottom < 80;

    backToCategories.classList.toggle(
      "is-visible",
      shouldShow
    );
  }

  window.addEventListener(
    "scroll",
    updateBackToCategoriesButton,
    { passive: true }
  );

  window.addEventListener(
    "resize",
    updateBackToCategoriesButton
  );

  backToCategories.addEventListener(
    "click",
    () => {
      categorySection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  );


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
          mainNav.classList.remove(
            "open"
          );

          menuButton.setAttribute(
            "aria-expanded",
            "false"
          );
        }
      );
    });


  /* INITIAL RENDER */

  renderCategories();
  renderResults();
  updateBackToCategoriesButton();
});
