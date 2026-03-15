window.addEventListener("load", ()=> {
  const preloader = document.getElementById("preloader"); //big bg
  const mainContent = document.getElementById("main-content");

  setTimeout(()=> {
    preloader.classList.add("hidden"); //so it will disappeare
  }, 2500);
})
// end of preloader

//active the nav

const sections = document.querySelectorAll("section[id]"); // get all sections that have an id
const navButs = document.querySelectorAll(".nav-but"); // get all nav buttons

const observer = new IntersectionObserver(function (entries) { // create a watcher, runs when screen changes

  entries.forEach(function (entry) { // loop through each watched section

    if (entry.isIntersecting) { // if this section is visible on screen

      navButs.forEach(function (but) {
        but.classList.remove("active"); // remove active from all buttons
      });

      const id = entry.target.getAttribute("id"); // get the id of the visible section

      const activeBtn = document.querySelector(`.nav-but[href="#${id}"]`); // find the matching button

      if (activeBtn) activeBtn.classList.add("active"); // add active only to that button
    }

  });

}, { threshold: 0.3 }); // trigger when 30% of the section is visible

sections.forEach(function (section) {
  observer.observe(section); // tell the watcher to watch each section
});
//end of nav










//todys's pick

// ===== TODAY'S PICKS =====
const picksGrid = document.getElementById("picks-grid"); // the grid where picks will appear

function getRandomDesserts() {
  const requests = []; // empty list to store 3 fetch requests

  for (let i = 0; i < 3; i++) { // loop 3 times to get 3 random recipes
    requests.push(
      fetch("https://www.themealdb.com/api/json/v1/1/filter.php?c=Dessert") // fetch desserts from TheMealDB
        .then((res) => res.json()) // convert to JSON
        .then((data) => {
          const meals = data.meals; // get the list of meals
          const random = meals[Math.floor(Math.random() * meals.length)]; // pick a random one
          return random; // return it
        })
    );
  }

  Promise.all(requests) // wait for all 3 requests to finish
    .then((recipes) => { // when all 3 are ready
      picksGrid.innerHTML = ""; // clear the grid

      recipes.forEach((recipe) => { // loop through each recipe
        const card = document.createElement("div"); // create a new card div
        card.classList.add("picks-card"); // give it the card class
        card.innerHTML = `
          <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" />
          <div class="picks-card-body">
            <p class="picks-card-title">${recipe.strMeal}</p>
            <a href="https://www.themealdb.com/meal/${recipe.idMeal}" target="_blank" class="picks-card-btn">View Recipe</a>
          </div>
        `; // fill card with image and title from TheMealDB
        picksGrid.appendChild(card); // add card to the grid
      });

    })
    .catch(() => { // if something goes wrong
      picksGrid.innerHTML = "<p style='color:var(--olive);font-family:Lato,sans-serif;'>Could not load picks. Try refreshing.</p>";
    });
}

getRandomDesserts(); // run when page loads