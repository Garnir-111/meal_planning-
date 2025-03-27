<?php

$dsn = "mysql:host=localhost;dbname=my_mealplanning";
$dbusername = "mealplanning";
$dbpassword = "";

try {
    $pdo = new PDO($dsn, $dbusername, $dbpassword);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::MYSQL_ATTR_USE_BUFFERED_QUERY => true]);
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}