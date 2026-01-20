import React, { useCallback, useState } from 'react';
import { CheckCircle2, FileUp } from 'lucide-react';
import { cn } from '../utils';

interface Props {
    onFileSelect: (file: File) => void;
    selectedFile: File | null;
    loading: boolean;
}

const FileUpload: React.FC<Props> = ({ onFileSelect, selectedFile, loading }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFileSelect(e.dataTransfer.files[0]);
        }
    }, [onFileSelect]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
        }
    };

    return (
        <div className="w-full mb-12">
            <div
                className={cn(
                    'relative w-full min-h-[220px] border border-slate-200 flex items-center justify-center transition-all duration-300 cursor-pointer',
                    isDragging ? 'bg-violet-50 border-violet-400' : 'bg-slate-50/50 hover:bg-white hover:border-slate-400',
                    selectedFile && 'bg-white border-emerald-500',
                    loading && 'opacity-30 pointer-events-none'
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    id="file-input"
                    className="sr-only"
                    onChange={handleFileChange}
                    accept=".py,.js,.ts,.java,.cpp,.go,.rs,.zip"
                    disabled={loading}
                />

                <label htmlFor="file-input" className="w-full h-full flex flex-col items-center justify-center p-12 cursor-pointer text-center group">
                    <div className="mb-6 transition-transform duration-300 group-hover:-translate-y-0.5">
                        {selectedFile ? (
                            <CheckCircle2 className="text-emerald-500" size={40} strokeWidth={1.5} />
                        ) : (
                            <div className="p-4 bg-white border border-slate-100 text-slate-400 group-hover:text-violet-600 group-hover:border-violet-200 transition-colors">
                                <FileUp size={28} strokeWidth={1.5} />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col items-center gap-1.5">
                        {selectedFile ? (
                            <>
                                <span className="text-sm font-bold text-slate-800 uppercase tracking-tighter break-all px-4">{selectedFile.name}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{(selectedFile.size / 1024).toFixed(1)} KB</span>
                            </>
                        ) : (
                            <>
                                <span className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Drop Target Payload</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Source modules or repository (.zip)</span>
                            </>
                        )}
                    </div>

                    {!selectedFile && (
                        <div className="mt-8 px-4 py-1.5 border border-slate-100 bg-white text-[9px] font-black uppercase tracking-[0.1em] text-slate-400 group-hover:text-slate-600 transition-colors">
                            Compliant Formats: .py, .js, .ts, .java, .cpp ...
                        </div>
                    )}
                </label>
            </div>
        </div>
    );
};

export default FileUpload;
