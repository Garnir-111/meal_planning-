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
            <img src="${recipe.image}" alt="Image of ${recipe.name} recipe" class="recipe-img" />
            <div class="recipe">
                <h2 class="recipe-title">${recipe.name}</h2>
                <p class="recipe-paragraph">Ingredients: ${recipe.ingredients.join(', ')}</p>
                <p class="recipe-time">Time: ${recipe.time}</p>
                <p class="recipe-category">Category: ${recipe.category}</p>
                <p class="recipe-description">${recipe.description}</p>
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
