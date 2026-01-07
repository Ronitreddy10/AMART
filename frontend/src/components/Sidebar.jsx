import React from 'react';
import { Terminal, Activity, FileText, Settings, Shield, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const { theme, toggleTheme } = useTheme();

    const menuItems = [
        { id: 'attack', label: 'Attack Console', icon: Terminal },
        { id: 'metrics', label: 'Metrics Report', icon: Activity },
        { id: 'logs', label: 'Live Logs', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="w-64 glass-panel border-r border-white/5 flex flex-col h-full relative z-20">
            <div className="p-6 flex items-center gap-3 border-b border-white/5">
                <div className="w-8 h-8 rounded-lg bg-apple-blue flex items-center justify-center shadow-[0_0_15px_rgba(10,132,255,0.4)]">
                    <Shield size={18} className="text-white" />
                </div>
                <div>
                    <h1 className="font-semibold tracking-tight text-white">AMART<span className="opacity-50 font-light">RAG</span></h1>
                    <p className="text-[10px] text-gray-400 font-medium tracking-wider">RED TEAM SUITE</p>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive
                                    ? 'bg-apple-blue text-white shadow-lg shadow-apple-blue/20'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/5 space-y-3">
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                >
                    <span className="flex items-center gap-3">
                        {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                        {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                    </span>
                </button>

                <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 border border-white/5">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <div className="text-xs">
                        <div className="text-gray-300 font-medium">System Online</div>
                        <div className="text-gray-500 text-[10px]">v2.1.0-stable</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
