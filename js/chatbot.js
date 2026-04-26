const CHAT_DATA = {
    keywords: {
        "price": "It's just ₹9! That's less than a cup of chai ☕. For that tiny one-time fee, you get lifetime access to all these powerful tools.",
        "cost": "Only ₹9. No hidden fees, no monthly subscriptions. Just value.",
        "free": "We do have a 'Fun Zone' that is 100% free! But the professional workspaces are unlocked for just ₹9.",
        "safe": "Absolutely! We use a secure mock-gateway for demonstration, but your trust is our priority. We don't store sensitive personal data.",
        "scam": "Not at all! You get instant access to the dashboard immediately after the transaction. We are built for students and creators.",
        "student": "Perfect for students! We have direct integrations with tools like Perplexity, WolframAlpha, and NotebookLM to crush your assignments.",
        "what": "WorkstackAI is an all-in-one productivity dashboard. We organize the best AI and native tools into focused workspaces for Students, Freelancers, and Creators.",
        "worth": "TOTALLY! Imagine saving hours on research or content creation every week. Time is money, and we save you both.",
        "hello": "Hi there! 👋 Ready to supercharge your productivity?",
        "hi": "Hello! How can I help you get started today?",
        "hey": "Hey! 👋 I'm here to help you get the best deal. Ask me anything!",
        "sup": "Not much, just helping people save time and money! How can I help you?",
        "yo": "Yo! 👋 Ready to join the productivity revolution?",
        "greetings": "Greetings! Welcome to the future of work.",
        "morning": "Good morning! ☀️ Perfect time to start being productive.",
        "hlo": "Hlo! 👋 Ready to supercharge your productivity?",
        "hola": "Hola! 👋 How can I help you today?",
        "hieee": "Hieee! 👋 What brings you here?",
        "hii": "Hii! 👋 Ready to get started?",
        "heyyy": "Heyyy! 👋 Ask me anything about WorkstackAI!",
        "ola": "Ola! 👋 Welcome to your new workspace.",
        "howdy": "Howdy! 🤠 Ready to work smarter?",
        "hiya": "Hiya! 👋 Let me know if you need any help!",
        "help": "I'm here to help! Ask me about our features, the ₹9 access pass, or how we can help you work smarter.",
        "features": "We have 4 dedicated modes: Student, Freelancer, Creator, and the new **Personal Workspace** where you can build your own desk!",
        "freelancer": "For freelancers, we have invoice generators, contract drafters, and client outreach tools all in one place.",
        "custom": "The **Personal Workspace** lets you pin your favorite tools and links to a custom dashboard. Click 'Build Your Own' to start!",
        "build": "You can build your own workspace! Go to Roles > Build Your Own to add widgets and links.",
        "widget": "You can add widgets like the Deep Focus Timer, Sticky Notes, or any custom link to your Personal Desk."
    },
    default_responses: [
        "That's interesting! context is key—could you elaborate?",
        "I'm not sure I understand. Try asking about 'features', 'pricing', or 'tools'.",
        "Could you rephrase that? I'm better at answering specific questions about the workspace.",
        "I'm still learning! Ask me how WorkstackAI can save you time."
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    // Inject HTML if not present
    if (!document.getElementById('chatbot-widget')) {
        const widget = document.createElement('div');
        widget.id = 'chatbot-widget';
        widget.innerHTML = `
            <div id="chat-bubble" onclick="toggleChat()">
                💬
            </div>
            <div id="chat-window" class="hidden">
                <div class="chat-header">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <div class="avatar">🤖</div>
                        <div>
                            <div style="font-weight:700; font-size:0.95rem;">Stacky</div>
                            <div style="font-size:0.7rem; opacity:0.8;">Sales Assistant</div>
                        </div>
                    </div>
                    <button onclick="toggleChat()" style="background:none; border:none; color:white; cursor:pointer;">✕</button>
                </div>
                <div id="chat-messages">
                    <div class="message bot-message">
                        Hi! I'm Stacky. 👋 <br>
                        I can tell you why WorkstackAI will change your workflow forever.<br>
                        <b>Ask me anything!</b>
                    </div>
                </div>
                <div class="chat-input-area">
                    <input type="text" id="chat-input" placeholder="Ask a question..." onkeypress="handleChatInput(event)">
                    <button id="chat-send" onclick="sendUserMessage()">→</button>
                </div>
            </div>
        `;
        document.body.appendChild(widget);
    }
});

function toggleChat() {
    const window = document.getElementById('chat-window');
    const bubble = document.getElementById('chat-bubble');
