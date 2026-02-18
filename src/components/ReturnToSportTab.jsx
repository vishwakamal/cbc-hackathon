import { useState } from 'react';
import SliderInput from './SliderInput';
import LoadingSpinner from './LoadingSpinner';
import ErrorCard from './ErrorCard';
import Disclaimer from './Disclaimer';
import { callClaude, getRTPPrompt } from '../api';

const SWELLING_OPTIONS  = ['None', 'Mild', 'Significant'];
const ROM_OPTIONS       = ['Full', 'Mostly Full', 'Limited'];
const STRENGTH_OPTIONS  = ['Equal to other side', 'Slightly weaker', 'Significantly weaker'];
const BALANCE_OPTIONS   = ['Normal', 'Slightly off', 'Poor'];
const DAYS_OPTIONS      = ['Less than 1 week', '1–2 weeks', '3–4 weeks', '1–2 months', '3+ months'];

function criterionIcon(status) {
  if (status === 'pass') return <span className="text-green font-bold text-lg">&#10003;</span>;
  if (status === 'warn') return <span className="text-amber font-bold text-lg">&#9888;</span>;
  return <span className="text-red font-bold text-lg">&#10007;</span>;
}

function criterionBg(status) {
  if (status === 'pass') return 'bg-green-light dark:bg-green-900/20 border-green';
  if (status === 'warn') return 'bg-amber-light dark:bg-amber-900/20 border-amber';
  return 'bg-red-light dark:bg-red-950/30 border-red';
}

function ReadinessSignal({ readiness, readinessScore, clearanceLevel }) {
  const cfg = {
    green: { bg: 'bg-green', ring: 'ring-green', label: '✓ Cleared', emoji: '🟢' },
    yellow: { bg: 'bg-amber', ring: 'ring-amber', label: '⚡ Partial', emoji: '🟡' },
    red: { bg: 'bg-red', ring: 'ring-red', label: '✗ Not Ready', emoji: '🔴' },
  }[readiness] ?? { bg: 'bg-gray-400', ring: 'ring-gray-400', label: 'Unknown', emoji: '⚪' };

  return (
    <div className="flex flex-col items-center mb-5">
      <div className={`w-28 h-28 rounded-full ${cfg.bg} ring-4 ${cfg.ring} ring-offset-4 dark:ring-offset-gray-800 flex flex-col items-center justify-center mb-3`}>
        <span className="text-3xl font-bold text-white">{readinessScore}</span>
        <span className="text-xs font-semibold text-white opacity-80">/ 100</span>
      </div>
      <p className="text-lg font-bold text-navy dark:text-blue-300">{clearanceLevel}</p>
    </div>
  );
}

function RTPResult({ result }) {
  return (
    <div className="mt-4 space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4 text-center">
          Readiness Assessment
        </h3>
        <ReadinessSignal
          readiness={result.readiness}
          readinessScore={result.readinessScore}
          clearanceLevel={result.clearanceLevel}
        />
        <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-4 leading-relaxed">{result.summary}</p>

        {/* Criteria checklist */}
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Evaluation Criteria</h4>
        <div className="space-y-2">
          {result.criteria.map((c, i) => (
            <div key={i} className={`flex items-start gap-3 border rounded-lg px-3 py-2 ${criterionBg(c.status)}`}>
              <div className="pt-0.5">{criterionIcon(c.status)}</div>
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{c.name}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{c.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Recommendation</h4>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">{result.recommendation}</p>

        {result.restrictions?.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Restrictions</h4>
            <ul className="space-y-1">
              {result.restrictions.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <span className="text-amber mt-0.5">&#9888;</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.nextSteps?.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Next Steps</h4>
            <ol className="space-y-1 list-decimal list-inside">
              {result.nextSteps.map((s, i) => (
                <li key={i} className="text-sm text-gray-600 dark:text-gray-300">{s}</li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <Disclaimer />
    </div>
  );
}

function OptionButtons({ options, selected, onSelect, cols = 2 }) {
  return (
    <div className={`grid grid-cols-${cols} gap-2`}>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onSelect(opt)}
          className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors text-center ${
            selected === opt
              ? 'bg-navy text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export default function ReturnToSportTab() {
  const [injury, setInjury]           = useState('');
  const [daysSince, setDaysSince]     = useState(DAYS_OPTIONS[1]);
  const [painRest, setPainRest]       = useState(2);
  const [painActivity, setPainActivity] = useState(4);
  const [swelling, setSwelling]       = useState('None');
  const [rom, setRom]                 = useState('Full');
  const [strength, setStrength]       = useState('Equal to other side');
  const [balance, setBalance]         = useState('Normal');
  const [confidence, setConfidence]   = useState(7);

  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [result, setResult]           = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const { systemPrompt, userMessage } = getRTPPrompt({
        injury, daysSince, painRest, painActivity, swelling, rom, strength, balance, confidence,
      });
      const data = await callClaude(systemPrompt, userMessage);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 mb-4 transition-colors duration-200">
        <h2 className="text-lg font-bold text-navy dark:text-blue-300 mb-1">Return to Sport Quiz</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Based on evidence-based Return to Play protocols used by sports medicine clinicians.</p>

        {/* Injury description */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">What injury are you recovering from?</label>
          <input
            type="text"
            value={injury}
            onChange={(e) => setInjury(e.target.value)}
            placeholder="e.g., left ankle sprain, hamstring strain..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-navy dark:focus:ring-blue-400 focus:border-transparent"
          />
        </div>

        {/* Days since injury */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Time since injury</label>
          <OptionButtons options={DAYS_OPTIONS} selected={daysSince} onSelect={setDaysSince} cols={3} />
        </div>

        <SliderInput label="Pain at rest" value={painRest} onChange={setPainRest} min={0} />
        <SliderInput label="Pain during sport movements" value={painActivity} onChange={setPainActivity} min={0} />

        {/* Swelling */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Current swelling</label>
          <OptionButtons options={SWELLING_OPTIONS} selected={swelling} onSelect={setSwelling} cols={3} />
        </div>

        {/* Range of motion */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Range of motion vs. uninjured side</label>
          <OptionButtons options={ROM_OPTIONS} selected={rom} onSelect={setRom} cols={3} />
        </div>

        {/* Strength */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Strength vs. uninjured side</label>
          <OptionButtons options={STRENGTH_OPTIONS} selected={strength} onSelect={setStrength} cols={1} />
        </div>

        {/* Balance */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Balance / proprioception</label>
          <OptionButtons options={BALANCE_OPTIONS} selected={balance} onSelect={setBalance} cols={3} />
        </div>

        {/* Confidence */}
        <SliderInput label="Confidence to return to sport" value={confidence} onChange={setConfidence} min={0} />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-navy text-white py-3 rounded-xl font-semibold text-base hover:bg-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Assessing...' : 'Assess My Readiness'}
        </button>
      </div>

      {loading && <LoadingSpinner />}
      {error && <ErrorCard message={error} onRetry={handleSubmit} />}
      {result && <RTPResult result={result} />}
    </div>
  );
}
