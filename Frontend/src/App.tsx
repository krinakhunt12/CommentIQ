import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Terminal,
  ChevronRight,
  RotateCcw,
  ShieldCheck,
  Layers,
  FileDown,
  LayoutDashboard,
  Search,
  Settings,
  Github,
  X,
  Zap,
  CheckCircle2,
  FileCode
} from 'lucide-react';
import type { AnalysisResult, ProjectAnalysisResult, CommentAnalysis } from './types';
import FileUpload from './components/FileUpload';
import AnalysisSummary from './components/AnalysisSummary';
import CommentCard from './components/CommentCard';
import ProjectSidebar from './components/ProjectSidebar';
import LandingPage from './components/LandingPage';
import ProjectDashboard from './components/ProjectDashboard';
import PolicyCenter from './components/PolicyCenter';
import type { AuditPolicy } from './components/PolicyCenter';
import { cn, downloadAuditReport } from './utils';
import './App.css';

const INITIAL_POLICIES: AuditPolicy[] = [
  { id: 'jsdoc', name: 'Strict JSDoc Enforcement', description: 'Flag functions missing standardized JSDoc parameter and return documentation.', enabled: true, severity: 'Medium' },
  { id: 'min_length', name: 'Comment Density Guard', description: 'Enforce a minimum of 5 words per significant logic block explanation.', enabled: true, severity: 'Low' },
  { id: 'no_todo_production', name: 'Production Debt Lockdown', description: 'Critical failure for TODO/FIXME tags found in main-branch candidates.', enabled: true, severity: 'High' },
  { id: 'context_overlap', name: 'Contextual Sychronicity', description: 'Strict enforcement of semantic overlap between variable names and comments.', enabled: false, severity: 'Medium' },
];

const App: React.FC = () => {
  const [showApp, setShowApp] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [projectResult, setProjectResult] = useState<ProjectAnalysisResult | null>(null);
  const [activeFileIdx, setActiveFileIdx] = useState<number | 'dashboard' | 'search' | 'policies'>('dashboard');
  const [error, setError] = useState<string>('');

  // New States for requested features
  const [policies, setPolicies] = useState<AuditPolicy[]>(INITIAL_POLICIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedRefactors, setAppliedRefactors] = useState<{ file: string, lineNumber: number, original: string, refactored: string }[]>([]);
  const [showPRMock, setShowPRMock] = useState(false);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setError('');
    if (result || projectResult) {
      setResult(null);
      setProjectResult(null);
      setAppliedRefactors([]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Module selection required. Please upload a source file or repository.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    const isZip = file.name.endsWith('.zip');
    const endpoint = isZip ? '/analyze-project' : '/analyze';

    try {
      const response = await axios.post<AnalysisResult | ProjectAnalysisResult>(
        `http://localhost:8000${endpoint}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (isZip) {
        setProjectResult(response.data as ProjectAnalysisResult);
        setActiveFileIdx('dashboard');
      } else {
        setResult(response.data as AnalysisResult);
        setActiveFileIdx(0);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Analysis engine connection failure. Check backend status.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setProjectResult(null);
    setError('');
    setAppliedRefactors([]);
    setActiveFileIdx('dashboard');
  };

  const togglePolicy = (id: string) => {
    setPolicies(prev => prev.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));
  };

  const currentResult = projectResult
    ? (typeof activeFileIdx === 'number' ? projectResult.files[activeFileIdx] : null)
    : result;

  // Feature 1: Semantic Search Logic
  const searchResults = useMemo(() => {
    if (!searchQuery || !projectResult) return [];
    const results: { file: AnalysisResult, comment: CommentAnalysis }[] = [];
    projectResult.files.forEach(f => {
      f.comments.forEach(c => {
        const matchesQuery =
          c.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.issues.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()));
        if (matchesQuery) results.push({ file: f, comment: c });
      });
    });
    return results;
  }, [searchQuery, projectResult]);

  const onRefactorApplied = (file: string, lineNumber: number, original: string, refactored: string) => {
    setAppliedRefactors(prev => [...prev.filter(r => !(r.file === file && r.lineNumber === lineNumber)), { file, lineNumber, original, refactored }]);
  };

  if (!showApp) {
    return <LandingPage onLaunch={() => {
      setShowApp(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }} />;
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-violet-100 selection:text-violet-900">
      <header className="relative z-50 py-6 px-6 bg-white border-b border-slate-100 sticky top-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowApp(false)}>
            <div className="p-1.5 bg-slate-900 text-white rounded-sm">
              <Sparkles size={18} />
            </div>
            <h1 className="text-lg font-bold tracking-tight uppercase text-slate-900">
              CommentIQ
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {(projectResult || result) && (
              <div className="flex items-center gap-2">
                {appliedRefactors.length > 0 && (
                  <button
                    onClick={() => setShowPRMock(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all border border-emerald-500"
                  >
                    <Github size={14} />
                    <span>Generate PR ({appliedRefactors.length})</span>
                  </button>
                )}
                <button
                  onClick={() => downloadAuditReport(projectResult || result!)}
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 border border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all"
                >
                  <FileDown size={14} />
                  <span>Export Audit</span>
                </button>
              </div>
            )}

            <button
              onClick={() => setShowApp(false)}
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-violet-600 transition-colors px-2"
            >
              Exit
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 py-12 px-6">
        <div className={cn(
          "mx-auto transition-all duration-300",
          projectResult ? "max-w-[1400px]" : "max-w-3xl"
        )}>

          <AnimatePresence mode="wait">
            {!projectResult && !result ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white p-10 lg:p-16 border border-slate-200"
              >
                <div className="flex flex-col gap-2 mb-12 items-center text-center">
                  <div className="inline-flex items-center gap-2 text-violet-600 font-bold uppercase text-[10px] tracking-[0.3em]">
                    <Terminal size={12} />
                    <span>Deployment Terminal</span>
                  </div>
                  <h2 className="text-4xl font-bold text-slate-900 tracking-tighter uppercase">Initialize Scan</h2>
                  <div className="h-0.5 w-12 bg-violet-600 my-2" />
                  <p className="text-slate-500 text-sm max-w-sm">Provide a single source module or a compressed project archive for evaluation.</p>
                </div>

                <FileUpload
                  onFileSelect={handleFileSelect}
                  selectedFile={file}
                  loading={loading}
                />

                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 bg-rose-50 border border-rose-100 flex items-center gap-4 text-rose-800 text-xs font-bold mb-8 uppercase tracking-wide"
                  >
                    <ShieldCheck size={16} />
                    <span>{error}</span>
                  </motion.div>
                )}

                <button
                  onClick={handleAnalyze}
                  disabled={!file || loading}
                  className={cn(
                    "w-full py-5 text-sm font-bold uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4",
                    !file || loading
                      ? "bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-200"
                      : "bg-slate-900 text-white hover:bg-violet-700 active:scale-[0.99]"
                  )}
                >
                  {loading ? (
                    <div className="flex items-center gap-4">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Processing Payload...</span>
                    </div>
                  ) : (
                    <>
                      <span>Execute Audit</span>
                      <ChevronRight size={18} />
                    </>
                  )}
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col lg:flex-row gap-8 items-start"
              >
                {projectResult && (
                  <div className="w-full lg:w-72 space-y-2 sticky top-28">
                    <div className="grid grid-cols-3 bg-white border border-slate-200 p-1 mb-4">
                      <button
                        onClick={() => setActiveFileIdx('dashboard')}
                        className={cn("p-2 transition-all flex items-center justify-center", activeFileIdx === 'dashboard' ? "bg-slate-900 text-white" : "text-slate-400 hover:bg-slate-50")}
                        title="Dashboard"
                      >
                        <LayoutDashboard size={16} />
                      </button>
                      <button
                        onClick={() => setActiveFileIdx('search')}
                        className={cn("p-2 transition-all flex items-center justify-center", activeFileIdx === 'search' ? "bg-slate-900 text-white" : "text-slate-400 hover:bg-slate-50")}
                        title="Search"
                      >
                        <Search size={16} />
                      </button>
                      <button
                        onClick={() => setActiveFileIdx('policies')}
                        className={cn("p-2 transition-all flex items-center justify-center", activeFileIdx === 'policies' ? "bg-slate-900 text-white" : "text-slate-400 hover:bg-slate-50")}
                        title="Policies"
                      >
                        <Settings size={16} />
                      </button>
                    </div>

                    <ProjectSidebar
                      files={projectResult.files}
                      activeFile={typeof activeFileIdx === 'number' ? projectResult.files[activeFileIdx].file_name : null}
                      onFileSelect={(name) => {
                        const idx = projectResult.files.findIndex(f => f.file_name === name);
                        if (idx !== -1) setActiveFileIdx(idx);
                      }}
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0 w-full space-y-8">
                  {/* Global Actions Bar */}
                  {(projectResult || result) && (
                    <div className="flex flex-wrap items-center justify-between gap-4 sticky top-24 z-20 bg-white/95 backdrop-blur-sm p-4 border border-slate-200 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-900 text-white rounded-sm">
                          {activeFileIdx === 'dashboard' && <LayoutDashboard size={16} />}
                          {activeFileIdx === 'search' && <Search size={16} />}
                          {activeFileIdx === 'policies' && <Settings size={16} />}
                          {typeof activeFileIdx === 'number' && <Layers size={16} />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase text-violet-600 tracking-widest leading-none mb-0.5">
                            {typeof activeFileIdx === 'string' ? activeFileIdx : 'Target Scope'}
                          </span>
                          <strong className="text-slate-800 font-bold truncate block max-w-[150px] md:max-w-md uppercase tracking-tighter">
                            {activeFileIdx === 'dashboard' ? 'Insight View' :
                              activeFileIdx === 'search' ? 'Semantic Engine' :
                                activeFileIdx === 'policies' ? 'Compliance Panel' : (currentResult?.file_name || 'Analysis Output')}
                          </strong>
                        </div>
                      </div>
                      <button
                        onClick={reset}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-900 text-slate-900 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all active:scale-95"
                      >
                        <RotateCcw size={14} />
                        <span>Reset Engine</span>
                      </button>
                    </div>
                  )}

                  {activeFileIdx === 'dashboard' && projectResult && (
                    <ProjectDashboard project={projectResult} onFileSelect={(idx) => setActiveFileIdx(idx)} />
                  )}

                  {activeFileIdx === 'policies' && (
                    <PolicyCenter policies={policies} onToggle={togglePolicy} />
                  )}

                  {activeFileIdx === 'search' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="bg-white border border-slate-200 p-8 space-y-6">
                        <div className="relative">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="SEARCH CROSS-MODULE TOKENS OR ISSUES (e.g. TODO, login, db)..."
                            className="w-full pl-12 pr-4 py-5 bg-slate-50 border border-slate-100 font-mono text-sm uppercase tracking-wider outline-none focus:border-violet-500 focus:bg-white transition-all shadow-inner"
                          />
                        </div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Semantic search indexing across {projectResult?.total_files || 1} modules.</p>
                      </div>

                      <div className="space-y-4">
                        {searchResults.length > 0 ? (
                          searchResults.map((res, i) => (
                            <div key={i} className="bg-white border border-slate-200 hover:border-violet-300 transition-all">
                              <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <FileCode size={12} className="text-slate-400" />
                                  <span className="text-[10px] font-black uppercase text-slate-600 truncate max-w-[200px]">{res.file.file_name}</span>
                                </div>
                                <button
                                  onClick={() => {
                                    const idx = projectResult?.files.findIndex(f => f.file_name === res.file.file_name);
                                    if (idx !== -1 && idx !== undefined) setActiveFileIdx(idx);
                                  }}
                                  className="text-[9px] font-black uppercase text-violet-600 hover:underline"
                                >
                                  Jump to Source
                                </button>
                              </div>
                              <CommentCard comment={res.comment} />
                            </div>
                          ))
                        ) : searchQuery && (
                          <div className="py-24 text-center border border-slate-100 bg-slate-50/50">
                            <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px]">Zero matches found in semantic index</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {typeof activeFileIdx === 'number' && (
                    <>
                      {currentResult && <AnalysisSummary result={currentResult} />}

                      {currentResult && (
                        <div className="py-8 border-y border-slate-100 space-y-2">
                          <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">Module Catalog</h2>
                          <div className="flex items-center gap-3">
                            <p className="text-slate-900 text-xl font-bold tracking-tight uppercase">{currentResult.file_name.split('/').pop()}</p>
                            <div className="px-1.5 py-0.5 bg-slate-900 text-white text-[9px] font-black uppercase rounded-sm">
                              {currentResult.comments.length} Findings
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="space-y-4">
                        {currentResult?.comments.map((comment, idx) => (
                          <CommentCard
                            key={`${currentResult.file_name}-${idx}`}
                            comment={comment}
                            onRefactor={(original, refactored) => onRefactorApplied(currentResult.file_name, comment.line_number, original, refactored)}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Feature 2: PR Mock Overlay */}
      <AnimatePresence>
        {showPRMock && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setShowPRMock(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white max-w-2xl w-full border border-slate-200 overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Github size={20} />
                  <h3 className="text-lg font-bold uppercase tracking-tight">Direct-to-Git PR Blueprint</h3>
                </div>
                <button onClick={() => setShowPRMock(false)}><X size={20} /></button>
              </div>

              <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase text-violet-600 tracking-widest">Pull Request Title</span>
                  <div className="p-4 bg-slate-50 border border-slate-200 font-mono text-xs">
                    docs: Refactor {appliedRefactors.length} documentation anomalies via CommentIQ Audit
                  </div>
                </div>

                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase text-violet-600 tracking-widest">PR Description Template</span>
                  <div className="p-6 bg-slate-50 border border-slate-100 font-mono text-[11px] leading-relaxed text-slate-700 space-y-4">
                    <p>## Summary</p>
                    <p>This automated PR addresses several documentation-code drift anomalies detected during a CommentIQ audit. Total health points recovered: **+{appliedRefactors.length * 12} pts**.</p>

                    <p>## Refactored Modules</p>
                    <ul className="list-disc pl-5 space-y-2">
                      {Array.from(new Set(appliedRefactors.map(r => r.file))).map(file => (
                        <li key={file}>`{file}` ({appliedRefactors.filter(r => r.file === file).length} improvements)</li>
                      ))}
                    </ul>

                    <p>## Intelligence Logs</p>
                    <div className="p-3 bg-white border border-slate-200">
                      {appliedRefactors.slice(0, 3).map((r, i) => (
                        <div key={i} className="mb-2 last:mb-0">
                          <p className="text-[9px] font-bold text-violet-600 uppercase">Change {i + 1} : {r.file}:L{r.lineNumber}</p>
                          <p className="text-[10px] line-through opacity-40">-{r.original}</p>
                          <p className="text-[10px] text-emerald-700">+{r.refactored}</p>
                        </div>
                      ))}
                      {appliedRefactors.length > 3 && <p className="text-[9px] italic opacity-50">... and {appliedRefactors.length - 3} more refinements.</p>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-slate-100 bg-slate-50 flex justify-end">
                <button
                  onClick={() => setShowPRMock(false)}
                  className="px-8 py-4 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest hover:bg-violet-700 transition-all flex items-center gap-3"
                >
                  <Zap size={14} className="fill-white" />
                  Push to Deployment Branch
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="relative z-10 py-16 text-center text-slate-300 border-t border-slate-50">
        <p className="text-[10px] font-bold tracking-[0.4em] uppercase">© 2026 CommentIQ Intelligence | Architecture Verified</p>
      </footer>
    </div>
  );
};

export default App;