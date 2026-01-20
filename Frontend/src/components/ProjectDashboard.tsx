import React from 'react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    AlertTriangle,
    Trophy,
    Code2,
    TrendingUp,
    CheckCircle2,
    XCircle,
    ChevronRight,
    Search
} from 'lucide-react';
import type { ProjectAnalysisResult } from '../types';
import { getScoreColor, cn } from '../utils';

interface Props {
    project: ProjectAnalysisResult;
    onFileSelect: (index: number) => void;
}

const ProjectDashboard: React.FC<Props> = ({ project, onFileSelect }) => {
    // 1. Calculate Chronic Issues
    const issueCounts: Record<string, number> = {};
    project.files.forEach(file => {
        file.comments.forEach(c => {
            c.issues.forEach(issue => {
                issueCounts[issue] = (issueCounts[issue] || 0) + 1;
            });
        });
    });
    const chronicIssues = Object.entries(issueCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4);

    // 2. Leaderboard (URGENT FIXES - lowest scores)
    const urgentFiles = [...project.files]
        .sort((a, b) => a.overall_score - b.overall_score)
        .slice(0, 3);

    // 3. Language Distribution
    const langCounts: Record<string, number> = {};
    project.files.forEach(file => {
        const ext = file.file_name.split('.').pop()?.toLowerCase() || 'unknown';
        langCounts[ext] = (langCounts[ext] || 0) + 1;
    });
    const languages = Object.entries(langCounts).sort((a, b) => b[1] - a[1]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Global Summary */}
            <div className="bg-white border border-slate-200 p-8 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-violet-600 font-black uppercase text-[10px] tracking-[0.3em]">
                        <LayoutDashboard size={14} />
                        <span>Project Intelligence</span>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight uppercase">{project.project_name}</h2>
                    <p className="text-slate-500 text-sm font-medium">Global repository audit across {project.total_files} active modules.</p>
                </div>

                <div className="flex items-center gap-6 bg-slate-50 p-6 border border-slate-100 min-w-[200px] justify-center">
                    <div className="flex flex-col items-center">
                        <span className="text-4xl font-black tracking-tighter" style={{ color: getScoreColor(project.overall_score) }}>
                            {project.overall_score.toFixed(0)}%
                        </span>
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">Global Health</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Chronic Issues Panel */}
                <div className="bg-white border border-slate-200 p-8 space-y-6">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                        <AlertTriangle size={16} className="text-amber-500" />
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Chronic Regression Issues</h3>
                    </div>

                    <div className="space-y-4">
                        {chronicIssues.map(([issue, count], i) => (
                            <div key={i} className="flex justify-between items-center group">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                    <span className="text-xs text-slate-600 font-medium group-hover:text-slate-900 transition-colors">{issue}</span>
                                </div>
                                <span className="bg-rose-50 text-rose-700 text-[10px] font-black px-2 py-0.5 border border-rose-100">
                                    {count} FILES
                                </span>
                            </div>
                        ))}
                        {chronicIssues.length === 0 && (
                            <p className="text-xs text-slate-400 py-4 italic">No recurring issues detected across files.</p>
                        )}
                    </div>
                </div>

                {/* Leaderboard Panel */}
                <div className="bg-white border border-slate-200 p-8 space-y-6">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                        <Trophy size={16} className="text-violet-600" />
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Maintenance Hotspots</h3>
                    </div>

                    <div className="space-y-3">
                        {urgentFiles.map((file, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    const idx = project.files.findIndex(f => f.file_name === file.file_name);
                                    if (idx !== -1) onFileSelect(idx);
                                }}
                                className="w-full flex items-center justify-between p-3 border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-violet-200 transition-all text-left active:scale-[0.98]"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className="text-[10px] font-black text-slate-300">#0{i + 1}</span>
                                    <span className="text-xs font-bold text-slate-800 truncate">{file.file_name.split('/').pop()}</span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-xs font-black text-rose-500">{file.overall_score.toFixed(0)}%</span>
                                    <ChevronRight size={14} className="text-slate-300" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Language & Complexity */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white border border-slate-200 p-8 md:col-span-2">
                    <div className="flex items-center gap-2 mb-8 text-slate-400">
                        <Code2 size={14} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Language Distribution</span>
                    </div>

                    <div className="flex flex-wrap gap-8">
                        {languages.map(([lang, count]) => (
                            <div key={lang} className="flex flex-col items-center gap-2">
                                <div className="w-16 h-16 rounded-full border-4 border-slate-50 flex items-center justify-center relative">
                                    <svg className="w-16 h-16 transform -rotate-90 absolute top-0 left-0">
                                        <circle
                                            cx="32" cy="32" r="28"
                                            fill="none"
                                            stroke="#8b5cf6"
                                            strokeWidth="4"
                                            strokeDasharray="175.9"
                                            strokeDashoffset={175.9 - (175.9 * (count / project.total_files))}
                                        />
                                    </svg>
                                    <span className="text-[10px] font-black uppercase text-slate-900">{lang}</span>
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{count} Files</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900 text-white p-8 flex flex-col justify-between overflow-hidden relative group">
                    <TrendingUp className="absolute -bottom-8 -right-8 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform duration-700" />
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-70">Architecture Goal</h4>
                        <p className="text-lg font-bold leading-tight">Implement localized fixes for {chronicIssues[0]?.[1] || 0} modules to reach 90% Global Health.</p>
                    </div>
                    <div className="pt-8 border-t border-white/10 mt-8">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Target Progress</span>
                            <span className="text-xs font-black">{project.overall_score.toFixed(0)}%</span>
                        </div>
                        <div className="h-1 bg-white/10 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${project.overall_score}%` }}
                                className="h-full bg-violet-500"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDashboard;
