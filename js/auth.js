const AUTH = {
    state: {
        isLoggedIn: localStorage.getItem('ws_isLoggedIn') === 'true',
        user: JSON.parse(localStorage.getItem('ws_user') || 'null')
    },

    // --- Core Actions ---

    loginWithGoogle: function () {
        return new Promise((resolve) => {
            // Simulate API Call
            setTimeout(() => {
                const user = {
                    name: "Ayush Rana",
                    email: "ayushamit007@gmail.com",
                    avatar: "https://ui-avatars.com/api/?name=Ayush+Rana&background=10b981&color=fff",
                    method: "google"
                };
                this._saveSession(user);
                resolve(user);
            }, 1500); // 1.5s delay for realism
        });
    },

    loginWithPhone: function (number, otp) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (otp === "1234") {
                    const user = {
                        name: "Mobile User",
                        phone: number,
                        avatar: "https://ui-avatars.com/api/?name=Mobile+User&background=6366f1&color=fff",
                        method: "phone"
                    };
                    this._saveSession(user);
                    resolve(user);
                } else {
                    reject("Invalid OTP");
                }
            }, 1000);
        });
    },

    logout: function () {
        localStorage.removeItem('ws_isLoggedIn');
        localStorage.removeItem('ws_user');
        this.state.isLoggedIn = false;
        this.state.user = null;
        window.location.reload();
    },

    // --- Internals ---

    _saveSession: function (user) {
        localStorage.setItem('ws_isLoggedIn', 'true');
        localStorage.setItem('ws_user', JSON.stringify(user));
        this.state.isLoggedIn = true;
        this.state.user = user;
    },

    // --- Admin Backdoor ---
    checkAdminBypass: function () {
        const urlParams = new URLSearchParams(window.location.search);
        // Magic Secret: 'workstack_admin_vip'
        if (urlParams.get('access_token') === 'workstack_admin_vip') {
            console.log("Admin Access Granted 🔓");
            localStorage.setItem('hasPaid', 'true');
            alert("Admin Access Unlocked! Welcome, Creator.");

            // Clean URL
            const newUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);

            // If on payment page, redirect
            if (window.location.pathname.includes('payment.html')) {
                window.location.href = 'roles.html';
            }
        }
    },

    // --- UI Helpers ---

    checkProtection: function () {
        if (!this.state.isLoggedIn) {
            window.location.href = "index.html?auth_required=true";
        }
    },

    updateHeader: function () {
        const headerBtn = document.getElementById('auth-trigger');
        if (!headerBtn) return;

        if (this.state.isLoggedIn) {
            headerBtn.innerHTML = `
                <div class="user-chip" onclick="AUTH.logout()" title="Click to Logout">
                    <img src="${this.state.user.avatar}" alt="User">
                    <span>${this.state.user.name.split(' ')[0]}</span>
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
    AUTH.updateHeader();
    AUTH.checkAdminBypass();
});

// Auto-run logic on protected pages
if (window.location.pathname.includes('payment.html') || window.location.pathname.includes('roles.html') || window.location.pathname.includes('workspace.html')) {
    AUTH.checkProtection();
}
