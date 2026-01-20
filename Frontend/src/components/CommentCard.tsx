import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown,
    ChevronUp,
    Copy,
    Check,
    AlertCircle,
    Lightbulb,
    Code2,
    Info,
    ShieldAlert,
    ZapOff,
    FileSearch,
    Hammer,
    Edit3,
    Save,
    X
} from 'lucide-react';
import type { CommentAnalysis } from '../types';
import { getScoreColor, cn } from '../utils';

interface Props {
    comment: CommentAnalysis;
}

const ISSUE_DETAILS: Record<string, { category: string, impact: string, rationale: string }> = {
    "Oversimplified / Too short": {
        category: "Low Clarity",
        impact: "Reduces onboarding speed for new developers. Vague comments often lead to assumptions and bugs.",
        rationale: "Documentation should explain the 'why' and 'how' of complex logic, not just restate the obvious."
    },
    "Contains TODO (Planned work)": {
        category: "Technical Debt",
        impact: "Accumulates unfinished tasks within the codebase. Can lead to forgotten features or unhandled edge cases.",
        rationale: "TODOs are useful during development but should be tracked in a project management tool for visibility."
    },
    "Contains FIXME (Known bug)": {
        category: "Critical Debt",
        impact: "Explicitly acknowledges a bug but leaves it unresolved. Increases maintenance cost and instability.",
        rationale: "FIXME markers indicate known issues that should be prioritized over new feature work."
    },
    "Contains HACK (Technical debt)": {
        category: "Structural Risk",
        impact: "Signals brittle or non-standard code that might break during future refactoring.",
        rationale: "Hacks are often quick fixes that bypass standard architecture. They should be documented with a plan to fix."
    },
    "CRITICAL: Potentially Outdated / Mismatched Documentation": {
        category: "Documentation Decay",
        impact: "Active Danger. False documentation is more harmful than none, as it misleads developers about the actual code behavior.",
        rationale: "The analysis engine found a zero-overlap between the keywords in your comment and the surrounding executable logic."
    }
};

const CommentCard: React.FC<Props> = ({ comment }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(comment.suggestions[0] || comment.text);
    const [isSaved, setIsSaved] = useState(false);

    const scoreColor = getScoreColor(comment.quality_score);
    const hasDebt = comment.issues.some(i => i.includes('TODO') || i.includes('FIXME') || i.includes('HACK'));

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSave = () => {
        setIsSaved(true);
        setIsEditing(false);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div className="bg-white border border-slate-200 transition-colors hover:border-violet-300 overflow-hidden">
            <div
                className="p-4 flex flex-wrap items-center gap-4 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-3">
                    <div className="px-2 py-0.5 border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50">
                        Line {comment.line_number}
                    </div>
                </div>

                <div className="text-[10px] font-black text-violet-600 uppercase tracking-[0.2em]">
                    {comment.comment_type}
                </div>

                {comment.consistency_score < 70 && (
                    <div className="flex items-center gap-2 px-2 py-0.5 bg-rose-50 border border-rose-100 text-rose-700 text-[9px] font-black uppercase tracking-widest ml-auto sm:ml-0">
                        <ShieldAlert size={10} />
                        <span>Integrity Alert</span>
                    </div>
                )}

                {hasDebt && (
                    <div className="flex items-center gap-2 px-2 py-0.5 bg-amber-50 border border-amber-100 text-amber-700 text-[9px] font-black uppercase tracking-widest">
                        <Hammer size={10} />
                        <span>Technical Debt</span>
                    </div>
                )}

                <div className="ml-auto flex items-center gap-4">
                    <div className="hidden sm:flex flex-col items-end">
                        <span className="text-sm font-black tracking-tighter" style={{ color: scoreColor }}>{comment.quality_score.toFixed(0)}%</span>
                        <span className="text-[8px] font-black uppercase text-slate-300 tracking-widest leading-none">Quality</span>
                    </div>
                    <div className="w-px h-6 bg-slate-100 mx-1" />
                    <div className="text-slate-300">
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                </div>
            </div>

            <div className="px-5 py-4 border-t border-slate-50 bg-slate-50/20 flex flex-col gap-3">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex items-start gap-4 flex-1">
                        <Code2 size={14} className="mt-1 text-slate-300 shrink-0" />
                        <code className="font-mono text-xs leading-relaxed text-slate-700 break-all bg-white/50 px-2 py-1 border border-slate-100 flex-1">
                            {comment.text}
                        </code>
                    </div>
                    {comment.suggestions.length > 0 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsEditing(true); setIsOpen(true); }}
                            className="px-3 py-1.5 bg-violet-600 text-white text-[9px] font-black uppercase tracking-widest hover:bg-violet-700 transition-all flex items-center gap-2 active:scale-95"
                        >
                            <Edit3 size={10} />
                            <span>Apply Refactor</span>
                        </button>
                    )}
                </div>
                {isSaved && (
                    <div className="flex items-center gap-2 text-emerald-600 text-[9px] font-black uppercase tracking-[0.2em] animate-in fade-in slide-in-from-left-2">
                        <Check size={10} />
                        <span>Analysis Updated Locally</span>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-slate-100"
                    >
                        {isEditing ? (
                            <div className="p-8 bg-violet-50/30 border-b border-slate-100 space-y-6">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-violet-700">
                                        <Edit3 size={14} />
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Refactor Interface</h4>
                                    </div>
                                    <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600">
                                        <X size={16} />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <textarea
                                        value={editedText}
                                        onChange={(e) => setEditedText(e.target.value)}
                                        className="w-full h-32 p-4 font-mono text-xs bg-white border border-violet-200 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-200 transition-all resize-none shadow-inner"
                                        placeholder="Enter updated documentation text..."
                                    />
                                    <div className="flex justify-between items-center">
                                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">Editing suggestion for Line {comment.line_number}</span>
                                        <button
                                            onClick={handleSave}
                                            className="px-6 py-2 bg-slate-900 text-white text-xs font-black uppercase tracking-widest hover:bg-violet-600 transition-colors flex items-center gap-3"
                                        >
                                            <Save size={14} />
                                            Update Audit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                                {/* Left Panel: Issues and Impacts */}
                                <div className="p-8 border-b lg:border-b-0 lg:border-r border-slate-100 space-y-8">
                                    <section>
                                        <div className="flex items-center gap-2 text-rose-700 mb-6">
                                            <FileSearch size={14} />
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Issue Diagnostics</h4>
                                        </div>

                                        <div className="space-y-6">
                                            {comment.issues.length > 0 ? (
                                                comment.issues.map((issue, i) => {
                                                    const detail = ISSUE_DETAILS[issue] || {
                                                        category: "General Constraint",
                                                        impact: "Might affect long-term maintainability and readability.",
                                                        rationale: "Documentation should follow common clean code principles."
                                                    };
                                                    return (
                                                        <div key={i} className="space-y-3">
                                                            <div className="flex items-start gap-3">
                                                                <div className="mt-0.5 p-1 bg-rose-50 text-rose-600">
                                                                    <ZapOff size={10} />
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs font-bold text-slate-900 mb-1">{issue}</p>
                                                                    <span className="text-[9px] font-black uppercase text-rose-500 tracking-widest">{detail.category}</span>
                                                                </div>
                                                            </div>
                                                            <div className="pl-7 space-y-3 border-l-2 border-slate-100">
                                                                <div>
                                                                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Impact Analysis</p>
                                                                    <p className="text-xs text-slate-500 leading-relaxed italic">{detail.impact}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Rationale</p>
                                                                    <p className="text-xs text-slate-600 leading-relaxed">{detail.rationale}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="flex items-center gap-3 text-emerald-600 py-2">
                                                    <Check size={14} />
                                                    <span className="text-xs font-bold uppercase tracking-widest">No structural issues identified.</span>
                                                </div>
                                            )}
                                        </div>
                                    </section>
                                </div>

                                {/* Right Panel: Optimization and Suggestions */}
                                <div className="p-8 bg-slate-50/30 space-y-8">
                                    <section>
                                        <div className="flex items-center gap-2 text-violet-700 mb-6">
                                            <Lightbulb size={14} />
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">AI Optimization Path</h4>
                                        </div>

                                        <div className="space-y-4">
                                            {comment.suggestions.length > 0 ? (
                                                comment.suggestions.map((suggestion, i) => (
                                                    <div key={i} className="flex flex-col gap-3 p-5 bg-white border border-slate-200 group transition-colors hover:border-violet-300">
                                                        <div className="flex justify-between items-start">
                                                            <span className="text-[9px] font-black uppercase text-violet-600 tracking-widest leading-none">Automated Suggestion</span>
                                                            <button
                                                                onClick={() => handleCopy(suggestion)}
                                                                className="text-slate-400 hover:text-violet-600 transition-colors"
                                                                title="Copy Suggestion"
                                                            >
                                                                {copied ? <Check size={12} /> : <Copy size={12} />}
                                                            </button>
                                                        </div>
                                                        <p className="text-xs text-slate-700 leading-relaxed font-medium">{suggestion}</p>
                                                        <button
                                                            onClick={() => setIsEditing(true)}
                                                            className="text-[9px] font-black uppercase text-slate-400 hover:text-violet-600 text-left tracking-widest transition-colors flex items-center gap-2"
                                                        >
                                                            <Edit3 size={10} />
                                                            Refine this suggestion
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="flex items-center gap-3 text-slate-400 py-2">
                                                    <Info size={14} />
                                                    <span className="text-xs font-bold uppercase tracking-widest">Documentation follows defined standards.</span>
                                                </div>
                                            )}
                                        </div>
                                    </section>

                                    <section className="pt-8 border-t border-slate-100">
                                        <div className="flex items-center gap-2 text-slate-400 mb-4">
                                            <AlertCircle size={14} />
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Analysis Statistics</h4>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 border border-slate-200 bg-white">
                                                <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest block mb-1">Integrity Score</span>
                                                <span className="text-xl font-bold text-slate-900 tracking-tighter">{comment.consistency_score.toFixed(0)}%</span>
                                            </div>
                                            <div className="p-4 border border-slate-200 bg-white">
                                                <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest block mb-1">Clarity Weight</span>
                                                <span className="text-xl font-bold text-slate-900 tracking-tighter">{comment.quality_score.toFixed(0)}%</span>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CommentCard;
