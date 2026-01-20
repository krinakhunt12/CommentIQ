import React from 'react';
import { motion } from 'framer-motion';
import { FileText, PieChart, CheckCircle2, AlertTriangle, XCircle, Activity } from 'lucide-react';
import type { AnalysisResult } from '../types';
import { getScoreColor, getScoreLabel } from '../utils';

interface Props {
    result: AnalysisResult;
}

const AnalysisSummary: React.FC<Props> = ({ result }) => {
    const scoreColor = getScoreColor(result.overall_score);
    const scoreLabel = getScoreLabel(result.overall_score);

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {/* Score Visualization Card */}
            <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center"
            >
                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">Overall Quality Status</h3>
                <div className="relative flex items-center justify-center mb-4">
                    <svg viewBox="0 0 100 100" className="w-32 h-32 transform -rotate-90">
                        <circle
                            cx="50" cy="50" r="45"
                            fill="none"
                            stroke="#f1f5f9"
                            strokeWidth="8"
                        />
                        <circle
                            cx="50" cy="50" r="45"
                            fill="none"
                            stroke={scoreColor}
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray="282.7"
                            strokeDashoffset={282.7 - (282.7 * result.overall_score) / 100}
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black text-slate-800">{result.overall_score.toFixed(0)}</span>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Percent</span>
                    </div>
                </div>
                <div className="mt-2">
                    <span className="text-lg font-black block leading-none" style={{ color: scoreColor }}>{scoreLabel}</span>
                    <span className="text-xs text-slate-400 font-medium tracking-tight">System Grade</span>
                </div>
            </motion.div>

            {/* File Metrics Card */}
            <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"
            >
                <div className="flex items-center gap-2 mb-6 text-indigo-600">
                    <FileText size={18} />
                    <h3 className="text-slate-800 font-bold">Comprehensive Metrics</h3>
                </div>
                <div className="space-y-4">
                    {[
                        { label: 'Total Lines', value: result.total_lines, sub: 'Source lines' },
                        { label: 'Code Blocks', value: result.code_lines, sub: 'Executable' },
                        { label: 'Commentary', value: result.comment_lines, sub: 'Documentation' },
                    ].map((stat, i) => (
                        <div key={i} className="flex justify-between items-end pb-3 border-b border-slate-50">
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-slate-700">{stat.label}</span>
                                <span className="text-[10px] text-slate-400 uppercase tracking-tighter">{stat.sub}</span>
                            </div>
                            <strong className="text-lg text-slate-800">{stat.value}</strong>
                        </div>
                    ))}

                    <div className="pt-2">
                        <div className="flex justify-between items-center mb-1.5">
                            <span className="text-sm font-semibold text-slate-700">Documentation Coverage</span>
                            <span className="text-sm font-bold text-indigo-600">{result.comment_ratio.toFixed(1)}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(result.comment_ratio, 100)}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                className="h-full bg-indigo-500 rounded-full"
                            />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Comment Distribution Card */}
            <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col"
            >
                <div className="flex items-center gap-2 mb-6 text-indigo-600">
                    <PieChart size={18} />
                    <h3 className="text-slate-800 font-bold">Comment Quality Ratio</h3>
                </div>

                <div className="flex-1 space-y-2.5 mb-6">
                    <QualityRow icon={<CheckCircle2 size={14} />} label="Optimization Grade" count={result.summary.high_quality} color="emerald" />
                    <QualityRow icon={<AlertTriangle size={14} />} label="Moderate Clarity" count={result.summary.medium_quality} color="amber" />
                    <QualityRow icon={<XCircle size={14} />} label="Needs Iteration" count={result.summary.low_quality} color="rose" />
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-slate-500">
                            <Activity size={14} />
                            <span className="text-xs font-semibold">Semantic Consistency</span>
                        </div>
                        <strong className={result.summary.avg_consistency_score < 70 ? 'text-rose-500' : 'text-emerald-500'}>
                            {result.summary.avg_consistency_score.toFixed(1)}%
                        </strong>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-500">Average Review Score</span>
                        <strong className="text-lg text-indigo-600 font-black">{result.summary.avg_comment_score.toFixed(1)}</strong>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const QualityRow = ({ icon, label, count, color }: { icon: any, label: string, count: number, color: 'emerald' | 'amber' | 'rose' }) => {
    const colors = {
        emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        amber: 'bg-amber-50 text-amber-700 border-amber-100',
        rose: 'bg-rose-50 text-rose-700 border-rose-100'
    };
    return (
        <div className={`flex items-center gap-3 p-3 rounded-xl border text-sm transition-transform hover:scale-[1.02] ${colors[color]}`}>
            <span className="shrink-0">{icon}</span>
            <span className="font-semibold">{label}</span>
            <span className="ml-auto font-black px-2.5 py-0.5 bg-white/50 rounded-lg">{count}</span>
        </div>
    );
};

export default AnalysisSummary;
