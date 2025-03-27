<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $recipeSearch = $_POST["recipesearch"];

    try {
        require_once "includes/dbh-inc.php";

        $query = "SELECT * FROM test WHERE recipe_name LIKE :recipesearch;";
        $recipeSearch = "%" . $recipeSearch . "%";

        $stmt = $pdo->prepare($query);

        $stmt->bindParam(":recipesearch", $recipeSearch);
        
        $stmt->execute();

        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $pdo = null;
        $stmt = null;
    } catch (PDOException $e) {
        die("Query failed: " . $e->getMessage());
    }
}
else {
    header("Location: ../index.php");
    exit();
}
?>

<!DOCTYPE html>
<html>
<head>
<title>Recipe Form</title>
</head>
<body>

    <h1>Search Results</h1>

    <?php
    if (count($results) > 0) {
        foreach ($results as $result) {
            echo "<h2>" . $result["recipe_name"] . "</h2>";
            echo "<p>Author: " . $result["author"] . "</p>";
            echo "<p>Ingredients: " . $result["ingredients"] . "</p>";
            echo "<p>Allergens: " . $result["allergens"] . "</p>";
        }
    } else {
        echo "<p>No results found.</p>";
    }
    ?>

</body>
</html>