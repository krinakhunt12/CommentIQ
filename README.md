# CommentIQ 🧠 | Enterprise Documentation Intelligence

CommentIQ is a professional, high-performance static analysis platform designed to eliminate "documentation-code drift." It uses heuristic semantic analysis and machine learning to ensure your source code comments are accurate, meaningful, and synchronized with your executable logic.

---

## ✨ Enterprise & Real-Time Suite

### 🔌 Sentinel Mode (Real-Time File Watcher)
- **Continuous Intelligence**: Point CommentIQ to a local directory. The engine watches for file saves and re-analyzes documentation the moment you hit `Ctrl+S`.
- **Zero-Latency Feedback**: Instant quality score updates in the dashboard without manual uploads.

### 👥 Collaborative "War Room"
- **Multi-Peer Sync**: Join a collaborative session via WebSockets.
- **Audit Alerts**: See in real-time when other developers refactor files or resolve documentation debt across the project.

### ⚡ Streaming Project Analysis
- **Scalable Scanning**: Uses Server-Sent Events (SSE) to stream analysis results file-by-file for large repositories.
- **Live Progress**: Monitor the analysis engine as it crawls your codebase, populating the dashboard in real-time.

---

## 🏗️ System Architecture

```
CommentIQ/
├── Backend/                # Python + FastAPI Enterprise Engine
│   ├── main.py             # WebSockets, Watchdog, & Heuristics
│   ├── train_model.py      # ML Model training
│   └── requirements.txt    # watchdog, sse-starlette, websockets
│
└── Frontend/               # React + Tailwind + Framer Motion
    ├── src/
    │   ├── hooks/          # useRealTime.ts (WS/SSE Management)
    │   ├── components/     # Audit & Dashboard Components
    │   └── utils.ts        # Report generators
```

---

## 🚀 Deployment Guide

### 1. Backend Engine Setup
```bash
cd Backend
pip install -r requirements.txt
python main.py        # Starts engine on http://localhost:8000
```

### 2. Frontend Terminal Setup
```bash
cd Frontend
npm install
npm run dev           # Starts UI on http://localhost:5173
```

---

Built with ❤️ by the **CommentIQ Intelligence Team**.
"When documentation drifts from code, it ceases to be a guide and becomes a liability."