<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $searchBar = $_POST["searchbar"];
    $Lactose = $_POST["Lactose"];
    $Eggs = $_POST["Eggs"];
    $Fish = $_POST["Fish"];
    $Shellfish = $_POST["Shellfish"];
    $TreeNuts = $_POST["Tree Nuts"];
    $Peanuts = $_POST["Peanuts"];
    $Wheat = $_POST["Wheat"];
    $SoyBeans = $_POST["SoyBeans"];
    $Sesame = $_POST["Sesame"];
    $allergens = [$Lactose, $Eggs, $Fish, $Shellfish, $TreeNuts, $Peanuts, $Wheat, $SoyBeans, $Sesame];

    $mealType = $_POST["meal"];
    $price = $_POST["price"];

    try {
        require_once "includes/dbh-inc.php";

        // Handle empty allergen values
        $Lactose = empty($Lactose) ? "empty" : $Lactose;
        $Eggs = empty($Eggs) ? "empty" : $Eggs;
        $Fish = empty($Fish) ? "empty" : $Fish;
        $Shellfish = empty($Shellfish) ? "empty" : $Shellfish;
        $TreeNuts = empty($TreeNuts) ? "empty" : $TreeNuts;
        $Peanuts = empty($Peanuts) ? "empty" : $Peanuts;
        $Wheat = empty($Wheat) ? "empty" : $Wheat;
        $SoyBeans = empty($SoyBeans) ? "empty" : $SoyBeans;
        $Sesame = empty($Sesame) ? "empty" : $Sesame;

        echo "<p>Meal Time: " . $Lactose . "," . $Eggs . "," . $Fish . "," . $Shellfish . "," . $TreeNuts . "," . $Peanuts . "," . $Wheat . "," . $SoyBeans . "," . $Sesame . "</p>";

        // Construct named placeholders for the IN clause
        $placeholders = [];
        foreach (array_keys($allergens) as $index) {
            $placeholders[] = ":allergen" . $index;
        }
        $inClause = implode(",", $placeholders);

        $query = "SELECT r.title,
                        r.instructions,
                        r.servings,
                        r.price,
                        GROUP_CONCAT(DISTINCT ir.ingredient SEPARATOR ', ') AS Ingredients,
                        GROUP_CONCAT(DISTINCT ar.allergen SEPARATOR ', ') AS Allergens,
                        GROUP_CONCAT(DISTINCT mt.meal_type SEPARATOR ', ') AS 'Meal Time'
                    FROM recipe AS r
                    JOIN ingredients_in_recipe AS ir ON ir.title = r.title
                    JOIN allergens_in_recipe AS ar ON ar.title = r.title
                    JOIN meal_time AS mt ON mt.title = r.title
                    WHERE r.price <= :price AND r.title NOT IN (SELECT ar2.title
                                                                FROM allergens_in_recipe AS ar2
                                                                WHERE ar2.allergen IN (" . $inClause . "))
                    GROUP BY r.title
                    HAVING `Meal Time` LIKE :mealType AND (r.title LIKE :searchBar OR Ingredients LIKE :searchBar);";

        $mealType = "%" . $mealType . "%";
        $searchBar = "%" . $searchBar . "%";

        $stmt = $pdo->prepare($query);

        $stmt->bindParam(":searchBar", $searchBar);
        $stmt->bindParam(":mealType", $mealType);
        $stmt->bindParam(":price", $price);

        // Bind allergen values using named placeholders
        foreach ($allergens as $index => $allergen) {
            $stmt->bindValue(":allergen" . $index, $allergen);
        }

        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $pdo = null;
        $stmt = null;
    } catch (PDOException $e) {
        die("Query failed: " . $e->getMessage());
    }
} else {
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
            echo "<h2>" . $result["title"] . "</h2>";
            echo "<p>Instructions: " . $result["instructions"] . "</p>";
            echo "<p>Servings: " . $result["servings"] . "</p>";
            echo "<p>Price: " . $result["price"] . "</p>";
            echo "<p>Ingredients: " . $result["Ingredients"] . "</p>";
            echo "<p>Allergens: " . $result["Allergens"] . "</p>";
            echo "<p>Meal Time: " . $result["Meal Time"] . "</p>";
        }
    } else {
        echo "<p>No results found.</p>";
    }
    ?>
</body>
</html>