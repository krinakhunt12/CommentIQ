import React from 'react';
import { motion } from 'framer-motion';
import {
    Sparkles,
    Terminal,
    Zap,
    ShieldCheck,
    Layout,
    Cpu,
    ArrowRight,
    Github,
    CheckCircle2,
    Globe,
    Search,
    Code2
} from 'lucide-react';

interface FeatureProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const FeatureCard: React.FC<FeatureProps> = ({ icon, title, description }) => (
    <div className="p-8 bg-white border border-slate-100 transition-colors hover:border-violet-200">
        <div className="w-10 h-10 bg-violet-50 text-violet-600 rounded flex items-center justify-center mb-6">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2 tracking-tight">{title}</h3>
        <p className="text-slate-500 leading-relaxed text-sm">{description}</p>
    </div>
);

const Step: React.FC<{ number: string; title: string; description: string }> = ({ number, title, description }) => (
    <div className="flex gap-6 items-start">
        <div className="flex-shrink-0 w-8 h-8 border border-slate-900 text-slate-900 flex items-center justify-center font-bold text-xs uppercase">
            {number}
        </div>
        <div className="space-y-1">
            <h4 className="text-base font-bold text-slate-900 uppercase tracking-wide">{title}</h4>
            <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
        </div>
    </div>
);

const LandingPage: React.FC<{ onLaunch: () => void }> = ({ onLaunch }) => {
    return (
        <div className="min-h-screen bg-white selection:bg-violet-100 selection:text-violet-900">
            {/* Navigation */}
            <nav className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-violet-600 text-white rounded-sm">
                            <Sparkles size={16} />
                        </div>
                        <span className="text-lg font-bold tracking-tight uppercase text-slate-900">CommentIQ</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-slate-500">
                        <a href="#features" className="hover:text-violet-600 border-b border-transparent hover:border-violet-600 transition-all py-1">Features</a>
                        <a href="#workflow" className="hover:text-violet-600 border-b border-transparent hover:border-violet-600 transition-all py-1">Workflow</a>
                        <a href="#about" className="hover:text-violet-600 border-b border-transparent hover:border-violet-600 transition-all py-1">About</a>
                    </div>

                    <button
                        onClick={onLaunch}
                        className="px-5 py-2 border border-slate-900 text-slate-900 text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all active:scale-95"
                    >
                        Launch Terminal
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-40 pb-24 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-50 border border-violet-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-600" />
                            <span className="text-[10px] font-bold text-violet-700 uppercase tracking-[0.2em]">Audit Systems v2.1.0</span>
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 leading-[1.05] tracking-tighter">
                            Professional <br />
                            <span className="text-violet-600 italic">Code Commentary</span> <br />
                            Analysis.
                        </h1>

                        <p className="text-lg text-slate-500 leading-relaxed max-w-lg font-medium">
                            A minimalist, enterprise-ready static analysis tool built specifically for documentation health. Detect logic mismatches and technical debt with precision.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={onLaunch}
                                className="px-8 py-4 bg-slate-900 text-white font-bold hover:bg-violet-700 transition-colors flex items-center justify-center gap-3 active:scale-[0.98] uppercase text-xs tracking-widest"
                            >
                                Start New Audit
                                <ArrowRight size={16} />
                            </button>
                            <button className="px-8 py-4 bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-3 uppercase text-xs tracking-widest">
                                <Github size={16} />
                                Build Logs
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="hidden lg:block border border-slate-100 bg-slate-50 p-6"
                    >
                        <div className="bg-white border border-slate-200 p-8 space-y-6">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Terminal size={14} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Process Identifier: AC-492</span>
                                </div>
                                <div className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-tighter">Healthy</div>
                            </div>

                            <div className="font-mono text-xs text-slate-800 space-y-2">
                                <div className="flex gap-4 opacity-50">
                                    <span>01</span>
                                    <span>async function validate_access(user_id) {'{'}</span>
                                </div>
                                <div className="flex gap-4 text-violet-600 font-bold">
                                    <span>02</span>
                                    <span>// Verification of biometric signature</span>
                                </div>
                                <div className="flex gap-4 opacity-50">
                                    <span>03</span>
                                    <span>   const token = await db.fetch(user_id)</span>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50 border-l-2 border-violet-500 space-y-2">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Analysis Results</span>
                                    <span className="text-xs font-black">74%</span>
                                </div>
                                <p className="text-[10px] text-slate-600 leading-relaxed font-medium">
                                    Informational: Comment mentions <span className="text-violet-600 font-bold">'biometric'</span> but code references <span className="text-violet-600 font-bold">'database fetch'</span>. Semantic mismatch detected.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Feature Section */}
            <section id="features" className="py-24 px-6 border-y border-slate-100 bg-slate-50/30">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-xl mb-20 space-y-4">
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight uppercase tracking-widest">System Capabilities</h2>
                        <div className="h-1 w-12 bg-violet-600" />
                        <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                            Purpose-built tools for modern engineering teams focused on technical documentation integrity.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        <FeatureCard
                            icon={<Zap size={20} />}
                            title="Stateless Audit"
                            description="High-speed analysis without data retention. We analyze tokens in memory and return results instantly."
                        />
                        <FeatureCard
                            icon={<Search size={20} />}
                            title="Semantic Integrity"
                            description="Heuristic checks that compare natural language intent with actual executable code blocks."
                        />
                        <FeatureCard
                            icon={<ShieldCheck size={20} />}
                            title="Debt Inventory"
                            description="Automated tracking of TODO, FIXME, and HACK labels across the entire module lifecycle."
                        />
                        <FeatureCard
                            icon={<Globe size={20} />}
                            title="Protocol Support"
                            description="First-class support for Python, JavaScript, TypeScript, Go, Rust, Java, and C++ source formats."
                        />
                        <FeatureCard
                            icon={<Layout size={20} />}
                            title="System Scanning"
                            description="Enterprise repository scanning via ZIP deployment. View cross-module documentation health scores."
                        />
                        <FeatureCard
                            icon={<Cpu size={20} />}
                            title="AI Rewriting"
                            description="LLM-assisted documentation correction to transform vague comments into precise technical specs."
                        />
                    </div>
                </div>
            </section>

            {/* Workflow Section */}
            <section id="workflow" className="py-32 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
                    <div className="space-y-16">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold text-slate-900 tracking-tight uppercase">Project Lifecycle</h2>
                            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                                A streamlined workflow designed to integrate into your existing review process with zero friction.
                            </p>
                        </div>

                        <div className="space-y-10">
                            <Step
                                number="01"
                                title="Input Payload"
                                description="Upload individual modules or full project archives using our encrypted drag-and-drop terminal."
                            />
                            <Step
                                number="02"
                                title="Token Analysis"
                                description="Our engine decomposes comments into semantic vectors, testing them against surrounding logic blocks."
                            />
                            <Step
                                number="03"
                                title="Review & Commit"
                                description="Inspect findings, accept automated suggestions, and export audit logs for team review."
                            />
                        </div>

                        <button
                            onClick={onLaunch}
                            className="px-10 py-4 bg-slate-900 text-white font-bold hover:bg-violet-700 transition-colors flex items-center justify-center gap-3 active:scale-95 uppercase text-[10px] tracking-widest"
                        >
                            Initialize Audit
                            <ArrowRight size={14} />
                        </button>
                    </div>

                    <div className="border border-slate-100 p-2">
                        <div className="bg-slate-50 p-12 space-y-12">
                            {[
                                { label: 'Analytical Speed', value: '12ms', color: 'text-violet-600' },
                                { label: 'Source Indexing', value: '9+', color: 'text-slate-900' },
                                { label: 'Heuristic Accuracy', value: '98%', color: 'text-emerald-600' },
                            ].map((stat, i) => (
                                <div key={i} className="flex justify-between items-end border-b border-slate-200 pb-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">{stat.label}</span>
                                        <div className="h-0.5 w-4 bg-slate-200" />
                                    </div>
                                    <span className={cn("text-4xl font-bold tracking-tighter", stat.color)}>{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 border-t border-slate-100">
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-10">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-bold text-slate-900 tracking-tight uppercase">Ready for Deployment?</h2>
                        <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                            Standardize your documentation quality today. Join teams delivering cleaner, more maintainable codebases.
                        </p>
                    </div>
                    <button
                        onClick={onLaunch}
                        className="px-12 py-5 bg-violet-600 text-white font-bold hover:bg-violet-700 transition-colors active:scale-[0.98] uppercase text-xs tracking-widest"
                    >
                        Start Analyzing Free
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16 px-6 border-t border-slate-100 bg-slate-50/30">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-slate-900 text-white rounded-sm">
                                <Sparkles size={14} />
                            </div>
                            <span className="text-base font-bold tracking-tight uppercase text-slate-900">CommentIQ</span>
                        </div>
                        <p className="text-slate-400 text-xs font-medium">Enterprise source evaluation tools.</p>
                    </div>

                    <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <a href="#" className="hover:text-violet-600 transition-colors">Documentation</a>
                        <a href="#" className="hover:text-violet-600 transition-colors">Security</a>
                        <a href="#" className="hover:text-violet-600 transition-colors">Repository</a>
                    </div>

                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                        © 2026 QC Systems International
                    </p>
                </div>
            </footer>
        </div>
    );
};

// Simple utility for layout
const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

export default LandingPage;
