'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  MessageSquare,
  Code2,
  Play,
  MapPin,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  ChevronRight,
  Sparkles,
  Database,
  Shield,
  Users,
  TrendingUp,
  Send,
  Loader2,
  ExternalLink,
  Terminal,
  FileCode,
  Cpu,
  Zap,
  X,
  User,
  Mail,
  Phone,
  DollarSign,
} from 'lucide-react';
import { clsx } from 'clsx';
import {
  mockAppointments,
  mockResources,
  formatTime,
  formatDate,
  formatCurrency,
  getStatusColor,
} from '@/lib/mockData';
import { allSnippets, type CodeSnippet } from '@/lib/snippets';
import type { Appointment, AppointmentStatus } from '@/lib/schema';

// ============================================
// Navigation Tabs
// ============================================
type TabId = 'sandbox' | 'media' | 'code';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  { id: 'sandbox', label: 'Interactive Sandbox', icon: <Calendar className="w-4 h-4" /> },
  { id: 'media', label: 'Featured Video & Press', icon: <Play className="w-4 h-4" /> },
  { id: 'code', label: 'Code Inspector', icon: <Code2 className="w-4 h-4" /> },
];

// ============================================
// Agent Prompt Chips
// ============================================
const promptChips = [
  {
    id: 'conflicts',
    label: "Analyze tomorrow's schedule for double-bookings",
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
  },
  {
    id: 'revenue',
    label: "Run a revenue forecast for unused afternoon slots",
    icon: <TrendingUp className="w-3.5 h-3.5" />,
  },
  {
    id: 'churn',
    label: "Identify high-value customers who haven't rebooked in 60 days",
    icon: <Users className="w-3.5 h-3.5" />,
  },
];

// ============================================
// Status Badge Component
// ============================================
function StatusBadge({ status }: { status: AppointmentStatus }) {
  const icons: Record<AppointmentStatus, React.ReactNode> = {
    confirmed: <CheckCircle2 className="w-3 h-3" />,
    pending: <Clock className="w-3 h-3" />,
    conflict: <AlertTriangle className="w-3 h-3" />,
    cancelled: <XCircle className="w-3 h-3" />,
    completed: <CheckCircle2 className="w-3 h-3" />,
  };

  return (
    <span className={clsx(
      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border',
      getStatusColor(status)
    )}>
      {icons[status]}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// ============================================
// Appointment Card Component
// ============================================
function AppointmentCard({ 
  appointment, 
  resource,
  onClick 
}: { 
  appointment: Appointment; 
  resource?: typeof mockResources[0];
  onClick: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={clsx(
        'p-3 rounded-lg cursor-pointer transition-all',
        'bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/50',
        appointment.status === 'conflict' && 'border-red-500/50 bg-red-500/10'
      )}
      style={{ borderLeftColor: resource?.color, borderLeftWidth: 3 }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-white truncate">{appointment.customerName}</p>
          <p className="text-xs text-slate-400">{appointment.serviceType}</p>
        </div>
        <StatusBadge status={appointment.status} />
      </div>
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
        </span>
        <span className="text-emerald-400 font-medium">{formatCurrency(appointment.price)}</span>
      </div>
      {resource && (
        <div className="mt-2 pt-2 border-t border-slate-700/50">
          <span className="text-xs text-slate-500">
            <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ backgroundColor: resource.color }} />
            {resource.name}
          </span>
        </div>
      )}
    </motion.div>
  );
}

// ============================================
// Calendar View Component
// ============================================
function CalendarView({ 
  appointments,
  selectedDate,
  onDateChange,
  onAppointmentClick 
}: { 
  appointments: Appointment[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onAppointmentClick: (appointment: Appointment) => void;
}) {
  const days = Array.from({ length: 5 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.startTime);
      return aptDate.toDateString() === date.toDateString();
    });
  };

  return (
    <div className="space-y-4">
      {/* Date Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {days.map((date, i) => {
          const isSelected = date.toDateString() === selectedDate.toDateString();
          const dayAppointments = getAppointmentsForDate(date);
          const hasConflict = dayAppointments.some(a => a.status === 'conflict');
          
          return (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDateChange(date)}
              className={clsx(
                'flex-shrink-0 px-4 py-3 rounded-lg transition-all text-center min-w-[80px]',
                isSelected 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50',
                hasConflict && !isSelected && 'ring-2 ring-red-500/50'
              )}
            >
              <p className="text-xs font-medium opacity-70">
                {date.toLocaleDateString('en-NZ', { weekday: 'short' })}
              </p>
              <p className="text-lg font-bold">{date.getDate()}</p>
              <p className="text-xs opacity-70">
                {dayAppointments.length} apt{dayAppointments.length !== 1 ? 's' : ''}
              </p>
            </motion.button>
          );
        })}
      </div>

      {/* Appointments Grid */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        <AnimatePresence mode="popLayout">
          {getAppointmentsForDate(selectedDate).length > 0 ? (
            getAppointmentsForDate(selectedDate)
              .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
              .map(apt => (
                <AppointmentCard
                  key={apt.id}
                  appointment={apt}
                  resource={mockResources.find(r => r.id === apt.resourceId)}
                  onClick={() => onAppointmentClick(apt)}
                />
              ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-slate-500"
            >
              <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No appointments for this day</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Resource Legend */}
      <div className="pt-4 border-t border-slate-700/50">
        <p className="text-xs text-slate-500 mb-2">Resources</p>
        <div className="flex flex-wrap gap-2">
          {mockResources.map(resource => (
            <div 
              key={resource.id}
              className="flex items-center gap-1.5 text-xs text-slate-400"
            >
              <span 
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: resource.color }}
              />
              <span>{resource.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// Agent Response Types
// ============================================
interface AgentThought {
  type: 'thinking' | 'executing' | 'validating' | 'result';
  content: string;
  timestamp: string;
  toolUsed?: string;
  executionTimeMs?: number;
}

interface AgentAction {
  id: string;
  label: string;
  type: string;
  action: string;
}

interface AgentResult {
  success: boolean;
  summary: string;
  data?: Record<string, unknown>;
  actions?: AgentAction[];
}

interface AgentResponse {
  id: string;
  query: string;
  thoughts: AgentThought[];
  result: AgentResult;
  totalExecutionTimeMs: number;
}

// ============================================
// AI Agent Chat Component
// ============================================
function AgentChat() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AgentResponse | null>(null);
  const [visibleThoughts, setVisibleThoughts] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    
    setIsLoading(true);
    setResponse(null);
    setVisibleThoughts(0);
    
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      
      const data = await res.json();
      setResponse(data);
      
      // Animate thoughts appearing one by one
      if (data.thoughts) {
        for (let i = 0; i <= data.thoughts.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 400));
          setVisibleThoughts(i);
        }
      }
    } catch (error) {
      console.error('Agent error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChipClick = (chipQuery: string) => {
    setQuery(chipQuery);
    handleSubmit({ preventDefault: () => {} } as React.FormEvent);
  };

  const getThoughtIcon = (type: AgentThought['type']) => {
    switch (type) {
      case 'thinking': return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 'executing': return <Database className="w-4 h-4 text-blue-400" />;
      case 'validating': return <Shield className="w-4 h-4 text-amber-400" />;
      case 'result': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getThoughtLabel = (type: AgentThought['type']) => {
    switch (type) {
      case 'thinking': return 'Thinking';
      case 'executing': return 'Executing SQL Query';
      case 'validating': return 'Validating Constraints';
      case 'result': return 'Result Formatted';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 pb-4 border-b border-slate-700/50">
        <div className="relative">
          <Cpu className="w-5 h-5 text-indigo-400" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full pulse-ring" />
        </div>
        <div>
          <h3 className="font-semibold text-white">AI Operations Assistant</h3>
          <p className="text-xs text-slate-400">Powered by LLM Tool-Calling</p>
        </div>
      </div>

      {/* Prompt Chips */}
      <div className="py-4 space-y-2">
        <p className="text-xs text-slate-500 mb-2">Quick Prompts:</p>
        <div className="flex flex-wrap gap-2">
          {promptChips.map(chip => (
            <motion.button
              key={chip.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleChipClick(chip.label)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-800/50 hover:bg-slate-700/50 rounded-full text-slate-300 transition-colors border border-slate-700/50"
            >
              {chip.icon}
              <span className="max-w-[180px] truncate">{chip.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Response Area */}
      <div className="flex-1 overflow-y-auto space-y-3 py-4 min-h-[200px]">
        {isLoading && !response && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-slate-400"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Processing your request...</span>
          </motion.div>
        )}

        {response && (
          <div className="space-y-3">
            {/* Thoughts */}
            <AnimatePresence>
              {response.thoughts.slice(0, visibleThoughts).map((thought, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-2 text-sm"
                >
                  <div className="flex-shrink-0 mt-0.5">{getThoughtIcon(thought.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 mb-0.5">{getThoughtLabel(thought.type)}</p>
                    <p className="text-slate-300">{thought.content}</p>
                    {thought.executionTimeMs && (
                      <p className="text-xs text-slate-500 mt-1">
                        <Zap className="w-3 h-3 inline mr-1" />
                        {thought.executionTimeMs}ms
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Result Card */}
            {visibleThoughts >= response.thoughts.length && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20"
              >
                <div className="flex items-start gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-white">Analysis Complete</p>
                    <p className="text-sm text-slate-300 mt-1">{response.result.summary}</p>
                  </div>
                </div>

                {/* Data Preview */}
                {response.result.data && (
                  <div className="mt-3 p-3 rounded bg-slate-900/50 text-xs terminal-output">
                    <pre className="text-slate-400 overflow-x-auto">
                      {JSON.stringify(response.result.data, null, 2).slice(0, 500)}
                    </pre>
                  </div>
                )}

                {/* Action Buttons */}
                {response.result.actions && response.result.actions.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {response.result.actions.map(action => (
                      <motion.button
                        key={action.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={clsx(
                          'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                          action.type === 'primary'
                            ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                            : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                        )}
                      >
                        {action.label}
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Execution Time */}
                <p className="mt-3 text-xs text-slate-500 flex items-center gap-1">
                  <Terminal className="w-3 h-3" />
                  Total execution: {response.totalExecutionTimeMs}ms
                </p>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="pt-4 border-t border-slate-700/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Ask the AI assistant..."
            className="flex-1 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
          <motion.button
            type="submit"
            disabled={isLoading || !query.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </motion.button>
        </div>
      </form>
    </div>
  );
}

// ============================================
// Code Inspector Component
// ============================================
function CodeInspector() {
  const [activeTab, setActiveTab] = useState<'csharp' | 'sql' | 'safety'>('csharp');
  const [selectedSnippet, setSelectedSnippet] = useState<CodeSnippet | null>(null);

  const filteredSnippets = allSnippets.filter(s => {
    if (activeTab === 'csharp') return s.language === 'csharp';
    if (activeTab === 'sql') return s.language === 'sql';
    if (activeTab === 'safety') return s.language === 'typescript';
    return false;
  });

  useEffect(() => {
    setSelectedSnippet(filteredSnippets[0] || null);
  }, [activeTab]);

  const tabConfig = [
    { id: 'csharp' as const, label: 'C# / ASP.NET Core', icon: <FileCode className="w-4 h-4" /> },
    { id: 'sql' as const, label: 'T-SQL Procedures', icon: <Database className="w-4 h-4" /> },
    { id: 'safety' as const, label: 'AI Safety Layer', icon: <Shield className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2">
        {tabConfig.map(tab => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activeTab === tab.id
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
            )}
          >
            {tab.icon}
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Snippet Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          {filteredSnippets.map(snippet => (
            <motion.button
              key={snippet.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedSnippet(snippet)}
              className={clsx(
                'w-full text-left p-3 rounded-lg transition-colors',
                selectedSnippet?.id === snippet.id
                  ? 'bg-indigo-600/20 border border-indigo-500/30'
                  : 'bg-slate-800/30 hover:bg-slate-700/30 border border-transparent'
              )}
            >
              <p className="font-medium text-sm text-white truncate">{snippet.title}</p>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{snippet.description}</p>
            </motion.button>
          ))}
        </div>

        {/* Code Display */}
        <div className="md:col-span-2">
          {selectedSnippet && (
            <motion.div
              key={selectedSnippet.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-lg bg-slate-900/80 border border-slate-700/50 overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-slate-700/50 flex items-center justify-between">
                <div>
                  <p className="font-medium text-white text-sm">{selectedSnippet.title}</p>
                  <p className="text-xs text-slate-400">{selectedSnippet.description}</p>
                </div>
                <span className={clsx(
                  'px-2 py-1 rounded text-xs font-medium',
                  selectedSnippet.language === 'csharp' && 'bg-purple-500/20 text-purple-400',
                  selectedSnippet.language === 'sql' && 'bg-blue-500/20 text-blue-400',
                  selectedSnippet.language === 'typescript' && 'bg-amber-500/20 text-amber-400'
                )}>
                  {selectedSnippet.language.toUpperCase()}
                </span>
              </div>

              {/* Highlights */}
              <div className="px-4 py-3 border-b border-slate-700/50 bg-slate-800/30">
                <p className="text-xs text-slate-500 mb-2">Key Concepts:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedSnippet.highlights.map((highlight, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded bg-slate-700/50 text-slate-300">
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>

              {/* Code Block */}
              <div className="p-4 overflow-x-auto max-h-[500px] overflow-y-auto">
                <pre className="code-block text-slate-300 whitespace-pre">
                  {selectedSnippet.code}
                </pre>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// Appointment Details Modal
// ============================================
function AppointmentModal({ 
  appointment, 
  onClose,
  onStatusChange 
}: { 
  appointment: Appointment; 
  onClose: () => void;
  onStatusChange: (id: string, status: AppointmentStatus) => void;
}) {
  const resource = mockResources.find(r => r.id === appointment.resourceId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-slate-900 rounded-xl border border-slate-700/50 w-full max-w-md overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white">{appointment.customerName}</h3>
              <p className="text-slate-400">{appointment.serviceType}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-slate-500" />
              <div>
                <p className="text-white">{formatDate(appointment.startTime)}</p>
                <p className="text-sm text-slate-400">
                  {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-slate-500" />
              <div>
                <p className="text-white">{resource?.name}</p>
                <p className="text-sm text-slate-400">{resource?.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-slate-500" />
              <p className="text-slate-300">{appointment.customerEmail}</p>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-slate-500" />
              <p className="text-slate-300">{appointment.customerPhone}</p>
            </div>

            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-slate-500" />
              <p className="text-emerald-400 font-semibold">{formatCurrency(appointment.price)}</p>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-slate-500" />
              <StatusBadge status={appointment.status} />
            </div>

            {appointment.notes && (
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <p className="text-xs text-slate-500 mb-1">Notes</p>
                <p className="text-sm text-slate-300">{appointment.notes}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 pt-6 border-t border-slate-700/50 flex gap-2">
            {appointment.status === 'conflict' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onStatusChange(appointment.id, 'confirmed')}
                className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium"
              >
                Resolve Conflict
              </motion.button>
            )}
            {appointment.status === 'pending' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onStatusChange(appointment.id, 'confirmed')}
                className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium"
              >
                Confirm Booking
              </motion.button>
            )}
            {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onStatusChange(appointment.id, 'cancelled')}
                className="flex-1 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 text-sm font-medium border border-red-500/30"
              >
                Cancel
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// Main Page Component
// ============================================
export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>('sandbox');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const handleStatusChange = useCallback((id: string, status: AppointmentStatus) => {
    setAppointments(prev => 
      prev.map(apt => apt.id === id ? { ...apt, status, updatedAt: new Date() } : apt)
    );
    setSelectedAppointment(null);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">
                <span className="gradient-text">Tumara Hall</span>
                <span className="text-slate-400 font-normal text-lg ml-2">| Software Developer & Founder</span>
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                <span className="text-indigo-400">CB Tech Trust</span> • Bachelor of IT
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-slate-400">
                <MapPin className="w-4 h-4" />
                <span>Southland, NZ</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Vercel Ready</span>
              </div>
              <div className="flex items-center gap-1.5 text-purple-400">
                <Code2 className="w-4 h-4" />
                <span>C# / T-SQL</span>
              </div>
            </div>
          </div>

          {/* Hero Title */}
          <div className="mt-6 mb-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              BookingTimes Interactive Sandbox
            </h2>
            <p className="text-slate-400 mt-2 max-w-2xl">
              A production-ready demonstration of scheduling systems, agentic AI operations, 
              and robust backend engineering for the Software Developer position at BookingTimes.
            </p>
          </div>

          {/* Tab Navigation */}
          <nav className="flex gap-2 mt-6">
            {tabs.map(tab => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                )}
              >
                {tab.icon}
                {tab.label}
                {activeTab === tab.id && (
                  <ChevronRight className="w-4 h-4" />
                )}
              </motion.button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* Interactive Sandbox Tab */}
          {activeTab === 'sandbox' && (
            <motion.div
              key="sandbox"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Calendar Section */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-lg font-semibold text-white">Booking & Resource Scheduler</h3>
                </div>
                <CalendarView
                  appointments={appointments}
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                  onAppointmentClick={setSelectedAppointment}
                />
              </div>

              {/* AI Agent Section */}
              <div className="glass rounded-xl p-6">
                <AgentChat />
              </div>
            </motion.div>
          )}

          {/* Media & Press Tab */}
          {activeTab === 'media' && (
            <motion.div
              key="media"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Video Section */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Play className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-lg font-semibold text-white">TechStep Portfolio Showcase</h3>
                </div>
                <div className="vimeo-container">
                  <iframe
                    src="https://player.vimeo.com/video/985552912?h=0&badge=0&autopause=0&player_id=0&app_id=58479"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title="Tumara Hall - TechStep Portfolio Showcase"
                  />
                </div>
                <p className="mt-4 text-sm text-slate-400">
                  Tumara Hall - TechStep Portfolio Showcase & CB Tech Trust Community Impact
                </p>
                <a 
                  href="https://www.techstep.nz/portfolio/tumara-hall-cb-tech-nz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  View on TechStep <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Press Feature Section */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <MessageSquare className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-lg font-semibold text-white">Featured in Otago Daily Times</h3>
                </div>
                
                <div className="rounded-lg overflow-hidden mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://www.odt.co.nz/sites/default/files/story/2025/06/tumara_hall_toni_mcdonald_odt.jpg"
                    alt="Tumara Hall featured in Otago Daily Times"
                    className="w-full h-auto object-cover"
                  />
                </div>

                <h4 className="text-xl font-bold text-white mb-2">
                  &ldquo;Big need for IT help&rdquo;
                </h4>
                
                <div className="space-y-4 text-sm text-slate-300">
                  <p>
                    Featured in the Otago Daily Times for driving accessible technology 
                    solutions across Southland, New Zealand.
                  </p>
                  
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <h5 className="font-semibold text-white mb-2">About Tumara Hall</h5>
                    <ul className="space-y-2 text-slate-400">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>Bachelor of Information Technology</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>Founder, CB Tech Charitable Trust</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>Delivering accessible software solutions to Southland communities</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>Proven track record of technical execution and community impact</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <a 
                  href="https://www.odt.co.nz/news/southland/big-need-for-it-help-qpzd3soc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-4 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Read Full Article <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          )}

          {/* Code Inspector Tab */}
          {activeTab === 'code' && (
            <motion.div
              key="code"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass rounded-xl p-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <Code2 className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-semibold text-white">Under the Hood: Code & Architecture</h3>
              </div>
              <CodeInspector />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-900/30 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-slate-500">
            <p>
              © 2024 Tumara Hall | Built with Next.js 14, TypeScript, Tailwind CSS & Framer Motion
            </p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                Ready for Vercel Deploy
              </span>
              <a 
                href="https://www.techstep.nz/portfolio/tumara-hall-cb-tech-nz/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                TechStep Portfolio
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Appointment Modal */}
      <AnimatePresence>
        {selectedAppointment && (
          <AppointmentModal
            appointment={selectedAppointment}
            onClose={() => setSelectedAppointment(null)}
            onStatusChange={handleStatusChange}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
