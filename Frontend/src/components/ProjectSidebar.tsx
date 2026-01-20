import React from 'react';
import { FileCode, LayoutGrid, AlertCircle, ShieldAlert } from 'lucide-react';
import type { AnalysisResult } from '../types';
import { cn, getScoreColor } from '../utils';

interface Props {
    files: AnalysisResult[];
    activeFile: string | null;
    onFileSelect: (fileName: string) => void;
}

const ProjectSidebar: React.FC<Props> = ({ files, activeFile, onFileSelect }) => {
    return (
        <div className="w-full lg:w-72 bg-white border border-slate-200 lg:h-[calc(100vh-160px)] flex flex-col sticky top-28">
            <div className="p-5 flex items-center gap-3 font-bold border-b border-slate-100 bg-slate-50/50 text-slate-800">
                <LayoutGrid size={14} className="text-violet-600" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] flex-1">Project Modules</span>
                <span className="bg-slate-200 px-1.5 py-0.5 text-[8px] text-slate-600 font-bold uppercase tracking-tighter">
                    {files.length} Units
                </span>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {files.map((file) => {
                    const issueCount = file.comments.filter(c => c.quality_score < 70 || c.consistency_score < 70).length;
                    const isHighRisk = file.overall_score < 60;

                    return (
                        <button
                            key={file.file_name}
                            onClick={() => onFileSelect(file.file_name)}
                            className={cn(
                                'w-full flex items-center gap-3 p-4 transition-all text-left border-b border-slate-50 last:border-0 relative',
                                activeFile === file.file_name
                                    ? 'bg-violet-50 text-violet-700 border-l-2 border-l-violet-600'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 border-l-2 border-l-transparent'
                            )}
                        >
                            <div className={cn(
                                'p-1.5 transition-colors',
                                activeFile === file.file_name ? 'text-violet-600' : 'text-slate-300'
                            )}>
                                {isHighRisk ? <ShieldAlert size={14} className="text-rose-500" /> : <FileCode size={14} />}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-bold truncate tracking-tight mb-1 uppercase">
                                    {file.file_name.split('/').pop()}
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                                        {file.code_lines} LOC
                                    </div>
                                    {issueCount > 0 && (
                                        <div className={cn(
                                            "flex items-center gap-1 text-[8px] font-black px-1 rounded-sm",
                                            isHighRisk ? "bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-600"
                                        )}>
                                            <AlertCircle size={8} />
                                            {issueCount} FAIL
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div
                                className="w-1.5 h-1.5 rounded-full shrink-0"
                                style={{ backgroundColor: getScoreColor(file.overall_score) }}
                                title={`Status: ${file.overall_score}%`}
                            />

                            {isHighRisk && (
                                <div className="absolute top-1 right-1 w-1 h-1 bg-rose-500 rounded-full animate-ping" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ProjectSidebar;
