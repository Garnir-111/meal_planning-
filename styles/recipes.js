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
    const includeQuery = urlParams.get('include'); // Get included ingredients
    const excludeQuery = urlParams.get('exclude'); // Get excluded ingredients

    let filteredRecipes = recipes; // Start with all recipes

    if (includeQuery) {
        filteredRecipes = filterRecipes(filteredRecipes, includeQuery, true);
    }
    
    if (excludeQuery) {
        filteredRecipes = filterRecipes(filteredRecipes, excludeQuery, false);
    }

    renderRecipes(filteredRecipes);
}


function recipeTemplate(recipe) {
    return `<main>
        <div class="recipe-container">
        
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
    const terms = query.split(" ").filter(Boolean); // Split by space & remove empty entries
    const includeTerms = terms.filter(term => !term.startsWith("-"));
    const excludeTerms = terms.filter(term => term.startsWith("-")).map(term => term.substring(1)); // Remove '-' from exclude terms

    return recipes.filter(recipe => {
        const recipeText = `${recipe.name} ${recipe.ingredients.join(' ')} ${recipe.category}`.toLowerCase();

        // Must include at least one of the included terms
        const includes = includeTerms.length === 0 || includeTerms.some(term => recipeText.includes(term));
        
        // Must NOT include any of the excluded terms
        const excludes = excludeTerms.some(term => recipeText.includes(term));

        return includes && !excludes;
    });
}

function filterRecipes(recipeList, query, isInclude) {
    const keywords = query.toLowerCase().split(',').map(k => k.trim());

    return recipeList.filter(recipe => {
        const ingredients = recipe["Ingredients"].toLowerCase();

        if (isInclude) {
            return keywords.every(keyword => ingredients.includes(keyword)); // Must include all
        } else {
            return keywords.every(keyword => !ingredients.includes(keyword)); // Must exclude all
        }
    });
}


// Initialize search from URL on page load
window.addEventListener('DOMContentLoaded', handleSearchFromURL);

// Search button event listener
document.querySelector('.search-box').addEventListener('submit', searchHandler);

console.log("Updated URL:", window.location.href);
