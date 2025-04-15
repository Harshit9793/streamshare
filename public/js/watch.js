// Get video ID from URL
const urlParams = new URLSearchParams(window.location.search);
const videoId = urlParams.get('id');

if (!videoId) {
    window.location.href = '/';
}

// DOM Elements
const videoTitle = document.getElementById('videoTitle');
const videoViews = document.getElementById('videoViews');
const videoDate = document.getElementById('videoDate');
const videoDescription = document.getElementById('videoDescription');
const uploaderName = document.getElementById('uploaderName');
const uploaderAvatar = document.getElementById('uploaderAvatar');
const subscriberCount = document.getElementById('subscriberCount');
const relatedVideos = document.getElementById('relatedVideos');
const likeBtn = document.getElementById('likeBtn');
const shareBtn = document.getElementById('shareBtn');

let player;
let currentVideo;

// Load video data
database.ref(`videos/${videoId}`).on('value', (snapshot) => {
    const video = snapshot.val();
    if (!video) {
        window.location.href = '/';
        return;
    }
    
    currentVideo = video;
    
    // Update video info
    videoTitle.textContent = video.title;
    videoViews.textContent = `${video.views || 0} views`;
    videoDate.textContent = new Date(video.uploadDate).toLocaleDateString();
    videoDescription.textContent = video.description;
    uploaderName.textContent = video.uploaderName;
    
    // Initialize video player
    if (player) {
        player.dispose();
    }
    
    player = initializeVideoPlayer(videoId, video.videoUrl, isUserPremium());
    
    // Load related videos
    loadRelatedVideos(video.uploaderId);
});

// Like button handler
likeBtn.addEventListener('click', () => {
    const user = auth.currentUser;
    if (!user) {
        alert('Please sign in to like videos');
        return;
    }
    
    const likesRef = database.ref(`videos/${videoId}/likes/${user.uid}`);
    likesRef.once('value', (snapshot) => {
        if (snapshot.exists()) {
            likesRef.remove();
            likeBtn.classList.remove('btn-primary');
            likeBtn.classList.add('btn-outline-primary');
        } else {
            likesRef.set(true);
            likeBtn.classList.remove('btn-outline-primary');
            likeBtn.classList.add('btn-primary');
        }
    });
});

// Share button handler
shareBtn.addEventListener('click', () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
        navigator.share({
            title: currentVideo.title,
            url: shareUrl
        });
    } else {
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert('Link copied to clipboard!');
        });
    }
});

// Load related videos
function loadRelatedVideos(uploaderId) {
    database.ref('videos')
        .orderByChild('uploaderId')
        .equalTo(uploaderId)
        .limitToLast(5)
        .on('value', (snapshot) => {
            relatedVideos.innerHTML = '';
            snapshot.forEach((childSnapshot) => {
                if (childSnapshot.key !== videoId) {
                    const video = childSnapshot.val();
                    createRelatedVideoCard(video, childSnapshot.key);
                }
            });
        });
}

// Create related video card
function createRelatedVideoCard(video, videoId) {
    const card = document.createElement('div');
    card.className = 'video-card mb-3';
    card.innerHTML = `
        <img src="${video.thumbnailUrl || 'https://via.placeholder.com/250x140'}" class="video-thumbnail" alt="${video.title}">
        <div class="video-info">
            <h5 class="video-title">${video.title}</h5>
            <p class="video-uploader">${video.uploaderName}</p>
            <p class="video-views">${video.views || 0} views</p>
        </div>
    `;
    
    card.addEventListener('click', () => {
        window.location.href = `/watch.html?id=${videoId}`;
    });
    
    relatedVideos.appendChild(card);
}

// Check if user is premium
function isUserPremium() {
    const user = auth.currentUser;
    if (!user) return false;
    
    // In a real app, you would check the user's premium status in Firebase
    return false;
}

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
} 