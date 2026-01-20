import React, { useState } from 'react';
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
  LayoutGrid
} from 'lucide-react';
import type { AnalysisResult, ProjectAnalysisResult } from './types';
import FileUpload from './components/FileUpload';
import AnalysisSummary from './components/AnalysisSummary';
import CommentCard from './components/CommentCard';
import ProjectSidebar from './components/ProjectSidebar';
import LandingPage from './components/LandingPage';
import ProjectDashboard from './components/ProjectDashboard';
import { cn, downloadAuditReport } from './utils';
import './App.css';

const App: React.FC = () => {
  const [showApp, setShowApp] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [projectResult, setProjectResult] = useState<ProjectAnalysisResult | null>(null);
  const [activeFileIdx, setActiveFileIdx] = useState<number | 'dashboard'>('dashboard');
  const [error, setError] = useState<string>('');

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setError('');
    if (result || projectResult) {
      setResult(null);
      setProjectResult(null);
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
  };

  const currentResult = projectResult
    ? (activeFileIdx === 'dashboard' ? null : projectResult.files[activeFileIdx as number])
    : result;

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
              <button
                onClick={() => downloadAuditReport(projectResult || result!)}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 border border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95"
              >
                <FileDown size={14} />
                <span>Export Audit</span>
              </button>
            )}

            <button
              onClick={() => setShowApp(false)}
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-violet-600 transition-colors px-2"
            >
              Exit
            </button>
            <div className="w-px h-4 bg-slate-100" />
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-slate-400 tracking-widest bg-slate-50 px-3 py-1 border border-slate-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Audit
            </div>
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
                  <div className="w-full lg:w-72 space-y-4 sticky top-28">
                    <button
                      onClick={() => setActiveFileIdx('dashboard')}
                      className={cn(
                        "w-full flex items-center gap-3 p-4 transition-all text-left border border-slate-200 uppercase font-black text-[10px] tracking-widest",
                        activeFileIdx === 'dashboard' ? "bg-slate-900 text-white" : "bg-white text-slate-500 hover:bg-slate-50"
                      )}
                    >
                      <LayoutDashboard size={14} />
                      <span>Intelligence Overview</span>
                    </button>

                    <ProjectSidebar
                      files={projectResult.files}
                      activeFile={activeFileIdx === 'dashboard' ? null : projectResult.files[activeFileIdx as number].file_name}
                      onFileSelect={(name) => {
                        const idx = projectResult.files.findIndex(f => f.file_name === name);
                        if (idx !== -1) setActiveFileIdx(idx);
                      }}
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0 w-full space-y-8">
                  {/* Result Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 sticky top-24 z-20 bg-white/95 backdrop-blur-sm p-4 border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-900 text-white rounded-sm">
                        {activeFileIdx === 'dashboard' ? <LayoutDashboard size={16} /> : <Layers size={16} />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase text-violet-600 tracking-widest mb-0.5 leading-none">
                          {activeFileIdx === 'dashboard' ? 'Insight View' : 'Target Scope'}
                        </span>
                        <strong className="text-slate-800 font-bold truncate block max-w-[200px] md:max-w-md uppercase tracking-tighter">
                          {activeFileIdx === 'dashboard' ? 'Project Dashboard' : (currentResult?.file_name || 'Analysis Output')}
                        </strong>
                      </div>
                    </div>
                    <button
                      onClick={reset}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-900 text-slate-900 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all active:scale-95"
                    >
                      <RotateCcw size={14} />
                      <span>Release Modules</span>
                    </button>
                  </div>

                  {activeFileIdx === 'dashboard' && projectResult ? (
                    <ProjectDashboard project={projectResult} onFileSelect={(idx) => setActiveFileIdx(idx)} />
                  ) : (
                    <>
                      {currentResult && <AnalysisSummary result={currentResult} />}

                      {currentResult && (
                        <div className="py-8 border-y border-slate-100 space-y-2">
                          <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">Documentation Catalog</h2>
                          <p className="text-slate-900 text-xl font-bold tracking-tight uppercase">Audit findings for {currentResult.file_name.split('/').pop()}</p>
                        </div>
                      )}

                      <div className="space-y-4">
                        {currentResult?.comments.map((comment, idx) => (
                          <CommentCard key={`${currentResult.file_name}-${idx}`} comment={comment} />
                        ))}

                        {currentResult?.comments.length === 0 && (
                          <div className="py-24 text-center border border-slate-100 bg-slate-50/50">
                            <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px]">Zero Comment Anomalies Detected</p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="relative z-10 py-16 text-center text-slate-300 border-t border-slate-50">
        <p className="text-[10px] font-bold tracking-[0.4em] uppercase">© 2026 CommentIQ Intelligence | Encrypted Audit</p>
      </footer>
    </div>
  );
};

export default App;