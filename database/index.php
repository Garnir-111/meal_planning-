<!DOCTYPE html>
<html>
<head>
<title>Recipe Form</title>
</head>
<body>

<h1>Add a Recipe</h1>

<form action="includes/formhandler-inc.php" method="post" id="recipeForm">
  <label for="recipeName">Recipe Name:</label><br>
  <input type="text" id="recipeName" name="recipeName" required><br><br>

  <label for="author">Author:</label><br>
  <input type="text" id="author" name="author" required><br><br>

  <label for="ingredients">Ingredients (separate by commas):</label><br>
  <textarea id="ingredients" name="ingredients" rows="4" cols="50" required></textarea><br><br>

  <label for="allergens">Allergens (separate by commas):</label><br>
  <textarea id="allergens" name="allergens" rows="4" cols="50"></textarea><br><br>

  <input type="submit" value="Submit Recipe">
</form>

<h1>Search Recipes</h1>

<form action="search.php" method="post" id="searchForm">
    <label for="search">Search:</label><br>
    <input type="text" id="search" name="recipesearch" placeholder="Search..."><br><br>

    <input type="submit" value="Search">
</form>

</body>
</html>