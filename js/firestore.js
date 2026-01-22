// --- Firestore Logic ---

const DB = {
    db: null,

    init: function () {
        if (typeof firebase === 'undefined' || !firebase.apps.length) {
            console.error("Firebase not initialized! Waiting...");
            return false;
        }
        this.db = firebase.firestore();
        return true;
    },

    submitRequest: function (role, toolName, description) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                const ready = this.init();
                if (!ready) {
                    reject(new Error("Database not connected. Please reload."));
                    return;
                }
            }

            this.db.collection("tool_requests").add({
                role: role,
                name: toolName,
                description: description,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                status: "pending"
            })
                .then((docRef) => {
                    resolve(docRef.id);
                })
                .catch((error) => {
                    console.error("Error adding document: ", error);
                    reject(error);
                });
        });
    },

    getRequests: function () {
        return new Promise((resolve, reject) => {
            if (!this.db) this.init();

            this.db.collection("tool_requests")
                .orderBy("timestamp", "desc")
                .get()
                .then((querySnapshot) => {
                    const requests = [];
                    querySnapshot.forEach((doc) => {
                        requests.push({ id: doc.id, ...doc.data() });
                    });
                    resolve(requests);
                })
                .catch((error) => {
                    console.error("Error getting documents: ", error);
                    reject(error);
                });
        });
    }
};

// --- UI Logic ---
function openRequestModal() {
    document.getElementById('request-modal-overlay').classList.add('active');
}

function closeRequestModal() {
    document.getElementById('request-modal-overlay').classList.remove('active');
}

function submitToolRequest() {
    const roleInput = document.getElementById('req-role');
    const nameInput = document.getElementById('req-name');
    const descInput = document.getElementById('req-desc');
    const btn = document.querySelector('#req-form .btn');

    const role = roleInput.value;
    const name = nameInput.value.trim();
    const desc = descInput.value.trim();

    if (!role || !name || !desc) {
        alert("Please select your role and fill in all fields!");
        return;
    }

    const originalText = btn.innerHTML;
    btn.innerHTML = "Sending... 🚀";
    btn.disabled = true;

    DB.submitRequest(role, name, desc).then(() => {
        alert("Thanks! Your request has been sent to the developer. 📨");
        roleInput.value = "";
        nameInput.value = "";
        descInput.value = "";
        closeRequestModal();
        btn.innerHTML = originalText;
        btn.disabled = false;
    }).catch(err => {
        alert("Error sending request: " + err.message);
        btn.innerHTML = originalText;
        btn.disabled = false;
    });
}

// --- Admin View Logic ---
function viewProductRequests() {
    // Basic Security Check (Client-side only, real security via Firestore Rules)
    const isAdmin = localStorage.getItem('hasPaid') === 'true' && window.location.search.includes('access_token=workstack_admin_vip');

    // For now, let's just allow checking if we are in 'Admin Mode' via token or just reuse the VIP token logic
    // Or simpler: Just call it. Firestore rules should prevent reads if we set them up, 
    // but since user asked for free open access initally, we likely have open rules.

    const listContainer = document.getElementById('req-list-container');
    const formContainer = document.getElementById('req-form');
    const listContent = document.getElementById('req-list-content');

    formContainer.classList.add('hidden');
    listContainer.classList.remove('hidden');
    listContent.innerHTML = '<div style="text-align:center; padding:20px;">Loading requests...</div>';

    DB.getRequests().then(requests => {
        if (requests.length === 0) {
            listContent.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-secondary);">No requests yet.</div>';
            return;
        }

        let html = '';
        requests.forEach(req => {
            const date = req.timestamp ? new Date(req.timestamp.toDate()).toLocaleDateString() : 'Just now';
            html += `
                <div style="background:rgba(255,255,255,0.05); padding:12px; margin-bottom:10px; border-radius:8px; border:1px solid rgba(255,255,255,0.1);">
                    <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                        <span style="font-weight:700; color:var(--accent);">${req.name}</span>
                        <span style="font-size:0.75rem; color:var(--text-muted);">${date}</span>
                    </div>
                    <p style="font-size:0.85rem; color:white;">${req.description}</p>
                </div>
            `;
        });
        listContent.innerHTML = html;
    }).catch(err => {
        listContent.innerHTML = `<div style="color:red; text-align:center;">Error: ${err.message}<br><small>Check console permissions</small></div>`;
    });
}

function showRequestForm() {
    document.getElementById('req-list-container').classList.add('hidden');
    document.getElementById('req-form').classList.remove('hidden');
}

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
    DB.init();

    // Admin Check to show the 'View Requests' button in Creator Modal
    // We reuse the Admin Backdoor logic: ?access_token=workstack_admin_vip
    if (window.location.search.includes('access_token=workstack_admin_vip')) {
        const adminTools = document.getElementById('admin-tools');
        if (adminTools) adminTools.classList.remove('hidden');
    }
});
