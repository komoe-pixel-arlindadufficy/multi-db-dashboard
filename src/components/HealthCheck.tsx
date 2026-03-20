import React from 'react';
import { Database, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { HealthStatus } from '../types';
import { cn } from '../lib/utils';

interface HealthCheckProps {
  status: HealthStatus | null;
  loading: boolean;
  onRefresh: () => void;
}

export const HealthCheck: React.FC<HealthCheckProps> = ({ status, loading, onRefresh }) => {
  const dbs = [
    { id: 'mssql', name: 'Microsoft SQL Server', icon: Database },
    { id: 'mysql', name: 'MySQL Database', icon: Database },
    { id: 'pg', name: 'PostgreSQL Database', icon: Database },
  ];

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Data Health</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">Real-time connection status of enterprise databases</p>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Refresh Status'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {dbs.map((db) => {
          const dbStatus = status ? status[db.id as keyof HealthStatus] : null;
          const isConnected = dbStatus?.connected;

          return (
            <div
              key={db.id}
              className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  isConnected ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-rose-50 dark:bg-rose-900/20"
                )}>
                  <db.icon className={cn(
                    "w-6 h-6",
                    isConnected ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                  )} />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-white">{db.name}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                    {isConnected ? 'Connection established' : (dbStatus?.error || 'Awaiting connection check...')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isConnected ? (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    <CheckCircle2 className="w-3 h-3" />
                    Healthy
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
                    <XCircle className="w-3 h-3" />
                    Offline
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!status && !loading && (
        <div className="p-8 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-center">
          <AlertCircle className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mb-4" />
          <p className="text-zinc-500 dark:text-zinc-400">No health data available. Please run a manual check.</p>
        </div>
      )}
    </div>
  );
};
