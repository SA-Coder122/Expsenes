<!-- get_transactions.php -->
<?php
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $user_id = isset($_GET['user_id']) ? (int)$_GET['user_id'] : 0;
        
        if ($user_id <= 0) {
            http_response_code(400);
            echo json_encode([
                'success' => false, 
                'message' => 'Valid user ID required'
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
        
        $sql = "SELECT * FROM transactions WHERE user_id = ?";
        $params = [$user_id];
        
        if (isset($_GET['type']) && in_array($_GET['type'], ['income', 'expense'])) {
            $sql .= " AND type = ?";
            $params[] = $_GET['type'];
        }
        
        if (isset($_GET['category']) && !empty($_GET['category'])) {
            $sql .= " AND category = ?";
            $params[] = $_GET['category'];
        }
        
        if (isset($_GET['start_date']) && !empty($_GET['start_date'])) {
            $sql .= " AND date >= ?";
            $params[] = $_GET['start_date'];
        }
        
        if (isset($_GET['end_date']) && !empty($_GET['end_date'])) {
            $sql .= " AND date <= ?";
            $params[] = $_GET['end_date'];
        }
        
        $sql .= " ORDER BY date DESC, created_at DESC";
        
        if (isset($_GET['limit']) && is_numeric($_GET['limit'])) {
            $sql .= " LIMIT ?";
            $params[] = (int)$_GET['limit'];
        }
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $transactions = $stmt->fetchAll();
        
        $summaryStmt = $pdo->prepare("
            SELECT type, COUNT(*) as count, SUM(amount) as total
            FROM transactions WHERE user_id = ? GROUP BY type
        ");
        $summaryStmt->execute([$user_id]);
        $summary = $summaryStmt->fetchAll(PDO::FETCH_GROUP | PDO::FETCH_UNIQUE);
        
        echo json_encode([
            'success' => true,
            'transactions' => $transactions,
            'summary' => $summary,
            'count' => count($transactions)
        ]);
        
    } catch (Exception $e) {
        error_log("Get transactions error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            'success' => false, 
            'message' => 'Failed to get transactions'
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