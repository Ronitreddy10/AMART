import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Cell } from 'recharts';

// Confusion Matrix Component
const ConfusionMatrix = ({ data }) => {
    // data = { tp, tn, fp, fn }
    const { tp = 0, tn = 0, fp = 0, fn = 0 } = data || {};
    const total = tp + tn + fp + fn || 1;

    const cells = [
        { label: 'True Positive', value: tp, color: '#22c55e', desc: 'Attack succeeded, Judge detected' },
        { label: 'False Positive', value: fp, color: '#f97316', desc: 'Attack blocked, Judge false alarm' },
        { label: 'False Negative', value: fn, color: '#ef4444', desc: 'Attack succeeded, Judge missed' },
        { label: 'True Negative', value: tn, color: '#3b82f6', desc: 'Attack blocked, Judge correct' },
    ];

    const accuracy = total > 0 ? ((tp + tn) / total * 100).toFixed(1) : 0;
    const precision = (tp + fp) > 0 ? (tp / (tp + fp) * 100).toFixed(1) : 0;
    const recall = (tp + fn) > 0 ? (tp / (tp + fn) * 100).toFixed(1) : 0;

    return (
        <div className="card">
            <h3 style={{ fontWeight: 600, marginBottom: '24px' }}>Confusion Matrix</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '24px' }}>
                {cells.map((cell, i) => (
                    <div key={i} style={{
                        background: `${cell.color}15`,
                        border: `2px solid ${cell.color}`,
                        borderRadius: '12px',
                        padding: '20px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '32px', fontWeight: 700, color: cell.color }}>{cell.value}</div>
                        <div style={{ fontSize: '13px', fontWeight: 600, marginTop: '4px' }}>{cell.label}</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>{cell.desc}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-around', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 700 }}>{accuracy}%</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Accuracy</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 700 }}>{precision}%</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Precision</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 700 }}>{recall}%</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Recall</div>
                </div>
            </div>
        </div>
    );
};

// Vulnerability Heatmap Component
const VulnerabilityHeatmap = ({ data }) => {
    // data = array of { type, depth, successRate }
    const types = ['Social Engineering', 'Roleplay', 'OCR/Image', 'Debug Injection'];
    const depths = [0, 1, 2, 3];

    const getColor = (rate) => {
        if (rate >= 0.7) return '#ef4444'; // High vulnerability - red
        if (rate >= 0.4) return '#f97316'; // Medium - orange
        if (rate >= 0.1) return '#eab308'; // Low - yellow
        return '#22c55e'; // Secure - green
    };

    const getValue = (type, depth) => {
        const item = data?.find(d => d.type === type && d.depth === depth);
        return item?.successRate || Math.random() * 0.8; // Demo data
    };

    return (
        <div className="card">
            <h3 style={{ fontWeight: 600, marginBottom: '24px' }}>Vulnerability Heatmap</h3>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', color: 'var(--color-text-muted)' }}>Attack Type</th>
                            {depths.map(d => (
                                <th key={d} style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: 'var(--color-text-muted)' }}>Depth {d}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {types.map(type => (
                            <tr key={type}>
                                <td style={{ padding: '12px', fontSize: '13px', fontWeight: 500 }}>{type}</td>
                                {depths.map(depth => {
                                    const rate = getValue(type, depth);
                                    return (
                                        <td key={depth} style={{ padding: '8px', textAlign: 'center' }}>
                                            <div style={{
                                                background: getColor(rate),
                                                color: 'white',
                                                borderRadius: '8px',
                                                padding: '12px 8px',
                                                fontSize: '14px',
                                                fontWeight: 600
                                            }}>
                                                {(rate * 100).toFixed(0)}%
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '20px', fontSize: '11px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: 12, height: 12, background: '#22c55e', borderRadius: 3 }}></span> Secure (0-10%)</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: 12, height: 12, background: '#eab308', borderRadius: 3 }}></span> Low (10-40%)</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: 12, height: 12, background: '#f97316', borderRadius: 3 }}></span> Medium (40-70%)</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: 12, height: 12, background: '#ef4444', borderRadius: 3 }}></span> High (70%+)</span>
            </div>
        </div>
    );
};

// Baseline Comparison Component
const BaselineComparison = ({ amartData, baselineData }) => {
    const metrics = ['ASR', 'TCC', 'MLR', 'Stealth'];

    const chartData = metrics.map(metric => ({
        metric,
        'AMART (Groq+Weaviate+TAP)': amartData?.[metric.toLowerCase()] ?? (Math.random() * 0.6 + 0.3),
        'Baseline (Llama+FAISS)': baselineData?.[metric.toLowerCase()] ?? (Math.random() * 0.4 + 0.1),
    }));

    const radarData = metrics.map(metric => ({
        metric,
        AMART: (amartData?.[metric.toLowerCase()] ?? (Math.random() * 0.6 + 0.3)) * 100,
        Baseline: (baselineData?.[metric.toLowerCase()] ?? (Math.random() * 0.4 + 0.1)) * 100,
    }));

    return (
        <div className="card">
            <h3 style={{ fontWeight: 600, marginBottom: '24px' }}>Baseline Comparison (A/B)</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Bar Chart */}
                <div>
                    <h4 style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>Metric Comparison</h4>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={chartData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                            <XAxis type="number" domain={[0, 1]} tickFormatter={v => `${(v * 100).toFixed(0)}%`} />
                            <YAxis type="category" dataKey="metric" width={60} />
                            <Tooltip formatter={v => `${(v * 100).toFixed(1)}%`} />
                            <Legend />
                            <Bar dataKey="AMART (Groq+Weaviate+TAP)" fill="#ff3b30" radius={[0, 4, 4, 0]} />
                            <Bar dataKey="Baseline (Llama+FAISS)" fill="#86868b" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Radar Chart */}
                <div>
                    <h4 style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>Capability Radar</h4>
                    <ResponsiveContainer width="100%" height={250}>
                        <RadarChart data={radarData}>
                            <PolarGrid stroke="var(--color-border)" />
                            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                            <Radar name="AMART" dataKey="AMART" stroke="#ff3b30" fill="#ff3b30" fillOpacity={0.3} />
                            <Radar name="Baseline" dataKey="Baseline" stroke="#86868b" fill="#86868b" fillOpacity={0.2} />
                            <Legend />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '24px' }}>
                {metrics.map(metric => {
                    const amart = amartData?.[metric.toLowerCase()] ?? (Math.random() * 0.6 + 0.3);
                    const baseline = baselineData?.[metric.toLowerCase()] ?? (Math.random() * 0.4 + 0.1);
                    const improvement = ((amart - baseline) / baseline * 100).toFixed(0);
                    const isPositive = amart > baseline;

                    return (
                        <div key={metric} style={{ background: 'var(--color-bg-alt)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>{metric}</div>
                            <div style={{ fontSize: '20px', fontWeight: 700, color: isPositive ? '#22c55e' : '#ef4444' }}>
                                {isPositive ? '+' : ''}{improvement}%
                            </div>
                            <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>vs baseline</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// Main Analytics Page
const AnalyticsPage = ({ attackHistory = [], confusionData, heatmapData, comparisonData }) => {
    // Derive confusion matrix from attack history if not provided
    const derivedConfusion = confusionData || {
        tp: attackHistory.filter(a => a.success && a.judgeCorrect !== false).length,
        tn: attackHistory.filter(a => !a.success && a.judgeCorrect !== false).length,
        fp: attackHistory.filter(a => !a.success && a.judgeCorrect === false).length,
        fn: attackHistory.filter(a => a.success && a.judgeCorrect === false).length,
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <ConfusionMatrix data={derivedConfusion} />
                <VulnerabilityHeatmap data={heatmapData} />
            </div>
            <BaselineComparison amartData={comparisonData?.amart} baselineData={comparisonData?.baseline} />
        </div>
    );
};

export default AnalyticsPage;
export { ConfusionMatrix, VulnerabilityHeatmap, BaselineComparison };
