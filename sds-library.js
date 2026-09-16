"use strict";

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const data = sdsLibraryData;


    /* =====================================================
       DATA
       ===================================================== */

    const activeSheets =
      data.sheets
        .filter(
          sheet =>
            sheet.active !== false
        )
        .sort(
          (a, b) =>
            a.number - b.number
        );


    const $ =
      selector =>
        document.querySelector(selector);


    const escapeHTML =
      value =>
        String(value)
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
          .replaceAll('"', "&quot;")
          .replaceAll("'", "&#039;");


    const escapeRegExp =
      value =>
        String(value)
          .replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          );


    const numberLabel =
      number =>
        String(number)
          .padStart(2, "0");


    /*
      IMPORTANT:
      GitHub Pages paths are case-sensitive.
      The real folder is uppercase SDS.
    */

    const fileURL =
      fileName =>
        `SDS/${encodeURIComponent(fileName)}`;


    /* =====================================================
       ELEMENTS
       ===================================================== */

    const searchArea =
      $("#sdsSearchArea");

    const searchForm =
      $("#sdsSearchForm");

    const searchInput =
      $("#sdsSearch");

    const searchActions =
      $("#sdsSearchActions");

    const clearSearchButton =
      $("#sdsClearSearch");

    const searchStatus =
      $("#sdsSearchStatus");

    const suggestionsBox =
      $("#sdsSuggestions");

    const categoryGrid =
      $("#sdsCategoryGrid");

    const categoryReset =
      $("#sdsCategoryReset");

    const categorySection =
      $("#sdsCategorySection");

    const sdsGrid =
      $("#sdsGrid");

    const emptyState =
      $("#sdsEmptyState");

    const resultsSection =
      $("#sdsResults");

    const backToCategories =
      $("#sdsBackToCategories");


    /* =====================================================
       STATE
       ===================================================== */

    let selectedCategory = "all";

    let searchMode = false;

    let currentSuggestions = [];

    let activeSuggestionIndex = -1;


    /* =====================================================
       PAGE INFORMATION
       ===================================================== */

    $("#lastUpdated").textContent =
      `Last updated: ${data.lastUpdated}`;


    $("#sdsLibraryTotal").textContent =
      activeSheets.length;


    /* =====================================================
       COMPLETE SDS PACKAGE
       ===================================================== */

    if (data.completePackage) {

      $("#completePackageTitle")
        .textContent =
          data.completePackage.title;


      $("#completePackageDescription")
        .textContent =
          data.completePackage.description;


      $("#completePackageButton")
        .href =
          fileURL(
            data.completePackage.fileName
          );

    }


    /* =====================================================
       CATEGORY COUNTS
       ===================================================== */

    const categoryCounts =
      activeSheets.reduce(
        (counts, sheet) => {

          counts[sheet.category] =
            (
              counts[sheet.category] ||
              0
            ) + 1;

          return counts;

        },
        {}
      );


    /*
      Keep categories in the order
      defined in sds-data.js.
    */

    const usedCategories =
      (data.categories || [])
        .filter(
          category =>
            categoryCounts[category] > 0
        )
        .concat(

          Object.keys(categoryCounts)
            .filter(
              category =>
                !(
                  data.categories ||
                  []
                ).includes(category)
            )
            .sort(
              (a, b) =>
                a.localeCompare(b)
            )

        );


    /* =====================================================
       BASIC HELPERS
       ===================================================== */

    function hasSearchQuery() {

      return (
        searchInput
          .value
          .trim()
          .length > 0
      );

    }


    function scrollToResults() {

      if (!resultsSection) {
        return;
      }


      resultsSection
        .scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

    }


    /* =====================================================
       SEARCH UI
       ===================================================== */

    function updateSearchUI(
      resultCount = 0
    ) {

      const hasQuery =
        hasSearchQuery();


      searchArea
        .classList
        .toggle(
          "has-query",
          hasQuery
        );


      searchActions
        .setAttribute(
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


    /* =====================================================
       CLEAR SEARCH / CLEAR CATEGORY
       ===================================================== */

    function updateResetControl({
      animateSearch = false
    } = {}) {

      categoryReset
        .classList
        .remove(
          "search-control-enter"
        );


      if (searchMode) {

        categoryReset.hidden = false;

        categoryReset.textContent =
          "Clear Search";


        if (animateSearch) {

          void categoryReset.offsetWidth;

          categoryReset
            .classList
            .add(
              "search-control-enter"
            );

        }


        return;

      }


      if (
        selectedCategory !== "all"
      ) {

        categoryReset.hidden = false;

        categoryReset.textContent =
          "Clear Category";

        return;

      }


      categoryReset.hidden = true;

    }


    /* =====================================================
       CATEGORIES
       ===================================================== */

    function renderCategories({
      animateSearchControl = false
    } = {}) {

      const allSelected =
        !searchMode &&
        selectedCategory === "all";


      const allButton = `
        <button
          class="
            sds-category-card
            ${allSelected
              ? "is-selected"
              : ""}
          "
          type="button"
          data-category="all"
          aria-pressed="${allSelected}"
        >

          <span
            class="sds-category-card-name"
          >
            <span
              class="sds-category-check"
              aria-hidden="true"
            >✓</span>All SDS
          </span>

          <span
            class="sds-category-card-count"
          >
            <strong>
              ${activeSheets.length}
            </strong>

            ${
              activeSheets.length === 1
                ? "sheet"
                : "sheets"
            }
          </span>

        </button>
      `;


      const categoryButtons =
        usedCategories
          .map(
            category => {

              const count =
                categoryCounts[
                  category
                ];


              const selected =
                !searchMode &&
                selectedCategory ===
                  category;


              return `
                <button
                  class="
                    sds-category-card
                    ${selected
                      ? "is-selected"
                      : ""}
                  "
                  type="button"
                  data-category="${
                    escapeHTML(
                      category
                    )
                  }"
                  aria-pressed="${selected}"
                >

                  <span
                    class="
                      sds-category-card-name
                    "
                  >
                    <span
                      class="
                        sds-category-check
                      "
                      aria-hidden="true"
                    >✓</span>${
                      escapeHTML(
                        category
                      )
                    }
                  </span>

                  <span
                    class="
                      sds-category-card-count
                    "
                  >
                    <strong>
                      ${count}
                    </strong>

                    ${
                      count === 1
                        ? "sheet"
                        : "sheets"
                    }
                  </span>

                </button>
              `;

            }
          )
          .join("");


      categoryGrid.innerHTML =
        allButton +
        categoryButtons;


      updateResetControl({
        animateSearch:
          animateSearchControl
      });


      categoryGrid
        .querySelectorAll(
          ".sds-category-card"
        )
        .forEach(
          button => {

            button
              .addEventListener(
                "click",
                () => {

                  closeSuggestions();


                  /*
                    Clicking a category
                    exits search mode.
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

          }
        );

    }


    /* =====================================================
       SDS CARD
       ===================================================== */

    function createSDSCard(
      sheet
    ) {

      return `
        <article class="sds-card">

          <div class="sds-card-top">

            <span class="sds-number">
              SDS ${numberLabel(
                sheet.number
              )}
            </span>

            <span class="sds-category">
              ${escapeHTML(
                sheet.category
              )}
            </span>

          </div>


          <div>

            <h3>
              ${escapeHTML(
                sheet.title
              )}
            </h3>

            <p class="sds-manufacturer">
              ${escapeHTML(
                sheet.manufacturer
              )}
            </p>

          </div>


          <a
            class="button button-outline"
            href="${
              fileURL(
                sheet.fileName
              )
            }"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open SDS

            <span aria-hidden="true">
              ↗
            </span>
          </a>

        </article>
      `;

    }


    /* =====================================================
       SEARCH MATCHING
       ===================================================== */

    function sheetMatchesQuery(
      sheet,
      query
    ) {

      const words =
        query
          .toLowerCase()
          .split(/\s+/)
          .filter(Boolean);


      const haystack = [

        numberLabel(
          sheet.number
        ),

        sheet.title,

        sheet.manufacturer,

        sheet.category,

        sheet.keywords || ""

      ]
        .join(" ")
        .toLowerCase();


      return words.every(
        word =>
          haystack.includes(word)
      );

    }


    function getFilteredSheets() {

      const query =
        searchInput
          .value
          .trim()
          .toLowerCase();


      /*
        Search mode always searches
        the ENTIRE SDS library.

        It does not combine the search
        with the previous category.
      */

      if (
        searchMode &&
        query
      ) {

        return activeSheets
          .filter(
            sheet =>
              sheetMatchesQuery(
                sheet,
                query
              )
          );

      }


      return activeSheets
        .filter(
          sheet =>

            selectedCategory ===
              "all"

            ||

            sheet.category ===
              selectedCategory

        );

    }


    /* =====================================================
       AUTOCOMPLETE RANKING
       ===================================================== */

    function suggestionScore(
      sheet,
      query
    ) {

      const q =
        query.toLowerCase();


      const title =
        sheet.title.toLowerCase();


      const manufacturer =
        sheet.manufacturer
          .toLowerCase();


      const category =
        sheet.category
          .toLowerCase();


      const keywords =
        (
          sheet.keywords ||
          ""
        ).toLowerCase();


      /*
        Lower number =
        stronger suggestion.
      */


      /* Exact product */

      if (title === q) {
        return 0;
      }


      /* Product begins with query */

      if (
        title.startsWith(q)
      ) {
        return 10;
      }


      /*
        A word in the product
        begins with query.
      */

      if (
        title
          .split(/\s+/)
          .some(
            word =>
              word.startsWith(q)
          )
      ) {
        return 20;
      }


      /* Product contains query */

      if (
        title.includes(q)
      ) {
        return 30;
      }


      /* Manufacturer begins */

      if (
        manufacturer.startsWith(q)
      ) {
        return 40;
      }


      /*
        Manufacturer word begins
        with query.
      */

      if (
        manufacturer
          .split(/\s+/)
          .some(
            word =>
              word.startsWith(q)
          )
      ) {
        return 45;
      }


      /* Manufacturer contains */

      if (
        manufacturer.includes(q)
      ) {
        return 50;
      }


      /* Category begins */

      if (
        category.startsWith(q)
      ) {
        return 60;
      }


      /* Category contains */

      if (
        category.includes(q)
      ) {
        return 70;
      }


      /* Keywords */

      if (
        keywords.includes(q)
      ) {
        return 80;
      }


      return 999;

    }


    function getSuggestions() {

      const query =
        searchInput
          .value
          .trim();


      /*
        No suggestions until
        at least two characters.
      */

      if (
        query.length < 2
      ) {

        return [];

      }


      return activeSheets

        .map(
          sheet => ({
            sheet,

            score:
              suggestionScore(
                sheet,
                query
              )
          })
        )

        .filter(
          item =>
            item.score < 999
        )

        .sort(
          (a, b) => {

            if (
              a.score !==
              b.score
            ) {

              return (
                a.score -
                b.score
              );

            }


            /*
              If equally relevant,
              use alphabetical product
              order for SDS.
            */

            return a.sheet.title
              .localeCompare(
                b.sheet.title
              );

          }
        )

        .slice(0, 3)

        .map(
          item =>
            item.sheet
        );

    }


    /* =====================================================
       AUTOCOMPLETE HIGHLIGHT
       ===================================================== */

    function highlightText(
      value,
      query
    ) {

      const safeValue =
        escapeHTML(value);


      const trimmedQuery =
        query.trim();


      if (!trimmedQuery) {

        return safeValue;

      }


      const escapedQuery =
        escapeHTML(
          trimmedQuery
        );


      const pattern =
        new RegExp(
          `(${escapeRegExp(
            escapedQuery
          )})`,
          "ig"
        );


      return safeValue.replace(
        pattern,
        "<mark>$1</mark>"
      );

    }


    /* =====================================================
       AUTOCOMPLETE OPEN / CLOSE
       ===================================================== */

    function closeSuggestions() {

      currentSuggestions = [];

      activeSuggestionIndex = -1;


      suggestionsBox
        .classList
        .remove(
          "is-open"
        );


      suggestionsBox.innerHTML =
        "";


      searchInput
        .setAttribute(
          "aria-expanded",
          "false"
        );


      searchInput
        .removeAttribute(
          "aria-activedescendant"
        );

    }


    function updateActiveSuggestion() {

      const buttons =
        suggestionsBox
          .querySelectorAll(
            ".sds-suggestion"
          );


      buttons.forEach(
        (button, index) => {

          const active =
            index ===
            activeSuggestionIndex;


          button
            .classList
            .toggle(
              "is-active",
              active
            );


          button
            .setAttribute(
              "aria-selected",
              String(active)
            );

        }
      );


      if (
        activeSuggestionIndex >= 0
      ) {

        searchInput
          .setAttribute(
            "aria-activedescendant",
            `sdsSuggestion-${activeSuggestionIndex}`
          );

      }

      else {

        searchInput
          .removeAttribute(
            "aria-activedescendant"
          );

      }

    }


    function renderSuggestions() {

      const query =
        searchInput
          .value
          .trim();


      currentSuggestions =
        getSuggestions();


      activeSuggestionIndex = -1;


      /*
        Don't show:
        - fewer than 2 characters
        - zero suggestions
        - when search isn't focused
      */

      if (
        query.length < 2
        ||
        currentSuggestions.length === 0
        ||
        document.activeElement !==
          searchInput
      ) {

        closeSuggestions();

        return;

      }


      suggestionsBox.innerHTML =
        currentSuggestions
          .map(
            (sheet, index) => `

              <button
                class="sds-suggestion"
                id="sdsSuggestion-${index}"
                type="button"
                role="option"
                aria-selected="false"
                data-index="${index}"
              >

                <span
                  class="
                    sds-suggestion-category
                  "
                >
                  ${escapeHTML(
                    sheet.category
                  )}
                </span>


                <span
                  class="
                    sds-suggestion-manufacturer
                  "
                >
                  ${highlightText(
                    sheet.manufacturer,
                    query
                  )}
                </span>


                <span
                  class="
                    sds-suggestion-title
                  "
                >
                  ${highlightText(
                    sheet.title,
                    query
                  )}
                </span>

              </button>

            `
          )
          .join("");


      suggestionsBox
        .classList
        .add(
          "is-open"
        );


      searchInput
        .setAttribute(
          "aria-expanded",
          "true"
        );


      suggestionsBox
        .querySelectorAll(
          ".sds-suggestion"
        )
        .forEach(
          button => {

            /*
              Prevent input losing focus
              before the click fires.
            */

            button
              .addEventListener(
                "mousedown",
                event => {

                  event.preventDefault();

                }
              );


            button
              .addEventListener(
                "click",
                () => {

                  const index =
                    Number(
                      button.dataset.index
                    );


                  chooseSuggestion(
                    index
                  );

                }
              );

          }
        );

    }


    /* =====================================================
       SELECT AUTOCOMPLETE SUGGESTION
       ===================================================== */

    function chooseSuggestion(
      index
    ) {

      const sheet =
        currentSuggestions[
          index
        ];


      if (!sheet) {
        return;
      }


      /*
        Fill search with the actual
        product title.

        We do NOT open the PDF
        automatically.
      */

      searchInput.value =
        sheet.title;


      searchMode = true;


      closeSuggestions();


      renderCategories();

      renderResults();


      /*
        Close phone / tablet keyboard.
      */

      searchInput.blur();


      /*
        Bring employee to the normal
        SDS result card.
      */

      scrollToResults();

    }


    /* =====================================================
       RESULTS
       ===================================================== */

    function renderResults() {

      const query =
        searchInput
          .value
          .trim();


      const filtered =
        getFilteredSheets();


      /*
        Keep normal SDS ordering.
      */

      const sheetsToShow =
        [...filtered]
          .sort(
            (a, b) =>
              a.number - b.number
          );


      updateSearchUI(
        sheetsToShow.length
      );


      /* SEARCH */

      if (
        searchMode &&
        query
      ) {

        $("#sdsResultsEyebrow")
          .textContent =
            "Search Results";


        $("#sdsResultsTitle")
          .textContent =
            "Matching Safety Data Sheets";


        $("#sdsResultsDescription")
          .textContent =
            `${sheetsToShow.length} ${
              sheetsToShow.length === 1
                ? "SDS"
                : "SDS"
            } matching "${query}".`;

      }


      /* ALL SDS */

      else if (
        selectedCategory ===
          "all"
      ) {

        $("#sdsResultsEyebrow")
          .textContent =
            "SDS Library";


        $("#sdsResultsTitle")
          .textContent =
            "All Safety Data Sheets";


        $("#sdsResultsDescription")
          .textContent =
            `${sheetsToShow.length} Safety Data Sheets available.`;

      }


      /* CATEGORY */

      else {

        $("#sdsResultsEyebrow")
          .textContent =
            "SDS Library";


        $("#sdsResultsTitle")
          .textContent =
            selectedCategory;


        $("#sdsResultsDescription")
          .textContent =
            `${sheetsToShow.length} ${
              sheetsToShow.length === 1
                ? "SDS"
                : "SDS"
            } in this category.`;

      }


      sdsGrid.innerHTML =
        sheetsToShow
          .map(
            createSDSCard
          )
          .join("");


      emptyState.hidden =
        sheetsToShow.length > 0;

    }


    /* =====================================================
       ENTER SEARCH MODE
       ===================================================== */

    function enterSearchMode() {

      if (searchMode) {
        return;
      }


      searchMode = true;


      /*
        Re-rendering categories removes
        the selected blue state while
        keeping all cards in place.
      */

      renderCategories({
        animateSearchControl: true
      });

    }


    /* =====================================================
       RESET SEARCH
       ===================================================== */

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


    /* =====================================================
       LIVE SEARCH
       ===================================================== */

    searchInput
      .addEventListener(
        "input",
        () => {

          const hasQuery =
            hasSearchQuery();


          /*
            First typed character:
            enter search mode.
          */

          if (
            hasQuery &&
            !searchMode
          ) {

            enterSearchMode();

          }


          /*
            Backspace all the way
            to empty:
            return to All SDS.
          */

          if (
            !hasQuery &&
            searchMode
          ) {

            resetSearch({
              focusSearch: true
            });

            return;

          }


          renderResults();

          renderSuggestions();

        }
      );


    /* =====================================================
       REOPEN SUGGESTIONS ON FOCUS
       ===================================================== */

    searchInput
      .addEventListener(
        "focus",
        () => {

          if (
            searchInput
              .value
              .trim()
              .length >= 2
          ) {

            renderSuggestions();

          }

        }
      );


    /* =====================================================
       KEYBOARD AUTOCOMPLETE
       ===================================================== */

    searchInput
      .addEventListener(
        "keydown",
        event => {

          const suggestionsOpen =
            suggestionsBox
              .classList
              .contains(
                "is-open"
              );


          /* DOWN */

          if (
            event.key ===
              "ArrowDown"
            &&
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


          /* UP */

          if (
            event.key ===
              "ArrowUp"
            &&
            suggestionsOpen
          ) {

            event.preventDefault();


            activeSuggestionIndex--;


            if (
              activeSuggestionIndex < 0
            ) {

              activeSuggestionIndex =
                currentSuggestions.length - 1;

            }


            updateActiveSuggestion();

            return;

          }


          /* ESCAPE */

          if (
            event.key ===
              "Escape"
            &&
            suggestionsOpen
          ) {

            event.preventDefault();

            closeSuggestions();

            return;

          }


          /*
            ENTER only selects a suggestion
            if the user deliberately moved
            to one with the arrow keys.

            Otherwise Enter remains normal
            Search behavior.
          */

          if (
            event.key ===
              "Enter"
            &&
            suggestionsOpen
            &&
            activeSuggestionIndex >= 0
          ) {

            event.preventDefault();


            chooseSuggestion(
              activeSuggestionIndex
            );

          }

        }
      );


    /* =====================================================
       SEARCH BUTTON / NORMAL ENTER
       ===================================================== */

    searchForm
      .addEventListener(
        "submit",
        event => {

          event.preventDefault();


          if (
            !hasSearchQuery()
          ) {

            return;

          }


          if (!searchMode) {

            enterSearchMode();

          }


          closeSuggestions();


          renderResults();


          /*
            Close mobile/tablet
            keyboard.
          */

          searchInput.blur();


          scrollToResults();

        }
      );


    /* =====================================================
       GRAY X
       ===================================================== */

    clearSearchButton
      .addEventListener(
        "click",
        () => {

          resetSearch({
            focusSearch: true
          });

        }
      );


    /* =====================================================
       CLEAR SEARCH / CLEAR CATEGORY
       ===================================================== */

    categoryReset
      .addEventListener(
        "click",
        () => {

          if (searchMode) {

            resetSearch({
              focusSearch: false
            });

            return;

          }


          selectedCategory =
            "all";


          renderCategories();

          renderResults();

        }
      );


    /* =====================================================
       CLICK OUTSIDE AUTOCOMPLETE
       ===================================================== */

    document
      .addEventListener(
        "pointerdown",
        event => {

          if (
            !searchArea.contains(
              event.target
            )
          ) {

            closeSuggestions();

          }

        }
      );


    /* =====================================================
       FLOATING BACK TO CATEGORIES
       ===================================================== */

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


      backToCategories
        .classList
        .toggle(
          "is-visible",
          shouldShow
        );

    }


    window
      .addEventListener(
        "scroll",
        updateBackToCategoriesButton,
        {
          passive: true
        }
      );


    window
      .addEventListener(
        "resize",
        updateBackToCategoriesButton
      );


    backToCategories
      .addEventListener(
        "click",
        () => {

          closeSuggestions();


          categorySection
            .scrollIntoView({
              behavior: "smooth",
              block: "start"
            });

        }
      );


    /* =====================================================
       MOBILE NAVIGATION
       ===================================================== */

    const menuButton =
      $("#menuButton");


    const mainNav =
      $("#mainNav");


    menuButton
      .addEventListener(
        "click",
        () => {

          const open =
            mainNav
              .classList
              .toggle("open");


          menuButton
            .setAttribute(
              "aria-expanded",
              String(open)
            );

        }
      );


    mainNav
      .querySelectorAll("a")
      .forEach(
        link => {

          link
            .addEventListener(
              "click",
              () => {

                mainNav
                  .classList
                  .remove("open");


                menuButton
                  .setAttribute(
                    "aria-expanded",
                    "false"
                  );

              }
            );

        }
      );


    /* =====================================================
       INITIAL RENDER
       ===================================================== */

    renderCategories();

    renderResults();

    updateBackToCategoriesButton();

  }
);
