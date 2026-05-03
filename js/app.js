/*
    WORKSTACK APPLICATION LOGIC
    v4.0 - Rewrite for performance
    Developer: Ayush Rana
*/

document.addEventListener('DOMContentLoaded', () => {
    // console.log("Init Workstack..."); // DEBUG

    // Router Logic
    const currentPath = window.location.pathname;

    // Route: Workspace
    if (currentPath.includes('workspace')) {
        // console.log("Loading Workspace...");
        checkAccess();
        renderWorkspace();
    }
    // Route: Roles (Reset state)
    else if (currentPath.includes('roles')) {
        // Fixing bug where student role stuck
        sessionStorage.removeItem('selectedRole');
        // console.log("Roles page loaded. Session cleared.");
    }
    // Route: Payment
    else if (currentPath.includes('payment')) {
        checkRoleSelection();
    }
    // Route: Fun Zone
    else if (currentPath.includes('fun-zone')) {
        renderFunZone();
    }

    // Role Selection Click Triggers
    const roleCards = document.querySelectorAll('.role-card');
    roleCards.forEach(card => {
        card.addEventListener('click', () => {
            const roleID = card.dataset.role;
            // console.log("Picked Role:", roleID);
            selectRole(roleID);
        });
    });

    // Payment Button Logic
    const btnPay = document.getElementById('pay-btn');
    if (btnPay) {
        btnPay.addEventListener('click', processPayment);
    }
});

/* --- State Management --- */
/* --- State Management --- */
function selectRole(role) {
    sessionStorage.setItem('selectedRole', role);
    window.location.href = 'workspace.html';
}

function checkRoleSelection() {
    // Legacy function removed or emptied to prevent auto-redirects
}

function processPayment() {
    const btn = document.getElementById('pay-btn');
    btn.textContent = 'Processing...';
    btn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        localStorage.setItem('hasPaid', 'true');
        sessionStorage.removeItem('selectedRole'); // Force re-selection
        window.location.href = 'roles.html';
    }, 1500);
}

function checkAccess() {
    const role = sessionStorage.getItem('selectedRole');

    if (!role) {
        window.location.href = 'roles.html';
    }
}

function renderFunZone() {
    const data = APP_DATABASE_V2['fun_zone'];

    // Render Web Games
    const gamesContainer = document.getElementById('games-grid');
    if (gamesContainer) {
        gamesContainer.innerHTML = data.games.map(game => `
            <div class="tool-card">
                 <div class="tool-header">
                    <span class="tool-tag">${game.category}</span>
                </div>
                <h4>${game.name}</h4>
                <p>${game.desc}</p>
                <a href="${game.url}" target="_blank" class="btn-outline" style="display:block; text-align:center; padding: 8px; border-radius: 4px; font-size: 0.9rem;">Play Now ↗</a>
            </div>
        `).join('');
    }

    // Render Platforms
    const platformsContainer = document.getElementById('platforms-grid');
    if (platformsContainer && data.platforms) {
        platformsContainer.innerHTML = data.platforms.map(p => `
            <div class="tool-card" style="border-color: rgba(255,255,255,0.1);">
                 <div class="tool-header">
                    <span class="tool-tag" style="background:var(--accent); color:black;">${p.category}</span>
                </div>
                <h4>${p.name}</h4>
                <p>${p.desc}</p>
                <a href="${p.url}" target="_blank" class="btn btn-outline" style="width:100%; justify-content:center;">Visit ↗</a>
            </div>
        `).join('');
    }

    // Render Portals
    const portalsContainer = document.getElementById('portals-grid');
    if (portalsContainer && data.portals) {
        portalsContainer.innerHTML = data.portals.map(p => `
            <div class="tool-card" style="border-color: rgba(229, 197, 88, 0.4); background: rgba(229, 197, 88, 0.05);">
                 <div class="tool-header">
                    <span class="tool-tag" style="background:var(--accent); color:black;">${p.category}</span>
                </div>
                <h4>${p.name}</h4>
                <p>${p.desc}</p>
                <a href="${p.url}" target="_blank" class="btn btn-outline" style="width:100%; justify-content:center;">Open Portal ↗</a>
            </div>
        `).join('');
    }

    // Init Search for Fun Zone
    initSearch(data);
}

/* --- Workspace Rendering --- */
function renderWorkspace() {
    const roleKey = sessionStorage.getItem('selectedRole');
    const data = APP_DATABASE_V2[roleKey];

    if (!data) return;

    try {
        // Sets Headers with Greeting
        const hour = new Date().getHours();
        let greeting = "Welcome back";
        if (hour < 12) greeting = "Good morning";
        else if (hour < 18) greeting = "Good afternoon";
        else greeting = "Good evening";

        // Get Name from correct localStorage key
        let displayName = "there";
        try {
            const userStr = localStorage.getItem('ws_user_profile');
            if (userStr) {
                const user = JSON.parse(userStr);
                if (user.name) displayName = user.name.split(' ')[0];
            }
        } catch (e) {
            console.error("Name fetch error", e);
        }

        document.getElementById('workspace-title').innerHTML = `${greeting}, <span style="color:var(--accent);">${displayName}</span> 👋`;
        document.getElementById('workspace-desc').textContent = data.description;

        // Render AI Decision Zone
        const aiContainer = document.getElementById('ai-zone-grid');
        if (aiContainer && data.ai_tools) {
            aiContainer.innerHTML = data.ai_tools.map((tool, index) => `
                <div class="tool-card ai-decision-card" style="animation-delay: ${(index * 0.05) + 0.2}s;">
                    <div class="tool-header">
                        <span class="tool-tag">${tool.bestFor}</span>
                        ${tool.pricing ? `<span class="pricing-tag ${tool.pricing.toLowerCase()}">${tool.pricing}</span>` : ''}
                    </div>
                    <h4>${tool.title}</h4>
                    <p>${tool.desc}</p>
                    <a href="${tool.url}" target="_blank" class="btn-outline" style="font-size: 0.8rem; width: 100%;">Open ${tool.toolName} ↗</a>
                </div>
            `).join('');
        }

