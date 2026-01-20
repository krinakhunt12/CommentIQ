import re
import ast
import zipfile
import io
import os
import asyncio
import json
from typing import List, Dict, Optional, Any, Set
from fastapi import FastAPI, UploadFile, File, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

app = FastAPI(title="CommentIQ Enterprise Platform")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this. For local dev, allow all.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- TYPES ---

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

# --- CORE LOGIC ---

class CommentAnalyzer:
    def __init__(self):
        self.config = {
            "python": {
                "single": [r'#'],
                "multi": [(r"'''", r"'''"), (r'"""', r'"""')],
                "ext": [".py"]
            },
            "cpp_style": {
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
        return self.config["cpp_style"]

    def extract_comments(self, code: str, filename: str) -> List[Dict]:
        comments = []
        lines = code.split('\n')
        cfg = self._get_lang_config(filename)
        
        for i, line in enumerate(lines, 1):
            stripped = line.strip()
            for pattern in cfg["single"]:
                if pattern == '//' and stripped.startswith('//'):
                    comments.append({'text': stripped[2:].strip(), 'line': i, 'type': 'single-line'})
                elif pattern == '#' and stripped.startswith('#'):
                    comments.append({'text': stripped[1:].strip(), 'line': i, 'type': 'single-line'})

        for start_pat, end_pat in cfg["multi"]:
            matches = re.finditer(f"{start_pat}(.*?){end_pat}", code, re.DOTALL)
            for match in matches:
                start_line = code.count('\n', 0, match.start()) + 1
                text = match.group(1).strip()
                if text:
                    comments.append({'text': text, 'line': start_line, 'type': 'multi-line'})

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
        context = " ".join(code_lines[line_no : line_no + 3]).lower()
        comment = comment_text.lower()
        code_words = set(re.findall(r'[a-z]+', context))
        comment_words = set(re.findall(r'[a-z]+', comment))
        if not code_words: return 100.0
        common = comment_words.intersection(code_words)
        if len(comment_words) > 4 and len(common) == 0:
            return 40.0
        return 100.0

    def analyze_comment_quality(self, comment: Dict, code_lines: List[str]) -> CommentAnalysis:
        text = comment['text']
        issues = []
        suggestions = []
        score = 100.0
        
        if len(text) < 12:
            issues.append("Oversimplified / Too short")
            suggestions.append("Provide a more descriptive explanation.")
            score -= 25
        
        markers = {'TODO': 'Planned work', 'FIXME': 'Known bug', 'HACK': 'Technical debt'}
        for marker, desc in markers.items():
            if marker in text.upper():
                issues.append(f"Contains {marker} ({desc})")
                score -= 15

        c_score = self.analyze_consistency(text, comment['line'], code_lines)
        if c_score < 50:
            issues.append("CRITICAL: Potentially Outdated / Mismatched Documentation")
            suggestions.append("The comment mentions logic not found in the nearby code. Please verify.")
            score -= 40

        score = max(5, min(100, score))
        return CommentAnalysis(
            text=text, line_number=comment['line'], comment_type=comment['type'],
            quality_score=score, consistency_score=c_score, issues=issues, suggestions=suggestions
        )
    
    def calculate_metrics(self, code: str, filename: str) -> Dict:
        lines = code.split('\n')
        total_lines = len(lines)
        cfg = self._get_lang_config(filename)
        comment_lines = sum(1 for line in lines if any(line.strip().startswith(p) for p in cfg["single"] if p in ['#', '//']))
        blank_lines = sum(1 for line in lines if not line.strip())
        code_lines = total_lines - blank_lines - comment_lines
        return {
            'total_lines': total_lines, 'code_lines': code_lines, 'comment_lines': comment_lines,
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
        file_name=filename, total_lines=metrics['total_lines'], code_lines=metrics['code_lines'],
        comment_lines=metrics['comment_lines'], comment_ratio=metrics['comment_ratio'],
        overall_score=round(overall_score, 2), comments=analyzed_comments, summary=summary
    )

# --- REAL-TIME & WEBSOCKETS ---

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except:
                pass

manager = ConnectionManager()

class SentinelHandler(FileSystemEventHandler):
    def __init__(self, loop, directory):
        self.loop = loop
        self.directory = directory
        self.supported_exts = analyzer.config["python"]["ext"] + analyzer.config["cpp_style"]["ext"]

    def on_modified(self, event):
        if event.is_directory: return
        filename = event.src_path
        if any(filename.endswith(ext) for ext in self.supported_exts):
            asyncio.run_coroutine_threadsafe(self.process_file(filename), self.loop)

    async def process_file(self, full_path):
        try:
            with open(full_path, 'r', encoding='utf-8') as f:
                content = f.read()
            # Relative path for the UI
            rel_path = os.path.relpath(full_path, self.directory)
            result = analyze_single_file(rel_path, content)
            await manager.broadcast({
                "type": "file_update",
                "data": result.dict()
            })
        except Exception as e:
            print(f"Sentinel error processing {full_path}: {e}")

# Global watcher state
active_sentinel: Optional[Observer] = None

# --- ENDPOINTS ---

@app.post("/analyze", response_model=AnalysisResult)
async def analyze_api(file: UploadFile = File(...)):
    try:
        content = (await file.read()).decode('utf-8')
        return analyze_single_file(file.filename, content)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, session_id: Optional[str] = "global"):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Handle collaborative messages (War Room)
            msg = json.loads(data)
            if msg.get("type") == "refactor":
                # Broadcast refactor events to all other users in shift
                await manager.broadcast({
                    "type": "peer_refactor",
                    "user": msg.get("user", "Anonymous"),
                    "file": msg.get("file"),
                    "session": session_id
                })
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.get("/analyze-project-stream")
async def analyze_project_stream(project_id: str):
    """
    Mock SSE for streaming ZIP analysis results.
    In a real scenario, this would work with a previously uploaded ZIP.
    Here we simulation the step-by-step emitting.
    """
    async def event_generator():
        # Simulation of project load
        yield {"event": "status", "data": json.dumps({"message": "Initializing Semantic Engine..."})}
        await asyncio.sleep(1)
        
        # We'd normally get this from a database/cache or the uploaded zip
        mock_files = ["auth.py", "db_utils.ts", "main.tsx", "models.py", "api_handler.go"]
        for i, file in enumerate(mock_files):
            yield {"event": "file_processed", "data": json.dumps({
                "index": i,
                "total": len(mock_files),
                "file": file,
                "score": 70 + (i * 5) % 30
            })}
            await asyncio.sleep(0.5)
        
        yield {"event": "complete", "data": json.dumps({"message": "Project scan absolute."})}

    return EventSourceResponse(event_generator())

@app.post("/sentinel/start")
async def start_sentinel(directory: str):
    global active_sentinel
    if not os.path.exists(directory):
        raise HTTPException(status_code=404, detail="Directory not found.")
    
    if active_sentinel:
        active_sentinel.stop()
        active_sentinel.join()
    
    loop = asyncio.get_event_loop()
    event_handler = SentinelHandler(loop, directory)
    active_sentinel = Observer()
    active_sentinel.schedule(event_handler, directory, recursive=True)
    active_sentinel.start()
    
    return {"status": "Sentinel active", "path": directory}

@app.post("/sentinel/stop")
async def stop_sentinel():
    global active_sentinel
    if active_sentinel:
        active_sentinel.stop()
        active_sentinel.join()
        active_sentinel = None
        return {"status": "Sentinel stopped"}
    return {"status": "Sentinel was not active"}

@app.get("/health")
async def health(): return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
