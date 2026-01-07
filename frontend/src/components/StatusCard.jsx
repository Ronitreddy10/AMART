import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Shield, Zap, Search, Lock, ChevronDown, ChevronUp } from 'lucide-react';

const StatusCard = ({ lastLog, isRunning, liveStats }) => {
    // Infer narrative from raw logs
    const getNarrative = (log) => {
        if (!log) return "Ready to Initialize Audit";
        const l = log.toLowerCase();
        if (l.includes("generating")) return "AI is brainstorming attack vectors";
        if (l.includes("rated")) return "Evaluating stealthiness of proposed attack";
        if (l.includes("querying")) return "Launching payload against target system";
        if (l.includes("success")) return "VULNERABILITY CONFIRMED — Data leak detected";
        if (l.includes("pruned")) return "Strategy rejected (Too obvious). Retrying with new approach";
        if (l.includes("fail")) return "Attack attempt blocked by target defenses";
        if (l.includes("error")) return "An error occurred during execution";
        return "Processing...";
    };

    const narrative = getNarrative(lastLog);

    return (
        <div className="w-full mb-6">
            <div className="glass-panel p-8 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-apple-blue to-transparent opacity-50"></div>

                <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${isRunning ? 'bg-apple-blue/10 animate-pulse' : 'bg-white/5'}`}>
                            {isRunning ? <Activity className="text-apple-blue" size={24} /> : <Shield className="text-gray-400" size={24} />}
                        </div>
                        <div>
                            <h2 className="text-3xl font-semibold tracking-tight text-white mb-1">
                                {isRunning ? "Active Audit in Progress" : "System Ready"}
                            </h2>
                            <p className="text-gray-400 font-medium text-sm">
                                {isRunning ? "Automated Red Teaming Protocol v2.1" : "Waiting to launch secure assessment"}
                            </p>
                        </div>
                    </div>
                    {isRunning && (
                        <div className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold animate-pulse">
                            LIVE
                        </div>
                    )}
                </div>

                {/* Narrative Display */}
                <div className="mb-8 pl-2 border-l-2 border-apple-blue/50">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={narrative}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-2xl font-light text-gray-200"
                        >
                            {narrative}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Live Stats */}
                <div className="grid grid-cols-4 gap-4">
                    <StatBox label="Current Depth" value={liveStats.depth} icon={Search} />
                    <StatBox label="Variations Tested" value={liveStats.attempts} icon={Zap} />
                    <StatBox label="Best Stealth Score" value={liveStats.bestStealth.toFixed(2)} icon={Lock} color={liveStats.bestStealth > 0.8 ? "text-green-400" : "text-yellow-400"} />
                    <StatBox label="Breaches Found" value={liveStats.breaches} icon={Shield} color={liveStats.breaches > 0 ? "text-red-400" : "text-gray-400"} />
                </div>
            </div>
        </div>
    );
};

const StatBox = ({ label, value, icon: Icon, color = "text-white" }) => (
    <div className="bg-black/20 rounded-xl p-4 flex items-center gap-4">
        <div className="p-2 bg-white/5 rounded-lg">
            <Icon size={16} className="text-gray-400" />
        </div>
        <div>
            <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">{label}</div>
            <div className={`text-xl font-mono font-medium ${color}`}>{value}</div>
        </div>
    </div>
);

export default StatusCard;
