# Code Comment Quality Checker

A full-stack application that analyzes code comments using ML and provides quality scores with actionable suggestions.

## 🏗️ Project Structure

```
code-comment-checker/
├── backend/
│   ├── main.py              # FastAPI server
│   ├── train_model.py       # ML model trainer
│   ├── requirements.txt     # Python dependencies
│   └── comment_quality_model.pkl  # Trained model (generated)
│
└── frontend/
    ├── src/
    │   ├── App.tsx         # Main React component
    │   ├── App.css         # Styles
    │   └── main.tsx        # Entry point
    ├── package.json
    └── tsconfig.json
```

## 🚀 Setup Instructions

### Backend Setup

1. **Create project directory:**
```bash
mkdir code-comment-checker
cd code-comment-checker
mkdir backend
cd backend
```

2. **Create virtual environment:**
```bash
python -m venv venv

# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Train the ML model:**
```bash
python train_model.py
```

This creates `comment_quality_model.pkl` for comment classification.

5. **Run the backend server:**
```bash
python main.py
```

Backend runs on `http://localhost:8000`

### Frontend Setup

1. **Create React + TypeScript app:**
```bash
cd ..
npm create vite@latest frontend -- --template react-ts
cd frontend
```

2. **Install dependencies:**
```bash
npm install axios
npm install
```

3. **Replace files:**
- Copy `App.tsx` to `src/App.tsx`
- Copy `App.css` to `src/App.css`

4. **Update src/main.tsx:**
```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './App.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

5. **Run the frontend:**
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## 📊 Features

### Current Features
- ✅ Upload Python files (.py)
- ✅ Extract single-line and docstring comments
- ✅ Quality scoring (0-100)
- ✅ Issue detection
- ✅ Actionable suggestions
- ✅ Visual metrics dashboard
- ✅ Comment-to-code ratio analysis

### Quality Checks
1. **Length validation** - Comments should be descriptive
2. **Redundancy detection** - Avoid obvious comments
3. **Action markers** - Flag TODO/FIXME items
4. **Capitalization & punctuation** - Proper formatting
5. **Meaningful content** - Explain WHY, not WHAT
6. **Explanatory language** - Bonus for context

### ML Model
- Uses TF-IDF + Random Forest classifier
- Trained on synthetic comment dataset
- Classifies comments as High/Medium/Low quality
- Extensible for real-world training data

## 🎯 Usage

1. Open `http://localhost:5173` in browser
2. Click "Choose a file..." and select a Python file
3. Click "Analyze Comments"
4. Review:
   - Overall quality score
   - Code metrics
   - Individual comment analysis
   - Issues and suggestions

## 🔧 Extending the Project

### Add More Languages

In `main.py`, extend the `extract_comments` method:

```python
def extract_comments(self, code: str, language: str = "python"):
    if language == "javascript":
        # Add JS comment parsing
        pass
    elif language == "java":
        # Add Java comment parsing
        pass
```

### Improve ML Model

1. Collect real comment data
2. Label manually (High/Medium/Low)
3. Add to `create_training_data()` in `train_model.py`
4. Retrain model

### Add Features

- Code complexity analysis
- Multi-file support
- Export reports (PDF/JSON)
- GitHub integration
- Real-time editor plugin

## 🧪 Example Python File to Test

```python
# x
def calculate_sum(a, b):
    """Calculate sum of two numbers to avoid using the + operator."""
    return a + b

# TODO: optimize
def process_data(items):
    result = []
    for item in items:
        # Loop through items
        result.append(item * 2)
    return result

def validate_email(email):
    """
    Validate email format using regex to prevent invalid data
    from entering the database and causing downstream errors.
    """
    import re
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(pattern, email) is not None
```

## 📝 API Endpoints

### POST /analyze
Analyzes uploaded code file

**Request:**
- Form data with file

**Response:**
```json
{
  "file_name": "example.py",
  "overall_score": 75.5,
  "total_lines": 50,
  "comment_ratio": 18.5,
  "comments": [...],
  "summary": {...}
}
```

### GET /health
Health check endpoint

## 🤝 Contributing

Ideas for contributions:
1. Support more programming languages
2. Better ML model with more training data
3. Browser extension
4. VS Code plugin
5. CI/CD integration

## 📄 License

MIT License - feel free to use and modify!

---

Built with ❤️ using Python, FastAPI, React, and TypeScript