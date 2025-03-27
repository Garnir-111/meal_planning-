<!DOCTYPE html>
<html>
<head>
<title>Recipe Form</title>
    <style>
      body {
            font-family: Arial, sans-serif;
            background-color: #f8f8f8;
            margin: 20px;
            padding: 0;
        }

        form {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            max-width: 600px;
            margin: auto;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        }

        fieldset {
            border: none;
            padding: 15px;
            margin-bottom: 15px;
            background: #f5f5f5;
            border-radius: 8px;
        }

        legend {
            font-weight: bold;
            font-size: 1.2em;
            padding: 5px 10px;
        }

        label {
            display: block;
            margin: 10px 0 5px;
            font-weight: bold;
        }

        input, textarea, select {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 1em;
        }

        input[type="submit"] {
            background: #007bff;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 1.1em;
            padding: 12px;
            margin-top: 10px;
            border-radius: 5px;
            transition: 0.3s;
        }

        input[type="submit"]:hover {
            background: #0056b3;
        }
        .input-with-icon {
            display: flex;
            align-items: center;
        }

        .input-icon {
            margin-right: 5px; 
        }

        input[type="number"] {
            padding-left: 5px; 
        }
    </style>
</head>
<body>

<h1>Add a Recipe</h1>

<form action="includes/formhandler-inc.php" method="post" id="recipeForm">
        <fieldset>
            <legend>Recipe Details</legend>
    
            <label for="title">Title:</label>
            <input type="text" id="title" name="title" placeholder="E.g Chocolate Chip Cookies" required>

            <label>Meal Type</label>
            <input type="text" id="meal_type" name="meal_type" placeholder="E.g Breakfast, Lunch, or Dinner" required>
    
            <label for="instructions">Instructions:</label>
            <textarea id="instructions" name="instructions" rows="5" placeholder="E.g Preheat oven to 350°F. Mix ingredients. Bake for 12 minutes."></textarea>
    
            <label for="servings">Servings:</label>
            <input type="number" id="servings" name="servings" min="1" placeholder="Input number of servings" required>
            <label for="price">Price</label>
            <div class="input-with-icon">
                <span class="input-icon">$</span>
                <input type="number" id="price" name="price" placeholder="Input price of ingredients" required>
            </div>
        </fieldset> 
    
        <fieldset>
            <legend>Ingredients</legend>
            <label for="ingredients">Ingredients (separate by commas):</label>
            <textarea id="ingredients" name="ingredients" rows="4" placeholder="E.g Flour, Sugar, Eggs, Butter, Chocolate Chips"></textarea>
        </fieldset>
    
        <fieldset>
            <legend>Allergens</legend>
            <label>Select Allergens:</label>
            <select id="allergens-select" onchange="addAllergen()">
                <option value="" disabled selected>Select an allergen</option>
                <option value="Lactose">Lactose</option>
                <option value="Eggs">Eggs</option>
                <option value="Fish">Fish</option>
                <option value="Crustacean shellfish">Crustacean Shellfish</option>
                <option value="Tree nuts">Tree Nuts</option>
                <option value="Peanuts">Peanuts</option>
                <option value="Wheat">Wheat</option>
                <option value="Soybeans">Soybeans</option>
                <option value="Sesame">Sesame</option>
            </select>
            <div id="allergens-container"></div>
            <input type="hidden" name="allergens" id="allergens">
        </fieldset>
    
        <input type="submit" value="Submit Recipe">
    </form>
    

<script>
    function addAllergen() {
        let select = document.getElementById("allergens-select");
        let selectedValue = select.value;
        let container = document.getElementById("allergens-container");

        if (selectedValue) {
            let existingAllergens = container.querySelectorAll("span");
            for (let allergen of existingAllergens) {
                if (allergen.textContent.replace(" ❌", "") === selectedValue) {
                    return; // Prevent duplicates
                }
            }

            let span = document.createElement("span");
            span.textContent = selectedValue + " ";
            let button = document.createElement("button");
            button.textContent = "❌";
            button.style.border = "none";
            button.style.background = "transparent";
            button.style.cursor = "pointer";
            button.onclick = function () {
                container.removeChild(span);
                updateAllergens();
            };
            span.appendChild(button);
            container.appendChild(span);
            updateAllergens();
        }
        select.value = "";
    }

    function updateAllergens() {
        let container = document.getElementById("allergens-container");
        let allergens = [];
        container.querySelectorAll("span").forEach(span => {
            allergens.push(span.textContent.replace(" ❌", "").trim());
        });
        document.getElementById("allergens").value = allergens.join(",");
    }
</script>

<h1>Search Recipes</h1>

<!-- <form action="search.php" method="post" id="searchForm">
    <label for="search">Search:</label><br>
    <input type="text" id="search" name="recipesearch" placeholder="Search..."><br><br>

    <input type="submit" value="Search">
</form> -->

<form action="search.php" method="post" id="searchForm" class="container">
    <a href="#" class="back-button">⬅️ Back</a>
    <h2>Filters</h2>

    <h1>Price Range</h1>
    <div class="range">
        <input type="range" min="1" max="3" step="1">
    </div>

    <div class="range-labels">
        <span>$0-5</span>
        <span>$5-10</span>
        <span>$10-15</span>
    </div>

    <h1 id="header">Meal or Time of Day</h1>
    
    <div>
        <input type="radio" id="include1" name="meal" value="breakfast"><label for="include1"> Breakfast</label><br>
        <input type="radio" id="includ2" name="meal" value="lunch"><label for="include2"> Lunch</label><br>
        <input type="radio" id="include3" name="meal" value="dinner"><label for="include3"> Dinner</label><br>
    </div>

    <!-- <h1 id="header">Ingredients to Include</h1>
    <div>
        <input type="checkbox" id="include1"><label for="include1"> Ingredient 1</label><br>
        <input type="checkbox" id="include2"><label for="include2"> Ingredient 2</label><br>
        <input type="checkbox" id="include3"><label for="include3"> Ingredient 3</label><br>
    </div> -->

    <div class="allergens-container">
        <label class="allergen">
            <input type="checkbox" name="allergen" value="milk"> Milk
        </label>
        <label class="allergen">
            <input type="checkbox" name="allergen" value="eggs"> Eggs
        </label>
        <label class="allergen">
            <input type="checkbox" name="allergen" value="fish"> Fish
        </label>
        <label class="allergen">
            <input type="checkbox" name="allergen" value="shellfish"> Crustacean Shellfish
        </label>
        <label class="allergen">
            <input type="checkbox" name="allergen" value="tree_nuts"> Tree Nuts
        </label>
        <label class="allergen">
            <input type="checkbox" name="allergen" value="peanuts"> Peanuts
        </label>
        <label class="allergen">
            <input type="checkbox" name="allergen" value="wheat"> Wheat
        </label>
        <label class="allergen">
            <input type="checkbox" name="allergen" value="soybeans"> Soybeans
        </label>
        <label class="allergen">
            <input type="checkbox" name="allergen" value="sesame"> Sesame
        </label>
    </div>
    
    <input type="text" id="search-bar" placeholder="Search for ingredients..." oninput="searchRecipes()">
    <ul id="results"></ul>       

    <button class="apply-button">APPLY</button>
  </form>

</body>
</html>