document.addEventListener('DOMContentLoaded', () => {
    // Page Routing / Guard Logic
    const path = window.location.pathname;

    if (path.includes('workspace')) {
        checkAccess();
        renderWorkspace();
    } else if (path.includes('roles')) {
        // FORCE RESET: Ensure no role is pre-selected when landing here
        sessionStorage.removeItem('selectedRole');
    } else if (path.includes('payment')) {
        checkRoleSelection();
    } else if (path.includes('fun-zone')) {
        renderFunZone();
    }

    // Event Listeners for Role Selection
    const roleCards = document.querySelectorAll('.role-card');
    roleCards.forEach(card => {
        card.addEventListener('click', () => {
            const role = card.dataset.role;
            selectRole(role);
        });
    });

    // Payment Logic
    const payBtn = document.getElementById('pay-btn');
    if (payBtn) {
        payBtn.addEventListener('click', processPayment);
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
    const hasPaid = localStorage.getItem('hasPaid');
    const role = sessionStorage.getItem('selectedRole');

    if (!hasPaid) {
        window.location.href = 'payment.html';
    }
    if (!role) {
        window.location.href = 'roles.html';
    }
}

function renderFunZone() {
    const data = TOOL_DATA['fun_zone'];

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
    const data = TOOL_DATA[roleKey];

    if (!data) return;

    try {
        // Sets Headers with Greeting
        const hour = new Date().getHours();
        let greeting = "Welcome back";
        if (hour < 12) greeting = "Good morning";
        else if (hour < 18) greeting = "Good afternoon";
        else greeting = "Good evening";

        // Get Name
        let displayName = "Creator";
        try {
            const userStr = localStorage.getItem('ws_user');
            if (userStr) {
                const user = JSON.parse(userStr);
                if (user.name) displayName = user.name.split(' ')[0];
            }
        } catch (e) {
            console.error("Name fetch error", e);
        }

        document.getElementById('workspace-title').innerHTML = `${greeting}, <span style="color:var(--accent);">${displayName}</span>.`;
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
        ...TOOL_DATA.student.native_tools,
        ...TOOL_DATA.freelancer.native_tools,
        ...TOOL_DATA.creator.native_tools
    ];
    const uniqueNative = Array.from(new Map(allNative.map(item => [item.id, item])).values());

    const allExternal = [
        ...TOOL_DATA.student.external_tools,
        ...TOOL_DATA.freelancer.external_tools,
        ...TOOL_DATA.creator.external_tools,
        ...TOOL_DATA.fun_zone.games, // Why not?
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
        myWidgets = JSON.parse(stored);
    } else {
        // Default widgets for first time
        myWidgets = [
            { type: 'tool', id: 'pomodoro', name: 'Deep Focus Timer' },
            { type: 'link', url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk', name: '24h Focus Radio' },
            { type: 'link', url: 'https://gemini.google.com', name: 'Gemini AI' }
        ];
        saveWidgets();
    }

    renderFocusDesk();
    section.classList.remove('hidden');
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
}

function saveWidgets() {
    localStorage.setItem('myFocusWidgets', JSON.stringify(myWidgets));
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
    // Check Limits (Mock Premium check)
    if (myWidgets.length >= 3 && localStorage.getItem('hasPaid') !== 'true') {
        alert("Free Plan Limit: 3 Widgets.\nUpgrade to Premium (₹9 Lifetime) for unlimited access!");
        return;
    }

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
    if (typeof TOOL_DATA === 'undefined') {
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
        ...TOOL_DATA.student.native_tools,
        ...TOOL_DATA.freelancer.native_tools,
        ...TOOL_DATA.creator.native_tools
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
        default: return `<p>Tool loading logic missing for ID: ${toolId}</p>`;
    }
}

function initToolLogic(toolId) {
    if (toolId === 'word-counter') initWordCounter();
    if (toolId === 'pomodoro') initPomodoro();
    if (toolId === 'converter') setTimeout(window.updateUnits, 50);
    if (toolId === 'notes') initStickyNotes();
    // Others auto-init via inline events
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
                } else {
                    clearInterval(timerInterval);
                    isRunning = false;
                    startBtn.textContent = "Start Focus";
                    startBtn.classList.remove('btn');
                    startBtn.classList.add('btn-outline');
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
        <div class="input-group">
            <input type="text" id="inv-client" class="input-field" placeholder="Client Name">
            <input type="number" id="inv-amount" class="input-field" placeholder="Amount ($)">
            <input type="text" id="inv-item" class="input-field" placeholder="Service (e.g. Web Design)">
        </div>
        <button class="btn" onclick="generateInvoice()">Download PDF (Mock)</button>
        <div id="invoice-preview" style="margin-top: 20px; padding: 20px; border: 1px dashed var(--border); display:none;">
            <h3 style="margin-bottom:10px;">INVOICE</h3>
            <p><strong>To:</strong> <span id="prev-client"></span></p>
            <p><strong>For:</strong> <span id="prev-item"></span></p>
            <h2 style="margin-top:20px;">Total: $<span id="prev-amount"></span></h2>
        </div>
    `;
}
window.generateInvoice = function () {
    const client = document.getElementById('inv-client').value;
    const item = document.getElementById('inv-item').value;
    const amount = document.getElementById('inv-amount').value;

    if (!client || !amount) return alert("Fill details");

    document.getElementById('prev-client').textContent = client;
    document.getElementById('prev-item').textContent = item;
    document.getElementById('prev-amount').textContent = amount;
    document.getElementById('invoice-preview').style.display = 'block';
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
        });
    }
}
