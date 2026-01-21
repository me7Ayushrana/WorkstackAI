const TOOL_DATA = {
    "student": {
        title: "Student Workspace",
        description: "The ultimate academic command center. Research, write, and study faster.",
        ai_tools: [
            {
                title: "Understand PDFs & Slides",
                desc: "Upload readings. Ask questions. Get summaries.",
                toolName: "NotebookLM",
                url: "https://notebooklm.google.com/",
                bestFor: "Deep Reading",
                pricing: "Free"
            },
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
            { name: "CodePen", url: "https://codepen.io/", category: "Coding", pricing: "Free" }
        ],
        native_tools: [
            { id: "pomodoro", name: "Deep Focus Timer", icon: "🧠", pricing: "Free" },
            { id: "todo", name: "Kanban Board", icon: "📋", pricing: "Free" },
            { id: "word-counter", name: "Word Counter", icon: "📊", pricing: "Free" },
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
            { name: "WeTransfer", url: "https://wetransfer.com/", category: "File Sharing", pricing: "Freemium" }
        ],
        native_tools: [
            { id: "invoice-gen", name: "Smart Invoice", icon: "💸", pricing: "Free" },
            { id: "time-tracker", name: "Time Tracker", icon: "⏳", pricing: "Free" },
            { id: "expense-est", name: "Tax Shield", icon: "🛡️", pricing: "Free" },
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
            },
            {
                title: "AI Audio Studio",
                desc: "Edit audio by editing text. Studio quality.",
                toolName: "Descript",
                url: "https://www.descript.com/",
                bestFor: "Editing",
                pricing: "Freemium"
            },
            {
                title: "Design Everything",
                desc: "Thumbnails, posts, logos. Essential.",
                toolName: "Canva",
                url: "https://www.canva.com/",
                bestFor: "Design",
                pricing: "Freemium"
            },
            {
                title: "Generative Art",
                desc: "The gold standard for AI imagery.",
                toolName: "Midjourney",
                url: "https://www.midjourney.com/",
                bestFor: "Visuals",
                pricing: "Paid"
            },
            {
                title: "AI Music",
                desc: "Create radio-quality songs in seconds.",
                toolName: "Suno",
                url: "https://suno.com/",
                bestFor: "Music",
                pricing: "Free"
            },
            {
                title: "Studio Voice Fix",
                desc: "Make bad mics sound professional.",
                toolName: "Adobe Enhance",
                url: "https://podcast.adobe.com/enhance",
                bestFor: "Audio Fix",
                pricing: "Free"
            }
        ],
        external_tools: [
            { name: "Veed.io", url: "https://www.veed.io/", category: "Online Editor", pricing: "Freemium" },
            { name: "Pexels", url: "https://www.pexels.com/", category: "Stock Video", pricing: "Free" },
            { name: "Gumroad", url: "https://gumroad.com/", category: "Sales", pricing: "Free" },
            { name: "Beehiiv", url: "https://www.beehiiv.com/", category: "Newsletters", pricing: "Freemium" },
            { name: "Submagic", url: "https://submagic.co/", category: "Captions", pricing: "Freemium" },
            { name: "CapCut Desktop", url: "https://www.capcut.com/", category: "Editor", pricing: "Free" },
            { name: "DaVinci Resolve", url: "https://www.blackmagicdesign.com/products/davinciresolve", category: "Pro Editor", pricing: "Free" },
            { name: "OBS Studio", url: "https://obsproject.com/", category: "Streaming", pricing: "Free" },
            { name: "Figma", url: "https://www.figma.com/", category: "UI Design", pricing: "Freemium" },
            { name: "Unsplash", url: "https://unsplash.com/", category: "Stock Photos", pricing: "Free" },
            { name: "Mixkit", url: "https://mixkit.co/", category: "Assets", pricing: "Free" },
            { name: "Coolors", url: "https://coolors.co/", category: "Palettes", pricing: "Free" },
            { name: "RapidTags", url: "https://rapidtags.io/", category: "SEO", pricing: "Free" }
        ],
        native_tools: [
            { id: "caption-fmt", name: "Caption Formatter", icon: "✍️", pricing: "Free" },
            { id: "hashtag-gen", name: "Trend Finder", icon: "🔥", pricing: "Free" },
            { id: "idea-board", name: "Idea Organizer", icon: "💡", pricing: "Free" },
            { id: "thumb-test", name: "Thumbnail Tester", icon: "🖼️", pricing: "Free" },
            { id: "converter", name: "Unit Converter", icon: "🔄", pricing: "Free" },
            { id: "notes", name: "Sticky Notes", icon: "📝", pricing: "Free" }
        ]
    },
    "fun_zone": {
        title: "🎮 Zone",
        description: "Curated best-in-class web games.",
        games: [
            { name: "Subway Surfers", url: "https://poki.com/en/g/subway-surfers", category: "Runner", desc: "The legendary endless runner.", pricing: "Free" },
            { name: "Temple Run 2", url: "https://poki.com/en/g/temple-run-2", category: "Runner", desc: "Escape the temple.", pricing: "Free" },
            { name: "Agar.io", url: "https://agar.io/", category: "Multiplayer", desc: "Eat cells, grow bigger.", pricing: "Free" },
            { name: "Slither.io", url: "http://slither.io/", category: "Multiplayer", desc: "Classic snake battle royale.", pricing: "Free" },
            { name: "Smash Karts", url: "https://smashkarts.io/", category: "Kart Battle", desc: "Mario Kart meets Fortnite.", pricing: "Free" },
            { name: "Krunker.io", url: "https://krunker.io/", category: "FPS", desc: "Fast-paced pixel shooter.", pricing: "Free" },
            { name: "Slope", url: "https://poki.com/en/g/slope", category: "Arcade", desc: "High speed reflex challenge.", pricing: "Free" },
            { name: "Chess.com", url: "https://www.chess.com/", category: "Strategy", desc: "The classic game.", pricing: "Freemium" },
            { name: "GeoGuessr", url: "https://www.geoguessr.com/", category: "Geography", desc: "Travel the world from home.", pricing: "Freemium" },
            { name: "Neal.fun", url: "https://neal.fun/", category: "Explore", desc: "The deep sea, space, and chaos.", pricing: "Free" },
            { name: "Wordle", url: "https://www.nytimes.com/games/wordle/index.html", category: "Puzzle", desc: "The daily word game.", pricing: "Free" },
            { name: "Slow Roads", url: "https://slowroads.io/", category: "Relaxing", desc: "Infinite procedural driving.", pricing: "Free" }
        ],
        platforms: [
            { name: "Steam", url: "https://store.steampowered.com/", category: "PC", pricing: "Store" },
            { name: "Epic Games", url: "https://store.epicgames.com/", category: "PC", pricing: "Store" },
            { name: "Xbox Cloud", url: "https://www.xbox.com/en-US/play", category: "Cloud", pricing: "Paid" },
            { name: "GeForce Now", url: "https://www.nvidia.com/en-us/geforce-now/", category: "Cloud", pricing: "Freemium" },
            { name: "Twitch", url: "https://www.twitch.tv/", category: "Streaming", pricing: "Free" }
        ],
        portals: [
            { name: "Poki", url: "https://poki.com/", category: "All-in-One", pricing: "Free" },
            { name: "CrazyGames", url: "https://www.crazygames.com/", category: "All-in-One", pricing: "Free" },
            { name: "Y8.com", url: "https://www.y8.com/", category: "Portal", pricing: "Free" },
            { name: "Kongregate", url: "https://www.kongregate.com/", category: "Portal", pricing: "Free" },
            { name: "Armor Games", url: "https://armorgames.com/", category: "Portal", pricing: "Free" }
        ]
    }
};
