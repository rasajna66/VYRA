import React, { useState } from 'react';
import { ProviderCase, ProviderAlert, FollowUpTask, PriorityLevel } from '../../types';
import {
  LayoutDashboard,
  Users,
  Bell,
  CalendarCheck,
  BarChart3,
  FileText,
  Shield,
  Settings,
  Search,
  Filter,
  ArrowUpDown,
  ChevronRight,
  Sparkles,
  CheckCircle,
  Eye,
  SlidersHorizontal,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import { CaseDetailModal } from './CaseDetailModal';
import { CaseComparisonModal } from './CaseComparisonModal';
import { AlertCenterView } from './AlertCenterView';
import { FollowUpsView } from './FollowUpsView';
import { AnalyticsView } from './AnalyticsView';
import { ProviderNotesView } from './ProviderNotesView';
import { ProviderConsentLogsView } from './ProviderConsentLogsView';

interface ProviderDashboardProps {
  cases: ProviderCase[];
  alerts: ProviderAlert[];
  followUps: FollowUpTask[];
  onMarkCaseReviewed: (caseId: string) => void;
  onAddObservation: (caseId: string, note: string) => void;
  onScheduleFollowUp: (caseId: string, date: string, reason: string) => void;
  onChangePriority: (caseId: string, priority: PriorityLevel) => void;
  onDismissAlert: (alertId: string) => void;
  onCompleteFollowUp: (followUpId: string) => void;
  onAddFollowUp: (task: Omit<FollowUpTask, 'id'>) => void;
}

type ProviderNavTab =
  | 'Dashboard'
  | 'Cases'
  | 'Alerts'
  | 'Follow-ups'
  | 'Analytics'
  | 'Notes'
  | 'Consent'
  | 'Settings';

export const ProviderDashboard: React.FC<ProviderDashboardProps> = ({
  cases,
  alerts,
  followUps,
  onMarkCaseReviewed,
  onAddObservation,
  onScheduleFollowUp,
  onChangePriority,
  onDismissAlert,
  onCompleteFollowUp,
  onAddFollowUp,
}) => {
  const [activeTab, setActiveTab] = useState<ProviderNavTab>('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'All' | PriorityLevel>('All');
  const [sortBy, setSortBy] = useState<
    'Highest score' | 'Fastest increase' | 'Oldest unresolved case' | 'Last interaction'
  >('Highest score');

  // Selected case for detail modal
  const [selectedCase, setSelectedCase] = useState<ProviderCase | null>(null);

  // Compare cases selection (up to 3)
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [showComparisonModal, setShowComparisonModal] = useState(false);

  // 17. Overview Cards Stats calculation
  const totalCases = cases.length;
  const needsAttentionCount = cases.filter((c) => c.priority === 'Needs attention').length;
  const elevatedCount = cases.filter((c) => c.priority === 'Elevated').length;
  const highPriorityCount = cases.filter((c) => c.priority === 'High priority').length;
  const reviewedTodayCount = cases.filter((c) => c.reviewedToday).length;
  const followUpsDueCount = followUps.filter((f) => f.status === 'Due today').length;

  // Comparison toggle
  const toggleComparison = (id: string) => {
    if (selectedForComparison.includes(id)) {
      setSelectedForComparison(selectedForComparison.filter((cId) => cId !== id));
    } else {
      if (selectedForComparison.length < 3) {
        setSelectedForComparison([...selectedForComparison, id]);
      } else {
        alert('You can compare a maximum of 3 cases simultaneously.');
      }
    }
  };

  // Filter & Sort
  const filteredCases = cases
    .filter((c) => {
      const matchesSearch =
        c.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.preferredName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.assignedProfessional.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = priorityFilter === 'All' || c.priority === priorityFilter;
      return matchesSearch && matchesPriority;
    })
    .sort((a, b) => {
      if (sortBy === 'Highest score') return b.currentScore - a.currentScore;
      if (sortBy === 'Fastest increase') return b.change - a.change;
      if (sortBy === 'Oldest unresolved case') return (a.reviewedToday ? 1 : 0) - (b.reviewedToday ? 1 : 0);
      if (sortBy === 'Last interaction') return b.lastCheckIn.localeCompare(a.lastCheckIn);
      return 0;
    });

  const sidebarLinks = [
    { id: 'Dashboard' as ProviderNavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'Cases' as ProviderNavTab, label: 'Cases', icon: Users },
    { id: 'Alerts' as ProviderNavTab, label: 'Alerts', icon: Bell, badge: alerts.length },
    { id: 'Follow-ups' as ProviderNavTab, label: 'Follow-ups', icon: CalendarCheck, badge: followUpsDueCount },
    { id: 'Analytics' as ProviderNavTab, label: 'Analytics', icon: BarChart3 },
    { id: 'Notes' as ProviderNavTab, label: 'Notes', icon: FileText },
    { id: 'Consent' as ProviderNavTab, label: 'Consent', icon: Shield },
    { id: 'Settings' as ProviderNavTab, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#EFF9FD]/40 flex flex-col md:flex-row">
      {/* 28. PROVIDER SIDEBAR */}
      <aside className="w-full md:w-64 bg-white border-r border-[#B2CBD8]/50 p-4 sm:p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="px-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#547489]">
              Provider Console
            </span>
            <div className="text-sm font-bold text-[#0F3A57] mt-0.5">Dr. Sarah Jenkins</div>
            <div className="text-[11px] text-[#6E8C9F]">Adolescent Health Specialist</div>
          </div>

          <nav className="space-y-1">
            {sidebarLinks.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#0F3A57] text-white shadow-xs'
                      : 'text-[#547489] hover:text-[#0F3A57] hover:bg-[#EFF9FD]/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        isActive
                          ? 'bg-white text-[#0F3A57]'
                          : 'bg-[#EFF9FD] text-[#0F3A57] border border-[#B2CBD8]/50'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 mt-6 border-t border-[#B2CBD8]/40 px-2">
          <div className="text-[11px] text-[#547489]">
            Connected EHR: Westwood District Youth Clinic
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* Conditional Tab Rendering */}
        {activeTab === 'Alerts' ? (
          <AlertCenterView
            alerts={alerts}
            cases={cases}
            onOpenCase={(c) => setSelectedCase(c)}
            onDismissAlert={onDismissAlert}
          />
        ) : activeTab === 'Follow-ups' ? (
          <FollowUpsView
            followUps={followUps}
            onCompleteFollowUp={onCompleteFollowUp}
            onAddFollowUp={onAddFollowUp}
          />
        ) : activeTab === 'Analytics' ? (
          <AnalyticsView />
        ) : activeTab === 'Notes' ? (
          <ProviderNotesView
            cases={cases}
            onAddNote={onAddObservation}
          />
        ) : activeTab === 'Consent' ? (
          <ProviderConsentLogsView cases={cases} />
        ) : activeTab === 'Settings' ? (
          <div className="space-y-4 max-w-2xl bg-white p-6 rounded-3xl border border-[#B2CBD8]/60">
            <h2 className="text-xl font-bold text-[#0F3A57]">Clinician Configuration</h2>
            <p className="text-xs text-[#547489]">Adjust alert escalation sensitivity and triage criteria.</p>
            <div className="space-y-3 pt-2 text-xs">
              <label className="flex items-center justify-between p-3 rounded-2xl bg-[#EFF9FD]/50 border border-[#B2CBD8]/50">
                <span>Alert on score elevation ≥ 15 points</span>
                <input type="checkbox" defaultChecked className="accent-[#0F3A57] w-4 h-4" />
              </label>
              <label className="flex items-center justify-between p-3 rounded-2xl bg-[#EFF9FD]/50 border border-[#B2CBD8]/50">
                <span>Flag acute vocal pitch compression (acoustic fatigue)</span>
                <input type="checkbox" defaultChecked className="accent-[#0F3A57] w-4 h-4" />
              </label>
              <label className="flex items-center justify-between p-3 rounded-2xl bg-[#EFF9FD]/50 border border-[#B2CBD8]/50">
                <span>Auto-schedule follow-up prompt on 2 consecutive low check-ins</span>
                <input type="checkbox" defaultChecked className="accent-[#0F3A57] w-4 h-4" />
              </label>
            </div>
          </div>
        ) : (
          /* Dashboard & Cases Tab View */
          <div className="space-y-6">
            {/* 17. OVERVIEW CARDS */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-[#0F3A57]">Caseload Triage Overview</h1>
                  <p className="text-xs text-[#547489] mt-0.5">
                    Real-time multi-modal monitoring across assigned secondary student cohorts.
                  </p>
                </div>

                {selectedForComparison.length > 0 && (
                  <button
                    onClick={() => setShowComparisonModal(true)}
                    className="px-4 py-2 rounded-xl bg-[#0F3A57] text-white text-xs font-bold hover:bg-[#234C68] transition-all flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Compare {selectedForComparison.length} selected cases</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="p-4 rounded-3xl bg-white border border-[#B2CBD8]/60 shadow-xs">
                  <span className="text-[11px] font-bold text-[#547489] uppercase">Total Cases</span>
                  <div className="text-2xl font-black text-[#0F3A57] tabular-nums mt-1">24</div>
                  <span className="text-[10px] text-[#547489]">Cohort assigned</span>
                </div>

                <div className="p-4 rounded-3xl bg-white border border-[#B2CBD8]/60 shadow-xs">
                  <span className="text-[11px] font-bold text-[#547489] uppercase">Needs Attention</span>
                  <div className="text-2xl font-black text-[#0F3A57] tabular-nums mt-1">7</div>
                  <span className="text-[10px] text-[#547489]">Mild variance</span>
                </div>

                <div className="p-4 rounded-3xl bg-white border border-amber-200 bg-amber-50/30 shadow-xs">
                  <span className="text-[11px] font-bold text-amber-800 uppercase">Elevated</span>
                  <div className="text-2xl font-black text-amber-700 tabular-nums mt-1">4</div>
                  <span className="text-[10px] text-amber-600 font-semibold">Includes Ram S.</span>
                </div>

                <div className="p-4 rounded-3xl bg-white border border-rose-200 bg-rose-50/30 shadow-xs">
                  <span className="text-[11px] font-bold text-rose-800 uppercase">High Priority</span>
                  <div className="text-2xl font-black text-rose-700 tabular-nums mt-1">1</div>
                  <span className="text-[10px] text-rose-600 font-semibold">Priya S. (Urgent)</span>
                </div>

                <div className="p-4 rounded-3xl bg-white border border-[#B2CBD8]/60 shadow-xs">
                  <span className="text-[11px] font-bold text-[#547489] uppercase">Reviewed Today</span>
                  <div className="text-2xl font-black text-emerald-700 tabular-nums mt-1">9</div>
                  <span className="text-[10px] text-emerald-600 font-semibold">Up to date</span>
                </div>

                <div className="p-4 rounded-3xl bg-white border border-[#B2CBD8]/60 shadow-xs">
                  <span className="text-[11px] font-bold text-[#547489] uppercase">Follow-ups Due</span>
                  <div className="text-2xl font-black text-[#0F3A57] tabular-nums mt-1">5</div>
                  <span className="text-[10px] text-[#547489]">Scheduled today</span>
                </div>
              </div>
            </div>

            {/* 18. PRIORITY QUEUE TABLE & 24. SEARCH */}
            <div className="bg-white rounded-3xl border border-[#B2CBD8]/60 shadow-xs overflow-hidden space-y-4 p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-[#0F3A57]">Priority Caseload Queue</h2>
                  <span className="text-xs text-[#547489] bg-[#EFF9FD] px-2.5 py-0.5 rounded-full border border-[#B2CBD8]/40">
                    {filteredCases.length} Active Cases
                  </span>
                </div>

                {/* Search & Sort Controls */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative w-44 sm:w-56">
                    <Search className="w-3.5 h-3.5 text-[#547489] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search patient, ID..."
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#EFF9FD]/50 border border-[#B2CBD8] text-xs text-[#0F3A57] outline-none"
                    />
                  </div>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="text-xs font-semibold text-[#0F3A57] bg-[#EFF9FD] px-2.5 py-1.5 rounded-xl border border-[#B2CBD8] outline-none"
                  >
                    <option value="Highest score">Highest score</option>
                    <option value="Fastest increase">Fastest increase</option>
                    <option value="Oldest unresolved case">Oldest unresolved</option>
                    <option value="Last interaction">Last interaction</option>
                  </select>

                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value as typeof priorityFilter)}
                    className="text-xs font-semibold text-[#0F3A57] bg-[#EFF9FD] px-2.5 py-1.5 rounded-xl border border-[#B2CBD8] outline-none"
                  >
                    <option value="All">All Priorities</option>
                    <option value="High priority">High priority</option>
                    <option value="Elevated">Elevated</option>
                    <option value="Needs attention">Needs attention</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#EFF9FD] text-[#0F3A57] font-bold border-b border-[#B2CBD8]/50">
                    <tr>
                      <th className="p-3 w-10 text-center">Compare</th>
                      <th className="p-3">Patient</th>
                      <th className="p-3">Score</th>
                      <th className="p-3">Change</th>
                      <th className="p-3">Trend</th>
                      <th className="p-3">Priority</th>
                      <th className="p-3">Last Check-in</th>
                      <th className="p-3">Consent</th>
                      <th className="p-3">Assigned Professional</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#B2CBD8]/30">
                    {filteredCases.map((c) => {
                      const isCompared = selectedForComparison.includes(c.id);
                      return (
                        <tr
                          key={c.id}
                          className={`hover:bg-[#EFF9FD]/40 transition-colors ${
                            c.id === 'VYRA-0921' ? 'bg-[#EFF9FD]/20 font-medium' : ''
                          }`}
                        >
                          <td className="p-3 text-center">
                            <input
                              type="checkbox"
                              checked={isCompared}
                              onChange={() => toggleComparison(c.id)}
                              className="accent-[#0F3A57] w-3.5 h-3.5 rounded"
                              title="Select to compare (up to 3)"
                            />
                          </td>
                          <td className="p-3">
                            <div className="font-bold text-[#0F3A57]">
                              {c.patientName}{' '}
                              <span className="text-[#547489] font-normal">({c.preferredName})</span>
                            </div>
                            <div className="text-[10px] font-mono text-[#547489]">{c.id}</div>
                          </td>
                          <td className="p-3 font-extrabold text-[#0F3A57] tabular-nums text-sm">
                            {c.currentScore}
                          </td>
                          <td className="p-3 tabular-nums font-bold">
                            <span
                              className={
                                c.change > 0 ? 'text-rose-700' : c.change < 0 ? 'text-emerald-700' : 'text-[#547489]'
                              }
                            >
                              {c.change > 0 ? `+${c.change}` : c.change}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="uppercase text-[10px] font-bold text-[#234C68]">
                              {c.trend}
                            </span>
                          </td>
                          <td className="p-3">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                c.priority === 'High priority'
                                  ? 'bg-rose-100 text-rose-800'
                                  : c.priority === 'Elevated'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-[#EFF9FD] text-[#0F3A57]'
                              }`}
                            >
                              {c.priority}
                            </span>
                          </td>
                          <td className="p-3 text-[#547489]">{c.lastCheckIn}</td>
                          <td className="p-3">
                            <span className="text-[11px] text-[#234C68] font-medium bg-[#EFF9FD] px-2 py-0.5 rounded-md border border-[#B2CBD8]/40">
                              {c.consent.voiceAnalysis && c.consent.textAnalysis
                                ? 'Text + Voice'
                                : c.consent.textAnalysis
                                ? 'Text only'
                                : 'Restricted'}
                            </span>
                          </td>
                          <td className="p-3 text-[#547489]">{c.assignedProfessional}</td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {c.reviewedToday && (
                                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                                  ✓ Reviewed
                                </span>
                              )}
                              <button
                                onClick={() => setSelectedCase(c)}
                                className="px-3 py-1.5 rounded-xl bg-[#0F3A57] text-white text-[11px] font-bold hover:bg-[#234C68] transition-colors shadow-xs active:scale-95"
                              >
                                Triage
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Case Detail Modal */}
      {selectedCase && (
        <CaseDetailModal
          caseData={selectedCase}
          isOpen={true}
          onClose={() => setSelectedCase(null)}
          onMarkReviewed={(id) => {
            onMarkCaseReviewed(id);
            setSelectedCase((prev) => (prev ? { ...prev, reviewedToday: true } : null));
          }}
          onAddObservation={onAddObservation}
          onScheduleFollowUp={onScheduleFollowUp}
          onChangePriority={onChangePriority}
        />
      )}

      {/* Case Comparison Modal */}
      {showComparisonModal && (
        <CaseComparisonModal
          cases={cases.filter((c) => selectedForComparison.includes(c.id))}
          isOpen={true}
          onClose={() => setShowComparisonModal(false)}
          onSelectCaseForDetail={(c) => setSelectedCase(c)}
        />
      )}
    </div>
  );
};
