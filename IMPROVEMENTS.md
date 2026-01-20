# Code Comment Quality Checker - Version 2.0

I have significantly improved both the **Backend analysis engine** and the **Frontend user interface** to provide a professional, multi-language experience.

## ✨ Key Improvements

### 🧠 Backend (The "File Check")
- **Multi-Language Support**: Now supports `.py`, `.js`, `.ts`, `.java`, `.cpp`, `.go`, `.rs`, `.tsx`, and `.jsx`.
- **Advanced Comment Extraction**:
    - Robust single-line comment detection (`#`, `//`).
    - Multi-line comment support (`/* */`, `'''`, `"""`).
    - Python Docstring analysis via AST.
- **Sophisticated Quality Rules**:
    - **Narrating the Obvious**: Detects redundant comments like "set x to 5".
    - **Technical Debt**: Identifies `TODO`, `FIXME`, `HACK`, and `XXX` markers.
    - **Formatting**: Checks for capitalization, punctuation, and "commented-out" code.
    - **Intelligent Weighting**: Scores are now adjusted based on comment-to-code ratios (detecting both under-documented and cluttered code).

### 🎨 Frontend (The UI)
- **Modern Premium Design**: Implemented a "Glassmorphism" aesthetic with smooth gradients, backdrops, and modern typography (Inter).
- **Component Refactoring**:
    - `FileUpload`: interactive drag-and-drop zone with file type validation.
    - `AnalysisSummary`: Circular progress visualization and detailed file metrics.
    - `CommentCard`: Expandable cards for detailed issues and suggestions.
- **Micro-interactions**:
    - Smooth animations using `framer-motion`.
    - One-click copy for suggestions.
    - Loading states and success/error feedback.

## 🚀 How to Run

### Backend
1. Navigate to `Backend/`
2. Install dependencies: `pip install -r requirements.txt`
3. Start the server: `python main.py`

### Frontend
1. Navigate to `Frontend/`
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`

---
*Note: The UI is now fully responsive and optimized for both dark and light modes.*
