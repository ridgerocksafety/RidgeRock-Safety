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

  const escapeRegExp = value =>
    String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const numberLabel = number =>
    String(number).padStart(3, "0");

  const pdfURL = fileName =>
    `toolbox-talks/${encodeURIComponent(fileName)}`;


  /* ELEMENTS */

  const searchArea =
    $("#librarySearchArea");

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

  const suggestionsBox =
    $("#librarySuggestions");

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


  /* STATE */

  let selectedCategory = "all";
  let searchMode = false;

  let currentSuggestions = [];
  let activeSuggestionIndex = -1;


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


  /* RESET CONTROL */

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
            closeSuggestions();

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


  /* SEARCH MATCHING */

  function talkMatchesQuery(talk, query) {
    const words =
      query
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);

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
  }


  function getFilteredTalks() {
    const query =
      searchInput.value
        .trim()
        .toLowerCase();

    if (searchMode && query) {
      return activeTalks.filter(talk =>
        talkMatchesQuery(talk, query)
      );
    }

    return activeTalks.filter(talk =>
      selectedCategory === "all" ||
      talk.category === selectedCategory
    );
  }


  /* SUGGESTION RANKING */

  function suggestionScore(talk, query) {
    const q =
      query.toLowerCase();

    const title =
      talk.title.toLowerCase();

    const category =
      talk.category.toLowerCase();

    const number =
      numberLabel(talk.number).toLowerCase();

    const keywords =
      (talk.keywords || "").toLowerCase();

    const description =
      talk.description.toLowerCase();


    /*
      Lower score = stronger suggestion.
    */

    if (title === q) {
      return 0;
    }

    if (title.startsWith(q)) {
      return 10;
    }

    if (
      title
        .split(/\s+/)
        .some(word =>
          word.startsWith(q)
        )
    ) {
      return 20;
    }

    if (title.includes(q)) {
      return 30;
    }

    if (number === q) {
      return 35;
    }

    if (category.startsWith(q)) {
      return 40;
    }

    if (category.includes(q)) {
      return 50;
    }

    if (keywords.includes(q)) {
      return 60;
    }

    if (description.includes(q)) {
      return 70;
    }

    return 999;
  }


  function getSuggestions() {
    const query =
      searchInput.value.trim();

    if (query.length < 2) {
      return [];
    }

    return activeTalks
      .map(talk => ({
        talk,
        score:
          suggestionScore(talk, query)
      }))
      .filter(item =>
        item.score < 999
      )
      .sort((a, b) => {
        if (a.score !== b.score) {
          return a.score - b.score;
        }

        /*
          For equally good matches,
          show newer talks first.
        */
        return b.talk.number - a.talk.number;
      })
      .slice(0, 3)
      .map(item => item.talk);
  }


  /* MATCH HIGHLIGHT */

  function highlightTitle(title, query) {
    const safeTitle =
      escapeHTML(title);

    const trimmedQuery =
      query.trim();

    if (!trimmedQuery) {
      return safeTitle;
    }

    /*
      Only highlight the query in the title
      when the actual title contains it.
    */
    const escapedQuery =
      escapeHTML(trimmedQuery);

    const pattern =
      new RegExp(
        `(${escapeRegExp(escapedQuery)})`,
        "ig"
      );

    return safeTitle.replace(
      pattern,
      "<mark>$1</mark>"
    );
  }


  /* SUGGESTIONS */

  function closeSuggestions() {
    currentSuggestions = [];
    activeSuggestionIndex = -1;

    suggestionsBox.classList.remove(
      "is-open"
    );

    suggestionsBox.innerHTML = "";

    searchInput.setAttribute(
      "aria-expanded",
      "false"
    );

    searchInput.removeAttribute(
      "aria-activedescendant"
    );
  }


  function updateActiveSuggestion() {
    const buttons =
      suggestionsBox.querySelectorAll(
        ".library-suggestion"
      );

    buttons.forEach(
      (button, index) => {
        const active =
          index === activeSuggestionIndex;

        button.classList.toggle(
          "is-active",
          active
        );

        button.setAttribute(
          "aria-selected",
          String(active)
        );
      }
    );

    if (activeSuggestionIndex >= 0) {
      searchInput.setAttribute(
        "aria-activedescendant",
        `librarySuggestion-${activeSuggestionIndex}`
      );
    }

    else {
      searchInput.removeAttribute(
        "aria-activedescendant"
      );
    }
  }


  function renderSuggestions() {
    const query =
      searchInput.value.trim();

    currentSuggestions =
      getSuggestions();

    activeSuggestionIndex = -1;

    /*
      Don't show an empty suggestion box.
    */
    if (
      query.length < 2 ||
      currentSuggestions.length === 0 ||
      document.activeElement !== searchInput
    ) {
      closeSuggestions();
      return;
    }

    suggestionsBox.innerHTML =
      currentSuggestions
        .map((talk, index) => `
          <button
            class="library-suggestion"
            id="librarySuggestion-${index}"
            type="button"
            role="option"
            aria-selected="false"
            data-index="${index}"
          >
            <span class="suggestion-category">
              ${escapeHTML(talk.category)}
            </span>

            <span class="suggestion-number">
              ${numberLabel(talk.number)}
            </span>

            <span class="suggestion-title">
              ${highlightTitle(
                talk.title,
                query
              )}
            </span>
          </button>
        `)
        .join("");

    suggestionsBox.classList.add(
      "is-open"
    );

    searchInput.setAttribute(
      "aria-expanded",
      "true"
    );


    suggestionsBox
      .querySelectorAll(
        ".library-suggestion"
      )
      .forEach(button => {
        /*
          mousedown prevents the input from
          losing focus before the click fires.
        */
        button.addEventListener(
          "mousedown",
          event => {
            event.preventDefault();
          }
        );

        button.addEventListener(
          "click",
          () => {
            const index =
              Number(button.dataset.index);

            chooseSuggestion(index);
          }
        );
      });
  }


  function chooseSuggestion(index) {
    const talk =
      currentSuggestions[index];

    if (!talk) {
      return;
    }

    /*
      Fill the field with the actual talk title.
    */
    searchInput.value =
      talk.title;

    searchMode = true;

    closeSuggestions();

    updateSearchUI(1);
    updateResetControl();

    renderCategories();
    renderResults();

    /*
      Close the mobile/tablet keyboard.
    */
    searchInput.blur();

    scrollToResults();
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

    renderCategories({
      animateSearchControl: true
    });
  }


  /* RESET SEARCH */

  function resetSearch({
    focusSearch = false
  } = {}) {

    closeSuggestions();

    searchInput.value = "";

    searchMode = false;
    selectedCategory = "all";

    updateSearchUI();

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


      if (hasQuery && !searchMode) {
        enterSearchMode();
      }


      if (!hasQuery && searchMode) {
        resetSearch({
          focusSearch: true
        });

        return;
      }


      renderResults();
      renderSuggestions();
    }
  );


  /* FOCUS */

  searchInput.addEventListener(
    "focus",
    () => {
      if (
        searchInput.value.trim().length >= 2
      ) {
        renderSuggestions();
      }
    }
  );


  /* KEYBOARD NAVIGATION */

  searchInput.addEventListener(
    "keydown",
    event => {

      const suggestionsOpen =
        suggestionsBox.classList.contains(
          "is-open"
        );


      /*
        DOWN ARROW

        Nothing is automatically selected
        when suggestions first appear.

        The user must press down or tap one.
      */
      if (
        event.key === "ArrowDown" &&
        suggestionsOpen
      ) {
        event.preventDefault();

        activeSuggestionIndex++;

        if (
          activeSuggestionIndex >=
          currentSuggestions.length
        ) {
          activeSuggestionIndex = 0;
        }

        updateActiveSuggestion();

        return;
      }


      /* UP ARROW */

      if (
        event.key === "ArrowUp" &&
        suggestionsOpen
      ) {
        event.preventDefault();

        activeSuggestionIndex--;

        if (activeSuggestionIndex < 0) {
          activeSuggestionIndex =
            currentSuggestions.length - 1;
        }

        updateActiveSuggestion();

        return;
      }


      /*
        ESCAPE

        Only closes suggestions.
        It does NOT clear their search.
      */
      if (
        event.key === "Escape" &&
        suggestionsOpen
      ) {
        event.preventDefault();

        closeSuggestions();

        return;
      }


      /*
        ENTER

        If they deliberately highlighted a
        suggestion with the arrow keys,
        choose it.

        Otherwise the normal form submit
        handles Enter as a regular search.
      */
      if (
        event.key === "Enter" &&
        suggestionsOpen &&
        activeSuggestionIndex >= 0
      ) {
        event.preventDefault();

        chooseSuggestion(
          activeSuggestionIndex
        );
      }
    }
  );


  /* SEARCH BUTTON / NORMAL ENTER */

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

      closeSuggestions();

      renderResults();

      /*
        Close mobile/tablet keyboard.
      */
      searchInput.blur();

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


  /* CLEAR SEARCH / CLEAR CATEGORY */

  categoryReset.addEventListener(
    "click",
    () => {

      if (searchMode) {
        resetSearch({
          focusSearch: false
        });

        return;
      }

      selectedCategory = "all";

      renderCategories();
      renderResults();
    }
  );


  /* CLICK OUTSIDE SEARCH */

  document.addEventListener(
    "pointerdown",
    event => {
      if (
        !searchArea.contains(event.target)
      ) {
        closeSuggestions();
      }
    }
  );


  /* BACK TO CATEGORIES */

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
      closeSuggestions();

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
