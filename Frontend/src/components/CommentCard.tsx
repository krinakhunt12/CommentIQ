import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Copy, Check, AlertCircle, Lightbulb, Code2 } from 'lucide-react';
import type { CommentAnalysis } from '../types';
import { getScoreColor } from '../utils';

interface Props {
    comment: CommentAnalysis;
}

const CommentCard: React.FC<Props> = ({ comment }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const scoreColor = getScoreColor(comment.quality_score);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            layout
            className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all hover:border-indigo-300 hover:shadow-sm mb-4"
        >
            <div
                className="p-4 flex flex-wrap items-center gap-3 cursor-pointer bg-slate-50/50"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2">
                    <div className="px-2 py-1 bg-slate-200 rounded text-xs font-bold text-slate-600">
                        Line {comment.line_number}
                    </div>
                    <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-1 rounded">
                        {comment.comment_type}
                    </div>
                </div>

                {comment.consistency_score < 70 && (
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-orange-50 text-orange-700 border border-orange-100 rounded text-xs font-bold ml-auto sm:ml-0" title="Consistency match is low. This comment might be outdated.">
                        <span>⚠️</span>
                        <span className="hidden sm:inline">Mismatch Detected</span>
                        <span className="sm:hidden">Mismatch</span>
                    </div>
                )}

                <div
                    className="ml-auto flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm font-bold shadow-sm"
                    style={{ background: scoreColor }}
                >
                    {comment.quality_score.toFixed(0)}
                    <span className="text-[10px] opacity-80 uppercase font-black">Score</span>
                </div>

                <div className="text-slate-400">
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-white font-mono text-sm overflow-x-auto whitespace-pre-wrap break-all text-slate-700">
                <div className="flex items-start gap-3">
                    <Code2 size={16} className="mt-1 text-slate-400 shrink-0" />
                    <code>{comment.text}</code>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-4 pb-4 overflow-hidden"
                    >
                        {comment.issues.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-2 text-rose-500 mb-3">
                                    <AlertCircle size={16} />
                                    <h4 className="text-sm font-bold uppercase tracking-tight">Issues Found</h4>
                                </div>
                                <ul className="space-y-2">
                                    {comment.issues.map((issue, i) => (
                                        <li key={i} className="text-sm text-rose-800 bg-rose-50/50 p-2.5 rounded-lg border-l-4 border-rose-500">
                                            {issue}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {comment.suggestions.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-2 text-emerald-600 mb-3">
                                    <Lightbulb size={16} />
                                    <h4 className="text-sm font-bold uppercase tracking-tight">AI Suggestions</h4>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {comment.suggestions.map((suggestion, i) => (
                                        <div key={i} className="flex justify-between items-start gap-3 text-sm text-emerald-800 bg-emerald-50/50 p-3 rounded-lg border-l-4 border-emerald-500 group">
                                            <p className="flex-1 leading-relaxed">{suggestion}</p>
                                            <button
                                                onClick={() => handleCopy(suggestion)}
                                                className="p-1.5 bg-white border border-emerald-200 rounded-md text-emerald-600 hover:bg-emerald-500 hover:text-white transition-colors shrink-0 shadow-sm"
                                                title="Copy suggestion"
                                            >
                                                {copied ? <Check size={14} /> : <Copy size={14} />}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default CommentCard;
