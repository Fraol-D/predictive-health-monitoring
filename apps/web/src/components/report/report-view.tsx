
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, AlertTriangle, TrendingUp, CheckCircle, BarChart2, Calendar } from 'lucide-react';

interface Scorecard {
  category: string;
  score: number;
  level: 'Low' | 'Medium' | 'High' | 'Critical';
  recommendation?: string;
  previousScore?: number;
}

export interface ReportData {
  riskSummary: string;
  scorecards: Scorecard[];
  generatedAt: string;
}

const getRiskColor = (level: string) => {
    switch (level) {
        case 'Critical': return 'text-red-700';
        case 'High': return 'text-red-500';
        case 'Medium': return 'text-orange-400';
        case 'Low':
        default: return 'text-green-500';
    }
};

const getRiskFillColor = (level: string) => {
    switch (level) {
        case 'Critical': return '#b91c1c';
        case 'High': return '#ef4444';
        case 'Medium': return '#f97316';
        case 'Low':
        default: return '#22c55e';
    }
};

const RiskLevelDistributionChart = ({ data }: { data: Scorecard[] }) => {
    const levelCounts = data.reduce((acc, curr) => {
        acc[curr.level] = (acc[curr.level] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const chartData = Object.keys(levelCounts).map(level => ({
        name: level,
        value: levelCounts[level],
    }));

    return (
        <ResponsiveContainer width="100%" height={200}>
            <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getRiskFillColor(entry.name)} />
                    ))}
                </Pie>
                <Tooltip />
            </PieChart>
        </ResponsiveContainer>
    );
};

const ScorecardItem = ({ scorecard }: { scorecard: Scorecard }) => (
    <div className="p-4 bg-card/50 rounded-lg flex justify-between items-center">
        <div>
            <h4 className="font-semibold">{scorecard.category}</h4>
            <p className={`text-2xl font-bold ${getRiskColor(scorecard.level)}`}>{scorecard.score}%</p>
            {scorecard.recommendation && <p className="text-sm text-muted-foreground mt-1">{scorecard.recommendation}</p>}
        </div>
        <div className="flex items-center space-x-2">
             <div className="text-right">
                <p className={`px-3 py-1 text-sm font-bold rounded-full ${getRiskColor(scorecard.level)} bg-opacity-20`}>{scorecard.level}</p>
             </div>
             {scorecard.previousScore && <TrendingUp className="w-5 h-5 text-muted-foreground" title="Trend data available" />}
        </div>
    </div>
);

export const ReportView = ({ reportData }: { reportData: ReportData }) => {
    const overallRisk = reportData.scorecards.find(s => s.category === 'Overall Risk');
    const otherScorecards = reportData.scorecards.filter(s => s.category !== 'Overall Risk');

    return (
        <div className="space-y-6">
            <Card className="bg-primary/10 border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center"><Info className="w-5 h-5 mr-2 text-primary" /> Risk Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg">{reportData.riskSummary}</p>
                </CardContent>
            </Card>

            {overallRisk && (
                <Card className="border-2 border-highlight bg-highlight/5">
                    <CardHeader>
                        <CardTitle className="flex items-center text-highlight"><AlertTriangle className="w-5 h-5 mr-2" /> Overall Health Risk</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className={`text-5xl font-bold ${getRiskColor(overallRisk.level)}`}>{overallRisk.score}%</p>
                                <p className={`text-xl font-semibold ${getRiskColor(overallRisk.level)}`}>{overallRisk.level}</p>
                            </div>
                            <div className="w-1/2">
                                <RiskLevelDistributionChart data={otherScorecards} />
                            </div>
                        </div>
                        {overallRisk.recommendation && <p className="text-sm text-muted-foreground mt-2">{overallRisk.recommendation}</p>}
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><BarChart2 className="w-5 h-5 mr-2" /> Detailed Scores</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {otherScorecards.map(scorecard => <ScorecardItem key={scorecard.category} scorecard={scorecard} />)}
                </CardContent>
            </Card>

            <div className="text-center text-muted-foreground text-sm flex justify-center items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Report generated on {new Date(reportData.generatedAt).toLocaleString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
            </div>
        </div>
    );
}; 