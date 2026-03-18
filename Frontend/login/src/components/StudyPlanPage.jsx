// src/components/StudyPlanPage.jsx
// AI-powered Mid-Sem Marks Analyzer + configurable duration Study Plan Generator
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from './api';

// ─── Icons ────────────────────────────────────────────────────────────────────
const ArrowLeftIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const BrainIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-4.66z"/>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.44-4.66z"/>
  </svg>
);
const SparklesIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z"/>
    <path d="M5 3v4"/><path d="M3 5h4"/><path d="M19 17v4"/><path d="M17 19h4"/>
  </svg>
);
const PlusIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const TrashIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);
const DownloadIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
const RefreshIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
  </svg>
);
const CheckIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const ExternalLinkIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);
const ChevronDownIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const MIDSEM_MAX_MARKS = 20;

// ─── Colour helpers ────────────────────────────────────────────────────────────
const scoreColor = (score) => {
  if (score < 60) return { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', badge: 'bg-red-500', bar: 'bg-red-500' };
  if (score < 75) return { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300', badge: 'bg-yellow-500', bar: 'bg-yellow-500' };
  return { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', badge: 'bg-green-500', bar: 'bg-green-500' };
};

const statusLabel = (score) => score < 60 ? 'Weak' : score < 75 ? 'Moderate' : 'Strong';

const extractApiError = (error, fallbackMessage) => {
  const data = error?.response?.data;
  if (!data) return fallbackMessage;
  if (typeof data === 'string') return data;
  if (typeof data.error === 'string') return data.error;

  const walk = (value) => {
    if (Array.isArray(value)) {
      return value.length ? walk(value[0]) : null;
    }
    if (value && typeof value === 'object') {
      const keys = Object.keys(value);
      if (!keys.length) return null;
      const key = keys[0];
      const child = walk(value[key]);
      return child ? `${key}: ${child}` : key;
    }
    if (value === undefined || value === null) return null;
    return String(value);
  };

  return walk(data) || fallbackMessage;
};

// ─── Sub-components ────────────────────────────────────────────────────────────

function MarksInputForm({ onAnalyze, loading, initialWeeks = 6 }) {
  const [subjects, setSubjects] = useState([
    { name: '', marks: '' },
    { name: '', marks: '' },
    { name: '', marks: '' },
  ]);
  const [semester, setSemester] = useState('Sem 4');
  const [target, setTarget] = useState(80);
  const [weeksCount, setWeeksCount] = useState(initialWeeks);

  const addRow = () => setSubjects(prev => [...prev, { name: '', marks: '' }]);
  const removeRow = (i) => setSubjects(prev => prev.filter((_, idx) => idx !== i));
  const updateRow = (i, field, value) =>
    setSubjects(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: value } : r));

  const handleSubmit = (e) => {
    e.preventDefault();
    const filled = subjects.filter(s => s.name.trim() && s.marks !== '');
    if (filled.length === 0) return;
    const marksObj = {};
    filled.forEach(s => { marksObj[s.name.trim()] = parseFloat(s.marks); });
    onAnalyze({
      marks: marksObj,
      semester,
      target_final: parseFloat(target),
      weeks_count: parseInt(weeksCount, 10),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/40">
          <BrainIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Enter Mid-Sem Marks</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">AI will analyse and build your personalised study plan</p>
        </div>
      </div>

      {/* Semester, Target and Duration row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Semester</label>
          <input
            value={semester}
            onChange={e => setSemester(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. Sem 4"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Final %</label>
          <input
            type="number" min="0" max="100" value={target}
            onChange={e => setTarget(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preparation Duration (weeks)</label>
          <input
            type="number" min="1" max="24" value={weeksCount}
            onChange={e => setWeeksCount(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Marks table */}
      <div>
        <div className="grid grid-cols-[1fr_120px_40px] gap-2 mb-2">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Subject</span>
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Marks / 20</span>
          <span />
        </div>
        <div className="space-y-2">
          {subjects.map((row, i) => (
            <div key={i} className="grid grid-cols-[1fr_120px_40px] gap-2 items-center">
              <input
                value={row.name}
                onChange={e => updateRow(i, 'name', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. Mathematics"
              />
              <input
                type="number" min="0" max="20" step="0.5" value={row.marks}
                onChange={e => updateRow(i, 'marks', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="9"
              />
              <button type="button" onClick={() => removeRow(i)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addRow}
          className="mt-3 flex items-center gap-1.5 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 transition-colors">
          <PlusIcon className="w-4 h-4" /> Add subject
        </button>
      </div>

      <button type="submit" disabled={loading}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25">
        {loading ? (
          <><RefreshIcon className="w-4 h-4 animate-spin" /> Analysing…</>
        ) : (
          <><SparklesIcon className="w-4 h-4" /> Analyse & Generate Plan</>
        )}
      </button>
    </form>
  );
}

function AnalysisCard({ analysis }) {
  if (!analysis) return null;
  const { avg_score, avg_raw_score, weak_subjects, improvement_needed_pct, subject_details } = analysis;

  return (
    <div className="space-y-5">
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{avg_score}%</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Average Percentage</p>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">{avg_raw_score}/{MIDSEM_MAX_MARKS} raw avg</p>
        </div>
        <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{weak_subjects.length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Weak Subjects</p>
        </div>
        <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">+{improvement_needed_pct}%</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Gap to Target</p>
        </div>
      </div>

      {/* Subject breakdown */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Subject Breakdown</h3>
        {(subject_details || []).map(({ subject, raw_score, max_marks, percentage, gap_to_target }) => {
          const c = scoreColor(percentage);
          return (
            <div key={subject} className={`rounded-xl p-4 ${c.bg} border border-transparent`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900 dark:text-white text-sm">{subject}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full text-white ${c.badge}`}>{statusLabel(percentage)}</span>
                  <span className={`text-lg font-bold ${c.text}`}>{raw_score}/{max_marks}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{percentage}%</p>
              {/* Progress bar */}
              <div className="h-1.5 bg-white/60 dark:bg-gray-700/60 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${c.bar} transition-all duration-500`} style={{ width: `${percentage}%` }} />
              </div>
              {percentage < 60 && (
                <p className="text-xs mt-1.5 text-red-600 dark:text-red-400">
                  Need +{gap_to_target}% to reach target
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Weak subjects callout */}
      {weak_subjects.length > 0 && (
        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
          <p className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">Priority Focus (below 60%)</p>
          <div className="flex flex-wrap gap-2">
            {weak_subjects.map(s => (
              <span key={s} className="text-xs bg-red-600 text-white px-3 py-1 rounded-full font-medium">{s}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function WeekCard({ weekData, planId, progress, onToggle }) {
  const [open, setOpen] = useState(weekData.week <= 2);
  const { week, focus, daily_tasks = [], resources = [] } = weekData;
  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Count total and done tasks
  let total = 0, done = 0;
  daily_tasks.forEach(day => {
    day.tasks.forEach((_, ti) => {
      total++;
      const key = `w${week}_d${DAYS.indexOf(day.day)}_t${ti}`;
      if (progress[key]) done++;
    });
  });

  const pct = total ? Math.round((done / total) * 100) : 0;
  const weekColors = ['from-indigo-500 to-purple-600', 'from-purple-500 to-pink-600', 'from-pink-500 to-rose-600', 'from-rose-500 to-orange-600', 'from-orange-500 to-amber-600', 'from-amber-500 to-yellow-600'];
  const grad = weekColors[(week - 1) % weekColors.length];

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
      {/* Week header */}
      <button className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors" onClick={() => setOpen(o => !o)}>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center flex-shrink-0 shadow-md`}>
          <span className="text-white font-bold text-lg">{week}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-gray-900 dark:text-white">Week {week}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{done}/{total} tasks</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{focus}</p>
          <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
            <div className={`h-full bg-gradient-to-r ${grad} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
          </div>
        </div>
        <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-gray-100 dark:border-gray-700 pt-4">
          {/* Daily tasks */}
          {daily_tasks.map((dayData, di) => (
            <div key={dayData.day}>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{dayData.day}</p>
              <div className="space-y-2">
                {(dayData.tasks || []).map((task, ti) => {
                  const key = `w${week}_d${DAYS.indexOf(dayData.day)}_t${ti}`;
                  const checked = !!progress[key];
                  return (
                    <button key={ti} onClick={() => onToggle(planId, key, !checked)}
                      className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all ${checked ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 hover:border-indigo-300'}`}>
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${checked ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-gray-600'}`}>
                        {checked && <CheckIcon className="w-3 h-3 text-white" />}
                      </div>
                      <div className="min-w-0">
                        <span className={`text-sm font-medium block ${checked ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}`}>{task.activity}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{task.subject} · {task.duration_min} min</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Resources */}
          {resources.length > 0 && (
            <div className="mt-3 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
              <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-2">📚 Resources</p>
              <div className="space-y-2">
                {resources.map((r, ri) => (
                  <a key={ri} href={r.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-indigo-700 dark:text-indigo-300 hover:underline group">
                    <ExternalLinkIcon className="w-3.5 h-3.5 flex-shrink-0 group-hover:text-indigo-900 dark:group-hover:text-indigo-100" />
                    <span className="truncate">{r.title} <span className="text-indigo-400 dark:text-indigo-500">({r.subject})</span></span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ProgressBar({ value, label, color = 'bg-indigo-500' }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
        <span>{label}</span><span>{value}%</span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function StudyPlanPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState('input'); // 'input' | 'analysis' | 'plan'
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [error, setError] = useState('');
  const [planData, setPlanData] = useState(null);     // full StudyPlan object
  const [analysis, setAnalysis] = useState(null);
  const [pastPlans, setPastPlans] = useState([]);
  const [loadingPast, setLoadingPast] = useState(true);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [selectedWeeks, setSelectedWeeks] = useState(6);

  // Fetch existing plans on mount
  useEffect(() => {
    apiClient.get('marks/my-plans/')
      .then(r => setPastPlans(r.data))
      .catch(() => {})
      .finally(() => setLoadingPast(false));
  }, []);

  // ── Analyze marks ──────────────────────────────────────────────────────────
  const handleAnalyze = async ({ marks, semester, target_final, weeks_count }) => {
    setLoadingAnalysis(true);
    setError('');
    try {
      const res = await apiClient.post('marks/analyze/', { marks, semester, target_final });
      const normalizedWeeks = Math.min(24, Math.max(1, Number(weeks_count) || 6));
      setAnalysis(res.data.analysis);
      setSelectedWeeks(normalizedWeeks);
      setPlanData({ id: res.data.study_plan_id, midsem_marks: marks, semester, target_final, weeks_count: normalizedWeeks, task_progress: {}, study_plan: null });
      setStep('analysis');
    } catch (e) {
      setError(extractApiError(e, 'Analysis failed. Please try again.'));
    } finally {
      setLoadingAnalysis(false);
    }
  };

  // ── Generate AI plan ───────────────────────────────────────────────────────
  const handleGeneratePlan = async () => {
    setLoadingPlan(true);
    setError('');
    try {
      const weeksCount = Math.min(24, Math.max(1, Number(planData?.weeks_count || selectedWeeks || 6)));
      const res = await apiClient.post('marks/generate-study-plan/', {
        study_plan_id: planData.id,
        weeks_count: weeksCount,
      });
      const computedWeeks = res.data?.study_plan?.weeks_count || res.data?.study_plan?.weeks?.length || weeksCount;
      setPlanData((prev) => ({ ...res.data, weeks_count: computedWeeks || prev?.weeks_count || 6 }));
      setSelectedWeeks(computedWeeks || 6);
      setAnalysis(res.data.analysis);
      setPastPlans(prev => [res.data, ...prev.filter(p => p.id !== res.data.id)]);
      setStep('plan');
    } catch (e) {
      setError(extractApiError(e, 'Plan generation failed. Please try again.'));
    } finally {
      setLoadingPlan(false);
    }
  };

  // ── Load a previously saved plan ──────────────────────────────────────────
  const loadPlan = async (plan) => {
    const inferredWeeks = plan?.study_plan?.weeks_count || plan?.study_plan?.weeks?.length || plan?.weeks_count || 6;
    setSelectedWeeks(inferredWeeks);
    setPlanData({ ...plan, weeks_count: inferredWeeks });
    setAnalysis(plan.analysis);
    setStep(plan.study_plan ? 'plan' : 'analysis');
  };

  // ── Toggle task checkbox ───────────────────────────────────────────────────
  const handleToggle = useCallback(async (pid, key, completed) => {
    // Optimistic update
    setPlanData(prev => {
      if (!prev) return prev;
      const progress = { ...prev.task_progress, [key]: completed };
      return { ...prev, task_progress: progress };
    });
    try {
      await apiClient.patch(`marks/plan/${pid}/progress/`, { task_key: key, completed });
    } catch {
      // Revert on failure
      setPlanData(prev => {
        if (!prev) return prev;
        const progress = { ...prev.task_progress, [key]: !completed };
        return { ...prev, task_progress: progress };
      });
    }
  }, []);

  // ── Overall progress ───────────────────────────────────────────────────────
  const overallProgress = (() => {
    if (!planData?.study_plan?.weeks) return 0;
    let total = 0, done = 0;
    const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    planData.study_plan.weeks.forEach(w => {
      w.daily_tasks?.forEach(d => {
        d.tasks?.forEach((_, ti) => {
          total++;
          const key = `w${w.week}_d${DAYS.indexOf(d.day)}_t${ti}`;
          if (planData.task_progress?.[key]) done++;
        });
      });
    });
    return total ? Math.round((done / total) * 100) : 0;
  })();

  // ── PDF Export ─────────────────────────────────────────────────────────────
  const handleExportPDF = () => {
    setExportingPDF(true);
    try {
      const content = buildPDFContent(planData, analysis);
      const blob = new Blob([content], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const win = window.open(url, '_blank');
      if (win) {
        win.onload = () => { win.print(); URL.revokeObjectURL(url); };
      }
    } finally {
      setExportingPDF(false);
    }
  };

  const buildPDFContent = (plan, anal) => `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Study Plan – ${plan?.semester ?? ''}</title>
<style>
  body{font-family:Arial,sans-serif;max-width:800px;margin:0 auto;padding:20px;color:#1a1a1a}
  h1{color:#4f46e5;border-bottom:2px solid #4f46e5;padding-bottom:8px}
  h2{color:#374151;margin-top:24px}
  table{width:100%;border-collapse:collapse;margin:12px 0}
  th,td{border:1px solid #d1d5db;padding:10px;text-align:left}
  th{background:#f3f4f6;font-weight:600}
  .weak{background:#fee2e2;color:#b91c1c;font-weight:600}
  .strong{background:#dcfce7;color:#166534;font-weight:600}
  .moderate{background:#fef9c3;color:#854d0e;font-weight:600}
  .week-header{background:#4f46e5;color:white;padding:10px 14px;border-radius:8px;margin:20px 0 8px 0}
  a{color:#4f46e5}
  @media print{body{padding:10px}}
</style>
</head>
<body>
<h1>📚 CampusMate Study Plan</h1>
<p><strong>Semester:</strong> ${plan?.semester ?? '—'} &nbsp;|&nbsp; <strong>Target:</strong> ${plan?.target_final ?? '—'}%</p>
<p><strong>Mid-sem format:</strong> marks entered out of ${MIDSEM_MAX_MARKS}</p>
<h2>Marks Analysis</h2>
<table>
  <tr><th>Subject</th><th>Score</th><th>Status</th><th>Gap to Target</th></tr>
  ${(anal?.subject_details ?? []).map(s => `<tr>
    <td>${s.subject}</td>
    <td>${s.raw_score}/${s.max_marks} (${s.percentage}%)</td>
    <td class="${s.status}">${s.status.charAt(0).toUpperCase() + s.status.slice(1)}</td>
    <td>${s.gap_to_target > 0 ? '+' + s.gap_to_target + '%' : '✓'}</td>
  </tr>`).join('')}
</table>
${(plan?.study_plan?.weeks ?? []).map(w => `
<div class="week-header">Week ${w.week} – ${w.focus}</div>
${w.daily_tasks?.map(d => `<p><strong>${d.day}:</strong> ${d.tasks?.map(t => `${t.activity} (${t.subject}, ${t.duration_min}min)`).join(' | ') ?? ''}</p>`).join('') ?? ''}
${w.resources?.length ? `<p><strong>Resources:</strong> ${w.resources.map(r => `<a href="${r.url}">${r.title}</a>`).join(', ')}</p>` : ''}
`).join('')}
</body></html>`;

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 md:px-6 py-4 flex items-center gap-3">
        <button onClick={() => navigate('/dashboard')}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400">
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 flex-1">
          <SparklesIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span className="text-lg font-bold text-gray-900 dark:text-white">AI Study Plan</span>
          {planData?.semester && (
            <span className="hidden sm:inline text-sm text-gray-500 dark:text-gray-400">· {planData.semester}</span>
          )}
        </div>
        {step === 'plan' && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 hidden sm:inline">Progress: {overallProgress}%</span>
            <button onClick={handleExportPDF} disabled={exportingPDF}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors disabled:opacity-60">
              <DownloadIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Export PDF</span>
            </button>
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left panel ── */}
          <div className="lg:col-span-1 space-y-6">

            {/* Input / Analysis card */}
            <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm p-6">
              {step === 'input' && (
                <MarksInputForm onAnalyze={handleAnalyze} loading={loadingAnalysis} initialWeeks={selectedWeeks} />
              )}

              {(step === 'analysis' || step === 'plan') && analysis && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Analysis</h2>
                    <button onClick={() => setStep('input')}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">← Re-enter marks</button>
                  </div>
                  <AnalysisCard analysis={analysis} />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preparation Duration (weeks)</label>
                    <input
                      type="number"
                      min="1"
                      max="24"
                      value={planData?.weeks_count || selectedWeeks}
                      onChange={(e) => {
                        const value = Math.min(24, Math.max(1, Number(e.target.value) || 6));
                        setSelectedWeeks(value);
                        setPlanData((prev) => ({ ...(prev || {}), weeks_count: value }));
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {step === 'analysis' && (
                    <button onClick={handleGeneratePlan} disabled={loadingPlan}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25">
                      {loadingPlan ? (
                        <><RefreshIcon className="w-4 h-4 animate-spin" /> Generating…</>
                      ) : (
                        <><SparklesIcon className="w-4 h-4" /> Generate AI Plan</>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Overall progress (when plan loaded) */}
            {step === 'plan' && (
              <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm p-5 space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Overall Progress</h3>
                <ProgressBar value={overallProgress} label="Plan Completion" color="bg-gradient-to-r from-indigo-500 to-purple-500" />
                {planData?.status === 'completed' && (
                  <div className="rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 text-center">
                    <span className="text-sm font-semibold text-green-700 dark:text-green-300">🎉 Plan Completed!</span>
                  </div>
                )}
                <button onClick={handleGeneratePlan} disabled={loadingPlan}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors disabled:opacity-60">
                  {loadingPlan ? <><RefreshIcon className="w-4 h-4 animate-spin" /> Regenerating…</> : <><RefreshIcon className="w-4 h-4" /> Re-generate plan</>}
                </button>
              </div>
            )}

            {/* Past plans */}
            <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Saved Plans</h3>
              {loadingPast ? (
                <p className="text-sm text-gray-400 dark:text-gray-500">Loading…</p>
              ) : pastPlans.length === 0 ? (
                <p className="text-sm text-gray-400 dark:text-gray-500">No saved plans yet.</p>
              ) : (
                <div className="space-y-2">
                  {pastPlans.map(p => (
                    <button key={p.id} onClick={() => loadPlan(p)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors border ${planData?.id === p.id ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 font-medium' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>
                      <span className="block font-medium">{p.semester}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        Target {p.target_final}% · {p.status === 'completed' ? '✅ Completed' : '⏳ Active'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Right panel: generated plan ── */}
          <div className="lg:col-span-2">
            {step === 'input' && (
              <div className="h-full flex items-center justify-center rounded-2xl bg-white dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-800 p-12 text-center">
                <div className="space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center mx-auto">
                    <BrainIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Study Plan Appears Here</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">Enter your mid-sem marks out of 20 on the left and click <strong>Analyse & Generate Plan</strong> to get started.</p>
                </div>
              </div>
            )}

            {step === 'analysis' && (
              <div className="h-full flex items-center justify-center rounded-2xl bg-white dark:bg-gray-900 border-2 border-dashed border-indigo-200 dark:border-indigo-800 p-12 text-center">
                <div className="space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center mx-auto">
                    <SparklesIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-pulse" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ready to Generate</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">Analysis complete. Click <strong>Generate AI Plan</strong> to build your personalised study timeline with Gemini AI.</p>
                </div>
              </div>
            )}

            {step === 'plan' && planData?.study_plan?.weeks && (
              <div className="space-y-4">
                {/* Plan header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{planData?.study_plan?.weeks?.length || planData?.weeks_count || selectedWeeks}-Week Study Plan</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {planData.semester} · Target {planData.target_final}% · {overallProgress}% complete
                    </p>
                  </div>
                </div>

                {planData.study_plan.note && (
                  <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3">
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      ℹ️ {planData.study_plan.note}
                    </p>
                  </div>
                )}

                {/* Week cards */}
                {planData.study_plan.weeks.map(w => (
                  <WeekCard
                    key={w.week}
                    weekData={w}
                    planId={planData.id}
                    progress={planData.task_progress || {}}
                    onToggle={handleToggle}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
