// --- Firebase Configuration (V4.0 Update) ---
// Note: Using public implementation for demo purposes.
const firebaseConfig = {
    apiKey: "AIzaSyB0nMFw3e-l-KQcrmrS53DJMA5D85-8pps",
    authDomain: "workstackai-sync-2026.firebaseapp.com",
    projectId: "workstackai-sync-2026",
    storageBucket: "workstackai-sync-2026.firebasestorage.app",
    messagingSenderId: "108858818690",
    appId: "1:108858818690:web:05bd1e5aa24a1cf033749b"
};

// Initialize Firebase SDK
let db = null;
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
} else {
    // TODO: Add a fallback if lazy loading fails
    console.warn("Firebase SDK not loaded - Offline Mode?");
}

const AUTH = {
    state: {
        // Renamed session key in V3 to avoid conflicts
        isLoggedIn: localStorage.getItem('ws_session_v4') === 'true', 
        user: JSON.parse(localStorage.getItem('ws_user_profile') || 'null'),
        confirmationResult: null 
    },

    // --- Core Actions ---
    loginWithGoogle: function () {
        return new Promise((resolve, reject) => {
            const provider = new firebase.auth.GoogleAuthProvider();
            // Force popup to avoid redirect loops
            firebase.auth().signInWithPopup(provider)
                .then((result) => {
                    const user = result.user;
                    
                    // Normalizing user data for our UI
                    const userData = {
                        name: user.displayName,
                        email: user.email,
                        avatar: user.photoURL,
                        method: "google_oauth"
                    };
                    
                    this._saveSession(userData);
                    resolve(userData);
                }).catch((error) => {
                    console.error("Google Auth Failed:", error);
