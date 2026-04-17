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
