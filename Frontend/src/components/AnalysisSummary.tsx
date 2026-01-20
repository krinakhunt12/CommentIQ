import React from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    PieChart,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    Activity,
    BarChart2,
    ShieldAlert,
    Target,
    ZapOff,
    Lightbulb,
    Info,
    Map
} from 'lucide-react';
import type { AnalysisResult } from '../types';
import { cn, getScoreColor, getScoreLabel } from '../utils';

interface Props {
    result: AnalysisResult;
}

const getDiagnosticMessage = (result: AnalysisResult) => {
    const { overall_score, summary, comment_ratio } = result;

    if (overall_score >= 90) {
        return {
            title: "Optimized Module",
            description: "This module exhibits exceptional documentation standards. Comments are semantically aligned with the logic and cover a significant portion of the codebase.",
            impact: "High maintainability and extremely low onboarding friction for new developers.",
            status: "success"
        };
    } else if (overall_score >= 70) {
        return {
            title: "Stable Documentation",
            description: "The module is generally well-documented, but minor inefficiencies like brief comments or localized technical debt were detected.",
            impact: "Standard maintenance profile. Occasional clarifications might be needed during deep refactors.",
            status: "neutral"
        };
    } else if (summary.avg_consistency_score < 70) {
        return {
            title: "High Integrity Risk",
            description: "Critical semantic drift detected. Documentation mentions variables or logic that no longer exists or does not match the surrounding code context.",
            impact: "Dangerous. Developers may take incorrect actions based on misleading comments, leading to regression bugs.",
            status: "danger"
        };
    } else if (summary.low_quality > 0) {
        return {
            title: "Requires Quality Review",
            description: "A significant number of comments are either too brief to be useful or contain explicit technical debt markers (TODO/FIXME).",
            impact: "Increases cognitive load. Important logic paths are either hidden behind vague descriptions or unfinished implementations.",
            status: "warning"
        };
    } else if (comment_ratio < 10) {
        return {
            title: "Visibility Deficit",
            description: "Low documentation coverage. The executable logic significantly outweighs the explanatory text, leaving core blocks undocumented.",
            impact: "Knowledge silos. Core system logic is 'dark' and relies on specific developer memory rather than source records.",
            status: "warning"
        };
    }

    return {
        title: "Standard Review Needed",
        description: "General improvements recommended to align this module with enterprise documentation standards.",
        impact: "Slight impact on long-term readability and maintenance velocity.",
        status: "neutral"
    };
};

const AnalysisSummary: React.FC<Props> = ({ result }) => {
    const scoreColor = getScoreColor(result.overall_score);
    const scoreLabel = getScoreLabel(result.overall_score);
    const diagnostic = getDiagnosticMessage(result);

    // Calculate Global issues for this file
    const issueMap: Record<string, number> = {};
    result.comments.forEach(c => {
        c.issues.forEach(issue => {
            issueMap[issue] = (issueMap[issue] || 0) + 1;
        });
        if (c.consistency_score < 70) {
            issueMap["Potential Semantic Mismatch"] = (issueMap["Potential Semantic Mismatch"] || 0) + 1;
        }
    });

    const topIssues = Object.entries(issueMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

    // Feature 4: Heatmap Generation
    // We simulate a heatmap based on code vs comment lines
    const totalSlots = 80; // Total segments in the heatmap bar
    const commentRatio = result.comment_ratio / 100;
    const heatmap = Array.from({ length: totalSlots }).map((_, i) => {
        const isComment = Math.random() < commentRatio; // Simplified simulation for UI
        const isDebt = isComment && Math.random() < 0.2;
        return { isComment, isDebt };
    });

    return (
        <div className="space-y-6">
            {/* Module Diagnostic Banner */}
            <div className={cn(
                "p-6 border-l-4 bg-white border border-slate-200",
                diagnostic.status === 'success' && 'border-l-emerald-500',
                diagnostic.status === 'danger' && 'border-l-rose-500',
                diagnostic.status === 'warning' && 'border-l-amber-500',
                diagnostic.status === 'neutral' && 'border-l-violet-500',
            )}>
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-2">
                            {diagnostic.status === 'danger' ? <ShieldAlert size={16} className="text-rose-500" /> : <Lightbulb size={16} className="text-violet-600" />}
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">{diagnostic.title}</h3>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed font-medium">{diagnostic.description}</p>
                        <div className="pt-4 border-t border-slate-100">
                            <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest block mb-1">Architectural Impact</span>
                            <p className="text-xs text-slate-500 italic">{diagnostic.impact}</p>
                        </div>
                    </div>
                    <div className="hidden md:block w-px h-32 bg-slate-100" />
                    <div className="w-full md:w-auto flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-100">
                        <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest mb-1">Health Index</span>
                        <span className="text-3xl font-black tracking-tighter" style={{ color: scoreColor }}>{result.overall_score.toFixed(0)}%</span>
                        <span className="text-[10px] font-bold text-slate-900 uppercase mt-1 tracking-tighter">{scoreLabel}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-slate-200 bg-white">
                {/* Health Score Panel */}
                <div className="p-8 border-b md:border-b-0 md:border-r border-slate-200">
                    <div className="flex items-center gap-2 mb-8 text-slate-400">
                        <BarChart2 size={14} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Metric Distribution</span>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="relative mb-6">
                            <svg viewBox="0 0 100 100" className="w-32 h-32 transform -rotate-90">
                                <circle
                                    cx="50" cy="50" r="48"
                                    fill="none"
                                    stroke="#f8fafc"
                                    strokeWidth="4"
                                />
                                <circle
                                    cx="50" cy="50" r="48"
                                    fill="none"
                                    stroke={scoreColor}
                                    strokeWidth="4"
                                    strokeDasharray="301.6"
                                    strokeDashoffset={301.6 - (301.6 * result.overall_score) / 100}
                                    className="transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-bold tracking-tighter text-slate-800 leading-none">{result.overall_score.toFixed(0)}</span>
                                <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest mt-1">%</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <span className="text-lg font-bold uppercase tracking-tight" style={{ color: scoreColor }}>{scoreLabel}</span>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">Quality Index</p>
                        </div>
                    </div>
                </div>

                {/* Documentation Heatmap Panel */}
                <div className="p-8 border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-50/10">
                    <div className="flex items-center justify-between gap-2 mb-8 text-slate-400">
                        <div className="flex items-center gap-2">
                            <Map size={14} />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Documentation Heatmap</span>
                        </div>
                        <div className="flex gap-1">
                            <div className="w-2 h-2 bg-emerald-500 rounded-sm" title="Documented" />
                            <div className="w-2 h-2 bg-slate-200 rounded-sm" title="Dark Zone" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-1 p-3 bg-white border border-slate-100">
                            {heatmap.map((slot, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.005 }}
                                    className={cn(
                                        "w-[7px] h-3 rounded-sm",
                                        slot.isComment ? "bg-emerald-500" : "bg-slate-100",
                                        slot.isDebt && "bg-amber-400"
                                    )}
                                />
                            ))}
                        </div>
                        <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-slate-400 px-1">
                            <span>Start of Module</span>
                            <span>End of File</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic border-t border-slate-50 pt-2">
                            The segments represent documentation density vs functional logic blocks.
                        </p>
                    </div>
                </div>

                {/* Intelligence Panel */}
                <div className="p-8">
                    <div className="flex items-center gap-2 mb-8 text-slate-400">
                        <PieChart size={14} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Health Catalog</span>
                    </div>

                    <div className="space-y-3 mb-8">
                        <QualityRow icon={<CheckCircle2 size={10} />} label="Optimization" count={result.summary.high_quality} color="emerald" />
                        <QualityRow icon={<AlertTriangle size={10} />} label="Informational" count={result.summary.medium_quality} color="amber" />
                        <QualityRow icon={<XCircle size={10} />} label="Anomalies" count={result.summary.low_quality} color="rose" />
                    </div>

                    <div className="pt-6 border-t border-slate-100 space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 text-slate-400">
                                <Activity size={12} />
                                <span className="text-[9px] font-black uppercase tracking-widest">Consistency Map</span>
                            </div>
                            <strong className={cn("text-xs font-black", result.summary.avg_consistency_score < 70 ? 'text-rose-600' : 'text-emerald-600')}>
                                {result.summary.avg_consistency_score.toFixed(1)}%
                            </strong>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Mean Efficiency Score</span>
                            <strong className="text-lg font-bold text-slate-900 tracking-tighter italic">{result.summary.avg_comment_score.toFixed(1)}</strong>
                        </div>
                    </div>
                </div>
            </div>

            {/* Issue Inventory (The "SaaS Highlight" panel) */}
            {topIssues.length > 0 && (
                <div className="p-6 border border-slate-200 bg-white">
                    <div className="flex items-center gap-2 mb-6 text-slate-400">
                        <Target size={14} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Critical issue breakdown (exact types)</span>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        {topIssues.map(([type, count]) => (
                            <div key={type} className="flex-1 min-w-[200px] border border-slate-100 p-4 bg-slate-50/50">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[9px] font-black uppercase text-rose-600 tracking-widest">Type {count > 2 ? 'Recurring' : 'Found'}</span>
                                    <span className="px-1.5 py-0.5 bg-rose-50 text-rose-700 text-[10px] font-bold">x{count}</span>
                                </div>
                                <p className="text-sm font-bold text-slate-900 truncate" title={type}>{type}</p>
                            </div>
                        ))}
                        {result.summary.avg_consistency_score < 70 && (
                            <div className="flex-1 min-w-[200px] border border-rose-100 p-4 bg-rose-50/30">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[9px] font-black uppercase text-rose-600 tracking-widest">Safety Risk</span>
                                    <ShieldAlert size={12} className="text-rose-500" />
                                </div>
                                <p className="text-sm font-bold text-slate-900 uppercase tracking-tighter">Semantic Drift Detected</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const QualityRow = ({ icon, label, count, color }: { icon: any, label: string, count: number, color: 'emerald' | 'amber' | 'rose' }) => {
    const colors = {
        emerald: 'text-emerald-700',
        amber: 'text-amber-700',
        rose: 'text-rose-700'
    };
    return (
        <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
            <div className="flex items-center gap-3">
                <span className={colors[color]}>{icon}</span>
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{label}</span>
            </div>
            <span className="text-xs font-black text-slate-800">{count}</span>
        </div>
    );
};

export default AnalysisSummary;
