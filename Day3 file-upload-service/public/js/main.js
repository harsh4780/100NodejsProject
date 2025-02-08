// public/js/main.js
console.log('================================');
document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const fileList = document.querySelector('.file-list');
    const progressSection = document.querySelector('.progress-section');
    const progressBar = document.querySelector('.progress');
    const uploadingFile = document.querySelector('.uploading-file');
    const uploadStatus = document.querySelector('.upload-status');

    // Drag and Drop Handlers
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        handleFiles(files);
    });

    // Browse Button Handler
    dropZone.querySelector('.browse-btn').addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', () => {
        handleFiles(fileInput.files);
    });

    // File Upload Handler
    async function handleFiles(files) {
        for (const file of files) {
            await uploadFile(file);
        }
        loadFiles(); // Refresh file list after upload
    }

    // Upload Single File
    async function uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);

        // Show progress section
        progressSection.style.display = 'block';
        uploadingFile.textContent = `Uploading: ${file.name}`;

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    progressBar.style.width = percentCompleted + '%';
                    uploadStatus.textContent = `${percentCompleted}% - ${formatBytes(progressEvent.loaded)} of ${formatBytes(progressEvent.total)}`;
                }
            });

            if (!response.ok) throw new Error('Upload failed');

            // Hide progress section after upload
            setTimeout(() => {
                progressSection.style.display = 'none';
                progressBar.style.width = '0%';
            }, 1000);

        } catch (error) {
            console.error('Upload error:', error);
            alert('Upload failed');
        }
    }

    // Load Files
    async function loadFiles() {
        try {
            const response = await fetch('/api/files');
            const files = await response.json();
            displayFiles(files);
        } catch (error) {
            console.error('Error loading files:', error);
        }
    }

    // Display Files
    function displayFiles(files) {
        fileList.innerHTML = '';
        files.forEach(file => {
            const fileItem = createFileItem(file);
            fileList.appendChild(fileItem);
        });
    }

    // Create File Item Element
    function createFileItem(file) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <img src="${getFileIcon(file.mimetype)}" alt="file preview" class="file-preview">
            <div class="file-info">
                <div class="file-name">${file.originalName}</div>
                <div class="file-size">${formatBytes(file.size)} • ${formatDate(file.uploadDate)}</div>
            </div>
            <div class="file-actions">
                <button class="action-btn download-btn" data-filename="${file.filename}">Download</button>
                <button class="action-btn delete-btn" data-id="${file._id}">Delete</button>
            </div>
        `;

        // Add event listeners
        fileItem.querySelector('.download-btn').addEventListener('click', () => {
            window.open(`/uploads/${file.filename}`);
        });

        fileItem.querySelector('.delete-btn').addEventListener('click', async () => {
            try {
                await fetch(`/api/files/${file._id}`, { method: 'DELETE' });
                fileItem.remove();
            } catch (error) {
                console.error('Delete error:', error);
                alert('Delete failed');
            }
        });

        return fileItem;
    }

    // Utility Functions
    function formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function formatDate(date) {
        const d = new Date(date);
        const now = new Date();
        const diff = (now - d) / 1000; // difference in seconds

        if (diff < 60) return 'Just now';
        if (diff < 3600) return Math.floor(diff / 60) + ' mins ago';
        if (diff < 86400) return Math.floor(diff / 3600) + ' hours ago';
        return d.toLocaleDateString();
    }

    function getFileIcon(mimetype) {
        // Return appropriate icon based on file type
        return '/api/placeholder/50/50'; // Placeholder for now
    }

    // Initial load
    loadFiles();
});