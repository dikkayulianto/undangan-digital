<?php
/**
 * API Save Config - Menyimpan Pengaturan Undangan ke Server (PHP)
 * Digunakan oleh Builder dan Live Editor
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Metode request harus POST']);
    exit;
}

// Baca raw POST input
$input = file_get_contents('php://input');
if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Data input kosong']);
    exit;
}

$data = json_decode($input, true);
if (!$data || !is_array($data)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Format JSON tidak valid']);
    exit;
}

// Dapatkan payload config
$config = isset($data['config']) ? $data['config'] : $data;
$client = isset($data['client']) ? preg_replace('/[^a-zA-Z0-9_-]/', '', $data['client']) : '';
$type = isset($data['type']) ? preg_replace('/[^a-zA-Z0-9_-]/', '', $data['type']) : 'khitan';

// Pastikan folder data/ ada
$dataDir = __DIR__ . '/../data';
if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0755, true);
}

// File target utama: data/khitan.json (atau data/wedding.json)
$mainFile = $dataDir . '/' . ($type === 'wedding' ? 'wedding.json' : 'khitan.json');

// File target per klien jika ada
$clientFile = ($client !== '') ? ($dataDir . '/' . $type . '_' . $client . '.json') : null;

// Validasi minimal field khitan
if ($type === 'khitan') {
    if (empty($config['childNickname'])) $config['childNickname'] = 'Rendy';
    if (empty($config['childFullname'])) $config['childFullname'] = 'Irendy Wijaya Saputra';
    if (empty($config['father'])) $config['father'] = 'Bpk. Wangkis Suwito';
    if (empty($config['mother'])) $config['mother'] = 'Ibu Susi Dwi jayanti';
    if (empty($config['eventDateDisplay'])) $config['eventDateDisplay'] = 'Senin, 16 November 2026';
    if (empty($config['eventTime'])) $config['eventTime'] = 'Pukul 10.00 WIB';
    if (empty($config['eventPlace'])) $config['eventPlace'] = 'Rumah Hajat';
    if (empty($config['eventAddress'])) $config['eventAddress'] = 'Jl. Mangga No. 12 RT 03 RW 01 Balapulang Kulon';
    if (empty($config['mapsUrl'])) $config['mapsUrl'] = 'https://maps.app.goo.gl/FNjBDJMcNzKmvb6B7';
    if (empty($config['bank1Name'])) $config['bank1Name'] = 'BRI';
    if (empty($config['bank1Number'])) $config['bank1Number'] = '6062 0104 0268 531';
    if (empty($config['bank1Holder'])) $config['bank1Holder'] = 'Wangkis Suwito';
    if (empty($config['bank2Name'])) $config['bank2Name'] = 'Dana';
    if (empty($config['bank2Number'])) $config['bank2Number'] = '082134966499';
    if (empty($config['bank2Holder'])) $config['bank2Holder'] = 'Susi Dwi Jayanti (Ibu)';
    if (empty($config['audioUrl'])) $config['audioUrl'] = 'audio/qalbi.mp3';
    if (empty($config['theme'])) $config['theme'] = 'cream';
    if (!isset($config['gallery']) || !is_array($config['gallery']) || count($config['gallery']) === 0) {
        $config['gallery'] = [
            'images/khitan/rendy-galeri-1.jpg?v=20261009c',
            'images/khitan/rendy-galeri-2.jpg?v=20261009c',
            'images/khitan/rendy-galeri-3.jpg?v=20261009c'
        ];
    }
}

$jsonOutput = json_encode($config, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

// Simpan ke file klien jika ada
if ($clientFile) {
    @file_put_contents($clientFile, $jsonOutput);
}

// Simpan ke file utama data/khitan.json agar langsung aktif online
$saved = @file_put_contents($mainFile, $jsonOutput);

if ($saved === false) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Gagal menulis file data di server. Periksa izin akses (permission) folder data/.'
    ]);
    exit;
}

echo json_encode([
    'success' => true,
    'message' => 'Pengaturan berhasil disimpan dan langsung online di server!',
    'type' => $type,
    'client' => $client,
    'timestamp' => time(),
    'savedPath' => basename($mainFile)
]);
