<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $recipeName = $_POST["recipeName"];
    $author = $_POST["author"];
    $ingredients = $_POST["ingredients"];
    $allergens = $_POST["allergens"];

    try {
        require_once "dbh-inc.php";
        // This line includes the database connection file, which contains the $pdo variable that we need to interact with the database.

        $query = "INSERT INTO test (recipe_name, author, ingredients, allergens) VALUES (:recipeName, :author, :ingredients, :allergens);";

        $stmt = $pdo->prepare($query);

        $stmt->bindParam(":recipeName", $recipeName);
        $stmt->bindParam(":author", $author);
        $stmt->bindParam(":ingredients", $ingredients);
        $stmt->bindParam(":allergens", $allergens);

        $stmt->execute();

        

        $pdo = null;
        $stmt = null;
        // This code prepares and executes an SQL query to insert the form data into the database. The query uses placeholders to prevent SQL injection attacks. After executing the query, the $pdo and $stmt variables are set to null to close the database connection and free up memory.

        header("Location: ../index.php");
    } catch (PDOException $e) {
        die("Query failed: " . $e->getMessage());
    }
}
else {
    header("Location: ../index.php");
    exit();
}