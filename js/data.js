/* 
   ------------------------------------------------
   DATABASE MOCKUP (JSON)
   ------------------------------------------------
   Since we don't have a backend yet, I'm storing all tool data here.
   In V5, this will be replaced by a Firebase fetch.
*/

const APP_DATABASE_V2 = {
    "student": {
        title: "Student Workspace",
        description: "The ultimate academic command center. Research, write, and study faster.",

        // --- AI Power Tools ---
        ai_tools: [
            {
                title: "Understand PDFs & Slides",
                desc: "Upload readings. Ask questions. Get summaries.",
                toolName: "NotebookLM",
                url: "https://notebooklm.google.com/",
                bestFor: "Deep Reading",
                pricing: "Free"
            },
            // {
            //     title: "DEPRECATED TOOL",
            //     desc: "Removed because they added a paywall.",
            //     toolName: "OldTool",
            //     url: "#",
            //     pricing: "Paid"
            // },

            {
                title: "Research Assistant",
                desc: "Analyze research papers at superhuman speed.",
                toolName: "Elicit",
                url: "https://elicit.com/",
                bestFor: "Deep Research",
                pricing: "Freemium"
            },
            {
                title: "Find Academic Sources",
                desc: "Real citations from published papers.",
                toolName: "Perplexity",
                url: "https://www.perplexity.ai/",
                bestFor: "Citations",
                pricing: "Freemium"
            },
            {
                title: "Chat with Documents",
                desc: "Turn your textbooks into a conversation.",
                toolName: "Humata",
                url: "https://www.humata.ai/",
                bestFor: "PDF Chat",
                pricing: "Freemium"
            },
            {
                title: "Scientific Answers",
                desc: "Find answers backed by peer-reviewed science.",
                toolName: "Consensus",
                url: "https://consensus.app/",
                bestFor: "Science",
                pricing: "Freemium"
            },
            {
                title: "Generative Presentations",
                desc: "Create beautiful slides from just text.",
                toolName: "Gamma",
                url: "https://gamma.app/",
                bestFor: "Slides",
                pricing: "Freemium"
            },
            {
                title: "Math & Science Solver",
                desc: "Step-by-step solutions for complex problems.",
                toolName: "WolframAlpha",
                url: "https://www.wolframalpha.com/",
                bestFor: "STEM",
                pricing: "Freemium"
            },
            {
                title: "Writing Assistant",
                desc: "Tone checker, clarity, and grammar.",
                toolName: "Grammarly",
                url: "https://www.grammarly.com/",
                bestFor: "Editing",
                pricing: "Freemium"
            }
        ],
        external_tools: [
            { name: "iLovePDF", url: "https://www.ilovepdf.com/", category: "PDF Tools", pricing: "Free" },
            { name: "Sejda PDF", url: "https://www.sejda.com/", category: "PDF Editor", pricing: "Freemium" },
            { name: "ChatPDF", url: "https://www.chatpdf.com/", category: "PDF AI", pricing: "Freemium" },
            { name: "Quillbot", url: "https://quillbot.com/", category: "Paraphrasing", pricing: "Freemium" },
            { name: "Connected Papers", url: "https://www.connectedpapers.com/", category: "Research Viz", pricing: "Free" },
            { name: "Notion", url: "https://www.notion.so/product/notion-for-education", category: "Notes", pricing: "Free" },
            { name: "Obsidian", url: "https://obsidian.md/", category: "Second Brain", pricing: "Free" },
            { name: "Zotero", url: "https://www.zotero.org/", category: "Citations", pricing: "Free" },
            { name: "Google Scholar", url: "https://scholar.google.com/", category: "Research", pricing: "Free" },
            { name: "SciSpace", url: "https://typeset.io/", category: "Paper Analysis", pricing: "Freemium" },
            { name: "Quizlet", url: "https://quizlet.com/", category: "Flashcards", pricing: "Freemium" },
            { name: "Anki", url: "https://apps.ankiweb.net/", category: "Memory", pricing: "Free" },
            { name: "Khan Academy", url: "https://www.khanacademy.org/", category: "Courses", pricing: "Free" },
            { name: "Coursera", url: "https://www.coursera.org/", category: "Certificates", pricing: "Freemium" },
            { name: "Overleaf", url: "https://www.overleaf.com/", category: "LaTeX", pricing: "Freemium" },
            { name: "Desmos", url: "https://www.desmos.com/calculator", category: "Graphing", pricing: "Free" },
            { name: "CodePen", url: "https://codepen.io/", category: "Coding", pricing: "Free" },
            { name: "Perplexity AI", url: "https://www.perplexity.ai/", category: "AI Research", pricing: "Free" },
            { name: "NotebookLM", url: "https://notebooklm.google.com/", category: "PDF AI", pricing: "Free" },
            { name: "Wolfram Alpha", url: "https://www.wolframalpha.com/", category: "STEM Solver", pricing: "Free" },
            { name: "Excalidraw", url: "https://excalidraw.com/", category: "Whiteboard", pricing: "Free" }
        ],
        native_tools: [
            { id: "pomodoro", name: "Deep Focus Timer", icon: "🧠", pricing: "Free" },
            { id: "todo", name: "Kanban Board", icon: "📋", pricing: "Free" },
            { id: "music-player", name: "YouTube Media Player", icon: "🎵", pricing: "Free" },
            { id: "word-counter", name: "Word Counter", icon: "📊", pricing: "Free" },
            { id: "markdown-scratchpad", name: "Markdown Scratchpad", icon: "✍️", pricing: "Free" },
            { id: "soundboard", name: "Ambient Sound Mixer", icon: "🎧", pricing: "Free" },
            { id: "gpa-calc", name: "Grade Predictor", icon: "📈", pricing: "Free" },
            { id: "flashcards", name: "Quick Flashcards", icon: "🗂️", pricing: "Free" },
            { id: "calculator", name: "Scientific Calc", icon: "🧮", pricing: "Free" },
            { id: "converter", name: "Unit Converter", icon: "🔄", pricing: "Free" }
        ]
    },
    "freelancer": {
        title: "Freelancer HQ",
        description: "Run your business like a pro agency. Tools for every stage.",
        ai_tools: [
            {
                title: "AI Legal Assistant",
                desc: "Draft bulletproof contracts in seconds.",
                toolName: "Bonsai",
                url: "https://www.hellobonsai.com/",
                bestFor: "Contracts",
                pricing: "Paid"
            },

            {
                title: "Smart Contracts & Docs",
                desc: "Generate proposals and agreements.",
                toolName: "ChatGPT",
                url: "https://chat.openai.com/",
                bestFor: "Drafting",
                pricing: "Freemium"
            },
            {
                title: "Meeting Intelligence",
                desc: "Never take notes again. Transcribes calls.",
                toolName: "Otter.ai",
                url: "https://otter.ai/",
                bestFor: "Meetings",
                pricing: "Freemium"
            },
            {
                title: "AI Cold Email",
                desc: "Write high-converting outreach emails.",
                toolName: "Lavender",
                url: "https://www.lavender.ai/",
                bestFor: "Sales",
                pricing: "Freemium"
            },
            {
                title: "Find Decision Makers",
                desc: "Get email addresses for potential leads.",
                toolName: "Hunter.io",
                url: "https://hunter.io/",
                bestFor: "Leads",
                pricing: "Freemium"
            },
            {
                title: "Automate Workflows",
                desc: "Connect your apps to save time.",
                toolName: "Zapier",
                url: "https://zapier.com/",
                bestFor: "Automation",
                pricing: "Freemium"
            }
        ],
        external_tools: [
            { name: "Loom", url: "https://www.loom.com/", category: "Async Video", pricing: "Freemium" },
            { name: "Calendly", url: "https://calendly.com/", category: "Scheduling", pricing: "Freemium" },
            { name: "Copy.ai", url: "https://www.copy.ai/", category: "Copywriting", pricing: "Freemium" },
            { name: "ManyChat", url: "https://manychat.com/", category: "Chatbots", pricing: "Freemium" },
            { name: "Cron", url: "https://cron.com/", category: "Calendar", pricing: "Free" },
            { name: "Toggl Track", url: "https://toggl.com/track/", category: "Time Tracking", pricing: "Freemium" },
            { name: "Contra", url: "https://contra.com/", category: "Commission-Free", pricing: "Free" },
            { name: "Upwork", url: "https://www.upwork.com/", category: "Marketplace", pricing: "Free" },
            { name: "Fiverr", url: "https://www.fiverr.com/", category: "Gigs", pricing: "Free" },
            { name: "Mercury", url: "https://mercury.com/", category: "Banking", pricing: "Free" },
            { name: "Wave Apps", url: "https://www.waveapps.com/", category: "Invoicing", pricing: "Free" },
            { name: "Trello", url: "https://trello.com/", category: "Projects", pricing: "Freemium" },
            { name: "Slack", url: "https://slack.com/", category: "Chat", pricing: "Freemium" },
            { name: "Zoom", url: "https://zoom.us/", category: "Calls", pricing: "Freemium" },
            { name: "WeTransfer", url: "https://wetransfer.com/", category: "File Sharing", pricing: "Freemium" },
            { name: "Notion", url: "https://www.notion.so/", category: "Client Notes", pricing: "Free" },
            { name: "Wave Accounting", url: "https://www.waveapps.com/accounting", category: "Accounting", pricing: "Free" },
            { name: "Clockify", url: "https://clockify.me/", category: "Hour Tracking", pricing: "Free" },
            { name: "Hemingway Editor", url: "https://hemingwayapp.com/", category: "Writing", pricing: "Free" },
            { name: "DocuSign", url: "https://www.docusign.com/", category: "E-Signatures", pricing: "Freemium" },
            { name: "Hunter.io", url: "https://hunter.io/", category: "Lead Gen", pricing: "Freemium" }
        ],
        native_tools: [
            { id: "invoice-gen", name: "Smart Invoice", icon: "💸", pricing: "Free" },
            { id: "time-tracker", name: "Time Tracker", icon: "⏳", pricing: "Free" },
            { id: "expense-est", name: "Tax Shield", icon: "🛡️", pricing: "Free" },
            { id: "music-player", name: "YouTube Media Player", icon: "🎵", pricing: "Free" },
            { id: "markdown-scratchpad", name: "Markdown Scratchpad", icon: "✍️", pricing: "Free" },
            { id: "soundboard", name: "Ambient Sound Mixer", icon: "🎧", pricing: "Free" },
            { id: "rate-calc", name: "Rate Calculator", icon: "💰", pricing: "Free" },
            { id: "calculator", name: "Scientific Calc", icon: "🧮", pricing: "Free" },
            { id: "notes", name: "Sticky Notes", icon: "📝", pricing: "Free" }
        ]
    },
    "creator": {
        title: "Creator Studio",
        description: "The world's best AI production suite. From idea to viral hit.",
        ai_tools: [
            {
                title: "Viral Shorts Maker",
                desc: "Turn 1 long video into 10 shorts instantly.",
                toolName: "OpusClip",
                url: "https://www.opus.pro/",
                bestFor: "Repurposing",
                pricing: "Freemium"
            },
            {
                title: "Text to Video",
                desc: "Generate cinematic video from text prompts.",
                toolName: "Runway Gen-2",
                url: "https://runwayml.com/",
                bestFor: "Video FX",
                pricing: "Freemium"
            },
            {
                title: "AI Voice Generation",
                desc: "Realistic AI text-to-speech. Clone voices.",
                toolName: "ElevenLabs",
                url: "https://elevenlabs.io/",
                bestFor: "Voiceovers",
                pricing: "Freemium"
