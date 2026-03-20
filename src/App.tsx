import { useState, useEffect } from 'react';
import axios from 'axios';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { HealthCheck } from './components/HealthCheck';
import { ReportsTable } from './components/ReportsTable';
import { HealthStatus, ReportItem } from './types';
import { Send, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDark, setIsDark] = useState(true);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingReport, setSendingReport] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    fetchData();
    // Apply theme
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [healthRes, reportsRes] = await Promise.all([
        axios.get('/api/health'),
        axios.get('/api/reports')
      ]);
      setHealth(healthRes.data);
      setReports(reportsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReport = async () => {
    setSendingReport(true);
    try {
      await axios.post('/api/send-report', { health, reports });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error('Error sending report:', error);
    } finally {
      setSendingReport(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black transition-colors duration-200">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isDark={isDark} 
        toggleTheme={() => setIsDark(!isDark)} 
      />

      <main className="flex-1 overflow-y-auto">
        <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400">
            {activeTab.replace('-', ' ')}
          </h2>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleSendReport}
              disabled={sendingReport || loading}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
            >
              {sendingReport ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Send Manual Report
            </button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-zinc-500">
              <Loader2 className="w-10 h-10 animate-spin mb-4 text-indigo-600" />
              <p className="font-medium animate-pulse">Syncing with enterprise databases...</p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && <Dashboard data={reports} />}
              {activeTab === 'health' && (
                <HealthCheck 
                  status={health} 
                  loading={loading} 
                  onRefresh={fetchData} 
                />
              )}
              {activeTab === 'reports' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Merged Reports</h2>
                      <p className="text-zinc-500 dark:text-zinc-400 text-sm">Consolidated data from MSSQL, MySQL, and PostgreSQL</p>
                    </div>
                  </div>
                  <ReportsTable reports={reports} />
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Toast Notification */}
      <div className={cn(
        "fixed bottom-8 right-8 flex items-center gap-3 px-6 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl shadow-2xl transition-all duration-500 transform",
        showToast ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0 pointer-events-none"
      )}>
        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        <span className="font-medium">Report sent successfully to administrator</span>
      </div>
    </div>
  );
}
