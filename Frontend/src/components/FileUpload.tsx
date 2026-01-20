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
        <div className="w-full mb-8">
            <div
                className={cn(
                    'relative w-full min-h-[200px] border-2 border-dashed rounded-2xl flex items-center justify-center transition-all duration-300 cursor-pointer',
                    isDragging ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]' : 'border-slate-200 bg-white hover:border-indigo-400 hover:bg-slate-50/50',
                    selectedFile && 'border-emerald-500 bg-emerald-50/30',
                    loading && 'opacity-60 pointer-events-none'
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

                <label htmlFor="file-input" className="w-full h-full flex flex-col items-center justify-center p-8 cursor-pointer text-center">
                    <div className="mb-4 transition-transform duration-300 group-hover:-translate-y-1">
                        {selectedFile ? (
                            <CheckCircle2 className="text-emerald-500" size={48} />
                        ) : (
                            <div className="p-4 bg-indigo-100 rounded-full text-indigo-600">
                                <FileUp size={32} />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col items-center gap-1">
                        {selectedFile ? (
                            <>
                                <span className="text-lg font-semibold text-slate-800 break-all px-4">{selectedFile.name}</span>
                                <span className="text-sm text-slate-500">{(selectedFile.size / 1024).toFixed(1)} KB</span>
                            </>
                        ) : (
                            <>
                                <span className="text-xl font-bold text-slate-800">Drop code or .zip here</span>
                                <span className="text-slate-500">Analyze single files or full repositories</span>
                            </>
                        )}
                    </div>

                    {!selectedFile && (
                        <div className="mt-6 px-4 py-1.5 bg-slate-100 rounded-full text-xs font-medium text-slate-600">
                            Supports: .py, .js, .ts, .java, .cpp... and .zip
                        </div>
                    )}
                </label>
            </div>
        </div>
    );
};

export default FileUpload;
