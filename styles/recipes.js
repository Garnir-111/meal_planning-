document.addEventListener("DOMContentLoaded", () => {
  const recipeOutput = document.querySelector(".recipe-output");
  const searchInput = document.querySelector("input[type='text']");
  const searchForm = document.querySelector(".search-box");

  let query = ""; // Global search query

  fetch("styles/recipes.json")
    .then((res) => res.json())
    .then((data) => {
      let recipes = data.recipes; // make sure recipes.json has a "recipes" array

      const urlParams = new URLSearchParams(window.location.search);
      const includesRaw = urlParams.get("include");
      const includes = includesRaw ? includesRaw.split(",").filter(val => val.trim() !== "") : [];

      // Similarly for excludes:
      const excludesRaw = urlParams.get("exclude");
      const excludes = excludesRaw ? excludesRaw.split(",").filter(val => val.trim() !== "") : [];

      const allergens = urlParams.getAll("allergen");
      const mealTime = urlParams.get("mealTime");
      const minPrice = parseFloat(urlParams.get("min")) || 0;
      const maxPrice = parseFloat(urlParams.get("max")) || 100;
      const sortOrder = urlParams.get("sort");

      function filterRecipes() {
        return recipes
          .filter((recipe) => {
            const includesOk = includes.every((ingredient) => {
              const searchTerm = ingredient.toLowerCase();
              return (
                recipe.title?.toLowerCase().includes(searchTerm) ||
                recipe.ingredients?.toLowerCase().includes(searchTerm)
              );
            });

            // Fixed excludes: use a single every call and the correct string method:
            const excludesOk = excludes.every((ingredient) => {
              const searchTerm = ingredient.toLowerCase();
              return (
                !recipe.title?.toLowerCase().includes(searchTerm) &&
                !recipe.ingredients?.toLowerCase().includes(searchTerm)
              );
            });

            const allergensOk = allergens.every((allergen) =>
              !recipe.allergens?.toLowerCase().includes(allergen.toLowerCase())
            );

            const mealTimeOk =
              !mealTime ||
              recipe.mealTime?.toLowerCase().includes(mealTime.toLowerCase());

            const price = parseFloat(recipe.price);
            const priceOk = price >= minPrice && price <= maxPrice;

            const titleMatch = recipe.title?.toLowerCase().includes(query);
            const ingredientsMatch = recipe.ingredients?.toLowerCase().includes(query);

            return (
              (titleMatch || ingredientsMatch) &&
              includesOk &&
              excludesOk &&
              allergensOk &&
              mealTimeOk &&
              priceOk
            );
          })
          .sort((a, b) => {
            if (sortOrder === "asc") {
              return parseFloat(a.price) - parseFloat(b.price);
            } else if (sortOrder === "desc") {
              return parseFloat(b.price) - parseFloat(a.price);
            }
            return 0; // no sorting
          });
      }

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
            <p><strong>Instructions:</strong> ${recipe.instructions}</p>
            <p><strong>Serving:</strong> ${recipe.servings}</p>
            <p><strong>Price:</strong> ${recipe.price}</p>
            <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
            <p><strong>Allergens:</strong> ${recipe.allergens}</p>
            <p><strong>Meal Time:</strong> ${recipe.mealTime}</p>
          `;
          recipeOutput.appendChild(card);
        });
      }

      searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        console.log("Search form submitted");
        query = searchInput.value.trim().toLowerCase();
        console.log("Query:", query);
        const filtered = filterRecipes();
        console.log("Filtered recipes:", filtered);
        renderRecipes(filtered);
      });

      // Initial render
      renderRecipes(filterRecipes());
    })
    .catch((error) => {
      console.error("Error loading recipes:", error);
      if (recipeOutput) {
        recipeOutput.innerHTML =
          "<p>Failed to load recipes. Please try again later.</p>";
      }
    });
});
