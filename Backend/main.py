from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import re
import ast
from typing import List, Dict, Optional, Any

app = FastAPI(title="Code Comment Quality Checker API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5174", "http://localhost:5175"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import zipfile
import io
import os

class CommentAnalysis(BaseModel):
    text: str
    line_number: int
    comment_type: str
    quality_score: float
    consistency_score: float = 100.0
    issues: List[str]
    suggestions: List[str]

class AnalysisResult(BaseModel):
    file_name: str
    total_lines: int
    code_lines: int
    comment_lines: int
    comment_ratio: float
    overall_score: float
    comments: List[CommentAnalysis]
    summary: Dict[str, Any]

class ProjectAnalysisResult(BaseModel):
    project_name: str
    overall_score: float
    files: List[AnalysisResult]
    total_files: int

class CommentAnalyzer:
    def __init__(self):
        # Language specific comment patterns
        self.config = {
            "python": {
                "single": [r'#'],
                "multi": [(r"'''", r"'''"), (r'"""', r'"""')],
                "ext": [".py"]
            },
            "cpp_style": { # C, C++, Java, JS, TS, Go, Rust, etc.
                "single": [r'//'],
                "multi": [(r'/\*', r'\*/')],
                "ext": [".cpp", ".c", ".h", ".java", ".js", ".ts", ".go", ".rs", ".tsx", ".jsx"]
            }
        }

    def _get_lang_config(self, filename: str) -> Optional[Dict]:
        ext = "." + filename.split(".")[-1].lower() if "." in filename else ""
        for name, cfg in self.config.items():
            if ext in cfg["ext"]:
                return cfg
        return self.config["cpp_style"] # Default to CPP style if unknown

    def extract_comments(self, code: str, filename: str) -> List[Dict]:
        """Extract comments from code based on language"""
        comments = []
        lines = code.split('\n')
        cfg = self._get_lang_config(filename)
        
        # Single-line extraction
        for i, line in enumerate(lines, 1):
            stripped = line.strip()
            for pattern in cfg["single"]:
                if pattern == '//' and stripped.startswith('//'):
                    comments.append({'text': stripped[2:].strip(), 'line': i, 'type': 'single-line'})
                elif pattern == '#' and stripped.startswith('#'):
                    comments.append({'text': stripped[1:].strip(), 'line': i, 'type': 'single-line'})

        # Multi-line extraction
        for start_pat, end_pat in cfg["multi"]:
            matches = re.finditer(f"{start_pat}(.*?){end_pat}", code, re.DOTALL)
            for match in matches:
                start_line = code.count('\n', 0, match.start()) + 1
                text = match.group(1).strip()
                if text:
                    comments.append({'text': text, 'line': start_line, 'type': 'multi-line'})

        # Python-specific Docstrings via AST
        if filename.endswith('.py'):
            try:
                tree = ast.parse(code)
                for node in ast.walk(tree):
                    if isinstance(node, (ast.FunctionDef, ast.ClassDef, ast.Module)):
                        docstring = ast.get_docstring(node)
                        if docstring:
                            if not any(c['text'] == docstring for c in comments):
                                comments.append({'text': docstring, 'line': node.lineno, 'type': 'docstring'})
            except: pass
        
        return sorted(comments, key=lambda x: x['line'])
    
    def analyze_consistency(self, comment_text: str, line_no: int, code_lines: List[str]) -> float:
        """
        Check if the comment matches the surrounding code (Heuristic).
        In a real app, this would call an LLM (Gemini/GPT).
        """
        # Look at the next few lines for function/variable names
        context = " ".join(code_lines[line_no : line_no + 3]).lower()
        comment = comment_text.lower()
        
        # Extract keywords from code (snake_case or camelCase)
        code_words = set(re.findall(r'[a-z]+', context))
        comment_words = set(re.findall(r'[a-z]+', comment))
        
        if not code_words: return 100.0
        
        # Logic: If comment mentions words that are strictly NOT in the nearby code, 
        # it might be outdated or irrelevant.
        # This is a simple heuristic; true consistency needs AI.
        common = comment_words.intersection(code_words)
        
        # If the comment is long and has NO common words with the nearby code
        if len(comment_words) > 4 and len(common) == 0:
            return 40.0 # High suspicion of mismatch
            
        return 100.0

    def analyze_comment_quality(self, comment: Dict, code_lines: List[str]) -> CommentAnalysis:
        text = comment['text']
        issues = []
        suggestions = []
        score = 100.0
        
        # Rule 1: Minimal info
        words = text.split()
        if len(text) < 12:
            issues.append("Oversimplified / Too short")
            suggestions.append("Provide a more descriptive explanation.")
            score -= 25
        
        # Rule 2: Technical Markers
        markers = {'TODO': 'Planned work', 'FIXME': 'Known bug', 'HACK': 'Technical debt'}
        for marker, desc in markers.items():
            if marker in text.upper():
                issues.append(f"Contains {marker} ({desc})")
                score -= 15

        # Rule 3: Consistency Check (The "Holy Grail" feature)
        c_score = self.analyze_consistency(text, comment['line'], code_lines)
        if c_score < 50:
            issues.append("CRITICAL: Potentially Outdated / Mismatched Documentation")
            suggestions.append("The comment mentions logic not found in the nearby code. Please verify.")
            score -= 40

        score = max(5, min(100, score))
        
        return CommentAnalysis(
            text=text,
            line_number=comment['line'],
            comment_type=comment['type'],
            quality_score=score,
            consistency_score=c_score,
            issues=issues,
            suggestions=suggestions
        )
    
    def calculate_metrics(self, code: str, filename: str) -> Dict:
        lines = code.split('\n')
        total_lines = len(lines)
        cfg = self._get_lang_config(filename)
        comment_lines = sum(1 for line in lines if any(line.strip().startswith(p) for p in cfg["single"] if p in ['#', '//']))
        blank_lines = sum(1 for line in lines if not line.strip())
        code_lines = total_lines - blank_lines - comment_lines
        return {
            'total_lines': total_lines,
            'code_lines': code_lines,
            'comment_lines': comment_lines,
            'comment_ratio': round((comment_lines / max(1, code_lines) * 100), 2)
        }

analyzer = CommentAnalyzer()

def analyze_single_file(filename: str, code: str) -> AnalysisResult:
    comments = analyzer.extract_comments(code, filename)
    code_lines = code.split('\n')
    analyzed_comments = [analyzer.analyze_comment_quality(c, code_lines) for c in comments]
    metrics = analyzer.calculate_metrics(code, filename)
    
    avg_quality = sum(c.quality_score for c in analyzed_comments) / len(analyzed_comments) if analyzed_comments else 0
    avg_consistency = sum(c.consistency_score for c in analyzed_comments) / len(analyzed_comments) if analyzed_comments else 100
    ratio = metrics['comment_ratio']
    ratio_mod = -20 if ratio < 5 else (-15 if ratio > 50 else 0)
    overall_score = max(0, min(100, avg_quality + ratio_mod))
    
    summary = {
        'total_comments': len(analyzed_comments),
        'high_quality': sum(1 for c in analyzed_comments if c.quality_score >= 80),
        'medium_quality': sum(1 for c in analyzed_comments if 50 <= c.quality_score < 80),
        'low_quality': sum(1 for c in analyzed_comments if c.quality_score < 50),
        'avg_comment_score': round(avg_quality, 2),
        'avg_consistency_score': round(avg_consistency, 2),
    }
    
    return AnalysisResult(
        file_name=filename,
        total_lines=metrics['total_lines'],
        code_lines=metrics['code_lines'],
        comment_lines=metrics['comment_lines'],
        comment_ratio=metrics['comment_ratio'],
        overall_score=round(overall_score, 2),
        comments=analyzed_comments,
        summary=summary
    )

@app.post("/analyze", response_model=AnalysisResult)
async def analyze_api(file: UploadFile = File(...)):
    try:
        content = (await file.read()).decode('utf-8')
        return analyze_single_file(file.filename, content)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/analyze-project", response_model=ProjectAnalysisResult)
async def analyze_project(file: UploadFile = File(...)):
    """Analyze a ZIP file containing a project"""
    if not file.filename.endswith('.zip'):
        raise HTTPException(status_code=400, detail="Please upload a .zip file")
        
    try:
        z_content = await file.read()
        z_file = zipfile.ZipFile(io.BytesIO(z_content))
        
        file_results = []
        supported_exts = analyzer.config["python"]["ext"] + analyzer.config["cpp_style"]["ext"]
        
        for name in z_file.namelist():
            if any(name.endswith(ext) for ext in supported_exts):
                try:
                    with z_file.open(name) as f:
                        content = f.read().decode('utf-8')
                        file_results.append(analyze_single_file(name, content))
                except: continue
        
        if not file_results:
            raise HTTPException(status_code=400, detail="No supported code files found in the zip.")
            
        proj_score = sum(f.overall_score for f in file_results) / len(file_results)
        
        return ProjectAnalysisResult(
            project_name=file.filename,
            overall_score=round(proj_score, 2),
            files=file_results,
            total_files=len(file_results)
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Project analysis failed: {str(e)}")

@app.get("/health")
async def health(): return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
