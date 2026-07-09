import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { createClient } from '@supabase/supabase-js';
import { Shield, RefreshCw, Phone, Mail, MapPin, Calendar, Clock } from 'lucide-react';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://pviwktddsltnjjnokrwc.supabase.co';
const supabaseKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_PbxicU-umhZOO4PRhSGnHQ_qztBo_UW';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminDashboard({ theme, toggleTheme }: { theme: string, toggleTheme: () => void }) {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans p-6 selection:bg-[#16a34a] selection:text-white transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-[#16a34a] rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight">Admin Portal</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Lead Management Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={fetchLeads}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-lg text-sm font-bold uppercase tracking-wider transition-colors"
            >
              Back to Site
            </button>
          </div>
        </header>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
            <h2 className="text-lg font-bold uppercase tracking-wider">Recent Leads</h2>
            <div className="bg-[#16a34a]/10 text-[#16a34a] dark:text-green-400 px-3 py-1 rounded-full text-xs font-black">
              {leads.length} Total
            </div>
          </div>

          {error ? (
            <div className="p-8 text-center text-red-500">
              <p className="font-medium mb-4">{error}</p>
              <button onClick={fetchLeads} className="underline text-sm font-bold uppercase tracking-wider">Try Again</button>
            </div>
          ) : loading && leads.length === 0 ? (
            <div className="p-12 flex justify-center">
              <RefreshCw className="w-8 h-8 text-slate-400 animate-spin" />
            </div>
          ) : leads.length === 0 ? (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400">
              <p className="font-medium">No leads found.</p>
              <p className="text-sm mt-2">Leads captured by Thandi will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {leads.map((lead, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={lead.id} 
                  className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{lead.name || 'Anonymous'}</h3>
                      <div className="flex flex-wrap gap-4 mt-4">
                        {lead.email && (
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                            <Mail className="w-4 h-4 text-slate-400" />
                            <a href={`mailto:${lead.email}`} className="hover:text-[#16a34a] hover:underline">{lead.email}</a>
                          </div>
                        )}
                        {lead.phone && (
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                            <Phone className="w-4 h-4 text-slate-400" />
                            <a href={`tel:${lead.phone}`} className="hover:text-[#16a34a] hover:underline">{lead.phone}</a>
                          </div>
                        )}
                        {lead.location && (
                          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            {lead.location}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-left md:text-right flex flex-row md:flex-col items-center md:items-end gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(lead.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
