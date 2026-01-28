<!-- add_transaction.php -->
<?php
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $required_fields = ['user_id', 'type', 'description', 'amount', 'category', 'date'];
        foreach ($required_fields as $field) {
            if (!isset($data[$field]) || empty($data[$field])) {
                http_response_code(400);
                echo json_encode([
                    'success' => false, 
                    'message' => "Missing field: $field"
                ]);
                exit;
            }
        }
        
        $user_id = (int)$data['user_id'];
        $type = $data['type'];
        $description = trim($data['description']);
        $amount = (float)$data['amount'];
        $category = $data['category'];
        $date = $data['date'];
        
        if (!in_array($type, ['income', 'expense'])) {
            http_response_code(400);
            echo json_encode([
                'success' => false, 
                'message' => 'Invalid transaction type'
            ]);
            exit;
        }
        
        if ($amount <= 0) {
            http_response_code(400);
            echo json_encode([
                'success' => false, 
                'message' => 'Amount must be greater than 0'
            ]);
            exit;
        }
        
        if (strlen($description) > 255) {
            http_response_code(400);
            echo json_encode([
                'success' => false, 
                'message' => 'Description too long'
            ]);
            exit;
        }
        
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
            http_response_code(400);
            echo json_encode([
                'success' => false, 
                'message' => 'Invalid date format'
            ]);
            exit;
        }
        
        $userStmt = $pdo->prepare("SELECT id FROM users WHERE id = ?");
        $userStmt->execute([$user_id]);
        
        if ($userStmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode([
                'success' => false, 
                'message' => 'User not found'
            ]);
            exit;
        }
        
        $stmt = $pdo->prepare("
            INSERT INTO transactions (user_id, type, description, amount, category, date, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, NOW())
        ");
        
        if ($stmt->execute([$user_id, $type, $description, $amount, $category, $date])) {
            $transaction_id = $pdo->lastInsertId();
            
            $transactionStmt = $pdo->prepare("
                SELECT * FROM transactions WHERE id = ?
            ");
            $transactionStmt->execute([$transaction_id]);
            $transaction = $transactionStmt->fetch();
            
            echo json_encode([
                'success' => true, 
                'message' => 'Transaction added successfully',
                'transaction_id' => $transaction_id,
                'transaction' => $transaction
            ]);
        } else {
            throw new Exception('Failed to add transaction');
        }
        
    } catch (Exception $e) {
        error_log("Add transaction error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            'success' => false, 
            'message' => 'Failed to add transaction'
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