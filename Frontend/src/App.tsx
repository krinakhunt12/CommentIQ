import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Terminal, ChevronRight, RotateCcw, ShieldCheck, Layers, BookOpen } from 'lucide-react';
import type { AnalysisResult, ProjectAnalysisResult } from './types';
import FileUpload from './components/FileUpload';
import AnalysisSummary from './components/AnalysisSummary';
import CommentCard from './components/CommentCard';
import ProjectSidebar from './components/ProjectSidebar';
import LandingPage from './components/LandingPage';
import { cn } from './utils';
import './App.css';

const App: React.FC = () => {
  const [showApp, setShowApp] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [projectResult, setProjectResult] = useState<ProjectAnalysisResult | null>(null);
  const [activeFileIdx, setActiveFileIdx] = useState<number>(0);
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
      setError('Please select a file or .zip repository first');
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
        setActiveFileIdx(0);
      } else {
        setResult(response.data as AnalysisResult);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error connecting to analysis engine. Verify backend is running.');
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

  const currentResult = projectResult ? projectResult.files[activeFileIdx] : result;

  if (!showApp) {
    return <LandingPage onLaunch={() => {
      setShowApp(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }} />;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-200/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-30 pointer-events-none bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      <header className="relative z-50 py-8 px-6 backdrop-blur-md bg-white/70 border-b border-slate-100 sticky top-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowApp(false)}>
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
              <Sparkles size={22} className="text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              QualityCheck
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <a href="https://github.com" target="_blank" className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <BookOpen size={20} />
            </a>
            <button
              onClick={() => setShowApp(false)}
              className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 py-12 px-6">
        <div className={cn(
          "mx-auto transition-all duration-500 ease-in-out",
          projectResult ? "max-w-[1400px]" : "max-w-4xl"
        )}>

          <AnimatePresence mode="wait">
            {!currentResult ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                  <div className="space-y-2 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 text-indigo-600 font-black uppercase text-xs tracking-[0.2em]">
                      <Terminal size={14} />
                      <span>Input Terminal</span>
                    </div>
                    <h2 className="text-3xl font-black text-slate-800">New Code Audit</h2>
                    <p className="text-slate-500">Analyze a module or drop a full ZIP repository.</p>
                  </div>
                </div>

                <FileUpload
                  onFileSelect={handleFileSelect}
                  selectedFile={file}
                  loading={loading}
                />

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-4 text-rose-800 text-sm font-semibold mb-8"
                  >
                    <div className="p-2 bg-rose-500 text-white rounded-xl">
                      <ShieldCheck size={18} />
                    </div>
                    <span>{error}</span>
                  </motion.div>
                )}

                <button
                  onClick={handleAnalyze}
                  disabled={!file || loading}
                  className={cn(
                    "w-full py-5 rounded-2xl text-lg font-black transition-all flex items-center justify-center gap-3 relative overflow-hidden group shadow-lg ring-offset-2 focus:ring-2 ring-indigo-500",
                    !file || loading
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                      : "bg-indigo-600 text-white hover:bg-slate-900 active:scale-[0.98] shadow-indigo-100"
                  )}
                >
                  {loading ? (
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Syncing Brain...</span>
                    </div>
                  ) : (
                    <>
                      <span>Examine Documentation</span>
                      <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
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
                  <ProjectSidebar
                    files={projectResult.files}
                    activeFile={currentResult.file_name}
                    onFileSelect={(name) => {
                      const idx = projectResult.files.findIndex(f => f.file_name === name);
                      if (idx !== -1) setActiveFileIdx(idx);
                    }}
                  />
                )}

                <div className="flex-1 min-w-0 w-full space-y-8">
                  <div className="flex flex-wrap items-center justify-between gap-4 sticky top-28 z-20 backdrop-blur-md bg-white/70 p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 text-slate-600 rounded-xl">
                        <Layers size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase text-indigo-600 mb-0.5">Active Scope</span>
                        <strong className="text-slate-800 truncate block max-w-[200px] md:max-w-md">
                          {projectResult ? projectResult.project_name : currentResult.file_name}
                        </strong>
                      </div>
                    </div>
                    <button
                      onClick={reset}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-all active:scale-95 border border-indigo-100"
                    >
                      <RotateCcw size={16} />
                      <span>New Audit</span>
                    </button>
                  </div>

                  <AnalysisSummary result={currentResult} />

                  <div className="py-6 border-b border-slate-200">
                    <h2 className="text-2xl font-black text-slate-800">Comment Inspection</h2>
                    <p className="text-slate-500 text-sm">Automated clarity scores for {currentResult.file_name}.</p>
                  </div>

                  <div className="space-y-4">
                    {currentResult.comments.map((comment, idx) => (
                      <CommentCard key={`${currentResult.file_name}-${idx}`} comment={comment} />
                    ))}

                    {currentResult.comments.length === 0 && (
                      <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-slate-100">
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No comments found to inspect.</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="relative z-10 py-12 text-center text-slate-400 border-t border-slate-100">
        <p className="text-[10px] font-black tracking-[0.3em] uppercase">© QualityCheck Intelligence Framework</p>
      </footer>
    </div>
  );
};

export default App;