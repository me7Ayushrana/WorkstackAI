// --- Firebase Configuration (V4.0 Update) ---
// Note: Using public implementation for demo purposes.
const firebaseConfig = {
    apiKey: "AIzaSyA6tzjoMXAy3TKobmTJectvtqABV3fye54",
    authDomain: "workstackai.firebaseapp.com",
    projectId: "workstackai",
    storageBucket: "workstackai.firebasestorage.app",
    messagingSenderId: "636409413302",
    appId: "1:636409413302:web:ec1b9e33693a4b268af017"
};

// Initialize Firebase SDK
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
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
                    reject(error);
                });
        });
    },

    logout: function () {
        firebase.auth().signOut().then(() => {
            // Clear V4 session keys
            localStorage.removeItem('ws_session_v4');
            localStorage.removeItem('ws_user_profile');
            
            // Note: Keeping 'hasPaid' for UX continuity
            this.state.isLoggedIn = false;
            this.state.user = null;
            window.location.reload();
        });
    },

    // --- Internals ---
    _saveSession: function (user) {
        localStorage.setItem('ws_session_v4', 'true');
        localStorage.setItem('ws_user_profile', JSON.stringify(user));
        this.state.isLoggedIn = true;
        this.state.user = user;
    },

    // --- Admin Backdoor (Dev Use Only) ---
    checkAdminBypass: function () {
        const urlParams = new URLSearchParams(window.location.search);
        // Secret token for demo access
        if (urlParams.get('access_token') === 'workstack_admin_vip') {
            console.log("Admin Access Granted 🔓");
            localStorage.setItem('hasPaid', 'true');
            alert("Admin Access Unlocked! Welcome, Creator.");

            try {
                const newUrl = window.location.origin + window.location.pathname;
                window.history.replaceState({}, document.title, newUrl);
            } catch (e) { /* Ignore old browsers */ }

            if (window.location.pathname.includes('payment.html')) {
                window.location.href = 'roles.html';
            }
        }
    },

    // --- UI Helpers ---
    checkProtection: function () {
        // 1. Auth Guard
        if (!this.state.isLoggedIn) {
            window.location.href = "index.html?auth_required=true";
            return;
        }

        // 2. Payment Guard (Skip if already on payment page)
        // Fixed bug where users got stuck in redirect loop
        const hasPaid = localStorage.getItem('hasPaid') === 'true';
        const isPaymentPage = window.location.pathname.includes('payment.html');

        if (!hasPaid && !isPaymentPage) {
            console.log("Redirecting to Payment Gateway...");
            window.location.href = "payment.html";
        }

        if (hasPaid && isPaymentPage) {
            window.location.href = "roles.html";
        }
    },

    updateHeader: function () {
        const headerBtn = document.getElementById('auth-trigger');
        if (!headerBtn) return;

        if (this.state.isLoggedIn && this.state.user) {
             // Dropdown HTML Structure - Refactored in V4.5
            headerBtn.innerHTML = `
                <div class="user-menu-container" style="position: relative;">
                    <button class="user-menu-btn" onclick="AUTH.toggleMenu()" title="Account Options">
                        <img src="${this.state.user.avatar}" alt="User">
                        <span>${this.state.user.name ? this.state.user.name.split(' ')[0] : 'User'}</span>
                        <span style="font-size: 0.8rem; opacity: 0.5;">▼</span>
                    </button>
                    
                    <!-- Dropdown Content (Hidden by default) -->
                    <div id="user-dropdown" class="user-dropdown-menu hidden">
                        <div class="dropdown-header">
                            <img src="${this.state.user.avatar}" class="dropdown-avatar">
                            <div>
                                <div class="dropdown-name">${this.state.user.name}</div>
                                <div class="dropdown-email">${this.state.user.email}</div>
                            </div>
                        </div>
                        <div class="dropdown-divider"></div>
                        <a href="roles.html" class="dropdown-item">
                            <span>🎭</span> Switch Role
                        </a>
                        <a href="#" class="dropdown-item disabled" title="Coming Soon">
                            <span>⚙️</span> Settings
                        </a>
                        <div class="dropdown-divider"></div>
                        <div class="dropdown-item dangerous" onclick="AUTH.logout()">
                            <span>🚪</span> Log Out
                        </div>
                    </div>
                </div>
            `;
            // Remove default event listeners to prevent conflicts
            headerBtn.onclick = null; 
            headerBtn.style.padding = "0"; 
            headerBtn.style.border = "none";
        } else {
            headerBtn.innerHTML = `Sign In`;
            headerBtn.onclick = () => openAuthModal();
        }
    },

    toggleMenu: function() {
        const menu = document.getElementById('user-dropdown');
        if (menu) {
            menu.classList.toggle('hidden');
            // Event Listener: Close when clicking outside
            if (!menu.classList.contains('hidden')) {
                document.addEventListener('click', function closeMenu(e) {
                    if (!e.target.closest('.user-menu-container')) {
                        menu.classList.add('hidden');
                        document.removeEventListener('click', closeMenu);
                    }
                });
            }
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
