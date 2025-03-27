<?php
session_start(); // Start the session at the beginning of the script

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $title = $_POST["title"];
    $instructions = $_POST["instructions"];
    $servings = $_POST["servings"];
    $price = $_POST["price"];
    $ingredients = explode(',', $_POST["ingredients"]);
    $ingredients = array_map('trim', $ingredients);
    $allergens = explode(',', $_POST["allergens"]);
    $allergens = array_map('trim', $allergens);
    $mealType = $_POST["meal_type"];

    try {
        require_once "dbh-inc.php";

        $pdo->beginTransaction(); // Start transaction

        $queryCheck = "SELECT COUNT(*) FROM recipe WHERE title = :title";
        $stmtCheck = $pdo->prepare($queryCheck);
        $stmtCheck->bindParam(":title", $title);
        $stmtCheck->execute();
        $titleExists = $stmtCheck->fetchColumn();

        if ($titleExists == 0) {
            $query = "INSERT INTO recipe (title, instructions, servings, price) VALUES (:title, :instructions, :servings, :price); INSERT INTO meal_time (title, meal_type) VALUES (:title, :mealType);";

            $stmt = $pdo->prepare($query);
            $stmt->bindParam(":title", $title);
            $stmt->bindParam(":instructions", $instructions);
            $stmt->bindParam(":servings", $servings);
            $stmt->bindParam(":price", $price);
            $stmt->bindParam(":mealType", $mealType);
            $stmt->execute();

            // Prepare ingredient and allergen insert queries outside the loops
            $ingredientInsertQuery = "INSERT INTO ingredients (ingredient) VALUES (:ingredient)";
            $ingredientInsertStmt = $pdo->prepare($ingredientInsertQuery);

            $ingredientRecipeQuery = "INSERT INTO ingredients_in_recipe (title, ingredient) VALUES (:title, :ingredient)";
            $ingredientRecipeStmt = $pdo->prepare($ingredientRecipeQuery);

            $allergenRecipeQuery = "INSERT INTO allergens_in_recipe (title, allergen) VALUES (:title, :allergen)";
            $allergenRecipeStmt = $pdo->prepare($allergenRecipeQuery);

            foreach ($ingredients as $ingredient) {
                // Check if ingredient exists
                $ingredientCheckQuery = "SELECT COUNT(*) FROM ingredients WHERE ingredient = :ingredient";
                $ingredientCheckStmt = $pdo->prepare($ingredientCheckQuery);
                $ingredientCheckStmt->bindParam(":ingredient", $ingredient);
                $ingredientCheckStmt->execute();
                $ingredientExists = $ingredientCheckStmt->fetchColumn();

                if ($ingredientExists == 0) {
                    // Insert new ingredient
                    $ingredientInsertStmt->bindParam(":ingredient", $ingredient);
                    $ingredientInsertStmt->execute();
                }

                // Insert ingredient into recipe
                $ingredientRecipeStmt->bindParam(":title", $title);
                $ingredientRecipeStmt->bindParam(":ingredient", $ingredient);
                $ingredientRecipeStmt->execute();
            }

            foreach ($allergens as $allergen) {
                // Insert allergen into recipe
                $allergenRecipeStmt->bindParam(":title", $title);
                $allergenRecipeStmt->bindParam(":allergen", $allergen);
                $allergenRecipeStmt->execute();
            }

            $pdo->commit(); // Commit the transaction
            $_SESSION['success_message'] = "Recipe added successfully!"; // Set success message

        }
        else {
            $_SESSION['error_message'] = "Recipe with this title already exists."; // Set error message
        }

        header("Location: ../index.php"); // Return to index.php after successful execution
        exit(); // Important: Stop further script execution after header redirect
    } catch (PDOException $e) {
        $pdo->rollBack(); // Roll back the transaction on error
        $_SESSION['error_message'] = "Error adding recipe: " . $e->getMessage(); // Set error message
        die("Connection failed: " . $e->getMessage());
    }
} else {
    header("Location: ../index.php");
    exit();
}
?>