# Smart Expense Tracker 💰

A modern, full-featured expense tracking web application with local storage capabilities and currency support.

## 📋 Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [File Structure](#file-structure)
- [API Documentation](#api-documentation)
- [Frontend Features](#frontend-features)
- [Usage Guide](#usage-guide)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## ✨ Features

### 🔐 Authentication
- User registration with unique username and 4-digit PIN
- Secure login system
- Session persistence with localStorage
- Automatic logout on browser close

### 💼 Transaction Management
- Add income and expense transactions
- Categorize transactions (Food, Transport, Shopping, etc.)
- View transaction history with filtering
- Delete transactions
- Date-based transaction organization

### 📊 Financial Insights
- Real-time balance calculation
- Income vs. expense tracking
- Category-wise spending analysis
- Monthly financial summaries
- Interactive charts (Category distribution, Monthly overview)

### 🎨 User Experience
- Light/Dark theme toggle
- Multiple currency support (USD, GHS, EUR, GBP)
- Responsive design for mobile and desktop
- Intuitive dashboard with statistics
- Floating Action Button (FAB) for quick actions

### 📁 Data Management
- Local storage for offline functionality
- Data export to JSON format
- Clear data option with confirmation
- Persistent user preferences

## 🛠 Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Flexbox, Grid
- **JavaScript (ES6)** - Modern JavaScript with localStorage API
- **Chart.js** - Data visualization
- **Font Awesome** - Icons

### Backend (PHP)
- **PHP 7.4+** - Server-side processing
- **MySQL/MariaDB** - Database
- **PDO** - Database interaction
- **JSON API** - RESTful endpoints
