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
    },

    updateHeader: function () {
        const headerBtn = document.getElementById('auth-trigger');
        if (!headerBtn) return;

        if (this.state.isLoggedIn && this.state.user) {
            const firstName = this.state.user.name ? this.state.user.name.split(' ')[0] : 'User';
            const avatarSrc = this.state.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName)}&background=E5C558&color=000&size=96`;
            
            // Dropdown HTML Structure
            headerBtn.innerHTML = `
                <div class="user-menu-container" style="position: relative;">
                    <button class="user-menu-btn" onclick="AUTH.toggleMenu()" title="Account Options">
                        <img src="${avatarSrc}" alt="User" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(firstName)}&background=E5C558&color=000&size=96'">
                        <span>${firstName}</span>
                        <span style="font-size: 0.8rem; opacity: 0.5;">▼</span>
                    </button>
                    
                    <!-- Dropdown Content (Hidden by default) -->
                    <div id="user-dropdown" class="user-dropdown-menu hidden">
                        <div class="dropdown-header">
                            <img src="${avatarSrc}" class="dropdown-avatar" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(firstName)}&background=E5C558&color=000&size=96'">
                            <div>
                                <div class="dropdown-name">${this.state.user.name || firstName}</div>
                                <div class="dropdown-email">${this.state.user.email || ''}</div>
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
            headerBtn.onclick = () => {
                if (typeof openAuthModal === 'function') openAuthModal();
                else window.location.href = 'index.html';
            };
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

// --- Cloud Sync Implementation ---
const SYNC = {
    debouncers: {},
    
    save: function(key, value) {
        if (!db) return;
        const currentUser = firebase.auth().currentUser;
        if (!currentUser) return;
        
        const docRef = db.collection('users').doc(currentUser.uid);
        
        let data = {};
        if (key === 'userTheme') {
            data.theme = value;
        } else if (key === 'myFocusWidgets') {
            data.widgets = value; // array
        } else if (key === 'workstack_notes') {
            data.notes = value; // string
        }
        
        docRef.set(data, { merge: true })
            .catch(err => console.error("Firestore sync error:", err));
    },

    saveDebounced: function(key, value, delay = 1000) {
        if (this.debouncers[key]) clearTimeout(this.debouncers[key]);
        this.debouncers[key] = setTimeout(() => {
            this.save(key, value);
        }, delay);
    }
};

// Listen to Firebase Auth state changes
if (typeof firebase !== 'undefined') {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            const userData = {
                name: user.displayName,
                email: user.email,
                avatar: user.photoURL,
                method: "google_oauth"
            };
            AUTH.state.isLoggedIn = true;
            AUTH.state.user = userData;
            localStorage.setItem('ws_session_v4', 'true');
            localStorage.setItem('ws_user_profile', JSON.stringify(userData));
            AUTH.updateHeader();

            // Sync from Firestore to LocalStorage
            const docRef = db.collection('users').doc(user.uid);
            docRef.get().then(doc => {
                if (doc.exists) {
                    const data = doc.data();
                    let needsUpdate = false;
                    
                    if (data.theme && localStorage.getItem('userTheme') !== data.theme) {
                        localStorage.setItem('userTheme', data.theme);
                        needsUpdate = true;
                    }
                    
                    let localWidgets = [];
                    try {
                        localWidgets = JSON.parse(localStorage.getItem('myFocusWidgets') || '[]');
                    } catch(e) {}
                    
                    if (data.widgets && JSON.stringify(data.widgets) !== JSON.stringify(localWidgets)) {
                        localStorage.setItem('myFocusWidgets', JSON.stringify(data.widgets));
                        needsUpdate = true;
                    }
                    if (data.notes && localStorage.getItem('workstack_notes') !== data.notes) {
                        localStorage.setItem('workstack_notes', data.notes);
                        needsUpdate = true;
                    }
                    
                    if (needsUpdate) {
                        // Apply changes without reloading the page if possible
                        if (window.setTheme && data.theme) {
                            window.setTheme(data.theme);
                        }
                        if (window.renderFocusDesk) {
                            if (typeof myWidgets !== 'undefined') {
                                myWidgets = data.widgets;
                            }
                            window.renderFocusDesk();
                        }
                        const notesArea = document.getElementById('sticky-note');
                        if (notesArea && data.notes) {
                            notesArea.value = data.notes;
                        }
                    }
                } else {
                    // Seed Firestore document with current localstorage data
                    let localWidgets = [];
                    try {
                        localWidgets = JSON.parse(localStorage.getItem('myFocusWidgets') || '[]');
                    } catch(e) {}

                    const initialData = {
                        theme: localStorage.getItem('userTheme') || 'midnight',
                        widgets: localWidgets,
                        notes: localStorage.getItem('workstack_notes') || ''
                    };
                    docRef.set(initialData);
                }
            }).catch(err => {
                console.error("Error fetching Firestore user config:", err);
            });
        } else {
            // Keep session alive if logged in via dev bypass
            const profile = JSON.parse(localStorage.getItem('ws_user_profile') || 'null');
            if (profile && profile.method === 'dev_bypass') {
                AUTH.state.isLoggedIn = true;
                AUTH.state.user = profile;
                AUTH.updateHeader();
                return;
            }

            AUTH.state.isLoggedIn = false;
            AUTH.state.user = null;
            localStorage.removeItem('ws_session_v4');
            localStorage.removeItem('ws_user_profile');
            AUTH.updateHeader();
        }
    });
}
