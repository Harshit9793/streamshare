// AWS S3 Configuration
AWS.config.update({
    region: 'YOUR_AWS_REGION',
    credentials: new AWS.Credentials({
        accessKeyId: 'YOUR_AWS_ACCESS_KEY',
        secretAccessKey: 'YOUR_AWS_SECRET_KEY'
    })
});

const s3 = new AWS.S3();
const BUCKET_NAME = 'YOUR_S3_BUCKET_NAME';

// DOM Elements
const uploadForm = document.getElementById('uploadForm');
const videoFileInput = document.getElementById('videoFile');
const thumbnailFileInput = document.getElementById('thumbnailFile');
const progressBar = document.querySelector('.progress');
const progressBarInner = document.querySelector('.progress-bar');

// Authentication State Observer
auth.onAuthStateChanged((user) => {
    if (!user) {
        window.location.href = '/';
    }
});

// Upload Form Handler
uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const user = auth.currentUser;
    if (!user) {
        alert('Please sign in to upload videos');
        return;
    }

    const videoFile = videoFileInput.files[0];
    const thumbnailFile = thumbnailFileInput.files[0];
    
    if (!videoFile) {
        alert('Please select a video file');
        return;
    }

    if (videoFile.size > 500 * 1024 * 1024) {
        alert('Video file size must be less than 500MB');
        return;
    }

    try {
        // Show progress bar
        progressBar.classList.remove('d-none');
        
        // Generate unique file names
        const videoFileName = `${Date.now()}-${videoFile.name}`;
        const thumbnailFileName = thumbnailFile ? `${Date.now()}-${thumbnailFile.name}` : null;
        
        // Upload video to S3
        const videoUrl = await uploadToS3(videoFile, videoFileName, 'video/mp4');
        
        // Upload thumbnail to S3 if provided
        let thumbnailUrl = null;
        if (thumbnailFile) {
            thumbnailUrl = await uploadToS3(thumbnailFile, thumbnailFileName, 'image/jpeg');
        }
        
        // Save video metadata to Firebase
        const videoData = {
            title: document.getElementById('videoTitle').value,
            description: document.getElementById('videoDescription').value,
            videoUrl: videoUrl,
            thumbnailUrl: thumbnailUrl,
            uploaderId: user.uid,
            uploaderName: user.displayName,
            uploadDate: Date.now(),
            views: 0
        };
        
        await database.ref('videos').push(videoData);
        
        alert('Video uploaded successfully!');
        window.location.href = '/dashboard';
    } catch (error) {
        console.error('Upload error:', error);
        alert('Error uploading video. Please try again.');
    } finally {
        progressBar.classList.add('d-none');
    }
});

// Upload file to S3
async function uploadToS3(file, fileName, contentType) {
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: BUCKET_NAME,
            Key: fileName,
            Body: file,
            ContentType: contentType,
            ACL: 'public-read'
        };
        
        s3.upload(params)
            .on('httpUploadProgress', (evt) => {
                const progress = Math.round((evt.loaded * 100) / evt.total);
                progressBarInner.style.width = `${progress}%`;
                progressBarInner.textContent = `${progress}%`;
            })
            .send((err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.Location);
                }
            });
    });
} 