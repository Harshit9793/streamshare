// Import Firebase Authentication
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js';
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider,
    signInWithPhoneNumber,
    RecaptchaVerifier
} from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js';

// Initialize Firebase with your config
const app = initializeApp(window.config.firebase);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Initialize reCAPTCHA verifier
let recaptchaVerifier;

// Function to initialize reCAPTCHA
function initRecaptcha() {
    recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'normal',
        'callback': (response) => {
            // reCAPTCHA solved, enable sign-in button
            document.getElementById('phone-sign-in-button').disabled = false;
        }
    });
}

// Google Sign In
async function signInWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        console.log('Successfully signed in with Google:', user);
        // Update UI or redirect
        window.location.href = '/dashboard.html';
    } catch (error) {
        console.error('Error signing in with Google:', error);
        alert('Error signing in with Google. Please try again.');
    }
}

// Phone Number Sign In
async function startPhoneSignIn(phoneNumber) {
    try {
        const appVerifier = recaptchaVerifier;
        const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
        // Save confirmation result to use it later
        window.confirmationResult = confirmationResult;
        // Show verification code input
        document.getElementById('verification-code-container').style.display = 'block';
    } catch (error) {
        console.error('Error starting phone sign-in:', error);
        alert('Error sending verification code. Please try again.');
    }
}

// Verify Phone Number Code
async function verifyPhoneCode(code) {
    try {
        const result = await window.confirmationResult.confirm(code);
        const user = result.user;
        console.log('Successfully signed in with phone number:', user);
        // Update UI or redirect
        window.location.href = '/dashboard.html';
    } catch (error) {
        console.error('Error verifying code:', error);
        alert('Invalid verification code. Please try again.');
    }
}

// Sign Out
async function signOut() {
    try {
        await auth.signOut();
        window.location.href = '/';
    } catch (error) {
        console.error('Error signing out:', error);
        alert('Error signing out. Please try again.');
    }
}

// Export functions
window.auth = {
    signInWithGoogle,
    startPhoneSignIn,
    verifyPhoneCode,
    signOut,
    initRecaptcha
}; 