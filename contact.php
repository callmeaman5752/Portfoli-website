<?php
// Simple contact endpoint for PHP-enabled hosting.
// IMPORTANT: PHP mail() depends on the hosting provider's mail configuration.

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

// Honeypot spam protection.
if (!empty($_POST['website'] ?? '')) {
    echo json_encode(['success' => true, 'message' => 'Thank you.']);
    exit;
}

function clean_text($value, $maxLength) {
    $value = trim((string)$value);
    $value = strip_tags($value);
    $value = preg_replace('/[\r\n]+/', ' ', $value);
    return substr($value, 0, $maxLength);
}

$name = clean_text($_POST['name'] ?? '', 80);
$email = filter_var(trim((string)($_POST['email'] ?? '')), FILTER_VALIDATE_EMAIL);
$phone = clean_text($_POST['phone'] ?? '', 30);
$subject = clean_text($_POST['subject'] ?? '', 120);
$message = trim(strip_tags((string)($_POST['message'] ?? '')));
$message = substr($message, 0, 3000);

if (strlen($name) < 2 || !$email || strlen($subject) < 2 || strlen($message) < 10) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Please provide valid information in all required fields.']);
    exit;
}

$to = 'aman.sharma6231@gmail.com';
$mailSubject = 'Portfolio Contact: ' . $subject;
$body = "New message from amansharma.com.np\n\n"
      . "Name: {$name}\n"
      . "Email: {$email}\n"
      . "Phone: {$phone}\n\n"
      . "Message:\n{$message}\n";

$headers = [
    'From: Website Contact <no-reply@amansharma.com.np>',
    'Reply-To: ' . $email,
    'Content-Type: text/plain; charset=UTF-8'
];

$sent = @mail($to, $mailSubject, $body, implode("\r\n", $headers));

if (!$sent) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'The server could not send the email.']);
    exit;
}

echo json_encode(['success' => true, 'message' => 'Thank you. Your message has been sent successfully.']);
