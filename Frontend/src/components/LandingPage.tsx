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
    <motion.div
        whileHover={{ y: -5 }}
        className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
    >
        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
        <p className="text-slate-500 leading-relaxed text-sm">{description}</p>
    </motion.div>
);

const Step: React.FC<{ number: string; title: string; description: string }> = ({ number, title, description }) => (
    <div className="flex gap-6">
        <div className="flex-shrink-0 w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-black text-sm">
            {number}
        </div>
        <div className="space-y-2">
            <h4 className="text-lg font-bold text-slate-800">{title}</h4>
            <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
        </div>
    </div>
);

const LandingPage: React.FC<{ onLaunch: () => void }> = ({ onLaunch }) => {
    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-600 rounded-xl text-white">
                            <Sparkles size={20} />
                        </div>
                        <span className="text-xl font-black tracking-tight">QualityCheck</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
                        <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
                        <a href="#workflow" className="hover:text-indigo-600 transition-colors">How it Works</a>
                        <a href="#about" className="hover:text-indigo-600 transition-colors">Intelligence</a>
                    </div>

                    <button
                        onClick={onLaunch}
                        className="px-6 py-2.5 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
                    >
                        Launch App
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-indigo-100/30 rounded-full blur-[120px] -z-10 translate-x-20 -translate-y-20" />
                <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-emerald-100/20 rounded-full blur-[120px] -z-10 -translate-x-20 translate-y-20" />

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                            <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Powered by AI Sentiment</span>
                        </div>

                        <h1 className="text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
                            Elevate your <span className="text-indigo-600">code health</span> with smart analysis.
                        </h1>

                        <p className="text-xl text-slate-500 leading-relaxed max-w-xl">
                            Professional-grade static analysis for code comments. Detect technical debt, outdated documentation, and mismatched logic in milliseconds.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={onLaunch}
                                className="group px-8 py-4 bg-indigo-600 text-white rounded-2xl text-lg font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-3 active:scale-[0.98]"
                            >
                                Start Free Audit
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-lg font-black hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
                                <Github size={20} />
                                Star on GitHub
                            </button>
                        </div>

                        <div className="flex items-center gap-6 pt-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 p-1">
                                        <div className="w-full h-full bg-slate-200 rounded-full" />
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm font-bold text-slate-400">Trusted by <span className="text-slate-900">1,200+</span> developers world-wide</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative"
                    >
                        <div className="absolute -inset-4 bg-indigo-500/10 rounded-[2.5rem] blur-3xl" />
                        <div className="relative bg-slate-900 rounded-[2.5rem] p-4 shadow-2xl border border-slate-800">
                            <div className="flex items-center gap-2 px-4 mb-4">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                </div>
                                <div className="ml-4 flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                                    <Terminal size={12} />
                                    Main.py Analysis
                                </div>
                            </div>
                            <div className="bg-slate-950 rounded-2xl p-6 font-mono text-xs leading-relaxed overflow-hidden">
                                <div className="flex gap-4">
                                    <span className="text-slate-600 select-none">01</span>
                                    <span className="text-indigo-400">def</span> <span className="text-blue-400">process_payment</span>(amount):
                                </div>
                                <div className="flex gap-4 mt-1">
                                    <span className="text-slate-600 select-none">02</span>
                                    <span className="text-emerald-500/60 opacity-60"># Send shipping mail after tax calculation</span>
                                </div>
                                <div className="flex gap-4 mt-1">
                                    <span className="text-slate-600 select-none">03</span>
                                    <span className="text-slate-400 italic">... logic here ...</span>
                                </div>
                                <div className="mt-8 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-indigo-400 font-bold uppercase tracking-widest text-[10px]">Quality Report</span>
                                        <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 rounded text-[10px] font-black">42% SCORE</span>
                                    </div>
                                    <div className="text-rose-400">⚠️ CRITICAL: Semantic Mismatch Detected</div>
                                    <div className="text-slate-400 text-[10px]">Suggestion: The code processes payment, but the comment mentions shipping mail.</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Feature Section */}
            <section id="features" className="py-32 px-6 bg-slate-50/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Intelligence built for modern teams.</h2>
                        <p className="text-slate-500 lg:text-lg leading-relaxed italic">
                            "Good code is self-documenting, but great documentation explains the intent."
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Zap size={24} />}
                            title="Instant Auditing"
                            description="Get a complete quality breakdown in milliseconds. Our heuristic engine analyzes length, word choice, and technical debt indicators automatically."
                        />
                        <FeatureCard
                            icon={<Search size={24} />}
                            title="Semantic Scout"
                            description="Proprietary consistency matching that compares natural language in comments with actual code logic to find outdated documentation."
                        />
                        <FeatureCard
                            icon={<ShieldCheck size={24} />}
                            title="Debt Detection"
                            description="Identify TODOs, FIXME markers, and HACK markers across your entire project. Keep your codebase clean and your team accountable."
                        />
                        <FeatureCard
                            icon={<Globe size={24} />}
                            title="Multi-Language"
                            description="Native support for Python, JavaScript, TypeScript, Java, C++, Rust and Go. One tool to rule all your microservices."
                        />
                        <FeatureCard
                            icon={<Layout size={24} />}
                            title="Project Analytics"
                            description="Upload full .zip repositories for a global health scan. Audit every module and correlate documentation across your entire system."
                        />
                        <FeatureCard
                            icon={<Cpu size={24} />}
                            title="AI Integration"
                            description="Connect with Gemini or GPT to automatically rewrite poor comments into professional, context-aware documentation. (Coming Soon)"
                        />
                    </div>
                </div>
            </section>

            {/* Workflow Section */}
            <section id="workflow" className="py-32 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <div className="space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-black text-slate-900">How QualityCheck works</h2>
                            <p className="text-slate-500 leading-relaxed max-w-lg">
                                We've spent months perfecting the analysis engine so you don't have to worry about manual documentation reviews.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <Step
                                number="01"
                                title="Upload Source"
                                description="Drop a single code file or an entire project ZIP into our secure interface. We support all major programming languages out of the box."
                            />
                            <Step
                                number="02"
                                title="Semantic Analysis"
                                description="Our engine tokenizes your code and comments, performing heuristic scoring based on industry-standard clarity rules."
                            />
                            <Step
                                number="03"
                                title="Project Insights"
                                description="Navigate through issues, accept AI suggestions, and view your global documentation health score instantly."
                            />
                        </div>

                        <button
                            onClick={onLaunch}
                            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-slate-100"
                        >
                            Analyze Your Code Now
                            <ArrowRight size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <div className="aspect-square bg-indigo-50 rounded-3xl flex items-center justify-center flex-col p-6 text-center">
                                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-4">
                                    <CheckCircle2 size={24} />
                                </div>
                                <span className="text-2xl font-black text-slate-800">10ms</span>
                                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">Audit speed</span>
                            </div>
                            <div className="aspect-[4/5] bg-slate-50 rounded-3xl flex items-center justify-center flex-col p-6 text-center">
                                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white mb-4">
                                    <Code2 size={24} />
                                </div>
                                <span className="text-2xl font-black text-slate-800">9+</span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Languages</span>
                            </div>
                        </div>
                        <div className="space-y-4 pt-12">
                            <div className="aspect-[4/5] bg-emerald-50 rounded-3xl flex items-center justify-center flex-col p-6 text-center">
                                <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white mb-4">
                                    <ShieldCheck size={24} />
                                </div>
                                <span className="text-2xl font-black text-slate-800">99%</span>
                                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Accuracy</span>
                            </div>
                            <div className="aspect-square bg-amber-50 rounded-3xl flex items-center justify-center flex-col p-6 text-center">
                                <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white mb-4">
                                    <Cpu size={24} />
                                </div>
                                <span className="text-2xl font-black text-slate-800">AI</span>
                                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mt-1">Engine</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto rounded-[3rem] bg-indigo-600 p-12 lg:p-24 relative overflow-hidden text-center">
                    <div className="absolute top-0 right-0 w-[60%] h-full bg-indigo-500/30 blur-[100px]" />
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-4xl lg:text-6xl font-black text-white leading-tight">
                            Ready to fix your <br className="hidden lg:block" /> technical debt?
                        </h2>
                        <p className="text-indigo-100 lg:text-xl max-w-xl mx-auto leading-relaxed">
                            Start auditing your project comments today. Join thousands of teams making their code readable again.
                        </p>
                        <button
                            onClick={onLaunch}
                            className="px-12 py-5 bg-white text-indigo-600 rounded-3xl text-xl font-black hover:bg-indigo-50 transition-all shadow-2xl active:scale-[0.98]"
                        >
                            Get Started for Free
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 px-6 border-t border-slate-100">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
                                <Sparkles size={16} />
                            </div>
                            <span className="text-lg font-black tracking-tight">QualityCheck</span>
                        </div>
                        <p className="text-slate-400 text-sm">Professional code commentary analysis.</p>
                    </div>

                    <div className="flex gap-12 text-sm font-bold text-slate-500">
                        <a href="#" className="hover:text-indigo-600 transition-colors">Twitter</a>
                        <a href="#" className="hover:text-indigo-600 transition-colors">GitHub</a>
                        <a href="#" className="hover:text-indigo-600 transition-colors">Contact</a>
                        <a href="#" className="hover:text-indigo-600 transition-colors">Legal</a>
                    </div>

                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                        © 2026 QualityCheck Intelligence
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
