import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { createClient } from '@supabase/supabase-js';
import { 
  Shield, 
  RefreshCw, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Clock, 
  Search, 
  X, 
  CheckCircle2, 
  ClipboardList, 
  Users, 
  PhoneCall, 
  FileText, 
  SlidersHorizontal,
  AlertTriangle,
  ChevronDown,
  Trash2,
  Download,
  Plus,
  MessageSquare,
  AlertCircle,
  Square,
  CheckSquare,
  Send,
  Loader2
} from 'lucide-react';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://pviwktddsltnjjnokrwc.supabase.co';
const supabaseKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_PbxicU-umhZOO4PRhSGnHQ_qztBo_UW';
const supabase = createClient(supabaseUrl, supabaseKey);

const STATUS_OPTIONS = ['New', 'Contacted', 'Quoted', 'Installed'];

const STATUS_COLORS: Record<string, { bg: string, text: string, border: string, dot: string }> = {
  'New': { 
    bg: 'bg-blue-50 dark:bg-blue-950/30', 
    text: 'text-blue-700 dark:text-blue-400', 
    border: 'border-blue-100 dark:border-blue-900/40',
    dot: 'bg-blue-500'
  },
  'Contacted': { 
    bg: 'bg-amber-50 dark:bg-amber-950/30', 
    text: 'text-amber-700 dark:text-amber-400', 
    border: 'border-amber-100 dark:border-amber-900/40',
    dot: 'bg-amber-500'
  },
  'Quoted': { 
    bg: 'bg-purple-50 dark:bg-purple-950/30', 
    text: 'text-purple-700 dark:text-purple-400', 
    border: 'border-purple-100 dark:border-purple-900/40',
    dot: 'bg-purple-500'
  },
  'Installed': { 
    bg: 'bg-green-50 dark:bg-green-950/30', 
    text: 'text-green-700 dark:text-green-400', 
    border: 'border-green-100 dark:border-green-900/40',
    dot: 'bg-green-500'
  }
};

export default function AdminDashboard({ theme, toggleTheme, onLogout }: { theme: string, toggleTheme: () => void, onLogout?: () => void }) {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSchemaNotice, setShowSchemaNotice] = useState(false);

  // Admin Login and OAuth States (now fully managed by AdminGuard, defaulted to true here)
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const handleGoogleCredentialResponse = (response: any) => {
    try {
      const jwt = response.credential;
      const payload = JSON.parse(atob(jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      const email = payload.email;
      const isEmailVerified = payload.email_verified;

      if (isEmailVerified && email === 'lesedisolarandbackup@gmail.com') {
        setIsAuthenticated(true);
        localStorage.setItem('vula_lesedi_admin_authenticated', 'true');
        setAuthError(null);
        logLeadHistory('system', 'admin_login', `Admin logged in via Google OAuth (${email})`);
      } else {
        setAuthError(`Access Denied: Google account (${email}) is not authorized as Admin.`);
      }
    } catch (e: any) {
      setAuthError('Failed to parse Google login token.');
    }
  };

  const handleEmailPasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const emailClean = adminEmail.trim().toLowerCase();
    const passwordClean = adminPassword.trim();

    if (emailClean === 'lesedisolarandbackup@gmail.com' && passwordClean === 'Vincent@1987') {
      setIsAuthenticated(true);
      localStorage.setItem('vula_lesedi_admin_authenticated', 'true');
      setAuthError(null);
      logLeadHistory('system', 'admin_login', `Admin logged in via credentials (${emailClean})`);
    } else {
      setAuthError('Invalid administrator credentials. Please check your email and password.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('vula_lesedi_admin_authenticated');
    if (onLogout) {
      onLogout();
    }
  };

  useEffect(() => {
    if (isAuthenticated) return;

    let script = document.getElementById('google-gsi-script') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = 'google-gsi-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    const initGsi = () => {
      const clientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || '948613355621-cl4peq5mmfledro8pp606l6dre0jv26b.apps.googleusercontent.com';
      if ((window as any).google?.accounts?.id) {
        (window as any).google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCredentialResponse,
        });
        const container = document.getElementById('google-signin-btn-container');
        if (container) {
          (window as any).google.accounts.id.renderButton(
            container,
            { theme: 'outline', size: 'large', width: 360 }
          );
        }
      }
    };

    script.onload = () => {
      initGsi();
    };

    if ((window as any).google?.accounts?.id) {
      initGsi();
    }

    const timer = setTimeout(() => {
      initGsi();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [isAuthenticated]);

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  // Selection states
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());
  
  // Modals / Confirmation overlays
  const [leadToDelete, setLeadToDelete] = useState<any | null>(null);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

  // Notes state
  const [expandedNotesLeadId, setExpandedNotesLeadId] = useState<string | null>(null);
  const [newNoteTexts, setNewNoteTexts] = useState<Record<string, string>>({});
  const [leadNotes, setLeadNotes] = useState<Record<string, Array<{ id: string, text: string, created_at: string }>>>(() => {
    try {
      const cached = localStorage.getItem('vula_lesedi_lead_notes');
      return cached ? JSON.parse(cached) : {};
    } catch (e) {
      return {};
    }
  });

  // Local state storage for statuses as a high-robustness fallback
  const [localStatuses, setLocalStatuses] = useState<Record<string, string>>(() => {
    try {
      const cached = localStorage.getItem('vula_lesedi_lead_statuses');
      return cached ? JSON.parse(cached) : {};
    } catch (e) {
      return {};
    }
  });

  // CRM Navigation Tab
  const [currentTab, setCurrentTab] = useState<'pipeline' | 'crm'>('pipeline');

  // Lead Details Modal
  const [selectedLeadDetails, setSelectedLeadDetails] = useState<any | null>(null);
  const [activeDetailsTab, setActiveDetailsTab] = useState<'overview' | 'history' | 'conversations'>('overview');

  // Pending bulk action state for safety confirmation
  const [pendingBulkStatus, setPendingBulkStatus] = useState<string | null>(null);

  // Email template draft
  const [draftEmail, setDraftEmail] = useState<{
    leadId: string;
    name: string;
    to: string;
    subject: string;
    body: string;
    html: string;
  } | null>(null);
  const [emailSending, setEmailSending] = useState(false);
  const [emailSendResult, setEmailSendResult] = useState<string | null>(null);

  // Audio simulation state for the premium call player
  const [activeCallDetails, setActiveCallDetails] = useState<any | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [playbackPlaying, setPlaybackPlaying] = useState<boolean>(false);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);

  // Call Logs from localStorage
  const [calls, setCalls] = useState<any[]>([]);

  // Lead history / Timeline logs
  const [leadHistory, setLeadHistory] = useState<Record<string, Array<{ id: string, leadId: string, type: string, text: string, created_at: string }>>>(() => {
    try {
      const cached = localStorage.getItem('vula_lesedi_lead_history');
      return cached ? JSON.parse(cached) : {};
    } catch (e) {
      return {};
    }
  });

  // Load and subscribe to storage changes to ensure real-time CRM updates
  useEffect(() => {
    const loadCalls = () => {
      try {
        const cachedCalls = localStorage.getItem('vula_lesedi_calls');
        setCalls(cachedCalls ? JSON.parse(cachedCalls) : []);
      } catch (e) {
        setCalls([]);
      }
    };

    loadCalls();

    const handleStorageChange = () => {
      loadCalls();
      try {
        const cachedHist = localStorage.getItem('vula_lesedi_lead_history');
        if (cachedHist) setLeadHistory(JSON.parse(cachedHist));
      } catch (e) {}
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Visual audio playback simulation effect for the high-premium CRM player
  useEffect(() => {
    let interval: any;
    if (playbackPlaying && activeCallDetails) {
      interval = setInterval(() => {
        setPlaybackProgress(prev => {
          if (prev >= 100) {
            setPlaybackPlaying(false);
            return 0;
          }
          // Increment progress relative to duration and playback speed (capped to 1s intervals)
          const step = (100 / Math.max(1, activeCallDetails.duration)) * playbackSpeed;
          return prev + step;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [playbackPlaying, activeCallDetails, playbackSpeed]);

  const logLeadHistory = (leadId: string, type: string, text: string) => {
    const historyItem = {
      id: Math.random().toString(36).substring(2, 11),
      leadId,
      type,
      text,
      created_at: new Date().toISOString()
    };
    try {
      const existingHistory = JSON.parse(localStorage.getItem('vula_lesedi_lead_history') || '{}');
      const leadHist = existingHistory[leadId] || [];
      existingHistory[leadId] = [historyItem, ...leadHist];
      localStorage.setItem('vula_lesedi_lead_history', JSON.stringify(existingHistory));
      setLeadHistory(existingHistory);
    } catch (e) {
      console.warn('Failed to save lead history to localStorage', e);
    }
  };

  const prepareEmailDraft = (lead: any) => {
    const to = lead.email || "client@example.com";
    const subject = `Vula Lesedi Solar Assessment - Custom Proposal`;
    const html = `<h3>Dear ${lead.name || "Customer"},</h3>
<p>Thank you for speaking with our AI Front Desk Receptionist, Thandi, at Vula Lesedi Power Solutions.</p>
<p>Based on your interest in solar installations in <strong>${lead.location || "South Africa"}</strong>, we have automatically prepared this custom proposal template to help you transition away from load shedding.</p>
<h4>Summary of Our Conversation:</h4>
<ul>
  <li><strong>Target Client:</strong> ${lead.name || "Anonymous User"}</li>
  <li><strong>Assessed Location:</strong> ${lead.location || "South Africa"}</li>
  <li><strong>Follow-up Contact:</strong> ${lead.phone || "N/A"}</li>
</ul>
<p>We've designated your account as <strong>Quoted</strong>. Our engineering team is currently mapping your roof layout using satellite imagery to design the perfect inverter and backup battery bank size.</p>
<p>An installer will call you shortly at <strong>${lead.phone || "your number"}</strong> to schedule a physical walkthrough.</p>
<br/>
<p>Warm regards,</p>
<p><strong>Admin Team</strong><br/>Vula Lesedi Power Solutions</p>`;

    setDraftEmail({
      leadId: lead.id,
      name: lead.name || "Client",
      to,
      subject,
      body: html.replace(/<[^>]*>/g, '\n').replace(/\n\n/g, '\n'), // Plaintext fallback
      html
    });
  };

  const handleSendEmail = async () => {
    if (!draftEmail) return;
    setEmailSending(true);
    setEmailSendResult(null);

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: draftEmail.to,
          subject: draftEmail.subject,
          html: draftEmail.html
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setEmailSendResult("success");
        logLeadHistory(draftEmail.leadId, 'email_draft', `Quote email template draft prepped and sent to ${draftEmail.to} ${data.simulated ? "(Simulating Delivery)" : "(Resend Delivery)"}`);
        setTimeout(() => {
          setDraftEmail(null);
          setEmailSendResult(null);
        }, 1800);
      } else {
        throw new Error(data.error || "Failed to send email");
      }
    } catch (err: any) {
      console.error(err);
      setEmailSendResult("error");
      logLeadHistory(draftEmail.leadId, 'email_draft', `Failed to send quote email: ${err.message}`);
    } finally {
      setEmailSending(false);
    }
  };

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
    if (isAuthenticated) {
      fetchLeads();
    }
  }, [isAuthenticated]);

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    const prevStatus = localStatuses[leadId] || (leads.find(l => l.id === leadId)?.status) || 'New';
    setUpdatingId(leadId);
    
    // 1. Update local state cache instantly for responsive UI & fallback persistence
    const updatedLocal = { ...localStatuses, [leadId]: newStatus };
    setLocalStatuses(updatedLocal);
    try {
      localStorage.setItem('vula_lesedi_lead_statuses', JSON.stringify(updatedLocal));
    } catch (e) {
      console.warn('Failed to save status to localStorage', e);
    }

    // Log the change in history
    if (prevStatus !== newStatus) {
      logLeadHistory(leadId, 'status_change', `Status updated from '${prevStatus}' to '${newStatus}'`);
    }

    // Automatically prepare quote email draft when changed to "Quoted"
    if (newStatus === 'Quoted') {
      const activeLead = leads.find(l => l.id === leadId) || { id: leadId, name: 'Anonymous Client', email: '', phone: '', location: '' };
      prepareEmailDraft(activeLead);
    }

    // 2. Try to update in Supabase
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', leadId);

      if (error) {
        console.warn('Supabase status update failed, utilizing client-side cached fallback:', error.message);
        // If column status doesn't exist yet, trigger instructions panel
        if (error.message?.includes('column "status"') || error.code === '42703') {
          setShowSchemaNotice(true);
        }
      }
    } catch (err) {
      console.error('Network or database error updating status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const getLeadStatus = (lead: any) => {
    return localStatuses[lead.id] || lead.status || 'New';
  };

  // Metric computations based on all fetched leads
  const totalLeadsCount = leads.length;
  const countByStatus = (status: string) => {
    return leads.filter(lead => getLeadStatus(lead) === status).length;
  };

  // Filter computation
  const filteredLeads = leads.filter(lead => {
    const currentStatus = getLeadStatus(lead);
    
    // Search query check (name, email, or location)
    const nameStr = (lead.name || '').toLowerCase();
    const emailStr = (lead.email || '').toLowerCase();
    const locationStr = (lead.location || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch = query === '' || nameStr.includes(query) || emailStr.includes(query) || locationStr.includes(query);

    // Status filter check
    const matchesStatus = statusFilter === 'All' || currentStatus === statusFilter;

    // Date range filter check
    let matchesDate = true;
    if (lead.created_at) {
      const leadTime = new Date(lead.created_at).getTime();
      
      if (startDate) {
        const startTimestamp = new Date(startDate + 'T00:00:00').getTime();
        if (leadTime < startTimestamp) matchesDate = false;
      }
      if (endDate) {
        const endTimestamp = new Date(endDate + 'T23:59:59').getTime();
        if (leadTime > endTimestamp) matchesDate = false;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setStartDate('');
    setEndDate('');
  };

  // Row selection handlers
  const handleSelectToggle = (leadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(selectedLeadIds);
    if (next.has(leadId)) {
      next.delete(leadId);
    } else {
      next.add(leadId);
    }
    setSelectedLeadIds(next);
  };

  const isAllSelected = filteredLeads.length > 0 && filteredLeads.every(lead => selectedLeadIds.has(lead.id));
  const isSomeSelected = filteredLeads.length > 0 && filteredLeads.some(lead => selectedLeadIds.has(lead.id)) && !isAllSelected;

  const handleSelectAllToggle = () => {
    if (isAllSelected) {
      const next = new Set(selectedLeadIds);
      filteredLeads.forEach(lead => next.delete(lead.id));
      setSelectedLeadIds(next);
    } else {
      const next = new Set(selectedLeadIds);
      filteredLeads.forEach(lead => next.add(lead.id));
      setSelectedLeadIds(next);
    }
  };

  // Bulk pipeline updates
  const handleBulkStatusChange = async (newStatus: string) => {
    if (selectedLeadIds.size === 0) return;
    setLoading(true);

    const idsArray = Array.from(selectedLeadIds) as string[];

    // Instant local Cache Sync & History Logging
    const updatedLocal = { ...localStatuses };
    idsArray.forEach(id => {
      const prev = localStatuses[id] || (leads.find(l => l.id === id)?.status) || 'New';
      updatedLocal[id] = newStatus;
      if (prev !== newStatus) {
        logLeadHistory(id, 'status_change', `Bulk status updated from '${prev}' to '${newStatus}'`);
        if (newStatus === 'Quoted') {
          logLeadHistory(id, 'email_draft', `Quote email template draft prepped (Bulk Action)`);
        }
      }
    });
    setLocalStatuses(updatedLocal);
    try {
      localStorage.setItem('vula_lesedi_lead_statuses', JSON.stringify(updatedLocal));
    } catch (e) {
      console.warn(e);
    }

    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .in('id', idsArray);

      if (error) {
        console.warn('Supabase bulk update failed, utilizing cached fallback:', error.message);
        if (error.message?.includes('column "status"') || error.code === '42703') {
          setShowSchemaNotice(true);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSelectedLeadIds(new Set());
      setLoading(false);
    }
  };

  // Deletion logic
  const confirmDeleteLead = async () => {
    if (!leadToDelete) return;
    const targetId = leadToDelete.id;

    // Optimistic state update
    setLeads(prev => prev.filter(l => l.id !== targetId));
    setSelectedLeadIds(prev => {
      const next = new Set(prev);
      next.delete(targetId);
      return next;
    });

    try {
      const { error } = await supabase.from('leads').delete().eq('id', targetId);
      if (error) {
        console.error('Delete database action failed:', error.message);
        fetchLeads(); // resync
      }
    } catch (e) {
      console.error(e);
      fetchLeads();
    } finally {
      setLeadToDelete(null);
    }
  };

  const confirmBulkDeleteLeads = async () => {
    if (selectedLeadIds.size === 0) return;
    const idsArray = Array.from(selectedLeadIds);

    // Optimistic state update
    setLeads(prev => prev.filter(l => !selectedLeadIds.has(l.id)));
    setSelectedLeadIds(new Set());

    try {
      const { error } = await supabase.from('leads').delete().in('id', idsArray);
      if (error) {
        console.error('Bulk delete database action failed:', error.message);
        fetchLeads(); // resync
      }
    } catch (e) {
      console.error(e);
      fetchLeads();
    } finally {
      setShowBulkDeleteConfirm(false);
    }
  };

  // Note management logic
  const handleAddNote = (leadId: string) => {
    const text = newNoteTexts[leadId]?.trim();
    if (!text) return;

    const newNote = {
      id: Math.random().toString(36).substring(2, 11),
      text,
      created_at: new Date().toISOString()
    };

    const updatedNotes = {
      ...leadNotes,
      [leadId]: [newNote, ...(leadNotes[leadId] || [])]
    };

    setLeadNotes(updatedNotes);
    try {
      localStorage.setItem('vula_lesedi_lead_notes', JSON.stringify(updatedNotes));
    } catch (e) {
      console.warn(e);
    }

    // Automatically append timeline history log
    logLeadHistory(leadId, 'note_added', `Logged communication note: "${text.length > 60 ? text.substring(0, 60) + '...' : text}"`);

    setNewNoteTexts({ ...newNoteTexts, [leadId]: '' });

    // Optional sync to database backup column if it ever exists
    supabase.from('leads').update({ notes: JSON.stringify(updatedNotes[leadId]) }).eq('id', leadId)
      .then(({ error }) => {
        if (error) console.debug('Supabase custom notes backup column not active; saved in local engine.');
      });
  };

  const handleDeleteNote = (leadId: string, noteId: string) => {
    const noteToDelete = (leadNotes[leadId] || []).find(n => n.id === noteId);
    const updatedNotes = {
      ...leadNotes,
      [leadId]: (leadNotes[leadId] || []).filter(n => n.id !== noteId)
    };

    setLeadNotes(updatedNotes);
    try {
      localStorage.setItem('vula_lesedi_lead_notes', JSON.stringify(updatedNotes));
    } catch (e) {
      console.warn(e);
    }

    // Automatically append timeline history log
    if (noteToDelete) {
      logLeadHistory(leadId, 'note_deleted', `Deleted note: "${noteToDelete.text.length > 60 ? noteToDelete.text.substring(0, 60) + '...' : noteToDelete.text}"`);
    }

    supabase.from('leads').update({ notes: JSON.stringify(updatedNotes[leadId]) }).eq('id', leadId)
      .then(({ error }) => {
        if (error) console.debug('Supabase notes backup delete synchronizer skipped.');
      });
  };

  // Export to CSV helper
  const handleExportCSV = () => {
    if (filteredLeads.length === 0) return;

    // Headers
    const headers = ['Lead ID', 'Full Name', 'Phone Number', 'Email Address', 'Location', 'Status', 'Total Notes', 'Created At'];

    const rows = filteredLeads.map(lead => {
      const status = getLeadStatus(lead);
      const notesCount = (leadNotes[lead.id] || []).length;
      const createdAt = lead.created_at ? new Date(lead.created_at).toLocaleString('en-ZA') : 'N/A';
      
      const escape = (val: any) => {
        const text = String(val ?? '');
        if (text.includes(',') || text.includes('"') || text.includes('\n')) {
          return `"${text.replace(/"/g, '""')}"`;
        }
        return text;
      };

      return [
        escape(lead.id),
        escape(lead.name || 'Anonymous User'),
        escape(lead.phone || ''),
        escape(lead.email || ''),
        escape(lead.location || ''),
        escape(status),
        escape(notesCount),
        escape(createdAt)
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `vula_lesedi_leads_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-[#16a34a] selection:text-white transition-colors duration-300">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-[#16a34a] rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/10">
              <Shield className="w-8 h-8" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
            Vula Lesedi
          </h2>
          <p className="mt-2 text-center text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Administrator Gateway
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-slate-900 py-8 px-4 shadow-xl border border-slate-200 dark:border-slate-800 rounded-3xl sm:px-10">
            {authError && (
              <div className="mb-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 p-4 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-red-700 dark:text-red-400 leading-normal">
                  {authError}
                </p>
              </div>
            )}

            <form onSubmit={handleEmailPasswordLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Admin Email Address
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@lesedipower.co.za"
                    className="block w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-[#16a34a] dark:text-white transition-all font-medium placeholder-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Security Password
                </label>
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-[#16a34a] dark:text-white transition-all font-medium placeholder-slate-400"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-xs font-black uppercase tracking-wider text-white bg-[#16a34a] hover:bg-[#15803d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16a34a] transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] duration-150"
                >
                  Verify Credentials
                </button>
              </div>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase font-black tracking-wider">
                  <span className="px-3 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500">
                    or authenticate with
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-col items-center">
                <div id="google-signin-btn-container" className="w-full flex justify-center h-[44px]"></div>
                <p className="mt-3 text-[10px] text-center text-slate-400 leading-normal">
                  Requires authorized Administrator Google account
                </p>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 text-center">
              <button
                onClick={() => window.location.href = '/'}
                className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
              >
                ← Return to Homepage
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans p-6 selection:bg-[#16a34a] selection:text-white transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8 relative">
        
        {/* HEADER */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-[#16a34a] rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight">Admin Portal</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Lead Management Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={fetchLeads}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-wider transition-colors disabled:opacity-50 w-full sm:w-auto cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-wider transition-colors w-full sm:w-auto text-center cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              Back to Site
            </button>
            <button 
              onClick={handleLogout}
              className="px-4 py-2.5 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors w-full sm:w-auto text-center cursor-pointer shadow-md"
            >
              Log Out
            </button>
          </div>
        </header>

        {/* TOP TABS NAVIGATION */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1 mt-2">
          <button
            onClick={() => setCurrentTab('pipeline')}
            className={`px-5 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              currentTab === 'pipeline'
                ? 'border-[#16a34a] text-[#16a34a]'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Users className="w-4.5 h-4.5" />
            Leads Pipeline
          </button>
          <button
            onClick={() => setCurrentTab('crm')}
            className={`px-5 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              currentTab === 'crm'
                ? 'border-[#16a34a] text-[#16a34a]'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <PhoneCall className="w-4.5 h-4.5" />
            AI Voice CRM & Call logs
            {calls.length > 0 && (
              <span className="bg-[#16a34a] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full ml-1 animate-pulse">
                {calls.length}
              </span>
            )}
          </button>
        </div>

        {/* SCHEMA UPDATE NOTICE */}
        <AnimatePresence>
          {showSchemaNotice && (
            <motion.div 
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 p-5 rounded-2xl flex gap-4 items-start shadow-sm"
            >
              <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-2 flex-1">
                <h4 className="font-bold text-amber-950 dark:text-amber-200 text-sm">Supabase Column Migration Required</h4>
                <p className="text-xs text-amber-900/80 dark:text-amber-300/80 leading-relaxed">
                  We saved this status change inside your local browser storage. To persist status updates permanently in your Supabase backend database, please execute this SQL command in your Supabase dashboard:
                </p>
                <div className="flex items-center gap-3 bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-[10px] overflow-x-auto border border-slate-700 select-all">
                  <code>ALTER TABLE leads ADD COLUMN status TEXT DEFAULT 'New';</code>
                </div>
              </div>
              <button 
                onClick={() => setShowSchemaNotice(false)}
                className="text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200 p-1 rounded-lg shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {currentTab === 'pipeline' && (
          <>
            {/* METRICS & PIPELINE SUMMARY */}
        <section className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Total Leads */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Total Leads</span>
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white leading-none">{totalLeadsCount}</h3>
              <p className="text-xs text-slate-500 mt-1">Received overall</p>
            </div>
          </div>

          {/* New Leads */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">New</span>
              <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg text-blue-600 dark:text-blue-400">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white leading-none">{countByStatus('New')}</h3>
              <p className="text-xs text-slate-500 mt-1">Awaiting contact</p>
            </div>
          </div>

          {/* Contacted */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Contacted</span>
              <div className="p-2 bg-amber-50 dark:bg-amber-950/20 rounded-lg text-amber-600 dark:text-amber-400">
                <PhoneCall className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white leading-none">{countByStatus('Contacted')}</h3>
              <p className="text-xs text-slate-500 mt-1">In discussion</p>
            </div>
          </div>

          {/* Quoted */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Quoted</span>
              <div className="p-2 bg-purple-50 dark:bg-purple-950/20 rounded-lg text-purple-600 dark:text-purple-400">
                <ClipboardList className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white leading-none">{countByStatus('Quoted')}</h3>
              <p className="text-xs text-slate-500 mt-1">Proposal sent</p>
            </div>
          </div>

          {/* Installed */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm col-span-2 lg:col-span-1 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Installed</span>
              <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded-lg text-green-600 dark:text-green-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-black text-[#16a34a] leading-none">{countByStatus('Installed')}</h3>
              <p className="text-xs text-slate-500 mt-1">Completed contracts</p>
            </div>
          </div>
        </section>

        {/* SEARCH AND FILTERS PANEL */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input 
                type="text"
                placeholder="Search leads by name, email, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-green-500 dark:focus:border-green-500/80 focus:ring-1 focus:ring-green-500 transition-all font-medium"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Status Buttons & Filter Toggle */}
            <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
              {['All', ...STATUS_OPTIONS].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    statusFilter === status 
                      ? 'bg-[#16a34a] text-white shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {status}
                </button>
              ))}

              <button
                onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                  isFilterExpanded || startDate || endDate
                    ? 'border-green-500 bg-green-50/20 text-[#16a34a] dark:text-green-400'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-500'
                }`}
                title="Toggle Date Range Filters"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Expanded Filters Panel */}
          <AnimatePresence>
            {isFilterExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                  {/* Start Date */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">From Date</label>
                    <input 
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2 text-xs outline-none focus:border-green-500 transition-all font-medium"
                    />
                  </div>

                  {/* End Date */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">To Date</label>
                    <input 
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2 text-xs outline-none focus:border-green-500 transition-all font-medium"
                    />
                  </div>

                  {/* Filter Action buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={clearFilters}
                      className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors h-[38px] cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* MAIN LEADS DATABASE */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          
          {/* DATABASE HEADER */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-slate-50/50 dark:bg-slate-800/20">
            <div className="flex items-center gap-3">
              {/* Header select all checkbox */}
              <button 
                onClick={handleSelectAllToggle}
                className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
                title={isAllSelected ? "Deselect All" : "Select All Filtered"}
              >
                {isAllSelected ? (
                  <CheckSquare className="w-5 h-5 text-[#16a34a]" />
                ) : isSomeSelected ? (
                  <div className="w-5 h-5 border-2 border-[#16a34a] rounded flex items-center justify-center">
                    <div className="w-2.5 h-0.5 bg-[#16a34a]" />
                  </div>
                ) : (
                  <Square className="w-5 h-5 text-slate-400" />
                )}
              </button>
              
              <div>
                <h2 className="text-base font-bold uppercase tracking-wider flex items-center gap-2">
                  Leads Database
                </h2>
                <p className="text-xs text-slate-400 font-medium">
                  {filteredLeads.length} of {totalLeadsCount} Shown
                </p>
              </div>
            </div>

            {/* CSV EXPORT */}
            {filteredLeads.length > 0 && (
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 dark:bg-green-950/20 dark:hover:bg-green-950/40 border border-green-200 dark:border-green-900/40 text-[#16a34a] dark:text-green-400 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm w-full sm:w-auto justify-center"
              >
                <Download className="w-4 h-4" />
                Export Filtered to CSV
              </button>
            )}
          </div>

          {error ? (
            <div className="p-12 text-center text-red-500">
              <p className="font-medium mb-4">{error}</p>
              <button onClick={fetchLeads} className="underline text-sm font-bold uppercase tracking-wider">Try Again</button>
            </div>
          ) : loading && leads.length === 0 ? (
            <div className="p-12 flex justify-center">
              <RefreshCw className="w-8 h-8 text-slate-400 animate-spin" />
            </div>
          ) : leads.length === 0 ? (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400">
              <p className="font-medium text-lg text-slate-900 dark:text-white mb-2">No leads found.</p>
              <p className="text-sm">Leads captured by Thandi will appear here.</p>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400">
              <p className="font-medium text-lg text-slate-900 dark:text-white mb-2">No results match filters.</p>
              <p className="text-sm">Try adjusting your search criteria or clearing filters.</p>
              <button 
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLeads.map((lead, idx) => {
                const currentStatus = getLeadStatus(lead);
                const colorConfig = STATUS_COLORS[currentStatus] || STATUS_COLORS['New'];
                const isSelected = selectedLeadIds.has(lead.id);
                const notes = leadNotes[lead.id] || [];
                const isNotesExpanded = expandedNotesLeadId === lead.id;

                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    key={lead.id} 
                    className={`p-6 transition-colors ${
                      isSelected 
                        ? 'bg-green-50/10 dark:bg-[#16a34a]/5' 
                        : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Row Checkbox Selector */}
                      <button 
                        onClick={(e) => handleSelectToggle(lead.id, e)}
                        className="mt-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-[#16a34a]" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                        )}
                      </button>

                      {/* Main lead container */}
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          {/* Bio & contact details */}
                          <div className="space-y-1.5">
                            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                              {lead.name || 'Anonymous User'}
                            </h3>
                            <div className="flex flex-wrap gap-x-6 gap-y-1.5">
                              {lead.email && (
                                <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                                  <a href={`mailto:${lead.email}`} className="hover:text-[#16a34a] hover:underline transition-colors">{lead.email}</a>
                                </div>
                              )}
                              {lead.phone && (
                                <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                                  <a href={`tel:${lead.phone}`} className="hover:text-[#16a34a] hover:underline transition-colors">{lead.phone}</a>
                                </div>
                              )}
                              {lead.location && (
                                <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                  <span className="text-slate-800 dark:text-slate-200">{lead.location}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Controls, Notes Toggle & Status Controllers */}
                          <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                            
                            {/* Notes trigger badge */}
                            <button
                              onClick={() => setExpandedNotesLeadId(isNotesExpanded ? null : lead.id)}
                              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                                isNotesExpanded 
                                  ? 'bg-[#16a34a]/10 border-[#16a34a]/30 text-[#16a34a]' 
                                  : 'bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-300'
                              }`}
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Notes ({notes.length})</span>
                            </button>

                            {/* Status Controller Dropdown */}
                            <div className="relative">
                              <select
                                value={currentStatus}
                                disabled={updatingId === lead.id}
                                onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                className={`pl-8 pr-9 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider border cursor-pointer select-none appearance-none outline-none focus:ring-2 focus:ring-green-500 transition-all ${colorConfig.bg} ${colorConfig.text} ${colorConfig.border} disabled:opacity-50`}
                              >
                                {STATUS_OPTIONS.map((statusOption) => (
                                  <option key={statusOption} value={statusOption} className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-bold">
                                    {statusOption}
                                  </option>
                                ))}
                              </select>
                              <span className={`absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${colorConfig.dot}`} />
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-60" />
                            </div>

                            {/* Single Row Deletion button */}
                            <button
                              onClick={() => setLeadToDelete(lead)}
                              className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 border border-red-100 dark:border-red-900/40 text-red-600 dark:text-red-400 rounded-xl transition-colors cursor-pointer"
                              title="Delete Lead Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Date Registered Timestamp Footnote */}
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Added {lead.created_at ? new Date(lead.created_at).toLocaleString('en-ZA', { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A'}</span>
                        </div>

                        {/* EXPANDED COLLAPSIBLE NOTES BOARD */}
                        <AnimatePresence>
                          {isNotesExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-4 rounded-xl space-y-4">
                                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                  <MessageSquare className="w-3.5 h-3.5" />
                                  Internal Admin Logs & Communications
                                </h4>

                                {/* Note Add Form */}
                                <div className="flex gap-2 items-start">
                                  <textarea
                                    placeholder="Type a communication note, client feedback, or installer schedule update..."
                                    rows={2}
                                    value={newNoteTexts[lead.id] || ''}
                                    onChange={(e) => setNewNoteTexts({ ...newNoteTexts, [lead.id]: e.target.value })}
                                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs outline-none focus:border-green-500 transition-all font-medium resize-none text-slate-800 dark:text-slate-100"
                                  />
                                  <button
                                    onClick={() => handleAddNote(lead.id)}
                                    disabled={!(newNoteTexts[lead.id] || '').trim()}
                                    className="px-4 py-3 bg-[#16a34a] hover:bg-[#15803d] disabled:opacity-50 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all self-stretch flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                                  >
                                    <Plus className="w-4 h-4" />
                                    <span>Log Note</span>
                                  </button>
                                </div>

                                {/* Notes Chronology Stream */}
                                {notes.length === 0 ? (
                                  <p className="text-xs text-slate-400 italic">No notes logged yet. Log the first customer touchpoint above.</p>
                                ) : (
                                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                                    {notes.map((note) => (
                                      <div 
                                        key={note.id} 
                                        className="bg-white dark:bg-slate-900/60 p-3 rounded-lg border border-slate-150 dark:border-slate-800/80 flex justify-between items-start gap-4 shadow-xs"
                                      >
                                        <div className="space-y-1">
                                          <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-semibold">
                                            {note.text}
                                          </p>
                                          <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-wider">
                                            <Clock className="w-3 h-3" />
                                            <span>
                                              {new Date(note.created_at).toLocaleString('en-ZA', { dateStyle: 'short', timeStyle: 'short' })}
                                            </span>
                                          </div>
                                        </div>
                                        <button
                                          onClick={() => handleDeleteNote(lead.id, note.id)}
                                          className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors cursor-pointer"
                                          title="Delete Note"
                                        >
                                          <X className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </>
    )}

        {/* AI VOICE CRM PANEL & CALL RECORDINGS WORKSPACE */}
        {currentTab === 'crm' && (
          <div className="space-y-8 animate-fade-in text-left">
            {/* CRM METRICS ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Voice Registries</span>
                  <div className="p-2 bg-[#16a34a]/10 text-[#16a34a] rounded-lg">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white leading-none">{calls.length}</h3>
                  <p className="text-xs text-slate-500 mt-1">Captured Receptionist Calls</p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Cumulative Duration</span>
                  <div className="p-2 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 rounded-lg">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white leading-none">
                    {Math.floor(calls.reduce((sum, c) => sum + (c.duration || 0), 0) / 60)}m {calls.reduce((sum, c) => sum + (c.duration || 0), 0) % 60}s
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Active Call Time Analyzed</p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Average Session Length</span>
                  <div className="p-2 bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 rounded-lg">
                    <SlidersHorizontal className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white leading-none">
                    {calls.length === 0 ? "0s" : `${Math.floor(calls.reduce((sum, c) => sum + (c.duration || 0), 0) / calls.length)}s`}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Avg conversational loop</p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Intake Success rate</span>
                  <div className="p-2 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-lg">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-3xl font-black text-[#16a34a] leading-none">
                    {calls.length === 0 ? "0%" : `${Math.round((calls.filter(c => c.clientPhone !== "N/A" && c.clientName !== "Anonymous Caller").length / calls.length) * 100)}%`}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Lead verification rate</p>
                </div>
              </div>
            </div>

            {/* CALL MINUTES BAR CHART / VISUAL DATA ANALYSIS */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-850 dark:text-white">Call Duration minutes Analysis</h3>
                  <p className="text-[11px] text-slate-400 font-medium">Historical assessment of Call Room duration patterns</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-black uppercase tracking-wider text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a]" /> Lead Saved
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Unknown Caller
                  </span>
                </div>
              </div>

              {calls.length === 0 ? (
                <div className="h-44 flex flex-col items-center justify-center border border-dashed border-slate-250 dark:border-slate-800 rounded-xl text-slate-400">
                  <Phone className="w-8 h-8 opacity-40 mb-2" />
                  <p className="text-xs font-semibold">No data points available yet.</p>
                  <p className="text-[10px] opacity-80 mt-0.5">Dial Thandi from the homepage call room to generate analysis logs!</p>
                </div>
              ) : (
                <div className="pt-4">
                  {/* Custom SVG Bar Chart */}
                  <div className="relative h-44 flex items-end justify-between gap-1 border-b border-slate-100 dark:border-slate-800/80 px-2 pb-1">
                    {/* Y Axis Guides */}
                    <div className="absolute left-0 right-0 top-0 border-t border-slate-100 dark:border-slate-800/40 pointer-events-none text-[8px] font-black text-slate-400 uppercase tracking-widest pt-1">3m Limit</div>
                    <div className="absolute left-0 right-0 top-1/2 border-t border-slate-100 dark:border-slate-800/40 pointer-events-none text-[8px] font-black text-slate-400 uppercase tracking-widest pt-1">1.5m Average</div>

                    {/* Chart Bars */}
                    {calls.map((call, idx) => {
                      const minutes = call.duration / 60;
                      // Max out chart scale at 3 minutes (180s)
                      const barPercentage = Math.min(100, (call.duration / 180) * 100);
                      const isLeadSaved = call.clientName !== "Anonymous Caller";

                      return (
                        <div 
                          key={call.id} 
                          onClick={() => {
                            setActiveCallDetails(call);
                            setPlaybackProgress(0);
                            setPlaybackPlaying(false);
                          }}
                          className="flex-1 flex flex-col items-center group cursor-pointer"
                        >
                          {/* Value Tooltip */}
                          <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md pointer-events-none transition-all z-20">
                            {Math.floor(call.duration / 60)}m {call.duration % 60}s
                          </div>

                          {/* Bar Graphic */}
                          <div 
                            className={`w-full max-w-[40px] rounded-t-lg transition-all group-hover:brightness-110 shadow-xs ${
                              activeCallDetails?.id === call.id
                                ? "bg-gradient-to-t from-[#15803d] to-[#22c55e] border-2 border-white dark:border-slate-900 scale-x-105"
                                : isLeadSaved 
                                  ? "bg-[#16a34a]/85"
                                  : "bg-slate-350 dark:bg-slate-800/80"
                            }`}
                            style={{ height: `${Math.max(8, barPercentage)}%` }}
                          />

                          {/* Label */}
                          <span className="text-[8px] font-black text-slate-400 uppercase mt-2 select-none">
                            Call {calls.length - idx}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* CALLS DUAL WORKSPACE SPLIT SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Call logs left column (5 cols) */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[520px]">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">Caller Conversation Directories</h3>
                
                <div className="space-y-2 flex-1 overflow-y-auto pr-1">
                  {calls.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      <Phone className="w-10 h-10 mx-auto opacity-30 mb-2 animate-pulse" />
                      <p className="text-xs font-bold uppercase tracking-wider">No Voice Logs available</p>
                      <p className="text-[10px] text-slate-400 mt-1">Complete your first virtual call receptionist simulation!</p>
                    </div>
                  ) : (
                    calls.map((call, idx) => {
                      const isLeadSaved = call.clientName !== "Anonymous Caller";
                      const isSelected = activeCallDetails?.id === call.id;

                      return (
                        <div
                          key={call.id}
                          onClick={() => {
                            setActiveCallDetails(call);
                            setPlaybackProgress(0);
                            setPlaybackPlaying(false);
                          }}
                          className={`p-3 rounded-xl border transition-all cursor-pointer text-left space-y-2 ${
                            isSelected
                              ? "bg-slate-900 border-slate-850 dark:bg-slate-950 dark:border-slate-800 text-white shadow-md"
                              : "bg-slate-50 border-slate-100 dark:bg-slate-950/30 dark:border-slate-850 hover:bg-slate-100 text-slate-800 dark:text-slate-200"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                              Directory Index #{calls.length - idx}
                            </span>
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                              isSelected
                                ? "bg-[#16a34a] text-white"
                                : isLeadSaved
                                  ? "bg-[#16a34a]/15 text-[#15803d]"
                                  : "bg-slate-250 text-slate-600 dark:bg-slate-800 dark:text-slate-350"
                            }`}>
                              {Math.floor(call.duration / 60)}m {call.duration % 60}s ({call.minutes ?? parseFloat((call.duration / 60).toFixed(2))} min)
                            </span>
                          </div>

                          <div className="space-y-0.5">
                            <h4 className="text-xs font-black">
                              {call.clientName}
                            </h4>
                            <p className="text-[10px] opacity-70 font-medium">
                              Phone: {call.clientPhone} • {call.clientLocation}
                            </p>
                          </div>

                          <div className="flex items-center justify-between text-[8px] font-bold uppercase tracking-widest opacity-60">
                            <span>Transposed Text available</span>
                            <span>{new Date(call.timestamp).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Call transposition & mock audio player right column (7 cols) */}
              <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[520px]">
                {activeCallDetails ? (
                  <div className="flex flex-col h-full space-y-4 text-left">
                    {/* Header */}
                    <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                            {activeCallDetails.clientName}
                          </h3>
                          <span className="text-[8px] bg-[#16a34a]/10 text-[#16a34a] font-black uppercase tracking-widest px-2 py-0.5 rounded">
                            Audio Transposed
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                          Inbound Contact: {activeCallDetails.clientPhone} • Location: {activeCallDetails.clientLocation}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          const csv = "Sender,Text\n" + activeCallDetails.transcript.map((t: any) => `"${t.sender === 'user' ? 'Client' : 'Thandi (AI)'}","${t.text.replace(/"/g, '""')}"`).join("\n");
                          const blob = new Blob([csv], { type: 'text/csv' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `call_transcript_${activeCallDetails.id}.csv`;
                          a.click();
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                        title="Download Text Transcript"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-black uppercase">CSV</span>
                      </button>
                    </div>

                    {/* PREMIUM VOICE PLAYER WIDGET */}
                    <div className="bg-slate-950 text-white rounded-2xl p-4 border border-slate-850 space-y-3 shadow-inner relative overflow-hidden">
                      {/* Background grid design */}
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(22,163,74,0.15),transparent)] pointer-events-none" />

                      <div className="flex items-center justify-between relative z-10">
                        <span className="text-[8px] font-black tracking-widest uppercase text-[#16a34a]">Vula Lesedi CRM Voice Engine</span>
                        <div className="flex items-center gap-1">
                          {[1, 1.5, 2].map(speed => (
                            <button
                              key={speed}
                              onClick={() => setPlaybackSpeed(speed)}
                              className={`text-[8.5px] font-black px-1.5 py-0.5 rounded cursor-pointer ${
                                playbackSpeed === speed ? "bg-[#16a34a] text-white" : "bg-slate-800 text-slate-400"
                              }`}
                            >
                              {speed}x
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Animated Audio Waves Visualizer */}
                      <div className="h-10 flex items-center justify-center gap-0.5 pt-1 relative z-10">
                        {Array.from({ length: 44 }).map((_, waveIdx) => {
                          const waveHeight = playbackPlaying 
                            ? Math.sin(waveIdx + playbackProgress) * 15 + 20 
                            : Math.sin(waveIdx) * 10 + 12;

                          return (
                            <div 
                              key={waveIdx} 
                              className={`w-[3px] rounded-full transition-all duration-300 ${
                                playbackPlaying 
                                  ? waveIdx * (100 / 44) <= playbackProgress 
                                    ? "bg-[#16a34a]" 
                                    : "bg-slate-750"
                                  : "bg-slate-750"
                              }`}
                              style={{ height: `${Math.max(4, waveHeight)}px` }}
                            />
                          );
                        })}
                      </div>

                      {/* Playback Controls Slider */}
                      <div className="space-y-1 relative z-10">
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden cursor-pointer relative"
                          onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const pct = (x / rect.width) * 100;
                            setPlaybackProgress(pct);
                          }}
                        >
                          <div 
                            className="bg-[#16a34a] h-full transition-all duration-100"
                            style={{ width: `${playbackProgress}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest text-slate-400">
                          <span>{playbackPlaying ? `${String(Math.floor((activeCallDetails.duration * (playbackProgress / 100)) / 60)).padStart(2, '0')}:${String(Math.floor((activeCallDetails.duration * (playbackProgress / 100)) % 60)).padStart(2, '0')}` : "00:00"}</span>
                          <span>{String(Math.floor(activeCallDetails.duration / 60)).padStart(2, '0')}:{String(activeCallDetails.duration % 60).padStart(2, '0')}</span>
                        </div>
                      </div>

                      {/* Main Player Toggle */}
                      <div className="flex justify-center pt-1 relative z-10">
                        <button
                          onClick={() => setPlaybackPlaying(!playbackPlaying)}
                          className="w-10 h-10 bg-[#16a34a] hover:bg-[#15803d] rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95 shadow-md"
                        >
                          {playbackPlaying ? (
                            <span className="flex gap-1 h-3.5 items-center justify-center">
                              <span className="w-1 bg-white h-full animate-pulse" />
                              <span className="w-1 bg-white h-full animate-pulse" />
                            </span>
                          ) : (
                            <svg className="w-4 h-4 text-white fill-current ml-0.5" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Transposition Chat logs */}
                    <div className="flex-1 overflow-y-auto space-y-4 pr-1 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20">
                      {activeCallDetails.transcript.map((item: any, cidx: number) => (
                        <div key={cidx} className={`flex flex-col ${item.sender === 'user' ? 'items-end' : 'items-start'}`}>
                          <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 mb-0.5 px-1">
                            {item.sender === 'user' ? (activeCallDetails.clientName || 'Caller') : 'Thandi (AI Front Desk)'}
                          </span>
                          <div className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                            item.sender === 'user'
                              ? 'bg-white dark:bg-slate-800 border border-slate-150 dark:border-slate-700 text-slate-850 dark:text-slate-100 rounded-tr-none shadow-xs'
                              : 'bg-[#16a34a]/15 text-[#15803d] dark:text-green-400 rounded-tl-none border border-[#16a34a]/10'
                          }`}>
                            {item.text}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-950 rounded-full flex items-center justify-center mb-3">
                      <PhoneCall className="w-8 h-8 text-slate-350" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wider">Conversation workspace Empty</p>
                    <p className="text-[10px] text-slate-400 mt-1 max-w-[280px] text-center leading-relaxed">
                      Select any recorded call history card from the directory to play back the voice waveform and review transposed text.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* FLOATING BULK ACTIONS OVERLAY BAR */}
        <AnimatePresence>
          {selectedLeadIds.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/95 dark:bg-slate-900 border border-slate-800/80 text-white py-3.5 px-6 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-4 items-center z-50 max-w-xl w-[90%] justify-between backdrop-blur-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-6.5 h-6.5 bg-[#16a34a] rounded-lg flex items-center justify-center text-xs font-black">
                  {selectedLeadIds.size}
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-slate-300 leading-none">Bulk Operation Selected</p>
                  <p className="text-[10px] text-slate-400 mt-1">Actions apply to selected rows</p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                {/* Bulk Status Select */}
                <div className="relative">
                  <select
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value) {
                        setPendingBulkStatus(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="pl-3 pr-8 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-white rounded-xl text-xs font-black uppercase tracking-wider appearance-none outline-none focus:ring-1 focus:ring-green-500 cursor-pointer"
                  >
                    <option value="" disabled>Change Status To...</option>
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt} value={opt} className="bg-slate-900">{opt}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none opacity-60" />
                </div>

                {/* Bulk Delete Trigger */}
                <button
                  onClick={() => setShowBulkDeleteConfirm(true)}
                  className="p-2 bg-red-900/20 hover:bg-red-900/40 border border-red-800/40 text-red-400 rounded-xl transition-colors cursor-pointer"
                  title="Bulk Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Clear selection */}
                <button
                  onClick={() => setSelectedLeadIds(new Set())}
                  className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Deselect All"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MODAL: CONFIRM SINGLE DELETION */}
        <AnimatePresence>
          {leadToDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" 
                onClick={() => setLeadToDelete(null)} 
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl max-w-sm w-full shadow-2xl relative z-10 space-y-4 text-center"
              >
                <div className="w-12 h-12 bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-black uppercase tracking-wide text-slate-900 dark:text-white">Confirm Deletion</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Are you sure you want to delete the lead for <strong className="text-slate-800 dark:text-slate-200">{leadToDelete.name || 'Anonymous'}</strong>? This action will permanently erase the record.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => setLeadToDelete(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteLead}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-md"
                  >
                    Yes, Delete
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL: CONFIRM BULK DELETION */}
        <AnimatePresence>
          {showBulkDeleteConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" 
                onClick={() => setShowBulkDeleteConfirm(false)} 
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl max-w-sm w-full shadow-2xl relative z-10 space-y-4 text-center"
              >
                <div className="w-12 h-12 bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-black uppercase tracking-wide text-slate-900 dark:text-white">Confirm Bulk Deletion</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Are you absolutely sure you want to permanently delete <strong className="text-slate-800 dark:text-slate-200">{selectedLeadIds.size} selected leads</strong>? This batch action cannot be undone.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => setShowBulkDeleteConfirm(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmBulkDeleteLeads}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-md"
                  >
                    Delete Batch
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL: CONFIRM BULK STATUS CHANGE */}
        <AnimatePresence>
          {pendingBulkStatus && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" 
                onClick={() => setPendingBulkStatus(null)} 
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl max-w-sm w-full shadow-2xl relative z-10 space-y-4 text-center text-slate-800 dark:text-slate-100"
              >
                <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-black uppercase tracking-wide">Confirm Status Update</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Are you sure you want to update the status to <strong className="text-[#16a34a]">{pendingBulkStatus}</strong> for <strong className="text-slate-950 dark:text-white">{selectedLeadIds.size} selected leads</strong>?
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => setPendingBulkStatus(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleBulkStatusChange(pendingBulkStatus);
                      setPendingBulkStatus(null);
                    }}
                    className="px-4 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-md"
                  >
                    Confirm Update
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL: RESEND EMAIL COMPOSER */}
        <AnimatePresence>
          {draftEmail && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" 
                onClick={() => setDraftEmail(null)} 
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl max-w-lg w-full shadow-2xl relative z-10 flex flex-col max-h-[90vh] text-slate-800 dark:text-slate-100"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 rounded-lg">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-sm font-black uppercase tracking-wider">Resend Email Draft prepared</h3>
                      <p className="text-[10px] text-slate-400 font-medium">Triggered: Status changed to 'Quoted'</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setDraftEmail(null)}
                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="py-4 space-y-4 flex-1 overflow-y-auto text-left">
                  {/* Recipient / Subject */}
                  <div className="grid grid-cols-1 gap-3 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center text-xs">
                      <span className="w-16 font-black text-slate-400 uppercase tracking-wider">To:</span>
                      <input 
                        type="email"
                        value={draftEmail.to}
                        onChange={(e) => setDraftEmail({ ...draftEmail, to: e.target.value })}
                        className="flex-1 bg-transparent border-none outline-none font-semibold text-slate-700 dark:text-slate-300"
                      />
                    </div>
                    <div className="flex items-center text-xs border-t border-slate-150 dark:border-slate-800/60 pt-2">
                      <span className="w-16 font-black text-slate-400 uppercase tracking-wider">Subject:</span>
                      <input 
                        type="text"
                        value={draftEmail.subject}
                        onChange={(e) => setDraftEmail({ ...draftEmail, subject: e.target.value })}
                        className="flex-1 bg-transparent border-none outline-none font-semibold text-slate-700 dark:text-slate-300"
                      />
                    </div>
                  </div>

                  {/* Body Textarea */}
                  <div className="space-y-1.5 flex flex-col h-[200px]">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email HTML Content Draft</label>
                    <textarea 
                      value={draftEmail.html}
                      onChange={(e) => setDraftEmail({ ...draftEmail, html: e.target.value })}
                      className="w-full flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs outline-none focus:border-green-500 font-mono transition-all resize-none text-slate-700 dark:text-slate-300"
                    />
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex items-center justify-between">
                  <div className="text-[10px] text-slate-400 font-bold max-w-[200px]">
                    <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">⚠ Resend Simulator (API Key Safe)</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDraftEmail(null)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={handleSendEmail}
                      disabled={emailSending}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                    >
                      {emailSending ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Dispatching...</span>
                        </>
                      ) : emailSendResult === "success" ? (
                        <span>Sent!</span>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Email</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL: CUSTOMER CRM CARD & AUDIT HISTORIES */}
        <AnimatePresence>
          {selectedLeadDetails && (() => {
            const hist = leadHistory[selectedLeadDetails.id] || [];
            // Match recorded calls
            const matchingCalls = calls.filter(call => 
              (call.clientPhone && call.clientPhone !== "N/A" && call.clientPhone === selectedLeadDetails.phone) ||
              (call.clientEmail && call.clientEmail !== "N/A" && call.clientEmail === selectedLeadDetails.email) ||
              (call.clientName && call.clientName !== "Anonymous Caller" && call.clientName.toLowerCase() === selectedLeadDetails.name.toLowerCase())
            );

            return (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" 
                  onClick={() => setSelectedLeadDetails(null)} 
                />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl max-w-2xl w-full shadow-2xl relative z-10 flex flex-col max-h-[85vh] text-slate-800 dark:text-slate-100"
                >
                  {/* Modal Header */}
                  <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4 text-left">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                          {selectedLeadDetails.name || "Anonymous Client"}
                        </h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          STATUS_COLORS[getLeadStatus(selectedLeadDetails)]?.bg || 'bg-slate-150'
                        } ${
                          STATUS_COLORS[getLeadStatus(selectedLeadDetails)]?.text || 'text-slate-600'
                        }`}>
                          {getLeadStatus(selectedLeadDetails)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-450" />
                        {selectedLeadDetails.location || "South Africa"} • Added {selectedLeadDetails.created_at ? new Date(selectedLeadDetails.created_at).toLocaleDateString('en-ZA') : 'N/A'}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedLeadDetails(null)}
                      className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Tabs Navigator */}
                  <div className="flex border-b border-slate-150 dark:border-slate-800 mt-3 gap-4">
                    <button
                      onClick={() => setActiveDetailsTab('overview')}
                      className={`pb-2.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                        activeDetailsTab === 'overview'
                          ? 'border-[#16a34a] text-[#16a34a]'
                          : 'border-transparent text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      Overview & Notes
                    </button>
                    <button
                      onClick={() => setActiveDetailsTab('history')}
                      className={`pb-2.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                        activeDetailsTab === 'history'
                          ? 'border-[#16a34a] text-[#16a34a]'
                          : 'border-transparent text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      Audit Timeline ({hist.length})
                    </button>
                    <button
                      onClick={() => setActiveDetailsTab('conversations')}
                      className={`pb-2.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                        activeDetailsTab === 'conversations'
                          ? 'border-[#16a34a] text-[#16a34a]'
                          : 'border-transparent text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      Recorded Calls ({matchingCalls.length})
                    </button>
                  </div>

                  {/* Tab Contents */}
                  <div className="py-4 overflow-y-auto flex-1 min-h-[300px]">
                    {activeDetailsTab === 'overview' && (
                      <div className="space-y-4 text-left">
                        {/* Bio Cards */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800/80">
                            <span className="text-[9px] font-black text-slate-400 uppercase block tracking-wider">Email Address</span>
                            <a href={`mailto:${selectedLeadDetails.email}`} className="text-xs font-bold text-[#16a34a] hover:underline break-all block mt-1">
                              {selectedLeadDetails.email || "N/A"}
                            </a>
                          </div>
                          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800/80">
                            <span className="text-[9px] font-black text-slate-400 uppercase block tracking-wider">Contact Number</span>
                            <a href={`tel:${selectedLeadDetails.phone}`} className="text-xs font-bold text-[#16a34a] hover:underline block mt-1">
                              {selectedLeadDetails.phone || "N/A"}
                            </a>
                          </div>
                        </div>

                        {/* Notes manager inside modal */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Communication Notes</h4>
                          
                          {/* Log note form */}
                          <div className="flex gap-2">
                            <input 
                              type="text"
                              placeholder="Add an internal communication note..."
                              value={newNoteTexts[selectedLeadDetails.id] || ""}
                              onChange={(e) => setNewNoteTexts({...newNoteTexts, [selectedLeadDetails.id]: e.target.value})}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleAddNote(selectedLeadDetails.id);
                                }
                              }}
                              className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs outline-none focus:border-green-500 font-medium"
                            />
                            <button
                              onClick={() => handleAddNote(selectedLeadDetails.id)}
                              className="px-4 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                            >
                              Add Note
                            </button>
                          </div>

                          {/* Notes timeline stream */}
                          <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                            {(leadNotes[selectedLeadDetails.id] || []).length === 0 ? (
                              <p className="text-xs text-slate-400 italic">No notes logged for this client yet.</p>
                            ) : (
                              (leadNotes[selectedLeadDetails.id] || []).map(note => (
                                <div key={note.id} className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 flex justify-between items-start gap-4">
                                  <div>
                                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{note.text}</p>
                                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1 block">
                                      {new Date(note.created_at).toLocaleString('en-ZA', { dateStyle: 'short', timeStyle: 'short' })}
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => handleDeleteNote(selectedLeadDetails.id, note.id)}
                                    className="text-slate-400 hover:text-red-500 p-1 rounded cursor-pointer"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeDetailsTab === 'history' && (
                      <div className="space-y-4 text-left">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Complete Audit Trail Timeline</h4>
                        {hist.length === 0 ? (
                          <div className="text-center py-8 text-slate-400">
                            <Clock className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                            <p className="text-xs font-semibold">No timeline modifications recorded yet.</p>
                            <p className="text-[10px] text-slate-400 mt-1">Status changes and note logs will record here instantly with timestamps.</p>
                          </div>
                        ) : (
                          <div className="relative border-l border-slate-150 dark:border-slate-800 pl-4 space-y-4 ml-2">
                            {hist.map((item, idx) => (
                              <div key={item.id} className="relative">
                                {/* Timeline Node Pin */}
                                <div className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 ${
                                  item.type === 'status_change' ? 'bg-blue-500' :
                                  item.type === 'note_added' ? 'bg-[#16a34a]' :
                                  item.type === 'note_deleted' ? 'bg-red-500' :
                                  'bg-purple-500'
                                }`} />
                                <div className="space-y-0.5 text-left">
                                  <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                                    {item.text}
                                  </p>
                                  <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">
                                    {new Date(item.created_at).toLocaleString('en-ZA', { dateStyle: 'medium', timeStyle: 'short' })}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {activeDetailsTab === 'conversations' && (
                      <div className="space-y-4 text-left">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Recorded AI Call Transcripts</h4>
                        {matchingCalls.length === 0 ? (
                          <div className="text-center py-8 text-slate-400">
                            <Phone className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                            <p className="text-xs font-semibold">No recorded calls found for this lead.</p>
                            <p className="text-[10px] text-slate-400 mt-1">When Thandi takes an incoming call matching this client's name or contact info, it appears here.</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {matchingCalls.map((call) => (
                              <div key={call.id} className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-[#16a34a]/10 text-[#16a34a] rounded-lg">
                                      <Phone className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <p className="text-xs font-extrabold">Inbound Call Conversation</p>
                                      <p className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">
                                        {new Date(call.timestamp).toLocaleString('en-ZA', { dateStyle: 'short', timeStyle: 'short' })}
                                      </p>
                                    </div>
                                  </div>
                                  <span className="bg-slate-150 dark:bg-slate-800 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-slate-500">
                                    {Math.floor(call.duration / 60)}m {call.duration % 60}s ({call.minutes ?? parseFloat((call.duration / 60).toFixed(2))} min)
                                  </span>
                                </div>

                                {/* Call minutes analysis inline */}
                                <div className="space-y-1">
                                  <div className="flex justify-between text-[9px] font-black text-slate-450 uppercase">
                                    <span>Call Minutes Analysis</span>
                                    <span>{call.duration} seconds overall</span>
                                  </div>
                                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                    <div 
                                      className="bg-[#16a34a] h-full"
                                      style={{ width: `${Math.min(100, (call.duration / 180) * 100)}%` }}
                                    />
                                  </div>
                                </div>

                                {/* Collapsible Transcript */}
                                <details className="group">
                                  <summary className="text-[10px] font-black uppercase tracking-wider text-[#16a34a] cursor-pointer outline-none select-none hover:underline flex items-center gap-1">
                                    <span>Inspect Transposition Transcript</span>
                                    <ChevronDown className="w-3.5 h-3.5 transition-transform group-open:rotate-180" />
                                  </summary>
                                  <div className="mt-3 space-y-2.5 border-t border-slate-150 dark:border-slate-850 pt-3 max-h-[180px] overflow-y-auto pr-1">
                                    {call.transcript.map((chat: any, cidx: number) => (
                                      <div key={cidx} className={`flex flex-col ${chat.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                        <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 mb-0.5 px-1">
                                          {chat.sender === 'user' ? (selectedLeadDetails.name || 'Caller') : 'Thandi (AI Receptionist)'}
                                        </span>
                                        <div className={`p-2.5 rounded-xl text-xs max-w-[85%] leading-relaxed ${
                                          chat.sender === 'user'
                                            ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tr-none'
                                            : 'bg-[#16a34a]/15 text-[#15803d] dark:text-green-400 rounded-tl-none border border-[#16a34a]/10'
                                        }`}>
                                          {chat.text}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </details>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Modal Footer */}
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex justify-end gap-2">
                    <button
                      onClick={() => setSelectedLeadDetails(null)}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Close CRM Card
                    </button>
                  </div>
                </motion.div>
              </div>
            );
          })()}
        </AnimatePresence>

      </div>
    </div>
  );
}
