# WorkstackAI ⚡️
> **The Operating System for your Productivity.**

![Status](https://img.shields.io/badge/Status-Stable-success)
![Tech](https://img.shields.io/badge/Stack-HTML%20%7C%20CSS%20%7C%20JS-yellow)
![Privacy](https://img.shields.io/badge/Privacy-Local%20Storage-blue)

**WorkstackAI** is not just another dashboard; it's a **focused digital workspace** designed to eliminate browser chaos. Whether you are writing a research paper, freelancing for clients, or creating viral content, WorkstackAI adapts your environment to your current role.

Built with performance and aesthetics in mind, it features a glassmorphism UI, 3D interactions, and zero-latency tools ensuring you stay in the "Flow State."

---

## 🌟 Why WorkstackAI?

Most browsers are cluttered with random bookmarks and distracting tabs. WorkstackAI solves this by organizing the web into **Role-Based Workspaces**:

### 1. 🎓 **Student Mode**
*   **Deep Work:** Integrated **Pomodoro Timer** and **Lofi Music Widget**.
*   **Research:** Quick access to **Google Scholar**, **NotebookLM**, and **Perplexity**.
*   **Utilities:** GPA Calculator and Citation Manager.

### 2. 💼 **Freelancer Mode**
*   **Business in a Box:** Create **Invoices** (PDF), track billable hours, and estimate taxes.
*   **Client Outreach:** Templates for cold emails and contract drafting.
*   **Tools:** Integration links for Upwork, Cron, and payment gateways.

### 3. 🎨 **Creator Mode**
*   **Production Studio:** One-click access to **Midjourney**, **RunwayML**, and **CapCut**.
*   **Ideation:** Sticky notes for video ideas and a **Trend Finder** tool.
*   **Asset Management:** Links to stock footage and audio libraries.

---

## 🛠️ Technical Architecture

WorkstackAI is engineered for **speed** and **privacy**.

*   **Zero-Database Architecture:** All user data (custom widgets, theme preferences, sticky notes) is stored in the browser's `localStorage`. This means your data never leaves your device and the app loads instantly.
*   **Vanilla Core:** No heavy frameworks (React/Angular). Just pure, optimized HTML5, CSS3, and ES6 JavaScript.
*   **Mock Functionality:**
    *   **Authentication:** Simulated Google Login via Firebase SDK (UI/UX demo).
    *   **Payments:** Integrated **Razorpay Test Mode** to simulate the premium upgrade flow.

---

## 🚀 Getting Started

Since WorkstackAI is a static web application, you don't need to install complex dependencies.

### 1. Clone the Repository
```bash
git clone https://github.com/me7Ayushrana/WorkstackAI.git
cd WorkstackAI
```

### 2. Run Locally
You can use any static server. If you have Python installed:

```bash
python3 -m http.server 8080
```

Or just open `index.html` directly in your browser (though some features might be restricted by CORS).

### 3. Explore
Visit `http://localhost:8080` to enter the workspace.

---

## 📂 Project Structure

```bash
WorkstackAI/
├── index.html        # Landing Page (Hero section & Auth Modal)
├── workspace.html    # The Core Dashboard (Dynamic Injection)
├── role.html         # Role Selection Interface
├── payment.html      # Payment Gateway Simulation
├── fun-zone.html     # Gaming Arcade (Separate Theme)
│
├── css/
│   └── style.css     # 2000+ lines of custom Glassmorphism CSS
│
└── js/
    ├── app.js        # Main Logic (Rendering, State Management)
    ├── data.js       # "Mock Database" (JSON data for all tools)
    ├── auth.js       # Auth & Gatekeeping Logic
    └── chatbot.js    # Rule-based Help Assistant
```

---

## 🔮 Future Roadmap

*   [ ] **Cloud Sync**: Migrate from LocalStorage to Firebase Firestore.
*   [ ] **Mobile App**: Native React Native application for on-the-go focus.
*   [ ] **Team Spaces**: Shared dashboards for collaborative projects.
*   [ ] **LLM Integration**: Replacing the rule-based chatbot with Gemini API.

---

## 👨‍💻 Developer

Designed and Developed by **Ayush Rana**.
*Built with passion, coffee, and a lot of CSS variables.*
