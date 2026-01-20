# CommentIQ 🧠 | Enterprise Documentation Intelligence

CommentIQ is a professional, high-performance static analysis platform designed to eliminate "documentation-code drift." It uses heuristic semantic analysis and machine learning to ensure your source code comments are accurate, meaningful, and synchronized with your executable logic.

---

## ✨ Enterprise Features

### 🔍 Semantic Intelligence
- **Heuristic Mismatch Detection**: Identifies when documentation mentions variables or logic that no longer exists in the surrounding code.
- **Micro-Refactor Engine**: Interactive "Accept & Refactor" mode allows you to edit and apply AI-suggested documentation improvements instantly.
- **Documentation Coverage Heatmap**: Visualizes documentation density against functional logic blocks to identify "Dark Zones."

### 📂 Project-Wide Management
- **Full Repository Audits**: Upload ZIP archives to analyze entire codebases at once.
- **Global Health Dashboard**: Instant visibility into "Chronic Regression Issues" and "Maintenance Hotspots."
- **Semantic Search Hub**: Index and search for tokens, TODOs, or issue patterns across thousands of files simultaneously.

### 🛡️ Compliance & DevOps
- **Policy Control Center**: Enforce documentation cultures (e.g., Strict JSDoc, word count minimums, production debt lockdowns).
- **Direct-to-PR Git Integration**: Generate professionally formatted Pull Request blueprints based on applied documentation refactors.
- **Enterprise Export**: Download high-fidelity Markdown audit reports for team reviews or compliance records.

---

## 🏗️ System Architecture

```
CommentIQ/
├── Backend/                # Python + FastAPI Enterprise Engine
│   ├── main.py             # Analysis Orchestrator & Heuristics
│   ├── train_model.py      # ML Model training for quality classification
│   └── requirements.txt    # Heavy-duty processing dependencies
│
└── Frontend/               # React + Tailwind + Framer Motion
    ├── src/
    │   ├── components/     # High-fidelity dashboard & audit components
    │   ├── types.ts        # Protocol definitions
    │   └── utils.ts        # Processing utilities & Report generators
    └── index.css           # Premium minimal design system
```

---

## 🚀 Deployment Guide

### 1. Backend Engine Setup
```bash
cd Backend
python -m venv venv
# On Windows: venv\Scripts\activate
# On Unix: source venv/bin/activate
pip install -r requirements.txt
python train_model.py # Initialize the ML classifier
python main.py        # Starts engine on http://localhost:8000
```

### 2. Frontend Terminal Setup
```bash
cd Frontend
npm install
npm run dev           # Starts UI on http://localhost:5173
```

---

## 🧪 Quality Metrics Breakdown

| Metric | Description | Weight |
| :--- | :--- | :--- |
| **Clarity** | Evaluates descriptive depth and word density. | 40% |
| **Semantic Integrity** | Check for drift between name tokens and documentation text. | 30% |
| **Debt Index** | Penalty for TODO, FIXME, or HACK markers in production-ready files. | 20% |
| **Format Consistency** | Proper capitalization, punctuation, and JSDoc adherence. | 10% |

---

## 🎯 Operational Workflow

1. **Initialization**: Launch the CommentIQ terminal and upload a source module or repository ZIP.
2. **Analysis**: The engine decomposes comments into semantic vectors, testing them against surrounding logic.
3. **Refactor**: Use the "Apply Refactor" button to fix anomalies using AI-suggested spec text.
4. **Deploy**: Generate a Pull Request blueprint or export the Audit Log for your CI/CD pipeline.

---

## 🤝 Protocol Support
First-class evaluation for:
- 🐍 **Python** (Docstrings, `#` comments)
- 📜 **JavaScript / TypeScript** (JSDoc, `//`, `/* */`)
- ⚙️ **Java / C++ / Go / Rust**

---

Built with ❤️ by the **CommentIQ Intelligence Team**.
"When documentation drifts from code, it ceases to be a guide and becomes a liability."