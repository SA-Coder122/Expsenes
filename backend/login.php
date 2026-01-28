<?php
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['username']) || !isset($data['pin'])) {
            http_response_code(400);
            echo json_encode([
                'success' => false, 
                'message' => 'Username and PIN are required'
            ]);
            exit;
        }
        
        $username = trim($data['username']);
        $pin = $data['pin'];
        
        if (!preg_match('/^\d{4}$/', $pin)) {
            http_response_code(400);
            echo json_encode([
                'success' => false, 
                'message' => 'PIN must be 4 digits'
            ]);
            exit;
        }
        
        $stmt = $pdo->prepare("
            SELECT id, username, pin, currency, theme 
            FROM users 
            WHERE username = ? AND pin = ?
        ");
        $stmt->execute([$username, $pin]);
        $user = $stmt->fetch();
        
        if ($user) {
            $updateStmt = $pdo->prepare("
                UPDATE users SET last_login = NOW() WHERE id = ?
            ");
            $updateStmt->execute([$user['id']]);
            
            unset($user['pin']);
            
            echo json_encode([
                'success' => true, 
                'message' => 'Login successful',
                'user' => $user
            ]);
        } else {
            http_response_code(401);
            echo json_encode([
                'success' => false, 
                'message' => 'Invalid username or PIN'
            ]);
        }
        
    } catch (Exception $e) {
        error_log("Login error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            'success' => false, 
            'message' => 'Login failed'
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'success' => false, 
        'message' => 'Method not allowed'
    ]);
}
?>