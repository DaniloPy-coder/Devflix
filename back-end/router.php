<?php

header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-XSRF-TOKEN, bypass-tunnel-reminder");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

if (file_exists(__DIR__ . '/public' . $_SERVER['REQUEST_URI'])) {
    return false;
}

require_once __DIR__ . '/public/index.php';