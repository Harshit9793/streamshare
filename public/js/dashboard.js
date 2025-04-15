// DOM Elements
const totalViews = document.getElementById('totalViews');
const totalVideos = document.getElementById('totalVideos');
const totalEarnings = document.getElementById('totalEarnings');
const recentActivity = document.getElementById('recentActivity');
const userVideos = document.getElementById('userVideos');
const earningsTable = document.getElementById('earningsTable');

let userVideosData = [];

// Authentication State Observer
auth.onAuthStateChanged((user) => {
    if (!user) {
        window.location.href = '/';
        return;
    }
    
    // Load user's videos and stats
    loadUserVideos(user.uid);
    loadRecentActivity(user.uid);
});

// Load user's videos and calculate stats
function loadUserVideos(userId) {
    database.ref('videos')
        .orderByChild('uploaderId')
        .equalTo(userId)
        .on('value', (snapshot) => {
            userVideosData = [];
            let totalViewsCount = 0;
            let totalEarningsAmount = 0;
            
            snapshot.forEach((childSnapshot) => {
                const video = childSnapshot.val();
                video.id = childSnapshot.key;
                userVideosData.push(video);
                
                // Calculate total views and earnings
                const views = video.views || 0;
                totalViewsCount += views;
                totalEarningsAmount += calculateEarnings(views);
                
                // Create video card
                createVideoCard(video);
                
                // Add to earnings table
                addToEarningsTable(video);
            });
            
            // Update stats
            totalViews.textContent = formatNumber(totalViewsCount);
            totalVideos.textContent = formatNumber(userVideosData.length);
            totalEarnings.textContent = `$${totalEarningsAmount.toFixed(2)}`;
        });
}

// Create video card
function createVideoCard(video) {
    const card = document.createElement('div');
    card.className = 'video-card mb-3';
    card.innerHTML = `
        <div class="row">
            <div class="col-md-3">
                <img src="${video.thumbnailUrl || 'https://via.placeholder.com/250x140'}" class="video-thumbnail" alt="${video.title}">
            </div>
            <div class="col-md-6">
                <h5 class="video-title">${video.title}</h5>
                <p class="video-description">${video.description || 'No description'}</p>
                <div class="d-flex">
                    <span class="me-3"><i class="bi bi-eye"></i> ${formatNumber(video.views || 0)} views</span>
                    <span><i class="bi bi-cash"></i> $${calculateEarnings(video.views || 0).toFixed(2)}</span>
                </div>
            </div>
            <div class="col-md-3 text-end">
                <a href="/watch.html?id=${video.id}" class="btn btn-outline-primary me-2">View</a>
                <button class="btn btn-outline-danger" onclick="deleteVideo('${video.id}')">Delete</button>
            </div>
        </div>
    `;
    
    userVideos.appendChild(card);
}

// Add to earnings table
function addToEarningsTable(video) {
    const row = document.createElement('tr');
    const earnings = calculateEarnings(video.views || 0);
    const cpm = (earnings / (video.views || 1)) * 1000; // CPM = Earnings per 1000 views
    
    row.innerHTML = `
        <td>${video.title}</td>
        <td>${formatNumber(video.views || 0)}</td>
        <td>$${earnings.toFixed(2)}</td>
        <td>$${cpm.toFixed(2)}</td>
    `;
    
    earningsTable.appendChild(row);
}

// Load recent activity
function loadRecentActivity(userId) {
    database.ref('videos')
        .orderByChild('uploaderId')
        .equalTo(userId)
        .limitToLast(5)
        .on('value', (snapshot) => {
            recentActivity.innerHTML = '';
            snapshot.forEach((childSnapshot) => {
                const video = childSnapshot.val();
                const activityItem = document.createElement('div');
                activityItem.className = 'activity-item mb-2';
                
                const date = new Date(video.uploadDate);
                const timeAgo = getTimeAgo(date);
                
                activityItem.innerHTML = `
                    <div class="d-flex justify-content-between">
                        <span>${video.title}</span>
                        <small class="text-muted">${timeAgo}</small>
                    </div>
                    <div class="progress" style="height: 5px;">
                        <div class="progress-bar" role="progressbar" style="width: ${Math.min((video.views || 0) / 1000 * 100, 100)}%"></div>
                    </div>
                `;
                
                recentActivity.appendChild(activityItem);
            });
        });
}

// Calculate earnings based on views
function calculateEarnings(views) {
    const CPM = 2; // $2 per 1000 views
    const REVENUE_SHARE = 0.3; // 30% revenue share
    return (views / 1000) * CPM * REVENUE_SHARE;
}

// Delete video
function deleteVideo(videoId) {
    if (confirm('Are you sure you want to delete this video?')) {
        database.ref(`videos/${videoId}`).remove()
            .then(() => {
                alert('Video deleted successfully');
            })
            .catch((error) => {
                alert('Error deleting video: ' + error.message);
            });
    }
}

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Get time ago string
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    
    return Math.floor(seconds) + ' seconds ago';
} 