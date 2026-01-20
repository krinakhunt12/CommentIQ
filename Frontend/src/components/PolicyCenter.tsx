import React from 'react';
import { ShieldCheck, ToggleLeft, ToggleRight, Info } from 'lucide-react';
import { cn } from '../utils';

export interface AuditPolicy {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
    severity: 'High' | 'Medium' | 'Low';
}

interface Props {
    policies: AuditPolicy[];
    onToggle: (id: string) => void;
}

const PolicyCenter: React.FC<Props> = ({ policies, onToggle }) => {
    return (
        <div className="bg-white border border-slate-200 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <ShieldCheck size={18} className="text-violet-600" />
                    <div>
                        <h3 className="text-[10px] font-black uppercase text-slate-900 tracking-[0.2em] leading-none mb-1">Compliance Policy Center</h3>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Active Enforcement Rules</p>
                    </div>
                </div>
            </div>

            <div className="divide-y divide-slate-50">
                {policies.map((policy) => (
                    <div key={policy.id} className="p-6 flex items-start justify-between group transition-colors hover:bg-slate-50/50">
                        <div className="space-y-2 flex-1 pr-8">
                            <div className="flex items-center gap-3">
                                <h4 className="text-xs font-bold text-slate-900 transition-colors uppercase tracking-tight">{policy.name}</h4>
                                <span className={cn(
                                    "px-1.5 py-0.5 text-[8px] font-black uppercase tracking-tighter rounded-sm",
                                    policy.severity === 'High' ? "bg-rose-50 text-rose-600" :
                                        policy.severity === 'Medium' ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                                )}>
                                    {policy.severity} Priority
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{policy.description}</p>
                        </div>

                        <button
                            onClick={() => onToggle(policy.id)}
                            className={cn(
                                "shrink-0 transition-colors",
                                policy.enabled ? "text-violet-600" : "text-slate-200"
                            )}
                        >
                            {policy.enabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                        </button>
                    </div>
                ))}
            </div>

            <div className="p-6 bg-slate-50/80 border-t border-slate-100 flex items-start gap-3">
                <Info size={14} className="text-slate-400 mt-0.5" />
                <p className="text-[10px] text-slate-400 font-bold uppercase leading-relaxed tracking-wider">
                    Policy changes are applied in real-time to the current audit session. Some scores may fluctuate based on rule severity.
                </p>
            </div>
        </div>
    );
};

export default PolicyCenter;
