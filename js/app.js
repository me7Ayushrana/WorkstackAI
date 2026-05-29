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

        // 2. 3D Tilt Effect on Mouse Move
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg tilt
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        // Reset on Leave
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
        });
    });
}

function filterTools(query) {
    const allCards = document.querySelectorAll('.tool-card');
    const lowerQuery = query.toLowerCase();
    let visibleCount = 0;

    allCards.forEach(card => {
        const title = card.querySelector('h4')?.textContent.toLowerCase() || "";
        const desc = card.querySelector('p')?.textContent.toLowerCase() || "";
        const tag = card.querySelector('.tool-tag')?.textContent.toLowerCase() || "";

        const isVisible = (card.style.display !== 'none');
        const shouldBeVisible = (title.includes(lowerQuery) || desc.includes(lowerQuery) || tag.includes(lowerQuery));

        if (shouldBeVisible) {
            visibleCount++;
            if (!isVisible) {
                card.style.display = 'flex';
                card.style.animation = 'fadeIn 0.3s ease-out';
            }
        } else {
            if (isVisible) {
                card.style.display = 'none';
            }
        }
    });

    // Handle "No Results"
    const noResults = document.getElementById('no-results');
    const sections = document.querySelectorAll('.section-header');

    if (visibleCount === 0) {
        if (noResults) noResults.classList.remove('hidden');
        sections.forEach(s => s.classList.add('hidden'));
    } else {
        if (noResults) noResults.classList.add('hidden');
        sections.forEach(s => s.classList.remove('hidden'));
    }
}


/* --- Native Tools Implementation --- */
/* --- Native Tools Implementation (Tabbed) --- */
let openTools = []; // Array of { id, name }
let activeToolId = null;

window.loadNativeTool = function (toolId) {
    if (!toolId) return;

    // 0. Ensure Data is Loaded
    if (typeof APP_DATABASE_V2 === 'undefined') {
        alert("Error: Tool Data not loaded. Please refresh.");
        return;
    }

    // 1. Ensure DOM Elements Exist (Self-Healing due to potential Cache issues)
    let container = document.getElementById('active-tool-container');

    // Fallback for cache mismatch (if user still has old ID but new JS)
    if (!container) {
        container = document.getElementById('active-tool-display');
        if (container) {
            // Upgrade old container to new structure dynamically
            container.id = 'active-tool-container';
            container.className = 'native-tool-container hidden';
        }
    }

    if (!container) {
        // Create from scratch if totally missing
        container = document.createElement('div');
        container.id = 'active-tool-container';
        container.className = 'hidden';
        container.style.marginBottom = '40px';

        // Inject after search container or at top
        const search = document.querySelector('.search-container');
        if (search && search.parentNode) search.parentNode.insertBefore(container, search.nextSibling);
        else {
            const main = document.querySelector('.container');
            if (main) main.prepend(container);
        }
    }

    // Ensure Tabs/Content structure exists
    let tabsContainer = document.getElementById('active-tool-tabs');
    let contentContainer = document.getElementById('active-tool-content');

    if (!tabsContainer || !contentContainer) {
        container.innerHTML = `
             <div id="active-tool-tabs" class="tool-tabs"></div>
             <div id="active-tool-content" class="tool-content-area native-tool-container"></div>
        `;
        tabsContainer = document.getElementById('active-tool-tabs');
        contentContainer = document.getElementById('active-tool-content');
    }

    // 2. Check if already open
    const exists = openTools.find(t => t.id === toolId);

    // Show container
    container.classList.remove('hidden');
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (exists) {
        switchToolTab(toolId);
        return;
    }

    // 3. Get Tool Name
    let toolName = "Tool";
    const allTools = [
        ...APP_DATABASE_V2.student.native_tools,
        ...APP_DATABASE_V2.freelancer.native_tools,
        ...APP_DATABASE_V2.creator.native_tools
    ];
    const original = allTools.find(t => t.id === toolId);
    if (original) toolName = original.name;

    openTools.push({ id: toolId, name: toolName });

    // 4. Create Tab
    const tabBtn = document.createElement('div');
    tabBtn.className = `tool-tab-btn`;
    tabBtn.id = `tab-btn-${toolId}`;
    tabBtn.innerHTML = `
        <span>${toolName}</span>
        <span class="tab-close" onclick="event.stopPropagation(); closeToolTab('${toolId}')">✕</span>
    `;
    tabBtn.onclick = () => switchToolTab(toolId);
    tabsContainer.appendChild(tabBtn);

    // 5. Create Content DOM
    const contentDiv = document.createElement('div');
    contentDiv.id = `tool-content-${toolId}`;
    contentDiv.className = 'tool-pane hidden'; // Hidden by default
    contentDiv.innerHTML = getToolHTML(toolId); // Use helper to get HTML
    contentContainer.appendChild(contentDiv);

    // 6. Initialize Tool Logic with Safety
    try {
        initToolLogic(toolId);
    } catch (e) {
        console.error(`Failed to init logic for ${toolId}`, e);
    }

    // 7. Activate
    switchToolTab(toolId);
}

window.switchToolTab = function (toolId) {
    activeToolId = toolId;

    // Update Tabs
    document.querySelectorAll('.tool-tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`tab-btn-${toolId}`).classList.add('active');

    // Update Content
    document.querySelectorAll('.tool-pane').forEach(p => p.classList.add('hidden'));
    document.getElementById(`tool-content-${toolId}`).classList.remove('hidden');
}

window.closeToolTab = function (toolId) {
    if (toolId === 'music-player') {
        destroyMediaYTPlayer();
    }

    // Remove from DOM
    const tab = document.getElementById(`tab-btn-${toolId}`);
    const content = document.getElementById(`tool-content-${toolId}`);
    if (tab) tab.remove();
    if (content) content.remove();

    // Remove from State
    openTools = openTools.filter(t => t.id !== toolId);

    // If we closed the active one, switch to the last one available
    if (openTools.length > 0) {
        if (activeToolId === toolId) {
            switchToolTab(openTools[openTools.length - 1].id);
        }
    } else {
        // No tools left, hide container
        document.getElementById('active-tool-container').classList.add('hidden');
        activeToolId = null;
    }
}

// Helper to get HTML (Extracted from old switch)
function getToolHTML(toolId) {
    switch (toolId) {
        case 'music-player': return renderMusicPlayer();
        case 'pomodoro': return renderPomodoro();
        case 'word-counter': return renderWordCounter();
        case 'todo': return renderTodo();
        case 'gpa-calc': return renderGPACalc();
        case 'invoice-gen': return renderInvoiceGen();
        case 'time-tracker': return renderTimeTracker();
        case 'expense-est': return renderTaxShield();
        case 'caption-fmt': return renderCaptionFmt();
        case 'hashtag-gen': return renderHashtagGen();
        case 'idea-board': return renderIdeaBoard();
        case 'thumb-test': return renderThumbTester();
        case 'flashcards': return renderFlashcards();
        case 'rate-calc': return renderRateCalc();
        case 'calculator': return renderCalculator();
        case 'converter': return renderConverter();
        case 'notes': return renderNotes();
        case 'markdown-scratchpad': return renderMarkdownScratchpad();
        case 'soundboard': return renderSoundboard();
        default: return `<p>Tool loading logic missing for ID: ${toolId}</p>`;
    }
}

function initToolLogic(toolId) {
    if (toolId === 'word-counter') initWordCounter();
    if (toolId === 'pomodoro') initPomodoro();
    if (toolId === 'converter') setTimeout(window.updateUnits, 50);
    if (toolId === 'notes') initStickyNotes();
    if (toolId === 'invoice-gen') initInvoice();
    if (toolId === 'music-player') initMusicPlayerTool();
    if (toolId === 'markdown-scratchpad') initMarkdownScratchpad();
    if (toolId === 'soundboard') initSoundboard();
}

// -- Student Tools --
let timerInterval;

function renderPomodoro() {
    return `
        <div style="text-align:center; padding: 20px; max-width: 400px; margin: 0 auto;">
            <div id="timer-display" style="font-size: 5rem; font-weight: 800; font-variant-numeric: tabular-nums; color: var(--text-primary); text-shadow: 0 0 20px rgba(255,255,255,0.1);">25:00</div>
            
            <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: center;">
                 <button class="btn" id="start-timer" style="padding: 12px 30px; font-size: 1.1rem;">Start Focus</button>
                 <button class="btn btn-outline" id="reset-timer">Reset</button>
            </div>

            <!-- Customization -->
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid var(--border); display: flex; gap: 10px; justify-content: center; align-items: center;">
                <span style="color: var(--text-muted); font-size: 0.9rem;">Duration (min):</span>
                <input type="number" id="custom-min" value="25" min="1" max="120" style="width: 60px; background: rgba(0,0,0,0.3); border: 1px solid var(--border); color: white; padding: 5px; border-radius: 5px; text-align: center;">
                <button class="btn-outline" style="padding: 5px 10px; font-size: 0.8rem;" onclick="updateTimerDuration()">Set</button>
            </div>
        </div>
    `;
}

function initPomodoro() {
    let timeLeft = 25 * 60;
    let isRunning = false;
    const display = document.getElementById('timer-display');
    const startBtn = document.getElementById('start-timer');

    // Global helper for "Set" button
    window.updateTimerDuration = function () {
        if (isRunning) return alert("Please pause the timer first.");
        const val = parseInt(document.getElementById('custom-min').value);
        if (val && val > 0) {
            timeLeft = val * 60;
            const mins = Math.floor(timeLeft / 60);
            const secs = timeLeft % 60;
            display.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        }
    };

    const updateDisplay = () => {
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        display.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    startBtn.addEventListener('click', () => {
        if (isRunning) {
            // Pause
            clearInterval(timerInterval);
            isRunning = false;
            startBtn.textContent = "Resume Focus";
            startBtn.classList.remove('btn');
            startBtn.classList.add('btn-outline');
        } else {
            // Start
            isRunning = true;
            startBtn.textContent = "Pause";
            startBtn.classList.remove('btn-outline');
            startBtn.classList.add('btn');

            timerInterval = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    updateDisplay();
                    // Track focus minute every 60 seconds
                    if (timeLeft % 60 === 0) {
                        if (typeof trackFocusMinute === 'function') trackFocusMinute();
                    }
                } else {
                    clearInterval(timerInterval);
                    isRunning = false;
                    startBtn.textContent = "Start Focus";
                    startBtn.classList.remove('btn');
                    startBtn.classList.add('btn-outline');
                    if (typeof trackFocusSessionComplete === 'function') trackFocusSessionComplete();
                    alert("Focus Session Complete!");
                }
            }, 1000);
        }
    });

    document.getElementById('reset-timer').addEventListener('click', () => {
        clearInterval(timerInterval);
        isRunning = false;
        startBtn.textContent = "Start Focus";
        startBtn.classList.remove('btn-outline');
        startBtn.classList.add('btn');
        // Reset to input value
        window.updateTimerDuration();
    });
}

function renderWordCounter() {
    return `
        <div class="input-group">
            <textarea id="word-input" class="input-field" rows="10" placeholder="Type or paste text here..."></textarea>
        </div>
        <div style="display: flex; gap: 30px; color: var(--text-secondary);">
            <div>Words: <span id="count-words" style="color: var(--accent); font-weight:bold;">0</span></div>
            <div>Chars: <span id="count-chars" style="color: var(--accent); font-weight:bold;">0</span></div>
        </div>
    `;
}
function initWordCounter() {
    const area = document.getElementById('word-input');
    area.addEventListener('input', () => {
        const text = area.value.trim();
        document.getElementById('count-chars').textContent = text.length;
        document.getElementById('count-words').textContent = text ? text.split(/\s+/).length : 0;
    });
}

function renderTodo() {
    return `
        <div>
            <div style="display:flex; gap: 10px; margin-bottom: 20px;">
                <input type="text" id="todo-input" class="input-field" placeholder="New Task...">
                <button class="btn" onclick="addTodo()">Add</button>
            </div>
            <ul id="todo-list" style="list-style: none;"></ul>
        </div>
    `;
}
window.addTodo = function () {
    const input = document.getElementById('todo-input');
    if (!input.value) return;
    const list = document.getElementById('todo-list');
    const li = document.createElement('li');
    li.style.padding = "10px";
    li.style.borderBottom = "1px solid var(--border)";
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.innerHTML = `<span>${input.value}</span> <button onclick="this.parentElement.remove()" style="color:var(--danger); background:none; border:none; cursor:pointer;">Done</button>`;
    list.appendChild(li);
    input.value = '';
}

function renderGPACalc() {
    return `
     <p style="color: var(--text-muted);">Simple 4.0 Scale Calculator</p>
     <div id="course-rows">
        <div class="input-group" style="display:flex; gap:10px;">
            <input type="number" placeholder="Credits" class="input-field creds">
            <input type="number" placeholder="Grade (0-4)" class="input-field grade">
        </div>
     </div>
     <button class="btn btn-outline" onclick="addCourseRow()" style="margin-top:10px;">+ Add Course</button>
     
     <div style="margin-top: 20px; font-size: 1.5rem;">
        GPA: <span id="gpa-result" style="color: var(--accent);">0.00</span>
     </div>
     <button class="btn" onclick="calculateGPA()" style="margin-top: 20px;">Calculate</button>
    `;
}
window.addCourseRow = function () {
    const div = document.createElement('div');
    div.className = "input-group";
    div.style.display = "flex";
    div.style.gap = "10px";
    div.style.marginTop = "10px";
    div.innerHTML = `
        <input type="number" placeholder="Credits" class="input-field creds">
        <input type="number" placeholder="Grade (0-4)" class="input-field grade">
    `;
    document.getElementById('course-rows').appendChild(div);
}
window.calculateGPA = function () {
    const creds = document.querySelectorAll('.creds');
    const grades = document.querySelectorAll('.grade');
    let totalPts = 0;
    let totalCreds = 0;
    creds.forEach((c, i) => {
        const cr = parseFloat(c.value) || 0;
        const gr = parseFloat(grades[i].value) || 0;
        totalPts += cr * gr;
        totalCreds += cr;
    });
    const gpa = totalCreds ? (totalPts / totalCreds).toFixed(2) : 0.00;
    document.getElementById('gpa-result').textContent = gpa;
}

// -- Freelancer Tools --

function renderInvoiceGen() {
    return `
        <div style="display:flex; justify-content:space-between; margin-bottom:15px;">
             <h3 style="margin:0;">Settings</h3>
             <select id="inv-currency" class="input-field" style="width:auto; padding:5px 10px; margin:0;" onchange="renderInvoiceItems()">
                <option value="$">USD ($)</option>
                <option value="€">EUR (€)</option>
                <option value="£">GBP (£)</option>
                <option value="₹">INR (₹)</option>
                <option value="¥">JPY (¥)</option>
             </select>
        </div>

        <div class="input-group">
            <input type="text" id="inv-client" class="input-field" placeholder="Client Name / Business">
            <input type="text" id="inv-date" class="input-field" placeholder="Date (YYYY-MM-DD)" onfocus="(this.type='date')" onblur="(this.type='text')">
        </div>

        <div style="margin-top:20px;">
            <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:5px;">Line Items</p>
            <div id="inv-items-container">
                <!-- Items injected here -->
            </div>
            <button class="btn-outline" onclick="addInvoiceItem()" style="width:100%; margin-top:10px; border-style:dashed;">+ Add Item</button>
        </div>

        <div style="margin-top:20px; display:flex; justify-content:space-between; align-items:center; font-size:1.2rem; font-weight:bold;">
            <span>Total:</span>
            <span id="inv-final-total" style="color:var(--accent);">$0.00</span>
        </div>

        <button class="btn" onclick="printInvoice()" style="width:100%; margin-top:20px;">📄 Generate & Download PDF</button>

        <!-- Hidden Print Template -->
        <div id="print-area" style="display:none;"></div>
    `;
}

// Global state for items
let invoiceItems = [];

window.initInvoice = function () {
    invoiceItems = [{ desc: '', qty: 1, price: 0 }];
    renderInvoiceItems();
}

window.addInvoiceItem = function () {
    invoiceItems.push({ desc: '', qty: 1, price: 0 });
    renderInvoiceItems();
}

window.removeInvoiceItem = function (index) {
    if (invoiceItems.length > 1) {
        invoiceItems.splice(index, 1);
        renderInvoiceItems();
    }
}

window.renderInvoiceItems = function () {
    const container = document.getElementById('inv-items-container');
    if (!container) return;

    const currency = document.getElementById('inv-currency')?.value || '$';

    container.innerHTML = invoiceItems.map((item, i) => `
        <div class="inv-item-row" style="display:flex; gap:10px; margin-bottom:10px;">
            <input type="text" class="input-field" style="flex:2; margin:0;" placeholder="Description" value="${item.desc}" oninput="updateInvItem(${i}, 'desc', this.value)">
            <input type="number" class="input-field" style="flex:1; margin:0;" placeholder="Qty" value="${item.qty}" min="1" oninput="updateInvItem(${i}, 'qty', this.value)">
            <input type="number" class="input-field" style="flex:1; margin:0;" placeholder="Price" value="${item.price}" oninput="updateInvItem(${i}, 'price', this.value)">
            <button onclick="removeInvoiceItem(${i})" style="background:none; border:none; color:var(--danger); cursor:pointer; font-size:1.2rem;">&times;</button>
        </div>
    `).join('');

    calcInvoiceTotal();
}

window.updateInvItem = function (index, field, value) {
    invoiceItems[index][field] = field === 'desc' ? value : parseFloat(value) || 0;
    calcInvoiceTotal();
}

window.calcInvoiceTotal = function () {
    const currency = document.getElementById('inv-currency')?.value || '$';
    const total = invoiceItems.reduce((sum, item) => sum + (item.qty * item.price), 0);
    const totalEl = document.getElementById('inv-final-total');
    if (totalEl) totalEl.innerText = `${currency}${total.toFixed(2)}`;
    return total;
}

window.printInvoice = function () {
    const client = document.getElementById('inv-client').value || 'Client';
    const date = document.getElementById('inv-date').value || new Date().toISOString().split('T')[0];
    const currency = document.getElementById('inv-currency').value;
    const total = window.calcInvoiceTotal().toFixed(2);

    const itemsHTML = invoiceItems.map(item => `
        <tr style="border-bottom:1px solid #eee;">
            <td style="padding:10px;">${item.desc || 'Service'}</td>
            <td style="padding:10px; text-align:center;">${item.qty}</td>
            <td style="padding:10px; text-align:right;">${currency}${item.price.toFixed(2)}</td>
            <td style="padding:10px; text-align:right;">${currency}${(item.qty * item.price).toFixed(2)}</td>
        </tr>
    `).join('');

    const printContent = `
        <html>
        <head>
            <title>Invoice_${client}_${date}</title>
            <style>
                body { font-family: 'Helvetica', sans-serif; color: #333; padding: 40px; max-width: 800px; margin: 0 auto; }
                .header { display: flex; justify-content: space-between; margin-bottom: 50px; }
                .header h1 { margin: 0; color: #111; }
                .details { margin-bottom: 30px; }
                table { width: 100%; border-collapse: collapse; }
                th { text-align: left; background: #f9f9f9; padding: 10px; font-weight: bold; }
                .total { margin-top: 30px; text-align: right; font-size: 1.5rem; font-weight: bold; }
                .footer { margin-top: 50px; font-size: 0.8rem; color: #777; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
            </style>
        </head>
        <body>
            <div class="header">
                <div>
                    <h1>INVOICE</h1>
                    <p style="color:#555;">Generated via WorkstackAI</p>
                </div>
                <div style="text-align:right;">
                    <p><strong>Date:</strong> ${date}</p>
                </div>
            </div>

            <div class="details">
                <p><strong>Bill To:</strong><br>${client}</p>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th style="text-align:center;">Qty</th>
                        <th style="text-align:right;">Price</th>
                        <th style="text-align:right;">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHTML}
                </tbody>
            </table>

            <div class="total">
                Total: ${currency}${total}
            </div>

            <div class="footer">
                Thank you for your business.
            </div>
            <script>window.print(); window.onafterprint = function(){ window.close(); }</script>
        </body>
        </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
}

function renderTimeTracker() {
    return `
        <div style="text-align:center;">
            <div id="stopwatch" style="font-size: 3rem; font-weight: 800; font-family: monospace;">00:00:00</div>
            <div style="margin-top: 20px; display:flex; gap:10px; justify-content:center;">
                <button class="btn" onclick="toggleTimer()" id="toggle-btn">Start</button>
                <button class="btn btn-outline" onclick="resetStopwatch()">Stop & Log</button>
            </div>
            <ul id="time-logs" style="text-align:left; margin-top:20px; list-style:none; opacity:0.7;"></ul>
        </div>
    `;
}
let watchInterval;
let watchSeconds = 0;
let isRunning = false;

window.toggleTimer = function () {
    const btn = document.getElementById('toggle-btn');
    if (!isRunning) {
        isRunning = true;
        btn.textContent = "Pause";
        watchInterval = setInterval(() => {
            watchSeconds++;
            const h = Math.floor(watchSeconds / 3600);
            const m = Math.floor((watchSeconds % 3600) / 60);
            const s = watchSeconds % 60;
            document.getElementById('stopwatch').textContent =
                `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
        }, 1000);
    } else {
        isRunning = false;
        btn.textContent = "Resume";
        clearInterval(watchInterval);
    }
}
window.resetStopwatch = function () {
    if (watchSeconds === 0) return;
    const log = document.createElement('li');
    log.innerHTML = `Session: ${document.getElementById('stopwatch').textContent}`;
    document.getElementById('time-logs').prepend(log);

    clearInterval(watchInterval);
    isRunning = false;
    watchSeconds = 0;
    document.getElementById('stopwatch').textContent = "00:00:00";
    document.getElementById('toggle-btn').textContent = "Start";
}

function renderTaxShield() {
    return `
        <p>Simple Breakdown (30% Rule)</p>
        <input type="number" id="tax-income" class="input-field" placeholder="Annual Income ($)">
        <button class="btn" onclick="calcTax()">Estimate</button>
        <div style="margin-top: 20px; display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
            <div class="tool-card" style="padding:15px; border-color:var(--danger);">
                <span class="text-muted">Set Aside</span>
                <h3 id="tax-owe" style="color:var(--danger);">$0</h3>
            </div>
            <div class="tool-card" style="padding:15px; border-color:var(--accent);">
                <span class="text-muted">Keep</span>
                <h3 id="tax-keep" style="color:var(--accent);">$0</h3>
            </div>
        </div>
    `;
}
window.calcTax = function () {
    const inc = parseFloat(document.getElementById('tax-income').value) || 0;
    const tax = inc * 0.30;
    document.getElementById('tax-owe').textContent = '$' + tax.toFixed(2);
    document.getElementById('tax-keep').textContent = '$' + (inc - tax).toFixed(2);
}

// -- Creator Tools --

function renderCaptionFmt() {
    return `
        <textarea id="cap-input" class="input-field" rows="6" placeholder="Write caption with line breaks..."></textarea>
        <button class="btn" onclick="formatCaption()">Convert & Copy</button>
        <p id="cap-msg" style="margin-top:10px; color:var(--accent); display:none;">Copied to clipboard!</p>
    `;
}
window.formatCaption = function () {
    const txt = document.getElementById('cap-input').value;
    // Basic logic: ensure verify logic or just act as a clean copier
    navigator.clipboard.writeText(txt).then(() => {
        const msg = document.getElementById('cap-msg');
        msg.style.display = 'block';
        setTimeout(() => msg.style.display = 'none', 2000);
    });
}

function renderHashtagGen() {
    return `
        <input type="text" class="input-field" placeholder="Topic (e.g. Fitness)">
        <button class="btn" onclick="genTags()">Generate Tags</button>
        <div id="tag-output" style="margin-top:20px; padding:15px; background:rgba(255,255,255,0.05); border-radius:8px; display:none;"></div>
    `;
}
window.genTags = function () {
    const tags = ["#fyp", "#viral", "#trending", "#creator", "#content", "#growth"];
    document.getElementById('tag-output').textContent = tags.join(" ");
    document.getElementById('tag-output').style.display = 'block';
}

function renderIdeaBoard() {
    return `
        <input type="text" id="idea-input" class="input-field" placeholder="Video Idea...">
        <button class="btn" onclick="addIdea()">Save Idea</button>
        <ul id="idea-list" style="margin-top:20px; list-style:none;"></ul>
    `;
}
window.addIdea = function () {
    const val = document.getElementById('idea-input').value;
    if (!val) return;
    const li = document.createElement('li');
    li.style.padding = "10px";
    li.style.background = "rgba(255,255,255,0.05)";
    li.style.marginBottom = "5px";
    li.textContent = "💡 " + val;
    document.getElementById('idea-list').appendChild(li);
    document.getElementById('idea-input').value = '';
}

// -- NEW: Flashcards --
function renderFlashcards() {
    return `
        <div style="display:flex; gap:10px; margin-bottom:15px;">
             <input type="text" id="fc-front" class="input-field" placeholder="Front (Question)">
             <input type="text" id="fc-back" class="input-field" placeholder="Back (Answer)">
             <button class="btn" onclick="addCard()">Add</button>
        </div>
        <div id="card-display" style="perspective:1000px; height:200px; cursor:pointer; display:none;" onclick="flipCard()">
             <div id="card-inner" style="width:100%; height:100%; position:relative; transform-style:preserve-3d; transition:transform 0.6s; border:1px solid var(--border); border-radius:10px; background:var(--bg-card);">
                 <div class="card-face" style="position:absolute; width:100%; height:100%; backface-visibility:hidden; display:flex; justify-content:center; align-items:center; font-size:1.5rem; text-align:center; padding:20px;">
                    <span id="card-front-text">Front</span>
                 </div>
                 <div class="card-face" style="position:absolute; width:100%; height:100%; backface-visibility:hidden; display:flex; justify-content:center; align-items:center; font-size:1.5rem; text-align:center; padding:20px; transform:rotateY(180deg); background:var(--accent); color:black;">
                    <span id="card-back-text">Back</span>
                 </div>
             </div>
        </div>
        <p id="fc-count" style="text-align:center; margin-top:10px; color:var(--text-muted);">0 Cards</p>
    `;
}
let flashcards = [];
let isFlipped = false;
window.addCard = function () {
    const f = document.getElementById('fc-front').value;
    const b = document.getElementById('fc-back').value;
    if (!f || !b) return;
    flashcards.push({ f, b });
    document.getElementById('fc-front').value = '';
    document.getElementById('fc-back').value = '';
    document.getElementById('fc-count').textContent = flashcards.length + " Cards (Click to Flip)";
    if (flashcards.length === 1) showCard(0);
}
window.showCard = function (idx) {
    document.getElementById('card-display').style.display = 'block';
    document.getElementById('card-front-text').textContent = flashcards[idx].f;
    document.getElementById('card-back-text').textContent = flashcards[idx].b;
}
window.flipCard = function () {
    const inner = document.getElementById('card-inner');
    if (isFlipped) {
        inner.style.transform = 'rotateY(0deg)';
    } else {
        inner.style.transform = 'rotateY(180deg)';
    }
    isFlipped = !isFlipped;
}

// -- NEW: Rate Calc --
function renderRateCalc() {
    return `
        <h3>Freelance Rate Calculator</h3>
        <div class="input-group" style="margin-top:10px;">
            <label>Goal Annual Income ($)</label>
            <input type="number" id="rc-goal" class="input-field" value="100000">
        </div>
        <div class="input-group">
            <label>Billable Hours / Week</label>
            <input type="number" id="rc-hours" class="input-field" value="25">
        </div>
        <div class="input-group">
            <label>Weeks Off / Year</label>
            <input type="number" id="rc-vacation" class="input-field" value="4">
        </div>
        <button class="btn" onclick="calcRate()">Calculate Hourly Rate</button>
        <div style="margin-top:20px; text-align:center;">
             <h3>You should charge:</h3>
             <h1 id="rc-result" style="color:var(--accent); font-size:3rem;">$0/hr</h1>
        </div>
    `;
}
window.calcRate = function () {
    const goal = parseFloat(document.getElementById('rc-goal').value);
    const hours = parseFloat(document.getElementById('rc-hours').value);
    const vacation = parseFloat(document.getElementById('rc-vacation').value);

    const workWeeks = 52 - vacation;
    const totalHours = workWeeks * hours;
    // Add 30% for taxes/overhead buffer
    const billableGoal = goal * 1.30;

    const rate = (billableGoal / totalHours).toFixed(0);
    document.getElementById('rc-result').textContent = `$${rate}/hr`;
}

// -- NEW: Thumbnail Tester --
function renderThumbTester() {
    return `
        <p>Preview your thumbnail in different contexts.</p>
        <input type="file" id="thumb-upload" class="input-field" accept="image/*" onchange="loadThumb(event)">
        
        <div id="thumb-prev-area" style="display:none; margin-top:20px;">
            <h4>Home Page (Dark)</h4>
            <div style="background:#0f0f0f; padding:10px; width:300px; border-radius:10px;">
                <img id="t-img-1" style="width:100%; border-radius:8px; aspect-ratio:16/9; object-fit:cover;">
                <div style="margin-top:5px; height:10px; width:80%; background:#333; border-radius:2px;"></div>
                <div style="margin-top:5px; height:10px; width:40%; background:#333; border-radius:2px;"></div>
            </div>

            <h4 style="margin-top:20px;">Sidebar (Small)</h4>
            <div style="background:#fff; padding:10px; width:180px; color:black; border-radius:5px;">
                 <img id="t-img-2" style="width:100%; border-radius:4px; aspect-ratio:16/9; object-fit:cover;">
                 <div style="margin-top:5px; height:8px; width:90%; background:#ccc;"></div>
            </div>
        </div>
    `;
}
window.loadThumb = function (event) {
    const reader = new FileReader();
    reader.onload = function () {
        document.getElementById('t-img-1').src = reader.result;
        document.getElementById('t-img-2').src = reader.result;
        document.getElementById('thumb-prev-area').style.display = 'block';
    }
    reader.readAsDataURL(event.target.files[0]);
}

// -- NEW: Calculator --
function renderCalculator() {
    return `
        <div style="max-width:300px; margin:0 auto; background:var(--bg-card); padding:20px; border-radius:15px; border:1px solid var(--border);">
            <input type="text" id="calc-disp" readonly style="width:100%; margin-bottom:15px; background:#111; border:none; color:white; font-size:1.5rem; text-align:right; padding:10px; border-radius:5px;">
            <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:10px;">
                <button class="btn-outline" onclick="calcInput('C')">C</button>
                <button class="btn-outline" onclick="calcInput('(')">(</button>
                <button class="btn-outline" onclick="calcInput(')')">)</button>
                <button class="btn-outline" onclick="calcInput('/')">÷</button>
                
                <button class="btn-outline" onclick="calcInput('7')">7</button>
                <button class="btn-outline" onclick="calcInput('8')">8</button>
                <button class="btn-outline" onclick="calcInput('9')">9</button>
                <button class="btn-outline" onclick="calcInput('*')">×</button>
                
                <button class="btn-outline" onclick="calcInput('4')">4</button>
                <button class="btn-outline" onclick="calcInput('5')">5</button>
                <button class="btn-outline" onclick="calcInput('6')">6</button>
                <button class="btn-outline" onclick="calcInput('-')">-</button>
                
                <button class="btn-outline" onclick="calcInput('1')">1</button>
                <button class="btn-outline" onclick="calcInput('2')">2</button>
                <button class="btn-outline" onclick="calcInput('3')">3</button>
                <button class="btn-outline" onclick="calcInput('+')">+</button>
                
                <button class="btn-outline" onclick="calcInput('0')">0</button>
                <button class="btn-outline" onclick="calcInput('.')">.</button>
                <button class="btn" style="grid-column:span 2;" onclick="calcEval()">=</button>
            </div>
        </div>
    `;
}
window.calcInput = function (v) {
    const d = document.getElementById('calc-disp');
    if (v === 'C') d.value = '';
    else d.value += v;
}
window.calcEval = function () {
    try {
        const d = document.getElementById('calc-disp');
        d.value = eval(d.value);
    } catch (e) {
        alert("Invalid Expression");
    }
}

// -- NEW: Unit Converter --
function renderConverter() {
    return `
        <div style="display:flex; gap:10px;">
            <select id="conv-type" class="input-field" onchange="updateUnits()">
                <option value="len">Length</option>
                <option value="weight">Weight</option>
            </select>
            <input type="number" id="conv-val" class="input-field" placeholder="Value">
        </div>
        <div style="display:flex; gap:10px; margin-top:10px; align-items:center;">
             <select id="conv-from" class="input-field"></select>
             <span>to</span>
             <select id="conv-to" class="input-field"></select>
        </div>
        <button class="btn" onclick="convert()" style="margin-top:10px;">Convert</button>
        <h2 id="conv-res" style="margin-top:20px; color:var(--accent);"></h2>
    `;
}
const units = {
    len: ['Meters', 'Feet', 'Inches', 'Kilometers', 'Miles'],
    weight: ['Kilograms', 'Pounds', 'Ounces', 'Grams']
};
const factors = {
    len: { Meters: 1, Feet: 3.28084, Inches: 39.3701, Kilometers: 0.001, Miles: 0.000621371 },
    weight: { Kilograms: 1, Pounds: 2.20462, Ounces: 35.274, Grams: 1000 }
};
window.updateUnits = function () {
    const type = document.getElementById('conv-type').value;
    const from = document.getElementById('conv-from');
    const to = document.getElementById('conv-to');

    const opts = units[type].map(u => `<option value="${u}">${u}</option>`).join('');
    from.innerHTML = opts;
    to.innerHTML = opts;
}
window.convert = function () {
    const type = document.getElementById('conv-type').value;
    const val = parseFloat(document.getElementById('conv-val').value);
    const f = document.getElementById('conv-from').value;
    const t = document.getElementById('conv-to').value;

    if (isNaN(val)) return;

    // Convert to base then to target
    const base = val / factors[type][f];
    const res = base * factors[type][t];

    document.getElementById('conv-res').textContent = `${val} ${f} = ${res.toFixed(4)} ${t}`;
}
// Units initialized via initToolLogic
// setTimeout(window.updateUnits, 500);

// -- NEW: Sticky Notes --
function renderNotes() {
    return `
        <textarea id="sticky-note" class="input-field" rows="12" placeholder="Start typing... Auto-saved locally." style="background:#fff2cc; color:#333; font-family:cursive; padding:20px; font-size:1.2rem;"></textarea>
        <p style="text-align:right; font-size:0.8rem; color:var(--text-muted); margin-top:5px;">Auto-saved to LocalStorage</p>
    `;
}
function initStickyNotes() {
    const saved = localStorage.getItem('workstack_notes');
    const el = document.getElementById('sticky-note');
    if (saved && el) el.value = saved;

    if (el) {
        el.addEventListener('input', () => {
            localStorage.setItem('workstack_notes', el.value);
            if (typeof SYNC !== 'undefined') {
                SYNC.saveDebounced('workstack_notes', el.value);
            }
        });
    }
}

// -- YouTube Media Player Tool --
let mediaYTPlayer = null;
let currentMediaVideoId = '';
let currentPlayMode = 'audio';
let mediaYTState = -1;

function renderMusicPlayer() {
    return `
        <div class="music-player-tool" style="max-width: 550px; margin: 0 auto; padding: 25px; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); text-align: left; box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);">
            <h3 style="margin-top: 0; margin-bottom: 20px; color: var(--text-primary); display: flex; align-items: center; gap: 10px; font-weight: 600;">
                <span style="font-size: 1.5rem;">🎵</span> YouTube Media Player
            </h3>
            
            <div style="margin-bottom: 20px; display: flex; flex-direction: column; gap: 8px;">
                <label style="font-size: 0.85rem; color: var(--text-secondary); font-weight: 500;">Paste YouTube Link or Video ID:</label>
                <div style="display: flex; gap: 10px;">
                    <input type="text" id="yt-media-url" class="input-field" style="margin: 0; flex: 1; padding: 10px 14px;" placeholder="e.g. https://www.youtube.com/watch?v=jfKfPfyJRdk">
                    <button class="btn" onclick="loadYoutubeMedia()" style="padding: 10px 24px; font-weight: 600;">Load Track</button>
                </div>
            </div>

            <div id="media-mode-selector" class="hidden" style="margin-bottom: 20px; padding: 20px; background: rgba(255, 183, 3, 0.05); border: 1px dashed var(--accent); border-radius: var(--radius); text-align: center;">
                <p style="margin: 0 0 15px 0; font-size: 0.95rem; color: var(--text-primary); font-weight: 600;">Choose Playback Mode:</p>
                <div style="display: flex; gap: 12px;">
                    <button class="btn" onclick="selectPlayMode('audio')" style="flex: 1; font-size: 0.9rem; padding: 12px; display: flex; align-items: center; justify-content: center; gap: 8px;">
                        <span>🎧 Audio Only</span>
                    </button>
                    <button class="btn btn-outline" onclick="selectPlayMode('video')" style="flex: 1; font-size: 0.9rem; padding: 12px; display: flex; align-items: center; justify-content: center; gap: 8px;">
                        <span>📺 Video & Audio</span>
                    </button>
                </div>
            </div>

            <div id="media-player-panel" class="hidden" style="margin-bottom: 10px; padding: 20px; background: rgba(0,0,0,0.2); border: 1px solid var(--border); border-radius: var(--radius);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <span style="font-size: 0.75rem; color: var(--accent); font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;" id="player-mode-badge">AUDIO-ONLY MODE</span>
                    <span style="font-size: 0.75rem; color: #888; font-weight: 600; background: rgba(255,255,255,0.05); padding: 4px 8px; border-radius: 4px;" id="media-player-status">IDLE</span>
                </div>
                
                <div id="yt-video-wrapper" style="width: 100%; height: 260px; background: #000; border-radius: var(--radius); overflow: hidden; margin-bottom: 20px; transition: all 0.3s ease; border: 1px solid var(--border);" class="hidden">
                    <div id="yt-native-target"></div>
                </div>

                <h4 id="media-player-title" style="margin: 0 0 20px 0; font-size: 1.15rem; color: var(--text-primary); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">No track loaded</h4>

                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 15px;">
                    <div style="display: flex; gap: 10px;">
                        <button class="btn-outline" onclick="togglePlayMedia()" id="media-play-btn" style="width: 44px; height: 44px; padding: 0; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; border-radius: 8px;" title="Play/Pause">▶</button>
                        <button class="btn-outline" onclick="stopPlayMedia()" style="width: 44px; height: 44px; padding: 0; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; border-radius: 8px;" title="Stop">⏹</button>
                    </div>
                    
                    <div style="display: flex; align-items: center; gap: 10px; background: rgba(0,0,0,0.15); padding: 6px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.03);">
                        <span style="font-size: 1rem; color: var(--text-secondary);">🔊</span>
                        <input type="range" min="0" max="100" value="80" id="media-volume-range" oninput="changeMediaVolume(this.value)" style="width: 100px; accent-color: var(--accent); cursor: pointer;">
                        <span id="media-volume-label" style="font-size: 0.8rem; color: var(--text-secondary); width: 25px; text-align: right; font-weight: 600;">80</span>
                    </div>
                </div>
            </div>
            
            <div id="yt-hidden-container" style="width:0; height:0; overflow:hidden; position:absolute; opacity:0; pointer-events:none;">
                <div id="yt-native-audio-target"></div>
            </div>

            <!-- Quick Play Focus Tracks Section -->
            <div style="margin-top: 25px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 15px;">
                <p style="margin: 0 0 12px 0; font-size: 0.85rem; color: var(--text-secondary); font-weight: 600; letter-spacing: 0.03em; text-transform: uppercase;">⚡ Quick Play Focus Tracks</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 8px;" id="quick-tracks-grid">
                    <div onclick="loadQuickTrack('jfKfPfyJRdk', 'Lofi Study Beats')" style="padding: 10px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; cursor: pointer; text-align: center; transition: all 0.2s ease;" class="quick-track-card">
                        <span style="font-size: 1.2rem; display: block; margin-bottom: 4px;">🎧</span>
                        <span style="font-size: 0.75rem; font-weight: 500; color: #fff; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Lofi Study Beats</span>
                    </div>
                    <div onclick="loadQuickTrack('4oStw0r33so', 'Rain on Window')" style="padding: 10px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; cursor: pointer; text-align: center; transition: all 0.2s ease;" class="quick-track-card">
                        <span style="font-size: 1.2rem; display: block; margin-bottom: 4px;">🌧️</span>
                        <span style="font-size: 0.75rem; font-weight: 500; color: #fff; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Rain on Window</span>
                    </div>
                    <div onclick="loadQuickTrack('D1f2dSi7kG4', 'Ambient Focus')" style="padding: 10px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; cursor: pointer; text-align: center; transition: all 0.2s ease;" class="quick-track-card">
                        <span style="font-size: 1.2rem; display: block; margin-bottom: 4px;">✨</span>
                        <span style="font-size: 0.75rem; font-weight: 500; color: #fff; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Ambient Focus</span>
                    </div>
                    <div onclick="loadQuickTrack('4xDzrJKvOOY', 'Deep Work Synth')" style="padding: 10px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; cursor: pointer; text-align: center; transition: all 0.2s ease;" class="quick-track-card">
                        <span style="font-size: 1.2rem; display: block; margin-bottom: 4px;">🚀</span>
                        <span style="font-size: 0.75rem; font-weight: 500; color: #fff; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Deep Work Synth</span>
                    </div>
                    <div onclick="loadQuickTrack('A7VCSigfex8', 'Nature Forest')" style="padding: 10px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; cursor: pointer; text-align: center; transition: all 0.2s ease;" class="quick-track-card">
                        <span style="font-size: 1.2rem; display: block; margin-bottom: 4px;">🌲</span>
                        <span style="font-size: 0.75rem; font-weight: 500; color: #fff; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Nature Forest</span>
                    </div>
                    <div onclick="loadQuickTrack('5qap5aO4i9A', 'Cafe Ambient')" style="padding: 10px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; cursor: pointer; text-align: center; transition: all 0.2s ease;" class="quick-track-card">
                        <span style="font-size: 1.2rem; display: block; margin-bottom: 4px;">☕</span>
                        <span style="font-size: 0.75rem; font-weight: 500; color: #fff; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Cafe Ambient</span>
                    </div>
                </div>
            </div>
            
            <style>
                .quick-track-card {
                    transform: translateY(0);
                }
                .quick-track-card:hover {
                    background: rgba(255, 255, 255, 0.05) !important;
                    border-color: var(--accent) !important;
                    transform: translateY(-2px);
                }
            </style>
        </div>
    `;
}

function initMusicPlayerTool() {
    // Registered on demand.
}

function loadYoutubeMedia() {
    const urlInput = document.getElementById('yt-media-url');
    if (!urlInput) return;
    const url = urlInput.value.trim();
    if (!url) return alert("Please enter a YouTube link or Video ID.");
    
    let videoId = url;
    if (url.length !== 11) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        if (match && match[2].length === 11) {
            videoId = match[2];
        } else {
            return alert("Invalid YouTube URL or Video ID. Please paste a standard watch link or short sharing URL.");
        }
    }
    
    currentMediaVideoId = videoId;
    
    const selector = document.getElementById('media-mode-selector');
    if (selector) selector.classList.remove('hidden');
    const panel = document.getElementById('media-player-panel');
    if (panel) panel.classList.add('hidden');
}

function selectPlayMode(mode) {
    currentPlayMode = mode;
    
    const selector = document.getElementById('media-mode-selector');
    if (selector) selector.classList.add('hidden');
    
    const panel = document.getElementById('media-player-panel');
    if (panel) panel.classList.remove('hidden');
    
    const badge = document.getElementById('player-mode-badge');
    if (badge) {
        badge.textContent = mode === 'audio' ? '🎧 AUDIO-ONLY MODE' : '📺 VIDEO & AUDIO MODE';
        badge.style.color = mode === 'audio' ? 'var(--accent)' : '#4ade80';
    }
    
    const wrapper = document.getElementById('yt-video-wrapper');
    if (wrapper) {
        if (mode === 'video') {
            wrapper.classList.remove('hidden');
        } else {
            wrapper.classList.add('hidden');
        }
    }
    
    initMediaYTPlayer();
}

function initMediaYTPlayer() {
    destroyMediaYTPlayer();
    
    const targetId = currentPlayMode === 'video' ? 'yt-native-target' : 'yt-native-audio-target';
    
    if (currentPlayMode === 'video') {
        const wrapper = document.getElementById('yt-video-wrapper');
        if (wrapper) {
            wrapper.innerHTML = '<div id="yt-native-target"></div>';
        }
    } else {
        const container = document.getElementById('yt-hidden-container');
        if (container) {
            container.innerHTML = '<div id="yt-native-audio-target"></div>';
        }
    }
    
    const initInstance = () => {
        try {
            const vol = parseInt(document.getElementById('media-volume-range')?.value || '80');
            
            mediaYTPlayer = new window.YT.Player(targetId, {
                host: 'https://www.youtube-nocookie.com',
                height: currentPlayMode === 'video' ? '100%' : '0',
                width: currentPlayMode === 'video' ? '100%' : '0',
                videoId: currentMediaVideoId,
                playerVars: {
                    autoplay: 1,
                    controls: currentPlayMode === 'video' ? 1 : 0,
                    disablekb: 1,
                    fs: 1,
                    modestbranding: 1,
                    rel: 0,
                    showinfo: 0
                },
                events: {
                    onReady: (event) => {
                        event.target.setVolume(vol);
                        const status = document.getElementById('media-player-status');
                        if (status) status.textContent = 'PLAYING';
                        
                        const titleEl = document.getElementById('media-player-title');
                        if (titleEl) {
                            try {
                                titleEl.textContent = event.target.getVideoData().title || 'YouTube Track';
                            } catch (e) {
                                titleEl.textContent = 'Active YouTube Track';
                            }
                        }
                        
                        const playBtn = document.getElementById('media-play-btn');
                        if (playBtn) playBtn.textContent = '⏸';
                    },
                    onStateChange: (event) => {
                        mediaYTState = event.data;
                        updateMediaUIState(event.data);
                    }
                }
            });
        } catch (e) {
            console.error("Error creating YT Player instance:", e);
        }
    };
    
    if (typeof window.YT === 'undefined' || typeof window.YT.Player === 'undefined') {
        if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScript = document.getElementsByTagName('script')[0];
            if (firstScript && firstScript.parentNode) {
                firstScript.parentNode.insertBefore(tag, firstScript);
            } else {
                document.head.appendChild(tag);
            }
        }
        
        const previousCallback = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
            if (previousCallback) previousCallback();
            initInstance();
        };
        
        const poll = setInterval(() => {
            if (window.YT && window.YT.Player) {
                clearInterval(poll);
                initInstance();
            }
        }, 500);
    } else {
        initInstance();
    }
}

function destroyMediaYTPlayer() {
    if (mediaYTPlayer) {
        try {
            mediaYTPlayer.destroy();
        } catch (e) {}
        mediaYTPlayer = null;
    }
    mediaYTState = -1;
}

function updateMediaUIState(state) {
    const status = document.getElementById('media-player-status');
    const playBtn = document.getElementById('media-play-btn');
    if (!status || !playBtn) return;
    
    switch (state) {
        case -1:
            status.textContent = 'IDLE';
            playBtn.textContent = '▶';
            break;
        case 0:
            status.textContent = 'ENDED';
            playBtn.textContent = '▶';
            break;
        case 1:
            status.textContent = 'PLAYING';
            playBtn.textContent = '⏸';
            break;
        case 2:
            status.textContent = 'PAUSED';
            playBtn.textContent = '▶';
            break;
        case 3:
            status.textContent = 'BUFFERING...';
            break;
        case 5:
            status.textContent = 'READY';
            playBtn.textContent = '▶';
            break;
    }
}

function togglePlayMedia() {
    if (!mediaYTPlayer) return;
    try {
        if (mediaYTState === 1) {
            mediaYTPlayer.pauseVideo();
        } else {
            mediaYTPlayer.playVideo();
        }
    } catch (e) {}
}

function stopPlayMedia() {
    if (!mediaYTPlayer) return;
    try {
        mediaYTPlayer.stopVideo();
        updateMediaUIState(-1);
    } catch (e) {}
}

function changeMediaVolume(val) {
    const label = document.getElementById('media-volume-label');
    if (label) label.textContent = val;
    if (mediaYTPlayer) {
        try {
            mediaYTPlayer.setVolume(parseInt(val));
        } catch (e) {}
    }
}

window.loadYoutubeMedia = loadYoutubeMedia;
window.selectPlayMode = selectPlayMode;
window.togglePlayMedia = togglePlayMedia;
window.stopPlayMedia = stopPlayMedia;
window.changeMediaVolume = changeMediaVolume;

// -- Global Floating Music Player --
let floatYTPlayer = null;
let currentFloatVideoId = '';
let currentFloatPlayMode = 'audio';
let floatYTState = -1;

window.toggleFloatingMusicPlayer = function() {
    const panel = document.getElementById('floating-music-panel');
    const btn = document.getElementById('floating-music-btn');
    if (!panel) return;
    
    panel.classList.toggle('hidden');
    if (!panel.classList.contains('hidden')) {
        btn.style.transform = 'scale(0.9)';
        btn.innerHTML = '🎵';
    } else {
        btn.style.transform = 'scale(1)';
    }
};

window.loadFloatYoutubeMedia = function() {
    const urlInput = document.getElementById('float-yt-url');
    if (!urlInput) return;
    const url = urlInput.value.trim();
    if (!url) return alert("Please enter a YouTube link or Video ID.");
    
    let videoId = url;
    if (url.length !== 11) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        if (match && match[2].length === 11) {
            videoId = match[2];
        } else {
            return alert("Invalid YouTube URL or Video ID. Please check the link.");
        }
    }
    
    currentFloatVideoId = videoId;
    
    const selector = document.getElementById('float-mode-selector');
    if (selector) selector.classList.remove('hidden');
    const panel = document.getElementById('float-player-panel');
    if (panel) panel.classList.add('hidden');
};

window.selectFloatPlayMode = function(mode) {
    currentFloatPlayMode = mode;
    
    const selector = document.getElementById('float-mode-selector');
    if (selector) selector.classList.add('hidden');
    
    const panel = document.getElementById('float-player-panel');
    if (panel) panel.classList.remove('hidden');
    
    const badge = document.getElementById('float-mode-badge');
    if (badge) {
        badge.textContent = mode === 'audio' ? '🎧 AUDIO-ONLY' : '📺 VIDEO & AUDIO';
        badge.style.color = mode === 'audio' ? 'var(--accent)' : '#4ade80';
    }
    
    const wrapper = document.getElementById('float-video-wrapper');
    if (wrapper) {
        if (mode === 'video') {
            wrapper.classList.remove('hidden');
        } else {
            wrapper.classList.add('hidden');
        }
    }
    
    initFloatYTPlayer();
};

function initFloatYTPlayer() {
    destroyFloatYTPlayer();
    
    const targetId = currentFloatPlayMode === 'video' ? 'float-yt-target' : 'float-yt-audio-target';
    
    if (currentFloatPlayMode === 'video') {
        const wrapper = document.getElementById('float-video-wrapper');
        if (wrapper) {
            wrapper.innerHTML = '<div id="float-yt-target"></div>';
        }
    } else {
        const container = document.getElementById('float-yt-hidden-container');
        if (container) {
            container.innerHTML = '<div id="float-yt-audio-target"></div>';
        }
    }
    
    const initInstance = () => {
        try {
            const vol = parseInt(document.getElementById('float-volume-range')?.value || '80');
            
            floatYTPlayer = new window.YT.Player(targetId, {
                host: 'https://www.youtube-nocookie.com',
                height: currentFloatPlayMode === 'video' ? '100%' : '0',
                width: currentFloatPlayMode === 'video' ? '100%' : '0',
                videoId: currentFloatVideoId,
                playerVars: {
                    autoplay: 1,
                    controls: currentFloatPlayMode === 'video' ? 1 : 0,
                    disablekb: 1,
                    fs: 1,
                    modestbranding: 1,
                    rel: 0,
                    showinfo: 0
                },
                events: {
                    onReady: (event) => {
                        event.target.setVolume(vol);
                        const status = document.getElementById('float-player-status');
                        if (status) status.textContent = 'PLAYING';
                        
                        const titleEl = document.getElementById('float-player-title');
                        if (titleEl) {
                            try {
                                titleEl.textContent = event.target.getVideoData().title || 'YouTube Track';
                            } catch (e) {
                                titleEl.textContent = 'Active YouTube Track';
                            }
                        }
                        
                        const playBtn = document.getElementById('float-play-btn');
                        if (playBtn) playBtn.textContent = '⏸';
                    },
                    onStateChange: (event) => {
                        floatYTState = event.data;
                        updateFloatMediaUIState(event.data);
                    }
                }
            });
        } catch (e) {
            console.error("Error creating YT Player instance:", e);
        }
    };
    
    if (typeof window.YT === 'undefined' || typeof window.YT.Player === 'undefined') {
        if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScript = document.getElementsByTagName('script')[0];
            if (firstScript && firstScript.parentNode) {
                firstScript.parentNode.insertBefore(tag, firstScript);
            } else {
                document.head.appendChild(tag);
            }
        }
        
        const previousCallback = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
            if (previousCallback) previousCallback();
            initInstance();
        };
        
        const poll = setInterval(() => {
            if (window.YT && window.YT.Player) {
                clearInterval(poll);
                initInstance();
            }
        }, 500);
    } else {
        initInstance();
    }
}

function destroyFloatYTPlayer() {
    if (floatYTPlayer) {
        try {
            floatYTPlayer.destroy();
        } catch (e) {}
        floatYTPlayer = null;
    }
    floatYTState = -1;
}

function updateFloatMediaUIState(state) {
    const status = document.getElementById('float-player-status');
    const playBtn = document.getElementById('float-play-btn');
    if (!status || !playBtn) return;
    
    switch (state) {
        case -1:
            status.textContent = 'IDLE';
            playBtn.textContent = '▶';
            break;
        case 0:
            status.textContent = 'ENDED';
            playBtn.textContent = '▶';
            break;
        case 1:
            status.textContent = 'PLAYING';
            playBtn.textContent = '⏸';
            break;
        case 2:
            status.textContent = 'PAUSED';
            playBtn.textContent = '▶';
            break;
        case 3:
            status.textContent = 'BUFFERING...';
            break;
        case 5:
            status.textContent = 'READY';
            playBtn.textContent = '▶';
            break;
    }
}

window.toggleFloatPlayMedia = function() {
    if (!floatYTPlayer) return;
    try {
        if (floatYTState === 1) {
            floatYTPlayer.pauseVideo();
        } else {
            floatYTPlayer.playVideo();
        }
    } catch (e) {}
};

window.stopFloatPlayMedia = function() {
    if (!floatYTPlayer) return;
    try {
        floatYTPlayer.stopVideo();
        updateFloatMediaUIState(-1);
    } catch (e) {}
};

window.changeFloatMediaVolume = function(val) {
    const label = document.getElementById('float-volume-label');
    if (label) label.textContent = val;
    if (floatYTPlayer) {
        try {
            floatYTPlayer.setVolume(parseInt(val));
        } catch (e) {}
    }
};

window.loadQuickTrack = function(videoId, title) {
    const urlInput = document.getElementById('yt-media-url');
    if (urlInput) urlInput.value = videoId;
    
    const floatInput = document.getElementById('float-yt-url');
    if (floatInput) floatInput.value = videoId;
    
    currentMediaVideoId = videoId;
    currentFloatVideoId = videoId;
    
    const selector = document.getElementById('media-mode-selector');
    if (selector) selector.classList.remove('hidden');
    const panel = document.getElementById('media-player-panel');
    if (panel) panel.classList.add('hidden');
    
    const floatSelector = document.getElementById('float-mode-selector');
    if (floatSelector) floatSelector.classList.remove('hidden');
    const floatPanel = document.getElementById('float-player-panel');
    if (floatPanel) floatPanel.classList.add('hidden');
};

/* --- Dynamic Focus Stats Tracking & Gamification --- */
function trackFocusMinute() {
    let mins = parseInt(localStorage.getItem('ws_total_focus_mins') || '0');
    mins += 1;
    localStorage.setItem('ws_total_focus_mins', mins.toString());
    updateFocusDeskStats();
}

function trackFocusSessionComplete() {
    let mins = parseInt(localStorage.getItem('ws_total_focus_mins') || '0');
    const val = parseInt(document.getElementById('custom-min')?.value || 25);
    mins += val;
    localStorage.setItem('ws_total_focus_mins', mins.toString());
    
    let sessions = parseInt(localStorage.getItem('ws_total_focus_sessions') || '0');
    sessions += 1;
    localStorage.setItem('ws_total_focus_sessions', sessions.toString());
    
    updateFocusDeskStats();
}

window.updateFocusDeskStats = function() {
    const totalTimeEl = document.getElementById('focus-total-time');
    const levelEl = document.getElementById('focus-level');
    if (!totalTimeEl || !levelEl) return;
    
    const mins = parseInt(localStorage.getItem('ws_total_focus_mins') || '0');
    totalTimeEl.textContent = `${mins}m`;
    
    let level = "Novice";
    if (mins >= 120) level = "Deep Master";
    else if (mins >= 60) level = "Zen Monk";
    else if (mins >= 25) level = "Elite Focus";
    else if (mins >= 5) level = "Getting Started";
    
    levelEl.textContent = level;
};

/* --- Native Tool: Markdown Scratchpad --- */
function renderMarkdownScratchpad() {
    return `
        <div class="markdown-scratchpad-container" style="display: flex; flex-direction: column; gap: 15px; height: 100%; min-height: 400px;">
            <div class="scratchpad-header" style="display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap;">
                <span style="color: var(--text-secondary); font-size: 0.9rem;">Live Markdown Editor</span>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-outline" style="padding: 6px 12px; font-size: 0.8rem;" onclick="copyMarkdownText()">Copy Markdown</button>
                    <button class="btn btn-outline" style="padding: 6px 12px; font-size: 0.8rem;" onclick="copyMarkdownHTML()">Copy HTML</button>
                    <button class="btn btn-outline" style="padding: 6px 12px; font-size: 0.8rem; border-color: var(--danger); color: var(--danger);" onclick="clearMarkdownText()">Clear</button>
                </div>
            </div>
            <div class="scratchpad-body" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; flex-grow: 1; height: 100%; min-height: 320px;">
                <textarea id="markdown-input" class="input-field" style="width: 100%; height: 100%; min-height: 300px; resize: vertical; font-family: monospace; font-size: 0.9rem; padding: 12px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--border); border-radius: 6px; color: white;" placeholder="Type markdown here... (e.g. # Hello World, **bold**, - list item)"></textarea>
                <div id="markdown-preview" class="preview-pane" style="height: 100%; min-height: 300px; padding: 12px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border); border-radius: 6px; overflow-y: auto; color: var(--text-primary); font-size: 0.95rem; line-height: 1.5;"></div>
            </div>
        </div>
    `;
}

function initMarkdownScratchpad() {
    const input = document.getElementById('markdown-input');
    const preview = document.getElementById('markdown-preview');
    if (!input || !preview) return;

    const saved = localStorage.getItem('ws_markdown_scratchpad');
    if (saved) {
        input.value = saved;
    }

    const renderMarkdown = () => {
        const text = input.value;
        localStorage.setItem('ws_markdown_scratchpad', text);
        
        let html = text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/^### (.*$)/gim, '<h3 style="margin-top: 12px; margin-bottom: 6px; color: var(--accent); font-size: 1.15rem; font-weight: 700;">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 style="margin-top: 16px; margin-bottom: 8px; color: var(--text-primary); border-bottom: 1px solid var(--border); padding-bottom: 4px; font-size: 1.35rem; font-weight: 700;">$1</h2>')
            .replace(/^# (.*$)/gim, '<h1 style="margin-top: 20px; margin-bottom: 10px; color: var(--accent); border-bottom: 2px solid var(--accent-glow); padding-bottom: 6px; font-size: 1.6rem; font-weight: 800;">$1</h1>')
            .replace(/\*\*(.*?)\*\*/g, '<strong style="color: white; font-weight: 700;">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em style="font-style: italic; color: var(--text-secondary);">$1</em>')
            .replace(/`(.*?)`/g, '<code style="background: rgba(255,255,255,0.08); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.85rem; color: var(--accent);">$1</code>')
            .replace(/^\> (.*$)/gim, '<blockquote style="border-left: 4px solid var(--accent); padding-left: 12px; margin: 10px 0; color: var(--text-secondary); font-style: italic; background: rgba(255,255,255,0.01); padding: 8px 12px; border-radius: 0 4px 4px 0;">$1</blockquote>')
            .replace(/^\s*\-\s+(.*$)/gim, '<li style="margin-left: 15px; margin-bottom: 4px; list-style-type: disc;">$1</li>')
            .replace(/^\s*\*\s+(.*$)/gim, '<li style="margin-left: 15px; margin-bottom: 4px; list-style-type: disc;">$1</li>')
            .replace(/^\s*\d+\.\s+(.*$)/gim, '<li style="margin-left: 15px; margin-bottom: 4px; list-style-type: decimal;">$1</li>')
            .replace(/\n$/gim, '<br />')
            .replace(/\n/gim, '<br />');

        preview.innerHTML = html || `<p style="color: var(--text-muted); font-style: italic;">No markdown content yet. Type in the editor to see live preview...</p>`;
    };

    input.addEventListener('input', renderMarkdown);
    renderMarkdown();

    window.copyMarkdownText = () => {
        navigator.clipboard.writeText(input.value);
        alert("Markdown copied to clipboard!");
    };

    window.copyMarkdownHTML = () => {
        navigator.clipboard.writeText(preview.innerHTML);
        alert("HTML copied to clipboard!");
    };

    window.clearMarkdownText = () => {
        if (confirm("Are you sure you want to clear the scratchpad?")) {
            input.value = '';
            renderMarkdown();
        }
    };
}

/* --- Native Tool: Ambient Sound Mixer --- */
function renderSoundboard() {
    return `
        <div class="soundboard-container" style="display: flex; flex-direction: column; gap: 20px; padding: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                <p style="color: var(--text-secondary); margin: 0; font-size: 0.9rem;">Mix custom ambient sounds to block out distractions.</p>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-outline" style="padding: 6px 12px; font-size: 0.8rem;" onclick="presetAmbient('focus')">🧠 Focus</button>
                    <button class="btn btn-outline" style="padding: 6px 12px; font-size: 0.8rem;" onclick="presetAmbient('relax')">🌊 Calm</button>
                    <button class="btn btn-outline" style="padding: 6px 12px; font-size: 0.8rem; border-color: var(--danger); color: var(--danger);" onclick="stopAllAmbient()">Mute All</button>
                </div>
            </div>
            
            <div style="position: relative; width: 100%; height: 80px; background: rgba(0,0,0,0.4); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden;">
                <canvas id="ambient-visualizer" style="width: 100%; height: 100%; display: block;"></canvas>
                <div id="visualizer-placeholder" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: var(--text-muted); font-size: 0.8rem; pointer-events: none; transition: opacity 0.3s;">
                    Visualizer Idle (Play a sound to activate)
                </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                <div class="sound-slider-card" style="background: rgba(255,255,255,0.02); border: 1px solid var(--border); padding: 15px; border-radius: 8px; display: flex; flex-direction: column; gap: 10px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 600; color: white;">🌧️ Rain Shower</span>
                        <button id="btn-ambient-rain" class="btn-outline" style="padding: 4px 8px; font-size: 0.75rem;" onclick="toggleAmbientSound('rain')">Play</button>
                    </div>
                    <input type="range" id="slider-ambient-rain" min="0" max="1" step="0.05" value="0.5" class="input-field" style="width:100%; height: 6px; padding: 0; margin: 0;" oninput="changeAmbientVolume('rain', this.value)">
                </div>

                <div class="sound-slider-card" style="background: rgba(255,255,255,0.02); border: 1px solid var(--border); padding: 15px; border-radius: 8px; display: flex; flex-direction: column; gap: 10px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 600; color: white;">🌊 Ocean Waves</span>
                        <button id="btn-ambient-ocean" class="btn-outline" style="padding: 4px 8px; font-size: 0.75rem;" onclick="toggleAmbientSound('ocean')">Play</button>
                    </div>
                    <input type="range" id="slider-ambient-ocean" min="0" max="1" step="0.05" value="0.5" class="input-field" style="width:100%; height: 6px; padding: 0; margin: 0;" oninput="changeAmbientVolume('ocean', this.value)">
                </div>

                <div class="sound-slider-card" style="background: rgba(255,255,255,0.02); border: 1px solid var(--border); padding: 15px; border-radius: 8px; display: flex; flex-direction: column; gap: 10px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 600; color: white;">🔥 Campfire Crackle</span>
                        <button id="btn-ambient-campfire" class="btn-outline" style="padding: 4px 8px; font-size: 0.75rem;" onclick="toggleAmbientSound('campfire')">Play</button>
                    </div>
                    <input type="range" id="slider-ambient-campfire" min="0" max="1" step="0.05" value="0.5" class="input-field" style="width:100%; height: 6px; padding: 0; margin: 0;" oninput="changeAmbientVolume('campfire', this.value)">
                </div>

                <div class="sound-slider-card" style="background: rgba(255,255,255,0.02); border: 1px solid var(--border); padding: 15px; border-radius: 8px; display: flex; flex-direction: column; gap: 10px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 600; color: white;">🧠 White Noise</span>
                        <button id="btn-ambient-whitenoise" class="btn-outline" style="padding: 4px 8px; font-size: 0.75rem;" onclick="toggleAmbientSound('whitenoise')">Play</button>
                    </div>
                    <input type="range" id="slider-ambient-whitenoise" min="0" max="1" step="0.05" value="0.5" class="input-field" style="width:100%; height: 6px; padding: 0; margin: 0;" oninput="changeAmbientVolume('whitenoise', this.value)">
                </div>
            </div>
        </div>
    `;
}

window.ambientSoundManager = {
    ctx: null,
    analyser: null,
    isPlaying: {},
    gains: {},
    sources: {},
    visualizerActive: false,
    
    init() {
        if (this.ctx) return;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 64;
        this.analyser.connect(this.ctx.destination);
        this.drawVisualizer();
    },
    
    getNoiseBuffer(type) {
        const sampleRate = this.ctx.sampleRate;
        const duration = 4;
        const bufferSize = sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
        const data = buffer.getChannelData(0);
        
        if (type === 'white') {
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
        } else if (type === 'pink') {
            let b0, b1, b2, b3, b4, b5, b6;
            b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
            for (let i = 0; i < bufferSize; i++) {
                let white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                data[i] *= 0.11;
                b6 = white * 0.115926;
            }
        } else if (type === 'brown') {
            let lastOut = 0.0;
            for (let i = 0; i < bufferSize; i++) {
                let white = Math.random() * 2 - 1;
                data[i] = (lastOut + (0.02 * white)) / 1.02;
                lastOut = data[i];
                data[i] *= 3.5;
            }
        } else if (type === 'campfire') {
            for (let i = 0; i < bufferSize; i++) {
                let hum = (Math.random() * 2 - 1) * 0.015;
                let pop = 0;
                if (Math.random() < 0.0003) {
                    pop = (Math.random() * 2 - 1) * 0.5;
                } else if (Math.random() < 0.001) {
                    pop = (Math.random() * 2 - 1) * 0.15;
                }
                data[i] = hum + pop;
            }
        }
        return buffer;
    },
    
    start(soundId) {
        this.init();
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        
        if (this.isPlaying[soundId]) return;
        
        const gainNode = this.ctx.createGain();
        const sliderVal = parseFloat(document.getElementById(`slider-ambient-${soundId}`)?.value || 0.5);
        gainNode.gain.value = sliderVal * 0.4;
        
        let source;
        
        if (soundId === 'whitenoise') {
            source = this.ctx.createBufferSource();
            source.buffer = this.getNoiseBuffer('white');
            source.loop = true;
            source.connect(gainNode);
        } else if (soundId === 'rain') {
            source = this.ctx.createBufferSource();
            source.buffer = this.getNoiseBuffer('pink');
            source.loop = true;
            
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 1800;
            
            source.connect(filter);
            filter.connect(gainNode);
        } else if (soundId === 'ocean') {
            source = this.ctx.createBufferSource();
            source.buffer = this.getNoiseBuffer('brown');
            source.loop = true;
            
            const lfo = this.ctx.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.value = 0.07;
            
            const lfoGain = this.ctx.createGain();
            lfoGain.gain.value = 0.15;
            
            lfo.connect(lfoGain);
            lfoGain.connect(gainNode.gain);
            lfo.start();
            source.connect(gainNode);
            
            this.sources[`${soundId}-lfo`] = lfo;
        } else if (soundId === 'campfire') {
            source = this.ctx.createBufferSource();
            source.buffer = this.getNoiseBuffer('campfire');
            source.loop = true;
            source.connect(gainNode);
        }
        
        gainNode.connect(this.analyser);
        source.start();
        
        this.sources[soundId] = source;
        this.gains[soundId] = gainNode;
        this.isPlaying[soundId] = true;
        
        const btn = document.getElementById(`btn-ambient-${soundId}`);
        if (btn) {
            btn.textContent = 'Pause';
            btn.style.borderColor = 'var(--accent)';
            btn.style.color = 'var(--accent)';
        }
        
        const placeholder = document.getElementById('visualizer-placeholder');
        if (placeholder) placeholder.style.opacity = '0';
    },
    
    stop(soundId) {
        if (!this.isPlaying[soundId]) return;
        
        try {
            this.sources[soundId].stop();
        } catch(e) {}
        
        if (this.sources[`${soundId}-lfo`]) {
            try { this.sources[`${soundId}-lfo`].stop(); } catch(e) {}
            delete this.sources[`${soundId}-lfo`];
        }
        
        delete this.sources[soundId];
        delete this.gains[soundId];
        this.isPlaying[soundId] = false;
        
        const btn = document.getElementById(`btn-ambient-${soundId}`);
        if (btn) {
            btn.textContent = 'Play';
            btn.style.borderColor = 'var(--border)';
            btn.style.color = 'white';
        }
        
        const active = Object.values(this.isPlaying).some(v => v);
        if (!active) {
            const placeholder = document.getElementById('visualizer-placeholder');
            if (placeholder) placeholder.style.opacity = '1';
        }
    },
    
    setVolume(soundId, val) {
        if (this.gains[soundId]) {
            this.gains[soundId].gain.setValueAtTime(parseFloat(val) * 0.4, this.ctx.currentTime);
        }
    },
    
    drawVisualizer() {
        const canvas = document.getElementById('ambient-visualizer');
        if (!canvas) {
            this.visualizerActive = false;
            return;
        }
        
        this.visualizerActive = true;
        const ctx2d = canvas.getContext('2d');
        const analyserNode = this.analyser;
        const bufferLength = analyserNode.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        }
        
        const draw = () => {
            if (!this.visualizerActive) return;
            requestAnimationFrame(draw);
            
            analyserNode.getByteFrequencyData(dataArray);
            
            ctx2d.clearRect(0, 0, canvas.width, canvas.height);
            
