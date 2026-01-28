let currentUser = null;
let transactions = [];
let currentCurrency = localStorage.getItem('currency') || 'USD';
let currentTheme = localStorage.getItem('theme') || 'light';

// Currency configuration
const currencyConfig = {
    USD: { symbol: '$', code: 'USD' },
    GHS: { symbol: '₵', code: 'GHS' },
    EUR: { symbol: '€', code: 'EUR' },
    GBP: { symbol: '£', code: 'GBP' }
};

// Initialize app when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize the application
function initializeApp() {
    applyTheme(currentTheme);
    setupCurrencySelector();
    checkAuthStatus();
    setupEventListeners();
}

// Set up event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            switchPage(e.currentTarget.dataset.page);
        });
    });
    
    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    
    // Currency selector
    document.getElementById('currency-select').addEventListener('change', function(e) {
        changeCurrency(e.target.value);
    });
}

// Check if user is logged in
function checkAuthStatus() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        currentUser = JSON.parse(user);
        showApp();
        loadUserData();
    } else {
        showLogin();
    }
}

// Show main app, hide login
function showApp() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    document.getElementById('username-display').textContent = currentUser.username;
    switchPage('dashboard');
}

// Show login, hide app
function showLogin() {
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('app').classList.add('hidden');
}

// Switch between pages
function switchPage(page) {
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-page="${page}"]`).classList.add('active');
    
    // Update page title
    const pageTitles = {
        dashboard: 'Dashboard',
        transactions: 'Transactions',
        reports: 'Reports',
        settings: 'Settings'
    };
    document.getElementById('page-title').textContent = pageTitles[page];
    
    // Load page content
    const content = document.getElementById('page-content');
    
    switch(page) {
        case 'dashboard':
            loadDashboard(content);
            break;
        case 'transactions':
            loadTransactions(content);
            break;
        case 'reports':
            loadReports(content);
            break;
        case 'settings':
            loadSettings(content);
            break;
    }
}

// ========== AUTHENTICATION FUNCTIONS ==========

// Handle user login
function login(event) {
    event.preventDefault();
    
    const username = document.getElementById('login-username').value;
    const pin = document.getElementById('login-pin').value;
    
    // Basic validation
    if (pin.length !== 4 || !/^\d+$/.test(pin)) {
        alert('PIN must be 4 digits');
        return;
    }
    
    // Check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[username];
    
    if (user && user.pin === pin) {
        currentUser = { username: username, pin: pin };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showApp();
    } else {
        alert('Invalid username or PIN');
    }
}

// Handle user registration
function register(event) {
    event.preventDefault();
    
    const username = document.getElementById('reg-username').value;
    const pin = document.getElementById('reg-pin').value;
    const confirmPin = document.getElementById('confirm-pin').value;
    
    // Validation
    if (pin !== confirmPin) {
        alert('PINs do not match');
        return;
    }
    
    if (pin.length !== 4 || !/^\d+$/.test(pin)) {
        alert('PIN must be 4 digits');
        return;
    }
    
    // Check if username already exists
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[username]) {
        alert('Username already exists');
        return;
    }
    
    // Create new user
    users[username] = { pin: pin, createdAt: new Date().toISOString() };
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('Registration successful! Please login.');
    window.location.href = 'index.html';
}

// Logout user
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showLogin();
}

// ========== THEME MANAGEMENT ==========

// Toggle between light and dark themes
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(currentTheme);
    localStorage.setItem('theme', currentTheme);
    
    // Update theme toggle icon
    const themeIcon = document.querySelector('#theme-toggle i');
    themeIcon.className = currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Apply the selected theme
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
}

// ========== CURRENCY MANAGEMENT ==========

// Set up currency selector with current value
function setupCurrencySelector() {
    const currencySelect = document.getElementById('currency-select');
    currencySelect.value = currentCurrency;
}

// Change the current currency
function changeCurrency(currency) {
    currentCurrency = currency;
    localStorage.setItem('currency', currency);
    
    // Reload current page to update currency display
    const activePage = document.querySelector('.nav-item.active').dataset.page;
    switchPage(activePage);
}

// Format amount with current currency
function formatCurrency(amount) {
    const config = currencyConfig[currentCurrency];
    return `${config.symbol}${amount.toFixed(2)}`;
}

// ========== DATA MANAGEMENT ==========

// Load user data from localStorage
function loadUserData() {
    if (!currentUser) return;
    
    const userData = JSON.parse(localStorage.getItem(`userData_${currentUser.username}`) || '{}');
    transactions = userData.transactions || [];
}

// Save user data to localStorage
function saveUserData() {
    if (!currentUser) return;
    
    const userData = {
        transactions: transactions,
        lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem(`userData_${currentUser.username}`, JSON.stringify(userData));
}

// ========== TRANSACTION MANAGEMENT ==========

// Show add transaction form
function showAddTransactionForm() {
    document.getElementById('transaction-modal').classList.remove('hidden');
    document.getElementById('date').value = new Date().toISOString().split('T')[0];
}

// Hide modal
function hideModal() {
    document.getElementById('transaction-modal').classList.add('hidden');
}

// Add new transaction
function addTransaction(event) {
    event.preventDefault();
    
    const transaction = {
        id: Date.now().toString(),
        type: document.getElementById('type').value,
        description: document.getElementById('description').value,
        amount: parseFloat(document.getElementById('amount').value),
        category: document.getElementById('category').value,
        date: document.getElementById('date').value,
        createdAt: new Date().toISOString()
    };
    
    transactions.unshift(transaction); // Add to beginning of array
    saveUserData();
    hideModal();
    
    // Reload current page to show new transaction
    const activePage = document.querySelector('.nav-item.active').dataset.page;
    switchPage(activePage);
}

// Delete transaction
function deleteTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        transactions = transactions.filter(t => t.id !== id);
        saveUserData();
        
        // Reload transactions page
        loadTransactions(document.getElementById('page-content'));
    }
}

// ========== PAGE LOADING FUNCTIONS ==========

// Load dashboard page
function loadDashboard(container) {
    const balance = calculateBalance();
    
    container.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon balance">
                    <i class="fas fa-wallet"></i>
                </div>
                <div class="stat-info">
                    <h3>Total Balance</h3>
                    <div class="stat-amount">${formatCurrency(balance.total)}</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon income">
                    <i class="fas fa-arrow-down"></i>
                </div>
                <div class="stat-info">
                    <h3>Total Income</h3>
                    <div class="stat-amount income">${formatCurrency(balance.income)}</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon expense">
                    <i class="fas fa-arrow-up"></i>
                </div>
                <div class="stat-info">
                    <h3>Total Expenses</h3>
                    <div class="stat-amount expense">${formatCurrency(balance.expenses)}</div>
                </div>
            </div>
        </div>
        
        <div class="chart-container">
            <div class="chart-header">
                <h3>Spending by Category</h3>
            </div>
            <canvas id="categoryChart"></canvas>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h3>Recent Transactions</h3>
                <button class="btn-primary" onclick="showAddTransactionForm()">
                    <i class="fas fa-plus"></i> Add Transaction
                </button>
            </div>
            <div class="card-body">
                <div class="transaction-list">
                    ${renderTransactionList(transactions.slice(0, 5))}
                </div>
            </div>
        </div>
    `;
    
    renderCategoryChart();
}

// Load transactions page
function loadTransactions(container) {
    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h3>All Transactions</h3>
                <button class="btn-primary" onclick="showAddTransactionForm()">
                    <i class="fas fa-plus"></i> Add Transaction
                </button>
            </div>
            <div class="card-body">
                <div class="transaction-list">
                    ${renderTransactionList(transactions)}
                </div>
            </div>
        </div>
    `;
}

// Load reports page
function loadReports(container) {
    const monthlyData = calculateMonthlyData();
    
    container.innerHTML = `
        <div class="chart-container">
            <div class="chart-header">
                <h3>Monthly Overview</h3>
            </div>
            <canvas id="monthlyChart"></canvas>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h3>Financial Summary</h3>
            </div>
            <div class="card-body">
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-info">
                            <h3>Total Transactions</h3>
                            <div class="stat-amount">${transactions.length}</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-info">
                            <h3>Average Monthly Income</h3>
                            <div class="stat-amount income">${formatCurrency(monthlyData.avgIncome)}</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-info">
                            <h3>Average Monthly Expenses</h3>
                            <div class="stat-amount expense">${formatCurrency(monthlyData.avgExpenses)}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    renderMonthlyChart();
}

// Load settings page
function loadSettings(container) {
    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h3>Settings</h3>
            </div>
            <div class="card-body">
                <div class="input-group">
                    <label>Username</label>
                    <input type="text" value="${currentUser.username}" disabled>
                </div>
                
                <div class="input-group">
                    <label>Currency</label>
                    <select id="currency-select">
                        <option value="USD">USD ($)</option>
                        <option value="GHS">GHS (₵)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                    </select>
                </div>
                
                <div class="form-buttons">
                    <button class="btn-primary" onclick="exportData()">
                        <i class="fas fa-download"></i> Export Data
                    </button>
                    <button class="btn-secondary" onclick="clearData()" style="background: #e74c3c; color: white;">
                        <i class="fas fa-trash"></i> Clear All Data
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Set up currency selector in settings
    document.getElementById('currency-select').value = currentCurrency;
    document.getElementById('currency-select').addEventListener('change', function(e) {
        changeCurrency(e.target.value);
    });
}

// ========== HELPER FUNCTIONS ==========

// Calculate balance from transactions
function calculateBalance() {
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
        
    const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
        
    return {
        income: income,
        expenses: expenses,
        total: income - expenses
    };
}

// Calculate monthly data for reports
function calculateMonthlyData() {
    // Simple implementation - in real app, group by month
    const incomeTransactions = transactions.filter(t => t.type === 'income');
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    
    const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    return {
        avgIncome: incomeTransactions.length > 0 ? totalIncome / incomeTransactions.length : 0,
        avgExpenses: expenseTransactions.length > 0 ? totalExpenses / expenseTransactions.length : 0
    };
}

// Render transaction list HTML
function renderTransactionList(transactionsToRender) {
    if (transactionsToRender.length === 0) {
        return '<p style="text-align: center; padding: 2rem; color: var(--text-secondary)">No transactions yet</p>';
    }
    
    return transactionsToRender.map(transaction => `
        <div class="transaction-item">
            <div class="transaction-info">
                <div class="transaction-icon ${transaction.type}">
                    <i class="fas fa-${getCategoryIcon(transaction.category)}"></i>
                </div>
                <div class="transaction-details">
                    <h4>${transaction.description}</h4>
                    <div class="transaction-meta">${transaction.category} • ${new Date(transaction.date).toLocaleDateString()}</div>
                </div>
            </div>
            <div class="transaction-amount ${transaction.type}">
                ${transaction.type === 'income' ? '+' : '-'}${formatCurrency(transaction.amount)}
            </div>
            <div class="transaction-actions">
                <button class="btn-icon delete" onclick="deleteTransaction('${transaction.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Get icon for category
function getCategoryIcon(category) {
    const icons = {
        'Food': 'utensils',
        'Transport': 'car',
        'Shopping': 'shopping-bag',
        'Bills': 'file-invoice-dollar',
        'Entertainment': 'film',
        'Other': 'receipt'
    };
    
    return icons[category] || 'receipt';
}

// ========== CHART FUNCTIONS ==========

// Render category chart using Chart.js
function renderCategoryChart() {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    const name = 
    // Group transactions by category
    const categories = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
    });
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(categories),
            datasets: [{
                data: Object.values(categories),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Render monthly chart
function renderMonthlyChart() {
    const ctx = document.getElementById('monthlyChart').getContext('2d');
    
    // Simple demo data - in real app, group by month
    const monthlyIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
        
    const monthlyExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Current'],
            datasets: [
                {
                    label: 'Income',
                    data: [monthlyIncome],
                    backgroundColor: '#4cc9f0'
                },
                {
                    label: 'Expenses',
                    data: [monthlyExpenses],
                    backgroundColor: '#f72585'
                }
            ]
        },
        options: {
            responsive: true
        }
    });
}

// ========== DATA MANAGEMENT FUNCTIONS ==========

// Export data
function exportData() {
    const data = {
        transactions: transactions,
        exportedAt: new Date().toISOString(),
        user: currentUser.username
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense-data-${currentUser.username}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Clear all data
function clearData() {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
        transactions = [];
        saveUserData();
        alert('All data cleared successfully');
        switchPage('dashboard');
    }
}