import React from 'react';
import { FileCode, ChevronRight, LayoutGrid } from 'lucide-react';
import type { AnalysisResult } from '../types';
import { cn, getScoreColor } from '../utils';

interface Props {
    files: AnalysisResult[];
    activeFile: string | null;
    onFileSelect: (fileName: string) => void;
}

const ProjectSidebar: React.FC<Props> = ({ files, activeFile, onFileSelect }) => {
    return (
        <div className="w-full lg:w-72 bg-white border border-slate-200 lg:h-[calc(100vh-140px)] flex flex-col rounded-2xl overflow-hidden shadow-sm sticky top-6">
            <div className="p-4 flex items-center gap-3 font-bold border-b border-slate-100 bg-slate-50/50 text-slate-800">
                <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
                    <LayoutGrid size={16} />
                </div>
                <span className="text-sm tracking-tight flex-1">Project Files</span>
                <span className="bg-slate-200 px-2 py-0.5 rounded-full text-[10px] text-slate-600 font-black">
                    {files.length}
                </span>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
                {files.map((file) => (
                    <button
                        key={file.file_name}
                        onClick={() => onFileSelect(file.file_name)}
                        className={cn(
                            'group w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left relative',
                            activeFile === file.file_name
                                ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 border border-transparent'
                        )}
                    >
                        <div className={cn(
                            'p-2 rounded-lg transition-colors',
                            activeFile === file.file_name ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                        )}>
                            <FileCode size={16} />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold truncate leading-none mb-1">{file.file_name}</div>
                            <div className="text-[10px] opacity-60 font-medium">
                                {file.code_lines} lines of code
                            </div>
                        </div>

                        <div
                            className="w-2.5 h-2.5 rounded-full ring-2 ring-white shrink-0 shadow-inner"
                            style={{ backgroundColor: getScoreColor(file.overall_score) }}
                            title={`Score: ${file.overall_score}%`}
                        />

                        <ChevronRight size={14} className={cn(
                            'transition-transform duration-200 shrink-0',
                            activeFile === file.file_name ? 'opacity-100 translate-x-1' : 'opacity-0 -translate-x-2 group-hover:opacity-40 group-hover:translate-x-0'
                        )} />
                    </button>
                ))}
            </div>

            {/* Mobile Indicator */}
            <div className="lg:hidden p-3 bg-indigo-50 border-t border-indigo-100 text-indigo-600 text-[10px] font-bold text-center uppercase tracking-widest">
                Scroll to view modules
            </div>
        </div>
    );
};

export default ProjectSidebar;
