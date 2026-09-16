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


  /* ELEMENTS */

  const searchArea =
    $(".library-search-area");

  const searchForm =
    $("#librarySearchForm");

  const searchInput =
    $("#librarySearch");

  const searchActions =
    $("#librarySearchActions");

  const clearSearchButton =
    $("#libraryClearSearch");

  const searchStatus =
    $("#librarySearchStatus");

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
    The category the user selected while
    browsing normally.
  */
  let selectedCategory = "all";

  /*
    Tracks whether the library is currently
    being controlled by search instead of
    a category.
  */
  let searchMode = false;


  /* PAGE DATA */

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


  /* HELPERS */

  function hasSearchQuery() {
    return searchInput.value.trim().length > 0;
  }


  function scrollToResults() {
    if (!resultsSection) return;

    resultsSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }


  /*
    Update the search bar controls and
    the small blue live-result message.
  */
  function updateSearchUI(resultCount = 0) {
    const hasQuery =
      hasSearchQuery();

    searchArea.classList.toggle(
      "has-query",
      hasQuery
    );

    searchActions.setAttribute(
      "aria-hidden",
      String(!hasQuery)
    );

    if (!hasQuery) {
      searchStatus.textContent = "";
      return;
    }

    if (resultCount === 0) {
      searchStatus.textContent =
        "No results found";
    }

    else if (resultCount === 1) {
      searchStatus.textContent =
        "1 result found";
    }

    else {
      searchStatus.textContent =
        `${resultCount} results found`;
    }
  }


  /*
    This one upper-right control has two jobs:

    Category mode:
      Clear Category

    Search mode:
      Clear Search
  */
  function updateResetControl({
    animateSearch = false
  } = {}) {

    categoryReset.classList.remove(
      "search-control-enter"
    );

    if (searchMode) {
      categoryReset.hidden = false;
      categoryReset.textContent =
        "Clear Search";

      if (animateSearch) {
        /*
          Force a reflow so the animation
          reliably starts only when entering
          search mode.
        */
        void categoryReset.offsetWidth;

        categoryReset.classList.add(
          "search-control-enter"
        );
      }

      return;
    }

    if (selectedCategory !== "all") {
      categoryReset.hidden = false;
      categoryReset.textContent =
        "Clear Category";
      return;
    }

    categoryReset.hidden = true;
  }


  /* CATEGORIES */

  function renderCategories({
    animateSearchControl = false
  } = {}) {

    const allSelected =
      !searchMode &&
      selectedCategory === "all";

    const allTalksButton = `
      <button
        class="category-card ${allSelected ? "is-selected" : ""}"
        type="button"
        data-category="all"
        aria-pressed="${allSelected}"
      >
        <span class="category-card-name">
          <span
            class="category-check"
            aria-hidden="true"
          >✓</span>All Talks
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
            !searchMode &&
            selectedCategory === category;

          return `
            <button
              class="category-card ${selected ? "is-selected" : ""}"
              type="button"
              data-category="${escapeHTML(category)}"
              aria-pressed="${selected}"
            >
              <span class="category-card-name">
                <span
                  class="category-check"
                  aria-hidden="true"
                >✓</span>${escapeHTML(category)}
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

    updateResetControl({
      animateSearch:
        animateSearchControl
    });

    categoryGrid
      .querySelectorAll(".category-card")
      .forEach(button => {
        button.addEventListener(
          "click",
          () => {
            /*
              Clicking a category immediately
              ends search mode.
            */
            searchInput.value = "";
            searchMode = false;

            updateSearchUI();

            selectedCategory =
              button.dataset.category;

            renderCategories();
            renderResults();
            scrollToResults();
          }
        );
      });
  }


  /* TALK CARD */

  function createTalkCard(talk) {
    const isCurrent =
      currentTalk &&
      talk.number === currentTalk.number;

    return `
      <article
        class="talk-card ${isCurrent ? "is-current" : ""}"
      >

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


  /* FILTERING */

  function getFilteredTalks() {
    const query =
      searchInput.value
        .trim()
        .toLowerCase();

    /*
      SEARCH MODE

      Search always searches the ENTIRE
      Toolbox Talk library.
    */
    if (searchMode && query) {
      const words =
        query
          .split(/\s+/)
          .filter(Boolean);

      return activeTalks.filter(talk => {
        const haystack = [
          numberLabel(talk.number),
          talk.title,
          talk.category,
          talk.description,
          talk.keywords || ""
        ]
          .join(" ")
          .toLowerCase();

        return words.every(word =>
          haystack.includes(word)
        );
      });
    }


    /*
      NORMAL CATEGORY MODE
    */
    return activeTalks.filter(talk =>
      selectedCategory === "all" ||
      talk.category === selectedCategory
    );
  }


  /* RESULTS */

  function renderResults() {
    const query =
      searchInput.value.trim();

    const filtered =
      getFilteredTalks();

    const talksToShow =
      [...filtered]
        .sort(
          (a, b) =>
            b.number - a.number
        );

    updateSearchUI(
      talksToShow.length
    );


    /* SEARCH RESULTS */

    if (searchMode && query) {
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


    /* ALL TALKS */

    else if (
      selectedCategory === "all"
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


    /* CATEGORY */

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


  /* ENTER SEARCH MODE */

  function enterSearchMode() {
    if (searchMode) {
      return;
    }

    searchMode = true;

    /*
      Re-rendering removes the selected
      class. CSS makes the selected styling
      fade away quickly.
    */
    renderCategories({
      animateSearchControl: true
    });
  }


  /* RESET SEARCH */

  function resetSearch({
    focusSearch = false
  } = {}) {

    searchInput.value = "";

    searchMode = false;

    /*
      A cleared search always returns
      to All Talks.
    */
    selectedCategory = "all";

    updateSearchUI();

    /*
      Re-rendering adds is-selected back
      to All Talks. CSS smoothly fades the
      blue selection back in.
    */
    renderCategories();
    renderResults();

    if (focusSearch) {
      searchInput.focus();
    }
  }


  /* LIVE SEARCH */

  searchInput.addEventListener(
    "input",
    () => {

      const hasQuery =
        hasSearchQuery();


      /*
        FIRST CHARACTER

        Enter search mode and smoothly
        release the selected category.
      */
      if (hasQuery && !searchMode) {
        enterSearchMode();
      }


      /*
        BACKSPACED ALL THE WAY TO EMPTY

        Return to All Talks automatically.
      */
      if (!hasQuery && searchMode) {
        resetSearch({
          focusSearch: true
        });

        return;
      }


      /*
        Results update live, but typing
        never scrolls the page.
      */
      renderResults();
    }
  );


  /* SEARCH / ENTER */

  searchForm.addEventListener(
    "submit",
    event => {
      event.preventDefault();

      if (!hasSearchQuery()) {
        return;
      }

      if (!searchMode) {
        enterSearchMode();
      }

      renderResults();
      scrollToResults();
    }
  );


  /* GRAY X */

  clearSearchButton.addEventListener(
    "click",
    () => {
      resetSearch({
        focusSearch: true
      });
    }
  );


  /* UPPER-RIGHT CLEAR CONTROL */

  categoryReset.addEventListener(
    "click",
    () => {

      /*
        SEARCH MODE:
        "Clear Search"
      */
      if (searchMode) {
        resetSearch({
          focusSearch: false
        });

        return;
      }


      /*
        CATEGORY MODE:
        "Clear Category"
      */
      selectedCategory = "all";

      renderCategories();
      renderResults();
    }
  );


  /* FLOATING BACK TO CATEGORIES */

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
