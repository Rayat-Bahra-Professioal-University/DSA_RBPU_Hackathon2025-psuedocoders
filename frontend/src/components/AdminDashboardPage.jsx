// frontend/src/components/AdminDashboardPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { BarChart, PieChart, Pie, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Users, FileText, UserCheck, CheckSquare } from 'lucide-react';

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center">
    <div className={`p-3 rounded-full mr-4 ${color}`}>{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default function AdminDashboardPage({ issues, navigateTo, userInfo }) {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('http://localhost:5000/api/admin/stats', config);
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      }
    };
    fetchStats();
  }, [userInfo.token]);

  const chartData = useMemo(() => {
    if (!issues || issues.length === 0) {
      return { categoryData: [], statusData: [] };
    }
    const categoryCounts = issues.reduce((acc, issue) => { acc[issue.category] = (acc[issue.category] || 0) + 1; return acc; }, {});
    const categoryData = Object.keys(categoryCounts).map(name => ({ name: name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' '), count: categoryCounts[name] }));

    const statusCounts = issues.reduce((acc, issue) => { acc[issue.status] = (acc[issue.status] || 0) + 1; return acc; }, { Open: 0, 'In Progress': 0, Resolved: 0 });
    const statusData = [
      { name: t('open'), value: statusCounts.Open },
      { name: t('in_progress'), value: statusCounts['In Progress'] },
      { name: t('resolved'), value: statusCounts.Resolved },
    ];
    return { categoryData, statusData };
  }, [issues, t]);

  const recentIssues = useMemo(() => issues.slice(0, 5), [issues]);
  const PIE_COLORS = ['#EF4444', '#F59E0B', '#10B981']; // Red, Amber, Green

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">{t('admin_dashboard')}</h1>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Issues" value={stats?.totalIssues ?? '...'} icon={<FileText />} color="bg-blue-100 text-blue-600" />
        <StatCard title="Total Users" value={stats?.totalUsers ?? '...'} icon={<Users />} color="bg-indigo-100 text-indigo-600" />
        <StatCard title="Pending Volunteers" value={stats?.pendingVolunteers ?? '...'} icon={<UserCheck />} color="bg-yellow-100 text-yellow-600" />
        <StatCard title="Resolved (30d)" value={stats?.resolvedLast30Days ?? '...'} icon={<CheckSquare />} color="bg-green-100 text-green-600" />
      </div>

      {/* Recent Issues & Status Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700 p-4 border-b">Recent Issues</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentIssues.map(issue => (
                <tr key={issue._id}>
                  <td className="px-6 py-4 font-medium text-gray-900">{issue.title}</td>
                  <td className="px-6 py-4"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${PIE_COLORS[issue.status === 'Open' ? 0 : issue.status === 'In Progress' ? 1 : 2].replace('#', 'bg-[-]-100').replace('text-[-]-800', '')}`}>{issue.status}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(issue.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right"><button onClick={() => navigateTo('issue-detail', issue._id)} className="text-indigo-600 hover:text-indigo-900 font-semibold">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">{t('issues_by_status')}</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={chartData.statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value" nameKey="name" paddingAngle={5}>
                {chartData.statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Category Chart */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">{t('issues_by_category')}</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData.categoryData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" fontSize={12} />
            <YAxis allowDecimals={false} fontSize={12} />
            <Tooltip />
            <Bar dataKey="count" fill="#4F46E5" name={t('issues')} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}