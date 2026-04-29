'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Shield, BarChart3, MessageSquare, AlertCircle, CheckCircle2 } from 'lucide-react';

const SIGNALS = [
    { id: 'risk', icon: AlertCircle, label: 'Risk Analysis', color: 'text-red-500', bg: 'bg-red-50' },
    { id: 'industry', icon: Shield, label: 'Industry Context', color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'timing', icon: Zap, label: 'Optimal Timing', color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 'history', icon: BarChart3, label: 'Payment History', color: 'text-emerald-500', bg: 'bg-emerald-50' },
];

export function AILogicDemo() {
    const [activeStep, setActiveStep] = useState(0);
    const [isThinking, setIsThinking] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsThinking(true);
            setTimeout(() => {
                setActiveStep((prev) => (prev + 1) % 4);
                setIsThinking(false);
            }, 1500);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full max-w-4xl mx-auto py-20 px-6">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-black text-dark-900 mb-4 tracking-tight leading-tight">
                    The brain behind <span className="text-primary-600">the chase.</span>
                </h2>
                <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto">
                    Most bots just spam. ChaseAI thinks. We combine multiple high-fidelity signals to decide the perfect message, time, and tone.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center bg-white/50 backdrop-blur-xl border border-white/40 p-8 rounded-[3rem] shadow-2xl">
                {/* Left: Signal Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {SIGNALS.map((signal, idx) => (
                        <motion.div
                            key={signal.id}
                            animate={{
                                scale: activeStep === idx ? 1.05 : 1,
                                opacity: activeStep === idx ? 1 : 0.6,
                                borderColor: activeStep === idx ? 'rgb(16 185 129 / 0.4)' : 'rgb(229 231 235 / 0.5)'
                            }}
                            className={`p-6 rounded-3xl border-2 transition-all bg-white shadow-sm flex flex-col items-center text-center gap-3`}
                        >
                            <div className={`w-12 h-12 ${signal.bg} ${signal.color} rounded-2xl flex items-center justify-center`}>
                                <signal.icon className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{signal.label}</span>
                            {activeStep === idx && isThinking && (
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    className="h-1 bg-primary-500 rounded-full mt-2"
                                />
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Right: AI Output Console */}
                <div className="relative h-[300px] bg-dark-900 rounded-[2rem] p-8 overflow-hidden shadow-2xl border border-white/10">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-[10px] font-mono text-gray-500 ml-2">CHASE-AI_CORE_V2.5.LOG</span>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="font-mono space-y-4"
                        >
                            {activeStep === 0 && (
                                <div className="space-y-2">
                                    <p className="text-primary-400 text-sm">{'>'} ANALYZING RISK...</p>
                                    <p className="text-gray-300 text-xs">Score: 0.82 (High Probability of Late Payment)</p>
                                    <p className="text-gray-400 text-xs italic">Decision: Shift tone to FIRM & DIRECT</p>
                                </div>
                            )}
                            {activeStep === 1 && (
                                <div className="space-y-2">
                                    <p className="text-blue-400 text-sm">{'>'} DETECTED INDUSTRY: CREATIVE AGENCY</p>
                                    <p className="text-gray-300 text-xs">Applying peer-based success patterns...</p>
                                    <p className="text-gray-400 text-xs italic">Decision: Use "Project Continuity" reasoning</p>
                                </div>
                            )}
                            {activeStep === 2 && (
                                <div className="space-y-2">
                                    <p className="text-amber-400 text-sm">{'>'} CALCULATING DELIVERY WINDOW...</p>
                                    <p className="text-gray-300 text-xs">Optimal Time: Tuesday, 2:15 PM (Local)</p>
                                    <p className="text-gray-400 text-xs italic">Decision: Schedule for next Tuesday window</p>
                                </div>
                            )}
                            {activeStep === 3 && (
                                <div className="space-y-2">
                                    <p className="text-emerald-400 text-sm">{'>'} FINALIZING REMINDER...</p>
                                    <div className="bg-gray-800/50 p-4 rounded-xl border border-white/5">
                                        <p className="text-white text-xs leading-relaxed">
                                            "Hi Sarah, let's keep the project momentum going! Just a quick nudge on..."
                                        </p>
                                    </div>
                                    <p className="text-primary-500 text-[10px] font-bold uppercase tracking-tighter">SUCCESS: 31% INCREASE IN PAY SPEED</p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Scanning Line Effect */}
                    <motion.div 
                        animate={{ top: ['0%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-10 bg-primary-500/10 blur-xl pointer-events-none"
                    />
                </div>
            </div>
        </div>
    );
}
