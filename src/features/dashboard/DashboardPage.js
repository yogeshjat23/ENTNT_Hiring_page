import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import Loader from '../../components/common/Loader';
import StatCard3D from './StatCard3D'; 
import './DashboardPage.css';

// API calls
const fetchAllCandidates = async () => (await fetch('/candidates')).json();
const fetchAllJobs = async () => (await fetch('/jobs/all')).json();

const STAGE_COLORS = {
  applied: '#8884d8',
  screen: '#82ca9d',
  tech: '#ffc658',
  offer: '#ff8042',
  hired: 'var(--status-active)',
  rejected: 'var(--danger-color)',
};

export default function DashboardPage() {
    const { data: candidates, isLoading: isLoadingCandidates } = useQuery({
        queryKey: ['allCandidates'],
        queryFn: fetchAllCandidates,
    });

    const { data: jobs, isLoading: isLoadingJobs } = useQuery({
        queryKey: ['allJobs'],
        queryFn: fetchAllJobs,
    });

    const stats = useMemo(() => {
        if (!candidates || !jobs) return null;

        const candidateStages = { applied: 0, screen: 0, tech: 0, offer: 0, hired: 0, rejected: 0 };
        candidates.forEach(c => {
            if (candidateStages.hasOwnProperty(c.stage)) {
                candidateStages[c.stage]++;
            }
        });

        const jobStatus = { active: 0, archived: 0 };
        jobs.forEach(j => {
            if (jobStatus.hasOwnProperty(j.status)) {
                jobStatus[j.status]++;
            }
        });

        return {
            totalCandidates: candidates.length,
            totalJobs: jobs.length,
            hiredCount: candidateStages.hired,
            candidatePipelineData: Object.keys(candidateStages).map(key => ({ name: key, count: candidateStages[key] })),
            jobStatusData: Object.keys(jobStatus).map(key => ({ name: key, value: jobStatus[key] })),
        };
    }, [candidates, jobs]);

    const isLoading = isLoadingCandidates || isLoadingJobs || !stats;

    if (isLoading) {
        return <Loader text="Analyzing hiring data..." />;
    }
    
    const PIE_COLORS = { active: 'var(--status-active)', archived: 'var(--status-archived)' };

    return (
        <div className="dashboard-layout">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <p>An overview of your hiring pipeline and job statuses.</p>
            </div>
            
            <div className="stats-grid">
                <StatCard3D title="Total Candidates" value={stats.totalCandidates} />
                <StatCard3D title="Total Jobs" value={stats.totalJobs} />
                <StatCard3D title="Candidates Hired" value={stats.hiredCount} className="hired-card" />
            </div>

            <div className="charts-grid">
                <div className="chart-container">
                    <h3>Candidate Pipeline</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.candidatePipelineData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
                            <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
                            <Tooltip cursor={{fill: 'var(--surface-secondary)'}} contentStyle={{backgroundColor: 'var(--surface-primary)', border: '1px solid var(--border-color)'}}/>
                            <Bar dataKey="count" name="Candidates" radius={[4, 4, 0, 0]}>
                                {stats.candidatePipelineData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={STAGE_COLORS[entry.name]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="chart-container">
                    <h3>Job Status Overview</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={stats.jobStatusData} cx="50%" cy="50%" labelLine={false} outerRadius={100} dataKey="value" nameKey="name">
                                {stats.jobStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[entry.name]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{backgroundColor: 'var(--surface-primary)', border: '1px solid var(--border-color)'}}/>
                            <Legend iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}