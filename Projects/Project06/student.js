// Student portal functionality
document.addEventListener('DOMContentLoaded', function() {
    const thesisForm = document.getElementById('thesisForm');
    const fileInput = document.getElementById('thesisFile');
    
    if (thesisForm) {
        thesisForm.addEventListener('submit', handleThesisSubmission);
    }
    
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelection);
    }

    // Add form validation feedback
    addFormValidation();
});

function handleFileSelection(event) {
    const file = event.target.files[0];
    const fileInfo = document.getElementById('fileInfo');
    
    if (file) {
        // Check file size (25MB limit)
        const maxSize = 25 * 1024 * 1024; // 25MB in bytes
        if (file.size > maxSize) {
            alert('File size exceeds 25MB limit. Please choose a smaller file.');
            event.target.value = '';
            fileInfo.style.display = 'none';
            return;
        }
        
        // Check file type
        const allowedTypes = ['.pdf', '.doc', '.docx'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!allowedTypes.includes(fileExtension)) {
            alert('Invalid file type. Please upload a PDF, DOC, or DOCX file.');
            event.target.value = '';
            fileInfo.style.display = 'none';
            return;
        }
        
        // Display file info
        fileInfo.innerHTML = `
            <strong>Selected File:</strong> ${file.name}<br>
            <strong>Size:</strong> ${formatFileSize(file.size)}<br>
            <strong>Type:</strong> ${file.type || 'Unknown'}
        `;
        fileInfo.style.display = 'block';
        
        // Update upload area appearance
        const uploadArea = document.querySelector('.file-upload-area');
        uploadArea.style.borderColor = '#059669';
        uploadArea.style.background = 'rgba(5, 150, 105, 0.02)';
    } else {
        fileInfo.style.display = 'none';
        const uploadArea = document.querySelector('.file-upload-area');
        uploadArea.style.borderColor = '#cbd5e1';
        uploadArea.style.background = '#fafafa';
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function handleThesisSubmission(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const file = formData.get('thesisFile');
    
    // Create submission object
    const submission = {
        id: generateId(),
        studentName: formData.get('studentName'),
        studentId: formData.get('studentId'),
        email: formData.get('email'),
        department: formData.get('department'),
        thesisTitle: formData.get('thesisTitle'),
        supervisor: formData.get('supervisor'),
        abstract: formData.get('abstract'),
        submissionType: formData.get('submissionType'),
        keywords: formData.get('keywords'),
        fileName: file ? file.name : '',
        fileSize: file ? file.size : 0,
        submissionDate: new Date().toISOString(),
        status: 'Submitted'
    };
    
    // Get existing submissions
    const submissions = getSubmissions();
    
    // Add new submission
    submissions.push(submission);
    
    // Save to localStorage
    saveSubmissions(submissions);
    
    // Show success modal
    showSuccessModal();
    
    // Reset form
    event.target.reset();
    document.getElementById('fileInfo').style.display = 'none';
    resetUploadArea();
}

function resetUploadArea() {
    const uploadArea = document.querySelector('.file-upload-area');
    uploadArea.style.borderColor = '#cbd5e1';
    uploadArea.style.background = '#fafafa';
}

function showSuccessModal() {
    document.getElementById('successModal').style.display = 'block';
}

function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
}

// Close success modal when clicking outside
window.addEventListener('click', function(event) {
    const successModal = document.getElementById('successModal');
    if (event.target === successModal) {
        closeSuccessModal();
    }
});

function addFormValidation() {
    const requiredFields = document.querySelectorAll('input[required], select[required], textarea[required]');
    
    requiredFields.forEach(field => {
        // Add real-time validation
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        field.addEventListener('input', function() {
            // Remove error styling when user starts typing
            if (this.classList.contains('error')) {
                this.classList.remove('error');
                const errorMsg = this.parentNode.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.remove();
                }
            }
        });
    });
    
    // Email validation
    const emailField = document.getElementById('email');
    if (emailField) {
        emailField.addEventListener('blur', function() {
            validateEmail(this);
        });
    }
}

function validateField(field) {
    const value = field.value.trim();
    
    // Remove existing error styling and message
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, `${getFieldLabel(field)} is required.`);
        return false;
    }
    
    return true;
}

function validateEmail(field) {
    const value = field.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Remove existing error styling and message
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    if (value && !emailRegex.test(value)) {
        showFieldError(field, 'Please enter a valid email address.');
        return false;
    }
    
    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        color: #dc2626;
        font-size: 14px;
        margin-top: 4px;
        font-weight: 500;
    `;
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function getFieldLabel(field) {
    const label = field.parentNode.querySelector('label');
    if (label) {
        return label.textContent.replace('*', '').trim();
    }
    return field.name || field.id || 'This field';
}

// Add error styles
const style = document.createElement('style');
style.textContent = `
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #dc2626;
        background: #fef2f2;
        box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
    }
`;
document.head.appendChild(style);

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getSubmissions() {
    return JSON.parse(localStorage.getItem('thesisSubmissions') || '[]');
}

function saveSubmissions(submissions) {
    localStorage.setItem('thesisSubmissions', JSON.stringify(submissions));
}