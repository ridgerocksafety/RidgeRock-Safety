
/* ==========================================
   RIDGE ROCK MOBILE CATEGORY SELECTOR

   Works with:
   - Toolbox Talk Library
   - SDS Library

   Does not replace existing filtering logic.
========================================== */

document.addEventListener("DOMContentLoaded", () => {

  const configurations = [
    {
      sectionId: "categorySection",
      gridId: "categoryGrid",
      resetId: "categoryReset",
      label: "Toolbox Talk Categories"
    },
    {
      sectionId: "sdsCategorySection",
      gridId: "sdsCategoryGrid",
      resetId: "sdsCategoryReset",
      label: "SDS Categories"
    }
  ];

  configurations.forEach(setupMobileCategories);

  function setupMobileCategories(config) {

    const section = document.getElementById(
      config.sectionId
    );

    const grid = document.getElementById(
      config.gridId
    );

    if (!section || !grid) {
      return;
    }

    // Avoid duplicate initialization
    if (section.dataset.mobileCategoriesReady === "true") {
      return;
    }

    section.dataset.mobileCategoriesReady = "true";

    const toggle = document.createElement("button");

    toggle.type = "button";
    toggle.className = "mobile-category-toggle";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", config.gridId);

    toggle.innerHTML = `
      <span class="mobile-category-toggle-left">

        <span class="mobile-category-icon" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="4" y1="7" x2="20" y2="7"></line>
            <line x1="7" y1="12" x2="17" y2="12"></line>
            <line x1="10" y1="17" x2="14" y2="17"></line>
          </svg>
        </span>

        <span class="mobile-category-labels">

          <span class="mobile-category-caption">
            ${config.label}
          </span>

          <span class="mobile-category-selected">
            All Categories
          </span>

        </span>

      </span>

      <svg
        class="mobile-category-chevron"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    `;

    // Insert before the existing category grid
    section.insertBefore(toggle, grid);

    const selectedLabel = toggle.querySelector(
      ".mobile-category-selected"
    );

    const activeIndicator = document.createElement("p");

    activeIndicator.className = "mobile-category-active";
    activeIndicator.hidden = true;

    section.insertBefore(activeIndicator, grid);

    function setExpanded(expanded) {

      section.classList.toggle(
        "mobile-categories-open",
        expanded
      );

      toggle.setAttribute(
        "aria-expanded",
        String(expanded)
      );

    }

    function setSelectedCategory(category) {

      const name = category || "All Categories";

      selectedLabel.textContent = name;

      const isFiltered = name !== "All Categories";

      activeIndicator.hidden = !isFiltered;

      if (isFiltered) {
        activeIndicator.textContent = "";

        const strong = document.createElement("strong");
        strong.textContent = name;

        activeIndicator.append("Showing category: ", strong);
      }

    }

    // Open and close categories
    toggle.addEventListener("click", () => {

      const isOpen = section.classList.contains(
        "mobile-categories-open"
      );

      setExpanded(!isOpen);

    });

    // Let the original library JS handle category clicks.
    // This listener only updates the mobile interface.
    grid.addEventListener("click", (event) => {

      const category = event.target.closest(
        "button, a, [role='button']"
      );

      if (!category || !grid.contains(category)) {
        return;
      }

      // Wait for the original category handler to run.
      window.setTimeout(() => {

        const resetButton = document.getElementById(
          config.resetId
        );

        // Existing libraries control whether a filter is active.
        const hasActiveFilter = resetButton &&
          !resetButton.hidden &&
          getComputedStyle(resetButton).display !== "none";

        if (hasActiveFilter) {

          const categoryName =
            category.querySelector(
              ".category-name, .sds-category-name"
            )?.textContent?.trim() ||
            category.textContent.trim();

          setSelectedCategory(categoryName);

        } else {

          setSelectedCategory("All Categories");

        }

        setExpanded(false);

      }, 0);

    });

    // Handle clearing the category with the original reset button
    const resetButton = document.getElementById(
      config.resetId
    );

    if (resetButton) {

      resetButton.addEventListener("click", () => {
        setSelectedCategory("All Categories");
        setExpanded(false);
      });

    }

    // Keep the desktop layout unchanged
    document.body.classList.add(
      "mobile-categories-ready"
    );

  }

});
