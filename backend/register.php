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
        
        if (strlen($username) < 3 || strlen($username) > 50) {
            http_response_code(400);
            echo json_encode([
                'success' => false, 
                'message' => 'Username must be 3-50 characters'
            ]);
            exit;
        }
        
        if (!preg_match('/^\d{4}$/', $pin)) {
            http_response_code(400);
            echo json_encode([
                'success' => false, 
                'message' => 'PIN must be 4 digits'
            ]);
            exit;
        }
        
        $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
        $stmt->execute([$username]);
        
        if ($stmt->rowCount() > 0) {
            http_response_code(409);
            echo json_encode([
                'success' => false, 
                'message' => 'Username already exists'
            ]);
            exit;
        }
        
        $stmt = $pdo->prepare("
            INSERT INTO users (username, pin, currency, theme, created_at) 
            VALUES (?, ?, 'USD', 'light', NOW())
        ");
        
        if ($stmt->execute([$username, $pin])) {
            $user_id = $pdo->lastInsertId();
            
            echo json_encode([
                'success' => true, 
                'message' => 'User registered successfully',
                'user' => [
                    'id' => $user_id,
                    'username' => $username,
                    'currency' => 'USD',
                    'theme' => 'light'
                ]
            ]);
        } else {
            throw new Exception('Failed to create user');
        }
        
    } catch (Exception $e) {
        error_log("Registration error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            'success' => false, 
            'message' => 'Registration failed'
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