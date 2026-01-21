# WorkstackAI 🚀

**The Ultimate Role-Based Digital Workspace.**

WorkstackAI is a premium, aesthetics-first productivity suite designed to adapt to your workflow. Whether you're a **Student**, **Freelancer**, or **Creator**, this application transforms your browser into a focused command center, integrating essential tools, AI resources, and native mini-apps into a single, cohesive glassmorphism interface.

![WorkstackAI Banner](https://via.placeholder.com/1200x600/0f172a/38bdf8?text=WorkstackAI+Workspace)
*(Replace with actual screenshot after deployment)*

## ✨ Key Features

### 🎭 Role-Based Workspaces
Switch seamlessly between modes, each tailored with curated tools:
*   **🎓 Student Mode**: Access to NotebookLM, Google Scholar, Pomodoro Timer, GPA Calculator, and Flashcards.
*   **💼 Freelancer Mode**: Integrated with Upwork, Cron, Smart Invoice Generator, Time Tracker, and Tax Estimator.
*   **🎨 Creator Mode**: Quick links to Midjourney, Runway, Caption Formatter, Trend Finder, and Idea Board.

### 🛠 Native Mini-Apps
Built-in tools that run instantly without page reloads:
*   **Scientific Calculator** & **Unit Converter**
*   **Sticky Notes** (Auto-saved to local storage)
*   **Kanban Board** & **Focus Timer**
*   **Invoice Generator** (PDF ready)

### 💎 Premium UX/UI
*   **Glassmorphism Design**: Frosted glass effects, neon accents, and dark mode aesthetics.
*   **3D Interactions**: Tilt effects on cards and staggered animations.
*   **Smart Chatbot**: "Stacky" - a sales and navigation assistant.
*   **Security**: Mock authentication flow (Google/Mobile) with session persistence.

## 🚀 Quick Start

### Run Locally
This is a static web application (HTML/CSS/JS). You can run it with any static server.

1.  **Clone the repo**
    ```bash
    git clone https://github.com/YOUR_USERNAME/WorkstackAI.git
    cd WorkstackAI
    ```

2.  **Start a local server**
    ```bash
    python3 -m http.server 8080
    ```

3.  **Open in Browser**
    Go to `http://localhost:8080`

### Deployment
Ready to deploy on **Netlify** (Recommended):
1.  Drag & drop this folder into [Netlify Drop](https://app.netlify.com/drop).
2.  That's it!

*(See `DEPLOY.md` for a detailed comparison of deployment options)*

## 📂 Project Structure

```
WorkstackAI/
├── index.html        # Landing page & Authentication
├── workspace.html    # Main application dashboard
├── roles.html        # Role selection screen
├── fun-zone.html     # Gaming & leisure area
├── css/
│   └── style.css     # Global styles & animations
├── js/
│   ├── app.js        # Core logic & UI rendering
│   ├── data.js       # Tool data & configuration
│   ├── auth.js       # Authentication mock logic
│   └── chatbot.js    # Chatbot widget logic
└── netlify.toml      # Deployment configuration
```

## 👨‍💻 Developer
Built by **Ayush Rana**.

---
*Created with ❤️ and ☕️.*
