# VideoStream - Video Streaming Platform

A web-based video streaming platform that allows users to upload and watch videos, with monetization through ads and premium subscriptions.

## Features

- User authentication with Firebase
- Video upload and streaming using AWS S3
- Ad integration with ExoClick
- Revenue sharing with content creators
- Premium subscription with Stripe
- Responsive design with Bootstrap
- Real-time statistics and analytics

## Prerequisites

- Node.js and npm
- Firebase account
- AWS account with S3 bucket
- Stripe account
- ExoClick account

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/yourusername/videostream.git
cd videostream
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Create a new Firebase project
   - Enable Authentication (Email/Password)
   - Enable Realtime Database
   - Get your Firebase configuration and update `public/js/config.js`

4. Configure AWS S3:
   - Create an S3 bucket
   - Set up CORS configuration
   - Create IAM user with S3 access
   - Update AWS credentials in `public/js/config.js`

5. Configure Stripe:
   - Create a Stripe account
   - Create a product and price for the premium subscription
   - Get your API keys and update `public/js/config.js`

6. Configure ExoClick:
   - Create an ExoClick account
   - Get your VAST URL
   - Update ExoClick configuration in `public/js/config.js`

7. Build and deploy:
```bash
npm run build
firebase deploy
```

## Project Structure

```
videostream/
├── public/
│   ├── index.html
│   ├── upload.html
│   ├── watch.html
│   ├── dashboard.html
│   ├── premium.html
│   ├── styles.css
│   └── js/
│       ├── app.js
│       ├── upload.js
│       ├── watch.js
│       ├── dashboard.js
│       ├── premium.js
│       └── config.js
├── package.json
└── README.md
```

## Security Considerations

1. Never commit API keys or sensitive credentials to version control
2. Use environment variables for sensitive data
3. Implement proper CORS policies
4. Set up proper S3 bucket policies
5. Use Firebase Security Rules
6. Implement rate limiting
7. Use HTTPS for all API calls

## Performance Optimization

1. Use AWS CloudFront for video delivery
2. Implement video transcoding
3. Use lazy loading for images
4. Implement caching strategies
5. Optimize database queries
6. Use compression for static assets

## Monetization

- Ad revenue: $2 CPM with 30% revenue share
- Premium subscription: $4.99/month
- Features:
  - Ad-free viewing
  - Priority uploads
  - Higher video quality
  - Early access to features

## Legal Considerations

1. Implement proper age verification
2. Add terms of service
3. Add privacy policy
4. Implement content moderation
5. Add DMCA compliance
6. Add copyright notices

## Support

For support, email support@videostream.com or create an issue in the repository.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 