// ===== GRAB ELEMENTS =====
const savedGrid = document.getElementById("saved-grid"); // the grid where saved cards will appear
const clearBtn = document.getElementById("clear-btn"); // the clear all button
const toast = document.getElementById("toast"); // the toast element

// ===== SHOW TOAST =====
function showToast(message) {
  toast.textContent = message; // set the message
  toast.classList.add("show"); // show it
  setTimeout(() => {
    toast.classList.remove("show"); // hide after 3 seconds
  }, 3000);
}

// ===== LOAD SAVED RECIPES =====
function loadSaved() {
  const saved = JSON.parse(localStorage.getItem("savedRecipes")) || []; // get saved list from local storage

  savedGrid.innerHTML = ""; // clear the grid first

  if (saved.length === 0) { // if nothing is saved
    savedGrid.innerHTML = "<p class='empty-msg'>No saved recipes yet.</p>"; // show empty message
    return; // stop
  }

  saved.forEach((recipe) => { // loop through each saved recipe
    const card = document.createElement("div"); // create a new card div
    card.classList.add("recipe-card"); // give it the card class
    card.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.title}" />
      <div class="recipe-card-body">
        <p class="recipe-card-title">${recipe.title}</p>
        <div class="card-actions">
          <a href="https://spoonacular.com/recipes/${recipe.title}-${recipe.id}" target="_blank" class="recipe-card-btn">View Recipe</a>
          <span class="save-btn saved" data-id="${recipe.id}">♥</span>
        </div>
      </div>
    `; // fill card with image, title and link

    const removeBtn = card.querySelector(".save-btn"); // grab the heart button
    removeBtn.addEventListener("click", function () { // when heart is clicked
      let saved = JSON.parse(localStorage.getItem("savedRecipes")) || []; // get saved list
      saved = saved.filter((r) => r.id !== this.dataset.id); // remove this recipe from the list
      localStorage.setItem("savedRecipes", JSON.stringify(saved)); // update local storage
      showToast("Removed from saved."); // show toast
      loadSaved(); // reload the grid
    });

    savedGrid.appendChild(card); // add card to the grid
  });
}

// ===== CLEAR ALL =====
clearBtn.addEventListener("click", () => {
  localStorage.removeItem("savedRecipes"); // delete everything from local storage
  showToast("All recipes cleared."); // show toast
  loadSaved(); // reload the grid
});

// ===== RUN ON PAGE LOAD =====
loadSaved(); // load saved recipes when page opens