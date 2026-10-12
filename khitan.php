<?php
/**
 * Dynamic Open Graph & Invitation Handler for Khitan
 * Generates accurate WhatsApp / Social Media link previews from data/khitan.json
 */

if (empty($_GET) && !empty($_SERVER['QUERY_STRING'])) {
    parse_str($_SERVER['QUERY_STRING'], $_GET);
}

$client = isset($_GET['client']) ? preg_replace('/[^a-zA-Z0-9_-]/', '', $_GET['client']) : '';
$dataDir = __DIR__ . '/data';

// Determine config file
$dataFile = $dataDir . '/khitan.json';
if ($client !== '' && file_exists($dataDir . '/khitan_' . $client . '.json')) {
    $dataFile = $dataDir . '/khitan_' . $client . '.json';
}

$config = [];
if (file_exists($dataFile)) {
    $raw = @file_get_contents($dataFile);
    $config = json_decode($raw, true) ?: [];
}

// Default values if empty
$childNick = !empty($config['childNickname']) ? $config['childNickname'] : 'Rendy';
$childFull = !empty($config['childFullname']) ? $config['childFullname'] : 'Irendy Wijaya Saputra';
$photo = !empty($config['photo']) ? $config['photo'] : 'images/khitan/rendy-profile.jpg';
$father = !empty($config['father']) ? $config['father'] : 'Bpk. Wangkis Suwito';
$mother = !empty($config['mother']) ? $config['mother'] : 'Ibu Susi Dwi jayanti';
$eventDate = !empty($config['eventDateDisplay']) ? $config['eventDateDisplay'] : 'Senin, 16 November 2026';

// Absolute URL for photo (Always HTTPS for external crawlers / WhatsApp)
$isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || (isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443)
    || (!empty($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https')
    || (isset($_SERVER['HTTP_HOST']) && strpos($_SERVER['HTTP_HOST'], 'localhost') === false);
$protocol = $isHttps ? 'https://' : 'http://';
$host = !empty($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : 'bikinundangan.biz.id';
$baseUrl = $protocol . $host;

// If photo is relative, make absolute
if (!preg_match('/^https?:\/\//i', $photo)) {
    $cleanPhoto = ltrim($photo, '/');
    $absPhoto = $baseUrl . '/' . $cleanPhoto;
} else {
    $absPhoto = $photo;
}

// Add cache buster timestamp if available
$localPhotoPath = __DIR__ . '/' . ltrim(parse_url($photo, PHP_URL_PATH), '/');
$vQuery = file_exists($localPhotoPath) ? filemtime($localPhotoPath) : '20261012';
if (strpos($absPhoto, 'v=') === false) {
    $absPhoto .= (strpos($absPhoto, '?') !== false ? '&' : '?') . 'v=' . $vQuery;
}

// Guest parameter for personalized message
$guest = isset($_GET['to']) ? trim($_GET['to']) : '';
if ($guest !== '') {
    $guestSafe = htmlspecialchars($guest, ENT_QUOTES, 'UTF-8');
    $ogTitle = "Tasyakuran Walimatul Khitan - {$childNick}";
    $ogDesc = "Kepada Yth. {$guestSafe}. Kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri tasyakuran walimatul khitan ananda {$childFull} ({$eventDate}).";
} else {
    $ogTitle = "Tasyakuran Walimatul Khitan - {$childNick}";
    $ogDesc = "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir serta memberikan doa restu untuk ananda {$childFull}.";
}

$requestUri = $_SERVER['REQUEST_URI'] ?? '/khitan';
$currentUrl = $baseUrl . $requestUri;

// Read base HTML template
$htmlFile = __DIR__ . '/khitan.html';
if (!file_exists($htmlFile)) {
    http_response_code(404);
    echo "Halaman undangan tidak ditemukan.";
    exit;
}

$html = file_get_contents($htmlFile);

// Remove existing title, description, and OG/Twitter tags
$html = preg_replace('/<title>.*?<\/title>\s*/is', '', $html);
$html = preg_replace('/<meta\s+name=["\']description["\'].*?\/?>\s*/is', '', $html);
$html = preg_replace('/<meta\s+property=["\']og:[^"\']+["\'].*?\/?>\s*/is', '', $html);
$html = preg_replace('/<meta\s+name=["\']twitter:[^"\']+["\'].*?\/?>\s*/is', '', $html);

// Build clean, consolidated meta block
$metaBlock = "<title>" . htmlspecialchars($ogTitle, ENT_QUOTES, 'UTF-8') . "</title>\n" .
    '  <meta name="description" content="' . htmlspecialchars($ogDesc, ENT_QUOTES, 'UTF-8') . '">' . "\n" .
    '  <meta property="og:title" content="' . htmlspecialchars($ogTitle, ENT_QUOTES, 'UTF-8') . '">' . "\n" .
    '  <meta property="og:description" content="' . htmlspecialchars($ogDesc, ENT_QUOTES, 'UTF-8') . '">' . "\n" .
    '  <meta property="og:image" content="' . htmlspecialchars($absPhoto, ENT_QUOTES, 'UTF-8') . '">' . "\n" .
    '  <meta property="og:image:secure_url" content="' . htmlspecialchars($absPhoto, ENT_QUOTES, 'UTF-8') . '">' . "\n" .
    '  <meta property="og:image:type" content="image/jpeg">' . "\n" .
    '  <meta property="og:image:width" content="800">' . "\n" .
    '  <meta property="og:image:height" content="800">' . "\n" .
    '  <meta property="og:url" content="' . htmlspecialchars($currentUrl, ENT_QUOTES, 'UTF-8') . '">' . "\n" .
    '  <meta property="og:type" content="website">' . "\n" .
    '  <meta name="twitter:card" content="summary_large_image">' . "\n" .
    '  <meta name="twitter:title" content="' . htmlspecialchars($ogTitle, ENT_QUOTES, 'UTF-8') . '">' . "\n" .
    '  <meta name="twitter:description" content="' . htmlspecialchars($ogDesc, ENT_QUOTES, 'UTF-8') . '">' . "\n" .
    '  <meta name="twitter:image" content="' . htmlspecialchars($absPhoto, ENT_QUOTES, 'UTF-8') . '">';

// Inject right after viewport meta tag
$html = preg_replace('/(<meta\s+name=["\']viewport["\'].*?\/?>)/is', "$1\n  " . $metaBlock, $html, 1);

// Output processed HTML
if (!headers_sent()) {
    header('Content-Type: text/html; charset=UTF-8');
}
echo $html;
