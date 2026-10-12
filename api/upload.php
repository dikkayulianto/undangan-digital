<?php
/**
 * API Upload - Mengunggah Gambar Langsung ke Server Hosting
 * Mendukung Base64 Data URL atau FormData File Upload
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

// Target folder: images/uploads/
$uploadDir = __DIR__ . '/../images/uploads';
if (!is_dir($uploadDir)) {
    @mkdir($uploadDir, 0755, true);
}

$rawInput = file_get_contents('php://input');
$jsonData = json_decode($rawInput, true);

// 1. Cek jika upload via Base64 JSON: { "image": "data:image/jpeg;base64,...", "filename": "nama.jpg" }
if ($jsonData && isset($jsonData['image'])) {
    $imgData = $jsonData['image'];
    $filename = isset($jsonData['filename']) ? preg_replace('/[^a-zA-Z0-9_.-]/', '', $jsonData['filename']) : ('img_' . time() . '.jpg');

    if (preg_match('/^data:image\/(\w+);base64,/', $imgData, $type)) {
        $imgData = substr($imgData, strpos($imgData, ',') + 1);
        $type = strtolower($type[1]); // jpg, png, gif, webp
        if (!in_array($type, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Format file tidak didukung']);
            exit;
        }
        $imgData = base64_decode($imgData);
        if ($imgData === false) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Dekode base64 gagal']);
            exit;
        }

        $safeName = 'upload_' . time() . '_' . rand(100, 999) . '.' . ($type === 'jpeg' ? 'jpg' : $type);
        $targetPath = $uploadDir . '/' . $safeName;
        
        if (file_put_contents($targetPath, $imgData)) {
            $relativeUrl = 'images/uploads/' . $safeName;
            echo json_encode([
                'success' => true,
                'url' => $relativeUrl,
                'filename' => $safeName
            ]);
            exit;
        }
    }
}

// 2. Cek jika upload via multipart/form-data: <input type="file" name="file">
if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
    $fileTmp = $_FILES['file']['tmp_name'];
    $fileInfo = getimagesize($fileTmp);
    if (!$fileInfo) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'File bukan gambar yang valid']);
        exit;
    }

    $ext = strtolower(pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
        $ext = 'jpg';
    }

    $safeName = 'upload_' . time() . '_' . rand(100, 999) . '.' . $ext;
    $targetPath = $uploadDir . '/' . $safeName;

    if (move_uploaded_file($fileTmp, $targetPath)) {
        $relativeUrl = 'images/uploads/' . $safeName;
        echo json_encode([
            'success' => true,
            'url' => $relativeUrl,
            'filename' => $safeName
        ]);
        exit;
    }
}

http_response_code(400);
echo json_encode(['success' => false, 'error' => 'Tidak ada file gambar yang berhasil diunggah']);
