window.addEventListener("load", ()=> {
  const preloader = document.getElementById("preloader"); //big bg
  const mainContent = document.getElementById("main-content");

  setTimeout(()=> {
    preloader.classList.add("hidden"); //so it will disappeare
  }, 2500);
})
// end of preloader

const btnName = document.getElementById("btn-name"); // search by name
const btnIngredients = document.getElementById("btn-ingredients"); //search by ingredients
const searchInput = document.getElementById("search-input"); // the search bar
const searchGo = document.getElementById("search-go"); // the search button
const resultsGrid = document.getElementById("results-grid"); // the empty div where cards will appear
const toast = document.getElementById("toast"); // the toast element

const API_KEY = "ec60e39fba4d42cb97cd9f5dd5b7943f"; //api key
let currentMode = "name"; // the users option name or ingredients

btnName.addEventListener("click", ()=>{ // if the name is choosen
  currentMode = "name"; // the mood will be name
  btnName.classList.add("active-toggle"); // change the css
  btnIngredients.classList.remove("active-toggle"); // remove the css of ingredients incase of
  searchInput.placeholder = "Enter recipe name..."; // change the placeholder
  resultsGrid.innerHTML = ""; // empty the grid div
});
//same as up
btnIngredients.addEventListener("click", function () {
  currentMode = "ingredients";
  btnIngredients.classList.add("active-toggle");
  btnName.classList.remove("active-toggle");
  searchInput.placeholder = "Enter ingredients (e.g. chocolate, eggs)...";
  resultsGrid.innerHTML = "";
});

//work
searchGo.addEventListener("click", function () { //click search button

  const input = searchInput.value.trim(); // trim the input
  if (!input){
        showToast("Please type somthing");
        return;
  }
  resultsGrid.innerHTML = "<p style='color:var(--olive);font-family:Lato,sans-serif;'>Searching...</p>"; // show searching message while searching

  let url = ""; // empty to store the api according to the mode

  if (currentMode === "name") { // if mode is name
    url = `https://api.spoonacular.com/recipes/complexSearch?query=${input}&type=dessert&number=8&apiKey=${API_KEY}`; // edited so, givs desserts only, gets 8 results only
  } else { // if mode is ingredients
    url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${input}&number=8&apiKey=${API_KEY}`;
  }

  fetch(url) //fetchimg the url
    .then((response) => {
        if (!response.ok) {
          showToast("Something went wrong. Try again."); // show toast error
          return;
        }
        return response.json(); // convert response to JSON
        })
    .then((data) => {
     console.log(data)
    resultsGrid.innerHTML = ""; // clear searching message
    if (!data) return; // if there is no data it will stop instead of making error
    const recipes = currentMode === "name" ? data.results : data;
  // it is same as if currentmode is name use data.result else use only data

    if (recipes.length === 0) { // if no results
      showToast("No results found. Try something else."); // show toast
      return;
    }

      recipes.forEach(function (recipe) {
        const card = document.createElement("div"); // create a new empty div
        card.classList.add("recipe-card"); // give it the card(div) css class
        card.innerHTML = `
          <img src="${recipe.image}" alt="${recipe.title}" />
          <div class="recipe-card-body">
            <p class="recipe-card-title">${recipe.title}</p>
            <div class="card-actions">
              <a href="https://spoonacular.com/recipes/${recipe.title}-${recipe.id}" target="_blank" class="recipe-card-btn">View Recipe</a>
              <span class="save-btn" data-id="${recipe.id}" data-title="${recipe.title}" data-image="${recipe.image}">♡</span>
            </div>
          </div>
        `; // fill the card with the image and title and link from api data
        resultsGrid.appendChild(card); // add the card to the main grid div

        const saveBtn = card.querySelector(".save-btn"); // the heart on the card
        saveBtn.addEventListener("click", function () { 

          const id = this.dataset.id; // get recipe id
          const title = this.dataset.title; // get recipe title
          const image = this.dataset.image; // get recipe image

          let saved = JSON.parse(localStorage.getItem("savedRecipes")) || []; // get saved list from local storage

          const alreadySaved = saved.find((r) => r.id === id); // check if already saved

          if (alreadySaved) { // if already saved
            saved = saved.filter((r) => r.id !== id); // remove it from the list
            localStorage.setItem("savedRecipes", JSON.stringify(saved)); // update local storage
            this.textContent = "♡"; // empty the heart
            this.classList.remove("saved"); // remove saved class
            showToast("Removed from saved."); // show toast
            return; // stop
          }

          saved.push({ id, title, image }); // add recipe to the list
          localStorage.setItem("savedRecipes", JSON.stringify(saved)); // save to local storage

          this.textContent = "♥"; // fill the heart
          this.classList.add("saved"); // add saved class
          showToast("Saved!"); // show toast

        });
      });

    })
    .catch(()=> { showToast("Something went wrong. Try again.");});

});

function showToast(message) {
  toast.textContent = message; // take text from the argumnt
  toast.classList.add("show"); // makes it visible
  setTimeout(function () { // after 3 seconds
    toast.classList.remove("show"); // hides it again
  }, 3000);
}








