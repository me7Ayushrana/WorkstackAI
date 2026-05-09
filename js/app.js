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
            </div>
        </div>
    `).join('');

    appStoreContainer.innerHTML = storeHTML;

    // 4. Update Description
    document.getElementById('workspace-desc').innerHTML = `
        Welcome to your personal dashboard.<br>
        <span style="color:var(--accent);">Pin tools</span> from below or <span style="color:var(--accent);">Add Widgets</span> to build your flow.
    `;
}

// Helper to add external link widget quickly
window.addLinkWidget = function (url, name) {
    if (myWidgets.find(w => w.url === url)) {
        return alert("Link already pinned!");
    }
    myWidgets.push({ type: 'link', name, url });
    saveWidgets();
    renderFocusDesk();
    document.getElementById('focus-desk-section').scrollIntoView({ behavior: 'smooth' });
}

// Global Helper to add pinned widget
window.addNativeWidget = function (id, name) {
    // Check duplication
    if (myWidgets.find(w => w.id === id)) {
        alert("Tool already pinned!");
        return;
    }
    myWidgets.push({ type: 'tool', id, name });
    saveWidgets();
    renderFocusDesk();

    // Scroll to top
    document.getElementById('focus-desk-section').scrollIntoView({ behavior: 'smooth' });
}

/* --- My Focus Desk Logic --- */
let myWidgets = [];

function initFocusDesk(roleData) {
    const section = document.getElementById('focus-desk-section');
    if (!section) return;

    // Load from LocalStorage
    const stored = localStorage.getItem('myFocusWidgets');
    if (stored) {
        try {
            myWidgets = JSON.parse(stored);
            
            // Remove 24h Focus Radio
            myWidgets = myWidgets.filter(w => w.name !== '24h Focus Radio' && w.url !== 'https://www.youtube.com/watch?v=jfKfPfyJRdk');
            
            // Remove Designed By Ayush widget
            myWidgets = myWidgets.filter(w => !w.name?.includes('Designed By Ayush') && w.url !== 'https://ayushhh-folio.netlify.app');
            
            // Replace Gemini AI with Claude AI
            let hasClaude = false;
            myWidgets = myWidgets.map(w => {
                if (w.name === 'Gemini AI' || w.url === 'https://gemini.google.com') {
                    hasClaude = true;
                    return { type: 'link', url: 'https://claude.ai', name: 'Claude AI' };
                }
                if (w.name === 'Claude AI' || w.url === 'https://claude.ai') {
                    hasClaude = true;
                }
                return w;
            });
            
            if (!hasClaude) {
                const insertIdx = Math.min(2, myWidgets.length);
                myWidgets.splice(insertIdx, 0, { type: 'link', url: 'https://claude.ai', name: 'Claude AI' });
            }
            saveWidgets();
        } catch (e) {
            console.error("Migration error", e);
        }
    } else {
        // Default widgets for first time — clean, no personal branding
        myWidgets = [
            { type: 'tool', id: 'pomodoro', name: 'Deep Focus Timer' },
            { type: 'tool', id: 'music-player', name: 'YouTube Media Player' },
            { type: 'link', url: 'https://claude.ai', name: 'Claude AI' },
            { type: 'tool', id: 'soundboard', name: 'Ambient Sound Mixer' }
        ];
        saveWidgets();
    }

    // Force-inject YouTube Media Player if missing (Migration Fix)
    const hasMusicWidget = myWidgets.some(w => w.id === 'music-player');
    if (!hasMusicWidget) {
        myWidgets.unshift({
            type: 'tool',
            id: 'music-player',
            name: 'YouTube Media Player'
        });
        saveWidgets();
    }

    // Update stats badge
    if (typeof updateFocusDeskStats === 'function') {
        updateFocusDeskStats();
    }

    renderFocusDesk();
    section.classList.remove('hidden');
}

// Helper to render move controls for widgets
function renderMoveControls(index) {
    return `
        <button class="widget-control-btn" onclick="event.stopPropagation(); moveWidget(${index}, -1)" title="Move Left">←</button>
        <button class="widget-control-btn" onclick="event.stopPropagation(); moveWidget(${index}, 1)" title="Move Right">→</button>
    `;
}

// Helper to render a tool widget
function renderToolWidget(widget, index) {
    return `
        <div class="tool-card widget-card" onclick="loadNativeTool('${widget.id}')">
            <div class="widget-controls">
                ${renderMoveControls(index)}
                <button class="widget-control-btn delete" onclick="event.stopPropagation(); deleteWidget(${index})" title="Remove">✕</button>
            </div>
            <div class="tool-header">
                <span style="font-size: 1.5rem;">🛠️</span>
                <span class="pricing-tag free">Native</span>
            </div>
            <h4>${widget.name}</h4>
            <div style="margin-top:auto;">
                <button class="btn btn-outline" style="width:100%;">Open Tool</button>
            </div>
        </div>
    `;
}

// Helper to render a link widget
function renderLinkWidget(widget, index) {
    // Check for special premium flag or specific name
    const specialClass = widget.isPremium || widget.name.includes('Ayush') ? 'premium-link-card' : '';
    const specialLabel = widget.isPremium || widget.name.includes('Ayush') ? 'CREATOR' : 'LINK';

    return `
        <div class="tool-card widget-card ${specialClass}" onclick="window.open('${widget.url}', '_blank')">
            <div class="widget-controls">
                ${renderMoveControls(index)}
                <button class="widget-control-btn delete" onclick="event.stopPropagation(); deleteWidget(${index})" title="Remove">✕</button>
            </div>
            <div class="tool-header">
                <div class="tool-icon" style="background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; border-radius: 50%; width: 40px; height: 40px;">
                    ${widget.name.includes('Ayush') ? '<img src="https://github.com/me7Ayuhrana.png" style="width:100%; height:100%; border-radius:50%;">' : '🔗'}
                </div>
                <span class="pricing-tag" style="${widget.name.includes('Ayush') ? 'background:linear-gradient(45deg, #FFD700, #FFA500); color:black;' : ''}">${specialLabel}</span>
            </div>
            <div class="tool-body">
                <h4>${widget.name}</h4>
                <p style="font-size: 0.9rem; opacity: 0.7;">${widget.name.includes('Ayush') ? 'Know more about me & my work.' : 'External Resource'}</p>
            </div>
            <button class="btn btn-outline" style="width:100%; margin-top:auto;">Visit Link ↗</button>
        </div>
    `;
}

function renderFocusDesk() {
    const grid = document.getElementById('focus-desk-grid');
    if (!grid) return;

    // Clear grid but keep the "Add" button (which is the last child usually or we re-append it)
    // Actually simpler to just rebuild string

    // 1. Generate Widget HTML
    const widgetsHTML = myWidgets.map((w, index) => {
        let content = '';
        let action = '';

        if (w.type === 'tool') {
            content = `
                <div class="tool-header">
                    <span style="font-size: 1.5rem;">🛠️</span>
                    <span class="pricing-tag free">Native</span>
                </div>
                <h4>${w.name}</h4>
                <div style="margin-top:auto;">
                    <button class="btn btn-outline" style="width:100%;">Open Tool</button>
                </div>
            `;
            action = `loadNativeTool('${w.id}')`;
        } else {
            content = `
                <div class="tool-header">
                    <span style="font-size: 1.5rem;">🔗</span>
                    <span class="pricing-tag">Link</span>
                </div>
                <h4>${w.name}</h4>
                <div style="margin-top:auto;">
                    <button class="btn btn-outline" style="width:100%;">Visit Link ↗</button>
                </div>
            `;
            action = `window.open('${w.url}', '_blank')`;
        }

        return `
            <div class="tool-card widget-card" onclick="${action}">
                <div class="widget-controls">
                    <button class="widget-control-btn" onclick="event.stopPropagation(); moveWidget(${index}, -1)" title="Move Left">←</button>
                    <button class="widget-control-btn delete" onclick="event.stopPropagation(); deleteWidget(${index})" title="Remove">✕</button>
                    <button class="widget-control-btn" onclick="event.stopPropagation(); moveWidget(${index}, 1)" title="Move Right">→</button>
                </div>
                ${content}
            </div>
        `;
    }).join('');

    // 2. Add Button HTML
    const addBtnHTML = `
        <div class="tool-card add-widget-card" onclick="openWidgetModal()">
            <div style="font-size: 2rem; color: var(--text-secondary);">+</div>
            <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 5px;">Add Widget</p>
        </div>
    `;

    grid.innerHTML = widgetsHTML + addBtnHTML;
    
    // Re-initialize animations for dynamic widgets
    setTimeout(() => {
        if (typeof applyVisualEffects === 'function') applyVisualEffects();
        if (typeof initSpotlightEffect === 'function') initSpotlightEffect();
    }, 50);
}

function saveWidgets() {
    localStorage.setItem('myFocusWidgets', JSON.stringify(myWidgets));
    if (typeof SYNC !== 'undefined') {
        SYNC.save('myFocusWidgets', myWidgets);
    }
}

// Global Widget Functions
// Global Widget Functions
window.deleteWidget = function (index) {
    openConfirmModal({
        title: "Remove Widget?",
        message: "Are you sure you want to remove this from your Focus Desk?",
        onConfirm: () => {
            myWidgets.splice(index, 1);
            saveWidgets();
            renderFocusDesk();
        }
    });
}

window.moveWidget = function (index, direction) {
    const newIndex = index + direction;
    // Bounds check
    if (newIndex < 0 || newIndex >= myWidgets.length) return;

    // Swap
    const temp = myWidgets[index];
    myWidgets[index] = myWidgets[newIndex];
    myWidgets[newIndex] = temp;

    saveWidgets();
    renderFocusDesk();
}

// Modal Logic
window.openWidgetModal = function () {
    document.getElementById('widget-modal-overlay').classList.add('active');
}
window.closeWidgetModal = function () {
    document.getElementById('widget-modal-overlay').classList.remove('active');
}

/* --- Generic Confirmation Modal Logic --- */
let currentConfirmAction = null;

window.openConfirmModal = function ({ title, message, onConfirm }) {
    const overlay = document.getElementById('confirm-modal-overlay');
    if (!overlay) {
        // Fallback if HTML is missing
        if (confirm(message)) onConfirm();
        return;
    }
    document.getElementById('confirm-title').innerText = title;
    document.getElementById('confirm-msg').innerText = message;

    currentConfirmAction = onConfirm;

    // Bind Action (Once)
    const btn = document.getElementById('confirm-btn-action');
    btn.onclick = () => {
        if (currentConfirmAction) currentConfirmAction();
        closeConfirmModal();
    };

    overlay.classList.add('active');
}

window.closeConfirmModal = function () {
    document.getElementById('confirm-modal-overlay').classList.remove('active');
    currentConfirmAction = null;
}

let activeWidgetTab = 'link';
window.switchWidgetTab = function (tab) {
    activeWidgetTab = tab;
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(`tab-${tab}`).classList.add('active');

    if (tab === 'link') {
        document.getElementById('widget-form-link').classList.remove('hidden');
        document.getElementById('widget-form-tool').classList.add('hidden');
    } else {
        document.getElementById('widget-form-link').classList.add('hidden');
        document.getElementById('widget-form-tool').classList.remove('hidden');
    }
}

window.confirmAddWidget = function () {
    // Limits removed - completely free app

    if (activeWidgetTab === 'link') {
        const name = document.getElementById('w-name').value;
        const url = document.getElementById('w-url').value;
        if (!name || !url) return alert("Please enter name and URL");

        myWidgets.push({ type: 'link', name, url });
    } else {
        const select = document.getElementById('w-tool-select');
        const id = select.value;
        const name = select.options[select.selectedIndex].text.replace('🧠 ', '').replace('📋 ', '').replace('📊 ', '').replace('🧮 ', ''); // Clean emoji

        if (!id) return alert("Select a tool");
        myWidgets.push({ type: 'tool', id, name });
    }

    saveWidgets();
    renderFocusDesk();
    closeWidgetModal();

    // Clear inputs
    document.getElementById('w-name').value = '';
    document.getElementById('w-url').value = '';
}

/* --- Search & Suggestions Logic --- */
let searchableTerms = [];

function initSearch(data) {
    const searchInput = document.getElementById('tool-search');
    const suggestionBox = document.getElementById('search-suggestions');
    if (!searchInput) return;

    // Collect all terms for autocomplete
    searchableTerms = [];

    // Store URL/ID for direct action
    const addTerm = (term, type, actionData) => {
        if (!term) return;
        const exists = searchableTerms.find(t => t.text.toLowerCase() === term.toLowerCase());
        if (!exists) {
            searchableTerms.push({
                text: term,
                type: type,
                url: actionData?.url,
                startId: actionData?.id
            });
        }
    };

    // Event Listeners
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        filterTools(query);
        showSuggestions(query);
    });

    // Close suggestions on click outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            if (suggestionBox) suggestionBox.classList.add('hidden');
        }
    });

    // Process Data for Search
    if (data.ai_tools) {
        data.ai_tools.forEach(t => {
            addTerm(t.toolName, 'AI Tool', { url: t.url });
            addTerm(t.bestFor, 'Category');
        });
        data.external_tools.forEach(t => {
            addTerm(t.name, 'External', { url: t.url });
            addTerm(t.category, 'Category');
        });
        data.native_tools.forEach(t => {
            addTerm(t.name, 'Native', { id: t.id });
        });
    }

    // Process Fun Zone specific data
    if (data.games) {
        data.games.forEach(g => {
            addTerm(g.name, 'Game', { url: g.url });
            addTerm(g.category, 'Category');
        });
    }
    if (data.platforms) {
        data.platforms.forEach(p => {
            addTerm(p.name, 'Platform', { url: p.url });
        });
    }
    if (data.portals) {
        data.portals.forEach(p => {
            addTerm(p.name, 'Portal', { url: p.url });
        });
    }
}

function showSuggestions(query) {
    const box = document.getElementById('search-suggestions');
    if (!box) return;

    if (!query || query.length < 1) {
        box.classList.add('hidden');
        return;
    }

    const matches = searchableTerms
        .filter(term => term.text.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5);

    if (matches.length > 0) {
        box.innerHTML = matches.map(m => `
            <div class="suggestion-item" onclick="applySuggestion('${m.text.replace(/'/g, "\\'")}')">
                <span>${m.text}</span>
                <span style="font-size:0.7rem; opacity:0.5; border:1px solid currentColor; padding:2px 4px; border-radius:4px;">${m.type}</span>
            </div>
        `).join('');
        box.classList.remove('hidden');
    } else {
        box.classList.add('hidden');
    }
}

// Global scope for visual onclick
window.applySuggestion = function (text) {
    const input = document.getElementById('tool-search');
    const termObj = searchableTerms.find(t => t.text === text);

    // ACTION: If it matches a tool with a URL/ID, execute immediately
    if (termObj) {
        if (termObj.url) {
            window.open(termObj.url, '_blank');
            return;
        }
        if (termObj.startId) {
            loadNativeTool(termObj.startId);
            // Scroll to native tool area
            document.getElementById('active-tool-container').scrollIntoView({ behavior: 'smooth' });
            document.getElementById('search-suggestions').classList.add('hidden');
            return;
        }
    }

    // Default: Just filter
    input.value = text;
    filterTools(text);
    document.getElementById('search-suggestions').classList.add('hidden');
}

/* --- Visual Effects (New) --- */
function applyVisualEffects() {
    const cards = document.querySelectorAll('.tool-card');

    cards.forEach((card, index) => {
        // 1. Staggered Animation Delay
        card.style.animationDelay = `${index * 50}ms`;

