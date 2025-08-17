// Main application script
document.addEventListener('DOMContentLoaded', function() {
    // Initialize demo data if it doesn't exist
    initializeData();
});

function initializeData() {
    if (!localStorage.getItem('thesisSubmissions')) {
        localStorage.setItem('thesisSubmissions', JSON.stringify([]));
    }
}

// Admin Login Modal Functions
function openAdminLogin() {
    document.getElementById('loginModal').style.display = 'block';
    // Focus on username field
    setTimeout(() => {
        document.getElementById('username').focus();
    }, 100);
}

function closeAdminLogin() {
    document.getElementById('loginModal').style.display = 'none';
    // Reset form
    document.getElementById('loginForm').reset();
}

// Handle login form submission
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('loginModal');
        if (event.target === modal) {
            closeAdminLogin();
        }
    });

    // Handle Enter key for demo credentials
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && document.getElementById('loginModal').style.display === 'block') {
            const activeElement = document.activeElement;
            if (activeElement.tagName !== 'BUTTON' && activeElement.type !== 'submit') {
                event.preventDefault();
                handleLogin(event);
            }
        }
    });
});

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    // Simple demo authentication
    if (username === 'admin' && password === 'admin123') {
        // Set admin session
        sessionStorage.setItem('adminLoggedIn', 'true');
        sessionStorage.setItem('loginTime', Date.now().toString());
        
        // Redirect to admin dashboard
        window.location.href = 'admin.html';
    } else {
        // Show error message
        showLoginError('Invalid username or password. Please use the demo credentials provided.');
    }
}

function showLoginError(message) {
    // Remove existing error if any
    const existingError = document.querySelector('.login-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'login-error';
    errorDiv.style.cssText = `
        background: #fee2e2;
        color: #dc2626;
        padding: 12px;
        border-radius: 8px;
        margin-top: 16px;
        font-size: 14px;
        font-weight: 500;
        text-align: center;
        border: 1px solid #fecaca;
    `;
    errorDiv.textContent = message;
    
    // Insert error message before form actions
    const formActions = document.querySelector('.form-actions');
    formActions.parentNode.insertBefore(errorDiv, formActions);
    
    // Remove error after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
    
    // Shake animation for the modal
    const modalContent = document.querySelector('.modal-content');
    modalContent.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        modalContent.style.animation = '';
    }, 500);
}

// Add shake animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
        20%, 40%, 60%, 80% { transform: translateX(4px); }
    }
`;
document.head.appendChild(style);

// Utility functions for data management
function getSubmissions() {
    return JSON.parse(localStorage.getItem('thesisSubmissions') || '[]');
}

function saveSubmissions(submissions) {
    localStorage.setItem('thesisSubmissions', JSON.stringify(submissions));
}

// Format date function
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}