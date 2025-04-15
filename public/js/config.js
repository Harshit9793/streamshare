// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD3Y_M0n92NLVlAMz_lGSZPhyVgeyn8ADc",
    projectId: "streamshare-fg833",
    storageBucket: "streamshare-fg833.firebasestorage.app",
    appId: "1:516059473618:web:9c438626102ce03f0def0b",
    authDomain: "streamshare-fg833.firebaseapp.com",
    messagingSenderId: "516059473618"
};

// AWS S3 configuration
const awsConfig = {
    region: "YOUR_AWS_REGION",
    accessKeyId: "YOUR_AWS_ACCESS_KEY_ID",
    secretAccessKey: "YOUR_AWS_SECRET_ACCESS_KEY",
    bucketName: "YOUR_S3_BUCKET_NAME"
};

// Stripe configuration
const stripeConfig = {
    publicKey: "YOUR_STRIPE_PUBLIC_KEY",
    priceId: "YOUR_STRIPE_PRICE_ID", // Monthly $4.99 plan
    webhookSecret: "YOUR_STRIPE_WEBHOOK_SECRET"
};

// ExoClick configuration
const exoclickConfig = {
    vastUrl: "YOUR_EXOCLICK_VAST_URL",
    cpm: 2.0, // $2 CPM
    revenueShare: 0.3 // 30% revenue share
};

// App configuration
const appConfig = {
    maxVideoSize: 500 * 1024 * 1024, // 500MB
    allowedVideoTypes: ['video/mp4'],
    allowedThumbnailTypes: ['image/jpeg', 'image/png', 'image/gif'],
    premiumPrice: 4.99,
    adSkipTime: 5 // seconds
};

// Export configurations
window.config = {
    firebase: firebaseConfig,
    aws: awsConfig,
    stripe: stripeConfig,
    exoclick: exoclickConfig,
    app: appConfig
}; 