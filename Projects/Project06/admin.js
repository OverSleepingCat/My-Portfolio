// Admin dashboard functionality
let currentThesis = null;

document.addEventListener('DOMContentLoaded', function() {
    // Check admin authentication
    if (!isAdminAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }
    
    // Load dashboard
    loadDashboard();
    
    // Set up event listeners
    setupEventListeners();
});

function isAdminAuthenticated() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    const loginTime = sessionStorage.getItem('loginTime');
    
    if (!isLoggedIn || !loginTime) {
        return false;
    }
    
    // Check if session is expired (4 hours)
    const currentTime = Date.now();
    const sessionAge = currentTime - parseInt(loginTime);
    const maxAge = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
    
    if (sessionAge > maxAge) {
        // Session expired
        sessionStorage.removeItem('adminLoggedIn');
        sessionStorage.removeItem('loginTime');
        return false;
    }
    
    return true;
}

function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    sessionStorage.removeItem('loginTime');
    window.location.href = 'index.html';
}

function loadDashboard() {
    const submissions = getSubmissions();
    
    // Update statistics
    updateStatistics(submissions);
    
    // Display submissions
    displaySubmissions(submissions);
}

function updateStatistics(submissions) {
    const stats = {
        total: submissions.length,
        draft: submissions.filter(s => s.submissionType === 'Draft').length,
        final: submissions.filter(s => s.submissionType === 'Final').length,
        revision: submissions.filter(s => s.submissionType === 'Revision').length
    };
    
    document.getElementById('totalSubmissions').textContent = stats.total;
    document.getElementById('draftSubmissions').textContent = stats.draft;
    document.getElementById('finalSubmissions').textContent = stats.final;
    document.getElementById('revisionSubmissions').textContent = stats.revision;
    
    // Animate numbers
    animateNumbers();
}

function animateNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(element => {
        const finalValue = parseInt(element.textContent);
        let currentValue = 0;
        const increment = Math.ceil(finalValue / 20);
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                currentValue = finalValue;
                clearInterval(timer);
            }
            element.textContent = currentValue;
        }, 50);
    });
}

function displaySubmissions(submissions) {
    const container = document.getElementById('submissionsList');
    const noSubmissions = document.getElementById('noSubmissions');
    
    if (submissions.length === 0) {
        noSubmissions.style.display = 'block';
        container.style.display = 'none';
        return;
    }
    
    noSubmissions.style.display = 'none';
    container.style.display = 'block';
    
    container.innerHTML = submissions.map(submission => createSubmissionCard(submission)).join('');
}

function createSubmissionCard(submission) {
    const typeClass = `type-${submission.submissionType.toLowerCase()}`;
    const formattedDate = formatDate(submission.submissionDate);
    
    return `
        <div class="submission-card" onclick="openThesisDetails('${submission.id}')">
            <div class="submission-header">
                <div class="submission-title">${submission.thesisTitle}</div>
                <span class="submission-type ${typeClass}">${submission.submissionType}</span>
            </div>
            
            <div class="submission-meta">
                <div class="meta-item">
                    <strong>Student:</strong> ${submission.studentName} (${submission.studentId})
                </div>
                <div class="meta-item">
                    <strong>Department:</strong> ${submission.department}
                </div>
                <div class="meta-item">
                    <strong>Supervisor:</strong> ${submission.supervisor}
                </div>
                <div class="meta-item">
                    <strong>Submitted:</strong> ${formattedDate}
                </div>
            </div>
            
            <div class="submission-abstract">
                ${submission.abstract}
            </div>
        </div>
    `;
}

function setupEventListeners() {
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('thesisModal');
        if (event.target === modal) {
            closeThesisModal();
        }
    });
}

function filterSubmissions() {
    const departmentFilter = document.getElementById('departmentFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    let submissions = getSubmissions();
    
    // Apply filters
    if (departmentFilter) {
        submissions = submissions.filter(s => s.department === departmentFilter);
    }
    
    if (typeFilter) {
        submissions = submissions.filter(s => s.submissionType === typeFilter);
    }
    
    if (searchTerm) {
        submissions = submissions.filter(s => 
            s.studentName.toLowerCase().includes(searchTerm) ||
            s.thesisTitle.toLowerCase().includes(searchTerm) ||
            s.supervisor.toLowerCase().includes(searchTerm)
        );
    }
    
    displaySubmissions(submissions);
}

function openThesisDetails(submissionId) {
    const submissions = getSubmissions();
    const submission = submissions.find(s => s.id === submissionId);
    
    if (!submission) {
        alert('Submission not found.');
        return;
    }
    
    currentThesis = submission;
    
    // Populate modal with thesis details
    document.getElementById('modalTitle').textContent = submission.thesisTitle;
    document.getElementById('thesisDetails').innerHTML = createThesisDetailsHTML(submission);
    
    // Show modal
    document.getElementById('thesisModal').style.display = 'block';
}

function createThesisDetailsHTML(submission) {
    const formattedDate = formatDate(submission.submissionDate);
    const fileSize = submission.fileSize ? formatFileSize(submission.fileSize) : 'N/A';
    
    return `
        <div class="thesis-detail-grid">
            <div class="detail-section">
                <h4>Student Information</h4>
                <div class="detail-grid">
                    <span class="detail-label">Name:</span>
                    <span class="detail-value">${submission.studentName}</span>
                    <span class="detail-label">Student ID:</span>
                    <span class="detail-value">${submission.studentId}</span>
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${submission.email}</span>
                    <span class="detail-label">Department:</span>
                    <span class="detail-value">${submission.department}</span>
                </div>
            </div>
            
            <div class="detail-section">
                <h4>Thesis Information</h4>
                <div class="detail-grid">
                    <span class="detail-label">Title:</span>
                    <span class="detail-value">${submission.thesisTitle}</span>
                    <span class="detail-label">Supervisor:</span>
                    <span class="detail-value">${submission.supervisor}</span>
                    <span class="detail-label">Submission Type:</span>
                    <span class="detail-value">${submission.submissionType}</span>
                    <span class="detail-label">Keywords:</span>
                    <span class="detail-value">${submission.keywords || 'Not provided'}</span>
                    <span class="detail-label">Submitted:</span>
                    <span class="detail-value">${formattedDate}</span>
                    <span class="detail-label">Status:</span>
                    <span class="detail-value">${submission.status}</span>
                </div>
            </div>
            
            <div class="detail-section">
                <h4>File Information</h4>
                <div class="detail-grid">
                    <span class="detail-label">File Name:</span>
                    <span class="detail-value">${submission.fileName || 'No file uploaded'}</span>
                    <span class="detail-label">File Size:</span>
                    <span class="detail-value">${fileSize}</span>
                </div>
            </div>
            
            <div class="detail-section">
                <h4>Abstract</h4>
                <div class="abstract-text">${submission.abstract}</div>
            </div>
        </div>
    `;
}

function closeThesisModal() {
    document.getElementById('thesisModal').style.display = 'none';
    currentThesis = null;
}

function downloadThesis() {
    if (!currentThesis) {
        alert('No thesis selected.');
        return;
    }
    
    if (!currentThesis.fileName) {
        alert('No file available for download.');
        return;
    }
    
    // In a real application, this would download the actual file
    // For demo purposes, we'll show a message
    alert(`Download would start for: ${currentThesis.fileName}\n\nNote: This is a demo - actual file download is not implemented.`);
}

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

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getSubmissions() {
    return JSON.parse(localStorage.getItem('thesisSubmissions') || '[]');
}

// Auto-refresh dashboard every 30 seconds to show new submissions
setInterval(() => {
    if (document.visibilityState === 'visible') {
        loadDashboard();
    }
}, 30000);