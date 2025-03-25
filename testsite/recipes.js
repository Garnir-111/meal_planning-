//recipes.js
import recipes from "./recipeDb.js";

//search function
function searchHandler(e) {
    e.preventDefault(); 

    const searchInput = document.querySelector('.search-box input');
    const query = searchInput.value.toLowerCase(); //lowercase
    const filteredRecipes = filterRecipes(query);
    renderRecipes(filteredRecipes);
}

function recipeTemplate(recipe) {
	return `<main>
    <div class="recipe-container">
      <img src="${recipe.image}" alt="Image of ${recipe.name} recipe" class="recipe-img" />

      <div class="recipe">
        <h2 class="recipe-title">${recipe.name}</h2>
          <p class="recipe-paragraph">
            Ingredients: ${recipe.ingredients.join(', ')}
          </p>
          <p class="recipe-time">
            Time: ${recipe.time}
          </p>
          <p class="recipe-category">
            Category: ${recipe.category} 
          </p>
          <p class="recipe-description">
            ${recipe.description}
          </p>
      </div>
    </div>
</main>`;
}

function filterRecipes(query) {
  return recipes.filter(recipe => {
      return recipe.name.toLowerCase().includes(query) || 
             recipe.ingredients.join(' ').toLowerCase().includes(query) ||
             recipe.category.toLowerCase().includes(query);
  });
}



  function renderRecipes(recipeList) {
    // get the element we will output the recipes into
    const recipeOutputElement = document.getElementById("recipe-output");
    // use the recipeTemplate function to transform our recipe objects into recipe HTML strings
    const recipesHTML = recipeList
      .map((recipe) => recipeTemplate(recipe))
      .join("");
    // Set the HTML strings as the innerHTML of our output element.
    recipeOutputElement.innerHTML = recipesHTML;
  }



//search button event listener
document.querySelector('.search-box').addEventListener('submit', searchHandler);


