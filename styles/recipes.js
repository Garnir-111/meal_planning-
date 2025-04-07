// DOM references
document.addEventListener("DOMContentLoaded", () => {

    const recipeOutput = document.querySelector(".recipe-output");
    const searchInput = document.querySelector("input[type='text']");
    const searchForm = document.querySelector(".search-box");
  
    // Fetch data and render
    fetch("recipes.json")
      .then((res) => res.json())
      .then((data) => {
        let recipes = data.recipes;
        const urlParams = new URLSearchParams(window.location.search);
        console.log("Recipes loaded:", recipes);
  
        // Get filter values from URL
        const includes = urlParams.getAll("include");
        const excludes = urlParams.getAll("exclude");
        const allergens = urlParams.getAll("allergen");
        const mealTime = urlParams.get("mealTime");
        const minPrice = parseFloat(urlParams.get("min")) || 0;
        const maxPrice = parseFloat(urlParams.get("max")) || Infinity;
  
        // Filter logic
        function filterRecipes() {
            let filtered = recipes.filter((recipe) => {
                console.log("Filtering recipe:", recipe);
        
                const includesOk = includes.every(ingredient =>
                    recipe.Ingredients?.toLowerCase().includes(ingredient.toLowerCase())
                );
        
                const excludesOk = excludes.every(ingredient =>
                    !recipe.Ingredients?.toLowerCase().includes(ingredient.toLowerCase())
                );
        
                const allergensOk = allergens.every(allergen =>
                    !recipe.Allergens?.toLowerCase().includes(allergen.toLowerCase())
                );
        
                const mealTimeOk = !mealTime || recipe["Meal Time"]?.toLowerCase().includes(mealTime.toLowerCase());
        
                const price = parseFloat(recipe.price);
                const priceOk = price >= minPrice && price <= maxPrice;
        
                // Handle possible undefined title and ingredients
                const titleMatch = recipe.title?.trim().toLowerCase().includes(query); // Optional chaining to handle undefined
                const ingredientsMatch = recipe.Ingredients?.trim().toLowerCase().includes(query); // Optional chaining to handle undefined
        
                return (titleMatch || ingredientsMatch) && includesOk && excludesOk && mealTimeOk && allergensOk && priceOk;
            });
        
            // Sorting logic
            const sortOrder = urlParams.get("sort");
            if (sortOrder === "asc") {
                filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            } else if (sortOrder === "desc") {
                filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
            }
        
            console.log("Filtered + Sorted:", filtered.map(r => r.title + " ($" + r.price + ")"));
            return filtered;
        }
       
          
  
        // Search form logic
        searchForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const query = searchInput.value.trim().toLowerCase();
          console.log("Search Query:", query);  // Log the query
  
          const filtered = filterRecipes().filter(recipe => {
            const titleMatch = recipe.title.toLowerCase().includes(query);
            const ingredientsMatch = recipe.Ingredients.toLowerCase().includes(query);
  
            // Log each comparison to debug
            console.log(`Checking title: "${recipe.title}" | ${titleMatch}`);
            console.log(`Checking ingredients: "${recipe.Ingredients}" | ${ingredientsMatch}`);
  
            return titleMatch || ingredientsMatch;
          });
  
          renderRecipes(filtered);  // Render the filtered results
        });
  
        // Render logic
        function renderRecipes(filteredRecipes) {
          recipeOutput.innerHTML = "";
  
          if (filteredRecipes.length === 0) {
            recipeOutput.innerHTML = "<p>No matching recipes found.</p>";
            return;
          }
  
          filteredRecipes.forEach((recipe) => {
            const card = document.createElement("div");
            card.classList.add("recipe-card");
            card.innerHTML = `
              <h3>${recipe.title}</h3>
              <p><strong>Price:</strong> $${recipe.price}</p>
              <p><strong>Ingredients:</strong> ${recipe.Ingredients}</p>
              <p><strong>Allergens:</strong> ${recipe.Allergens}</p>
              <p><strong>Meal Time:</strong> ${recipe["Meal Time"]}</p>
            `;
            recipeOutput.appendChild(card);
          });
        }
  
        // Initial render (default or filtered)
        const initialFiltered = filterRecipes();
        renderRecipes(initialFiltered);
      })
      .catch((error) => {
        console.error("Error loading recipes:", error);
        recipeOutput.innerHTML = "<p>Failed to load recipes. Please try again later.</p>";
      });
  });
  