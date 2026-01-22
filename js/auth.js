// --- Firebase Configuration ---
const firebaseConfig = {
    apiKey: "AIzaSyA6tzjoMXAy3TKobmTJectvtqABV3fye54",
    authDomain: "workstackai.firebaseapp.com",
    projectId: "workstackai",
    storageBucket: "workstackai.firebasestorage.app",
    messagingSenderId: "636409413302",
    appId: "1:636409413302:web:ec1b9e33693a4b268af017"
};

// Initialize Firebase
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
} else {
    console.error("Firebase SDK not loaded");
}

const AUTH = {
    state: {
        isLoggedIn: localStorage.getItem('ws_isLoggedIn') === 'true',
        user: JSON.parse(localStorage.getItem('ws_user') || 'null'),
        confirmationResult: null // For storing OTP confirmation object
    },

    // --- Core Actions ---

    loginWithGoogle: function () {
        return new Promise((resolve, reject) => {
            const provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider)
                .then((result) => {
                    const user = result.user;
                    const userData = {
                        name: user.displayName,
                        email: user.email,
                        avatar: user.photoURL,
                        method: "google"
                    };
                    this._saveSession(userData);
                    resolve(userData);
                }).catch((error) => {
                    console.error("Google Auth Error:", error);
                    reject(error);
                });
        });
    },

    initRecaptcha: function () {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
                'size': 'normal',
                'callback': (response) => {
                    // reCAPTCHA solved, allow signInWithPhoneNumber.
                },
                'expired-callback': () => {
                    // Response expired. Ask user to solve reCAPTCHA again.
                }
            });
            window.recaptchaVerifier.render();
        }
    },

    sendOTP: function (phoneNumber) {
        return new Promise((resolve, reject) => {
            if (!phoneNumber.startsWith('+')) {
                // Attempt to add country code if missing (default IND)
                phoneNumber = "+91" + phoneNumber;
            }
            const appVerifier = window.recaptchaVerifier;
            firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
                .then((confirmationResult) => {
                    // SMS sent. Prompt user to type the code from the message
                    this.state.confirmationResult = confirmationResult;
                    resolve("OTP Sent");
                }).catch((error) => {
                    console.error("SMS Error:", error);
                    if (error.code === 'auth/billing-not-enabled') {
                        alert("⚠️ Firebase Billing Required\n\nTo send real SMS, you must upgrade your Firebase project to the Blaze Plan (Pay as you go).\n\nUse a Test Number + OTP to bypass this for development.");
                    } else if (error.code === 'auth/too-many-requests') {
                        alert("⚠️ Too many attempts. Please try again later.");
                    } else {
                        alert("Error sending OTP: " + error.message);
                    }
                    reject(error);
                });
        });
    },

    verifyOTP: function (otp) {
        return new Promise((resolve, reject) => {
            if (!this.state.confirmationResult) {
                reject(new Error("No OTP request found."));
                return;
            }
            this.state.confirmationResult.confirm(otp)
                .then((result) => {
                    const user = result.user;
                    const userData = {
                        name: "Mobile User", // Phone auth doesn't give name by default
                        phone: user.phoneNumber,
                        avatar: "https://ui-avatars.com/api/?name=Mobile+User&background=6366f1&color=fff",
                        method: "phone"
                    };
                    this._saveSession(userData);
                    resolve(userData);
                }).catch((error) => {
                    reject(error);
                });
        });
    },

    logout: function () {
        firebase.auth().signOut().then(() => {
            localStorage.removeItem('ws_isLoggedIn');
            localStorage.removeItem('ws_user');
            // Do NOT remove 'hasPaid' so they don't lose purchase
            this.state.isLoggedIn = false;
            this.state.user = null;
            window.location.reload();
        });
    },

    // --- Internals ---

    _saveSession: function (user) {
        localStorage.setItem('ws_isLoggedIn', 'true');
        localStorage.setItem('ws_user', JSON.stringify(user));
        this.state.isLoggedIn = true;
        this.state.user = user;
    },

    // --- Admin Backdoor & Logic ---
    checkAdminBypass: function () {
        const urlParams = new URLSearchParams(window.location.search);
        // Magic Secret: 'workstack_admin_vip'
        if (urlParams.get('access_token') === 'workstack_admin_vip') {
            console.log("Admin Access Granted 🔓");
            localStorage.setItem('hasPaid', 'true');
            alert("Admin Access Unlocked! Welcome, Creator.");

            // Clean URL
            try {
                const newUrl = window.location.origin + window.location.pathname;
                window.history.replaceState({}, document.title, newUrl);
            } catch (e) { }

            // If on payment page, redirect
            if (window.location.pathname.includes('payment.html')) {
                window.location.href = 'roles.html';
            }
        }
    },

    // --- UI Helpers ---

    checkProtection: function () {
        // 1. Must be logged in
        if (!this.state.isLoggedIn) {
            window.location.href = "index.html?auth_required=true";
            return;
        }

        // 2. Must have paid (Skip check if we are already on payment page)
        const hasPaid = localStorage.getItem('hasPaid') === 'true';
        const isPaymentPage = window.location.pathname.includes('payment.html');

        if (!hasPaid && !isPaymentPage) {
            console.log("Access Denied: Payment Required");
            window.location.href = "payment.html";
        }

        // 3. If Paid, don't show payment page again
        if (hasPaid && isPaymentPage) {
            window.location.href = "roles.html";
        }
    },

    updateHeader: function () {
        const headerBtn = document.getElementById('auth-trigger');
        if (!headerBtn) return;

        if (this.state.isLoggedIn && this.state.user) {
            headerBtn.innerHTML = `
                <div class="user-chip" onclick="AUTH.logout()" title="Click to Logout">
                    <img src="${this.state.user.avatar}" alt="User">
                    <span>${this.state.user.name ? this.state.user.name.split(' ')[0] : 'User'}</span>
                </div>
            `;
            headerBtn.onclick = null; // Let the inner onclick handle logout
        } else {
            headerBtn.innerHTML = `Sign In`;
            headerBtn.onclick = () => openAuthModal(); // Global function in index.html
        }
    }
};

// Auto-run logic
document.addEventListener('DOMContentLoaded', () => {
    // Check for persisted Firebase user if strict session is needed, 
    // but we use localStorage for generic state to be faster. 
    // Ideally we would wait for onAuthStateChanged but for this static MPA style, localStorage is fine.

    // Admin Check
    AUTH.checkAdminBypass();

    // Header
    AUTH.updateHeader();
});

// Auto-run logic on protected pages
if (window.location.pathname.includes('payment.html') || window.location.pathname.includes('roles.html') || window.location.pathname.includes('workspace.html')) {
    AUTH.checkProtection();
}
