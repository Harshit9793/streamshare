// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
    databaseURL: "YOUR_FIREBASE_DATABASE_URL",
    projectId: "YOUR_FIREBASE_PROJECT_ID",
    storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
    messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
    appId: "YOUR_FIREBASE_APP_ID"
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