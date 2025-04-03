//recipes.js
import recipes from "./recipeDb.js";

// Search function
function searchHandler(e) {
    e.preventDefault(); 

    const searchInput = document.querySelector('.search-box input');
    const query = searchInput.value.trim().toLowerCase();
    
    if (query) {
        // Update the URL with the search query
        const url = new URL(window.location.href);
        url.searchParams.set('search', query);
        window.history.pushState({}, '', url);
    } else {
        // Remove search param if input is empty
        const url = new URL(window.location.href);
        url.searchParams.delete('search');
        window.history.pushState({}, '', url);
    }
    
    handleSearchFromURL();
}

function handleSearchFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('search');
    
    if (query) {
        const filteredRecipes = filterRecipes(query);
        renderRecipes(filteredRecipes);
    } else {
        renderRecipes(recipes); // Show all recipes if no search query
    }
}

function recipeTemplate(recipe) {
    return `<main>
        <div class="recipe-container">
            <img src="${recipe.image}" alt="Image of ${recipe.title} recipe" class="recipe-img" />
            <div class="recipe">
                <h2 class="recipe-title">${recipe.title}</h2>
                <p class="recipe-paragraph">Instructions: ${recipe.instructions}</p>
                <p class="recipe-servings">Servings: ${recipe.servings}</p>
                <p class="recipe-price">Price: $${recipe.price}</p>
                <p class="recipe-ingredients">Ingredients: ${recipe["Ingredients"]}</p>
                <p class="recipe-allergens">Allergens: ${recipe["Allergens"]}</p>
                <p class="recipe-meal-time">Meal Time: ${recipe["Meal Time"]}</p>
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
    const recipeOutputElement = document.getElementById("recipe-output");
    const recipesHTML = recipeList.map(recipe => recipeTemplate(recipe)).join("");
    recipeOutputElement.innerHTML = recipesHTML;
}

// Initialize search from URL on page load
window.addEventListener('DOMContentLoaded', handleSearchFromURL);

// Search button event listener
document.querySelector('.search-box').addEventListener('submit', searchHandler);

console.log("Updated URL:", window.location.href);
