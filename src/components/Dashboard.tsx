import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell, PieChart, Pie } from 'recharts';
import { ReportItem } from '../types';

interface DashboardProps {
  data: ReportItem[];
}

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const sourceData = [
    { name: 'MSSQL', value: data.filter(d => d.source === 'MSSQL').length },
    { name: 'MySQL', value: data.filter(d => d.source === 'MySQL').length },
    { name: 'PostgreSQL', value: data.filter(d => d.source === 'PostgreSQL').length },
  ];

  const statusData = [
    { name: 'Completed', value: data.filter(d => d.status === 'Completed').length },
    { name: 'Pending', value: data.filter(d => d.status === 'Pending').length },
    { name: 'Failed', value: data.filter(d => d.status === 'Failed').length },
  ];

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Total Revenue</p>
          <h3 className="text-3xl font-bold mt-2 text-zinc-900 dark:text-white">
            ${data.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
          </h3>
          <p className="text-xs text-emerald-500 mt-2 font-medium">↑ 12% from last month</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Active Reports</p>
          <h3 className="text-3xl font-bold mt-2 text-zinc-900 dark:text-white">{data.length}</h3>
          <p className="text-xs text-zinc-400 mt-2">Across 3 databases</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">System Health</p>
          <h3 className="text-3xl font-bold mt-2 text-zinc-900 dark:text-white">98.2%</h3>
          <p className="text-xs text-emerald-500 mt-2 font-medium">Optimal performance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <h4 className="text-sm font-semibold mb-6 text-zinc-900 dark:text-white">Revenue by Source</h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.1} />
                <XAxis dataKey="customer" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="amount" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <h4 className="text-sm font-semibold mb-6 text-zinc-900 dark:text-white">Data Distribution</h4>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-xs text-zinc-500">Total</span>
              <span className="text-lg font-bold text-zinc-900 dark:text-white">{data.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
