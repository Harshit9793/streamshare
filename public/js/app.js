// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// DOM Elements
const authButtons = document.getElementById('authButtons');
const userMenu = document.getElementById('userMenu');
const signInBtn = document.getElementById('signInBtn');
const signUpBtn = document.getElementById('signUpBtn');
const signOutBtn = document.getElementById('signOutBtn');
const userName = document.getElementById('userName');
const videoGrid = document.getElementById('videoGrid');

// Authentication State Observer
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        authButtons.classList.add('d-none');
        userMenu.classList.remove('d-none');
        userName.textContent = user.displayName || user.email;
        loadUserVideos(user.uid);
    } else {
        // User is signed out
        authButtons.classList.remove('d-none');
        userMenu.classList.add('d-none');
        loadPublicVideos();
    }
});

// Sign In Handler
signInBtn.addEventListener('click', () => {
    const email = prompt('Enter your email:');
    const password = prompt('Enter your password:');
    
    auth.signInWithEmailAndPassword(email, password)
        .catch((error) => {
            alert(error.message);
        });
});

// Sign Up Handler
signUpBtn.addEventListener('click', () => {
    const email = prompt('Enter your email:');
    const password = prompt('Enter your password:');
    const displayName = prompt('Enter your display name:');
    
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            return userCredential.user.updateProfile({
                displayName: displayName
            });
        })
        .catch((error) => {
            alert(error.message);
        });
});

// Sign Out Handler
signOutBtn.addEventListener('click', () => {
    auth.signOut();
});

// Load Public Videos
function loadPublicVideos() {
    database.ref('videos').limitToLast(12).on('value', (snapshot) => {
        videoGrid.innerHTML = '';
        snapshot.forEach((childSnapshot) => {
            const video = childSnapshot.val();
            createVideoCard(video, childSnapshot.key);
        });
    });
}

// Load User Videos
function loadUserVideos(userId) {
    database.ref('videos').orderByChild('uploaderId').equalTo(userId).on('value', (snapshot) => {
        videoGrid.innerHTML = '';
        snapshot.forEach((childSnapshot) => {
            const video = childSnapshot.val();
            createVideoCard(video, childSnapshot.key);
        });
    });
}

// Create Video Card
function createVideoCard(video, videoId) {
    const card = document.createElement('div');
    card.className = 'video-card';
    card.innerHTML = `
        <img src="${video.thumbnailUrl || 'https://via.placeholder.com/250x140'}" class="video-thumbnail" alt="${video.title}">
        <div class="video-info">
            <h3 class="video-title">${video.title}</h3>
            <p class="video-uploader">${video.uploaderName}</p>
            <p class="video-views">${video.views || 0} views</p>
        </div>
    `;
    
    card.addEventListener('click', () => {
        window.location.href = `/watch.html?id=${videoId}`;
    });
    
    videoGrid.appendChild(card);
}

// Initialize Video.js for VAST ads
function initializeVideoPlayer(videoId, videoUrl, isPremium) {
    const player = videojs('video-player', {
        controls: true,
        autoplay: false,
        preload: 'auto',
        sources: [{
            src: videoUrl,
            type: 'video/mp4'
        }]
    });

    if (!isPremium) {
        // Initialize VAST plugin
        player.vast({
            url: 'YOUR_EXOCLICK_VAST_URL',
            playAdAlways: true,
            adCancelTimeout: 5000,
            adsEnabled: true
        });
    }

    // Track video views
    player.on('play', () => {
        database.ref(`videos/${videoId}/views`).transaction((currentViews) => {
            return (currentViews || 0) + 1;
        });
    });

    return player;
} 