import React from 'react';
import {
    AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { Activity, ShieldAlert, TrendingUp, Zap } from 'lucide-react';

const MetricsPage = ({ data }) => {
    const chartData = data && data.length > 0 ? data : [
        { name: 'Test 1', asr: 0.1, tcc: 0.2, mlr: 0.0, qe: 0.8 },
        { name: 'Test 2', asr: 0.45, tcc: 0.5, mlr: 0.1, qe: 0.7 },
    ];
    const currentStats = chartData[chartData.length - 1];

    return (
        <div className="space-y-8 animate-fade-in p-2">
            <header className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-semibold text-white tracking-tight">Security Analytics</h2>
                    <p className="text-gray-400 text-sm mt-1 font-medium">Audit Session #SEC-2025-ALPHA</p>
                </div>
                <div className="text-xs font-mono text-gray-500 bg-white/5 px-2 py-1 rounded border border-white/10">
                    AUTO-SYNC ENABLED
                </div>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: 'Attack Success', value: currentStats.asr, color: 'text-red-400' },
                    { label: 'Target Compliance', value: currentStats.tcc, color: 'text-yellow-400' },
                    { label: 'Data Leakage', value: currentStats.mlr, color: 'text-orange-400' },
                    { label: 'Query Efficiency', value: currentStats.qe, color: 'text-apple-blue' },
                ].map((stat, i) => (
                    <div key={i} className="glass-panel p-5 rounded-xl">
                        <div className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-2">{stat.label}</div>
                        <div className={`text-3xl font-medium ${stat.color}`}>{(stat.value * 100).toFixed(0)}%</div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-3 gap-4 h-80">
                <div className="col-span-2 glass-panel p-5 rounded-xl flex flex-col">
                    <h3 className="text-gray-300 text-sm font-medium mb-6 flex items-center gap-2">
                        <TrendingUp size={16} className="text-apple-blue" /> VULNERABILITY TREND
                    </h3>
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorAsr" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0a84ff" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#0a84ff" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1c1c1e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="asr" stroke="#ef4444" fillOpacity={1} fill="url(#colorAsr)" strokeWidth={2} />
                                <Area type="monotone" dataKey="qe" stroke="#0a84ff" fillOpacity={1} fill="url(#colorBlue)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="col-span-1 glass-panel p-5 rounded-xl flex flex-col">
                    <h3 className="text-gray-300 text-sm font-medium mb-6 flex items-center gap-2">
                        <ShieldAlert size={16} className="text-apple-blue" /> VECTOR ANALYSIS
                    </h3>
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                                { subject: 'ASR', A: currentStats.asr * 100, fullMark: 100 },
                                { subject: 'TCC', A: currentStats.tcc * 100, fullMark: 100 },
                                { subject: 'MLR', A: currentStats.mlr * 100, fullMark: 100 },
                                { subject: 'QE', A: currentStats.qe * 100, fullMark: 100 },
                                { subject: 'Stealth', A: 45, fullMark: 100 },
                            ]}>
                                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                <PolarAngleAxis dataKey="subject" stroke="#888" fontSize={10} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="transparent" />
                                <Radar name="Current" dataKey="A" stroke="#0a84ff" fill="#0a84ff" fillOpacity={0.4} />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MetricsPage;
