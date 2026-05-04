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

        // Render Native Tools Sidebar/Grid
        const nativeContainer = document.getElementById('native-tools-grid');
        if (nativeContainer && data.native_tools) {
            nativeContainer.innerHTML = data.native_tools.map((tool, index) => `
                <div class="tool-card" onclick="loadNativeTool('${tool.id}')" style="cursor: pointer; animation-delay: ${index * 0.05}s;">
                    <div class="tool-header">
                        <span style="font-size: 1.5rem;">${tool.icon}</span>
                        <span class="pricing-tag free">Free</span>
                    </div>
                    <h4>${tool.name}</h4>
                    <div style="margin-top:auto;">
                        <button class="btn-outline" style="width:100%; justify-content:center; margin-top:10px;" onclick="event.stopPropagation(); loadNativeTool('${tool.id}')">Open Tool</button>
                    </div>
                </div>
            `).join('');
        }

        // Render External Tools
        const extContainer = document.getElementById('external-tools-grid');
        if (extContainer && data.external_tools) {
            extContainer.innerHTML = data.external_tools.map((tool, index) => `
                <div class="tool-card" style="animation-delay: ${(index * 0.05) + 0.4}s;">
                    <div class="tool-header">
                        <span class="tool-tag">${tool.category}</span>
                        ${tool.pricing ? `<span class="pricing-tag ${tool.pricing.toLowerCase()}">${tool.pricing}</span>` : ''}
                    </div>
                    <h4>${tool.name}</h4>
                    <p>External Resource</p>
                    <a href="${tool.url}" target="_blank" class="btn-outline" style="display:block; text-align:center; padding: 8px; border-radius: 4px; font-size: 0.9rem;">Launch ↗</a>
                </div>
            `).join('');
        }

        // Initialize Search Listener with Data
        initSearch(data);

        // Initialize Focus Desk (Custom)
        initFocusDesk(data);

        if (roleKey === 'custom') {
            renderCustomWorkspaceMode();
        }

        // Apply Premium Animations
        setTimeout(applyVisualEffects, 100);
        setTimeout(initSpotlightEffect, 200);

    } catch (e) {
        console.error("Workspace Render Error:", e);
        document.getElementById('workspace-title').textContent = "System Error";
        document.getElementById('workspace-desc').textContent = "Could not load workspace configuration. Please refresh.";
    }
}

/* --- Theme Switcher Logic --- */
const THEMES = {
    midnight: { class: '', bg: '#020202', accent: '#E5C558' },
    cyberpunk: { class: 'theme-bg-cyberpunk', bg: '#050a14', accent: '#00f3ff' },
    forest: { class: 'theme-bg-forest', bg: '#051405', accent: '#4ade80' },
    sunset: { class: 'theme-bg-sunset', bg: '#1a0505', accent: '#f43f5e' },
    snow: { class: 'theme-bg-snow', bg: '#0B1026', accent: '#60a5fa' }
};

/* --- Mouse Spotlight Effect (The "Magic") --- */
function initSpotlightEffect() {
    const cards = document.querySelectorAll('.tool-card');
    cards.forEach(card => {
        card.onmousemove = e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        };
    });
}

window.setTheme = function (themeName) {
    const theme = THEMES[themeName];
    if (!theme) return;

    // Reset Classes
    document.body.className = '';

    // Apply Class
    if (theme.class) {
        document.body.classList.add(theme.class);
    } else {
        // Default Midnight fallback
        document.body.style.background = theme.bg;
    }

    // Apply Colors
    document.documentElement.style.setProperty('--bg-primary', theme.bg);
    // For realistic image themes, we make the cards slightly more transparent
    const glassBg = theme.class ? 'rgba(0, 0, 0, 0.6)' : 'rgba(20, 20, 20, 0.7)';
    document.documentElement.style.setProperty('--bg-glass', glassBg);

    document.documentElement.style.setProperty('--accent', theme.accent);
    document.documentElement.style.setProperty('--accent-glow', `${theme.accent}40`);

    localStorage.setItem('userTheme', themeName);
    if (typeof SYNC !== 'undefined') {
        SYNC.save('userTheme', themeName);
    }
}

// Load Theme on Init
const savedTheme = localStorage.getItem('userTheme');
// Default to Midnight if nothing saved
if (savedTheme) {
    setTheme(savedTheme);
} else {
    setTheme('midnight');
}

function renderCustomWorkspaceMode() {
    // 1. Unhide Focus Desk immediately as it's the hero
    document.getElementById('focus-desk-section').classList.remove('hidden');

    // 2. Hide standard sections initially
    document.querySelector('.dashboard .section-header').innerHTML = `<div class="section-title">📦 Tool Library</div><span style="font-size:0.8rem; color:var(--text-secondary);">ADD TO YOUR DESK</span>`;

    // Hide the static headers for Native/External to avoid empty gaps
    if (document.getElementById('header-native')) document.getElementById('header-native').style.display = 'none';
    if (document.getElementById('header-external')) document.getElementById('header-external').style.display = 'none';

    document.getElementById('ai-zone-grid').innerHTML = '';
    document.getElementById('native-tools-grid').innerHTML = '';
    document.getElementById('external-tools-grid').innerHTML = '';

    // 3. Populate "App Store" Grid (Native + External)
    const appStoreContainer = document.getElementById('ai-zone-grid');
    appStoreContainer.className = "tool-grid";

    // Aggregate ALL tools
    const allNative = [
        ...APP_DATABASE_V2.student.native_tools,
        ...APP_DATABASE_V2.freelancer.native_tools,
        ...APP_DATABASE_V2.creator.native_tools
    ];
    const uniqueNative = Array.from(new Map(allNative.map(item => [item.id, item])).values());

    const allExternal = [
        ...APP_DATABASE_V2.student.external_tools,
        ...APP_DATABASE_V2.freelancer.external_tools,
        ...APP_DATABASE_V2.creator.external_tools,
        ...APP_DATABASE_V2.fun_zone.games, // Why not?
    ];
    // De-duplicate URLs
    const uniqueExternal = Array.from(new Map(allExternal.map(item => [item.url, item])).values());

    // Generate HTML
    let storeHTML = '';

    // Native Section
    storeHTML += uniqueNative.map(tool => `
        <div class="tool-card">
            <div class="tool-header">
                <span style="font-size: 1.5rem;">${tool.icon}</span>
                <button class="btn-outline" style="font-size:0.7rem; padding:4px 8px; margin-left:auto;" onclick="addNativeWidget('${tool.id}', '${tool.name}')">+ Pin</button>
            </div>
            <h4>${tool.name}</h4>
            <div style="margin-top:auto;">
                <button class="btn btn-outline" style="width:100%;" onclick="loadNativeTool('${tool.id}')">Open</button>
            </div>
        </div>
    `).join('');

    // External Section
    storeHTML += uniqueExternal.map(tool => `
        <div class="tool-card">
            <div class="tool-header">
                <span style="font-size: 1.5rem;">🔗</span>
                <span class="tool-tag">${tool.category || 'Link'}</span>
                <button class="btn-outline" style="font-size:0.7rem; padding:4px 8px; margin-left:auto;" onclick="addLinkWidget('${tool.url}', '${tool.name}')">+ Pin</button>
            </div>
            <h4>${tool.name}</h4>
            <div style="margin-top:auto;">
                <button class="btn btn-outline" style="width:100%;" onclick="window.open('${tool.url}')">Visit ↗</button>
