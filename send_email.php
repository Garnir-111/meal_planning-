<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST["user_name"]);
    $email = filter_var($_POST["user_email"], FILTER_VALIDATE_EMAIL);
    $message = htmlspecialchars($_POST["user_message"]);

    if (!$email) {
        echo "invalid_email";
        exit;
    }

    $to = "terranrenderer@gmail.com";
    $subject = "Message from $name";
    $headers = "From: $email\r\n" .
               "Reply-To: $email\r\n" .
               "Content-Type: text/plain; charset=UTF-8";

    $body = "Name: $name\nEmail: $email\n\nMessage:\n$message";

    if (mail($to, $subject, $body, $headers)) {
        echo "success";
    } else {
        echo "error";
    }
}
?>
