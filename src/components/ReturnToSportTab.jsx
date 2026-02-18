import { useState, useEffect, useMemo, useCallback } from 'react';
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

const READINESS_COLOR = {
  green:  '#4CAF82',
  yellow: '#F5A623',
  red:    '#E53E3E',
};

// ── Animated circular gauge ─────────────────────────────────────────────────
function AnimatedGauge({ score, readiness, clearanceLevel }) {
  const [display, setDisplay] = useState(0);
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const color = READINESS_COLOR[readiness] ?? '#94A3B8';

  useEffect(() => {
    setDisplay(0);
    let rafId;
    let startTime = null;
    const duration = 1400;

    const animate = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(Math.round(eased * score));
      if (progress < 1) rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [score]);

  const dashOffset = circumference * (1 - display / 100);

  return (
    <div className="flex flex-col items-center mb-5">
      <div className="relative">
        <svg width="148" height="148" viewBox="0 0 120 120">
          {/* Track */}
          <circle cx="60" cy="60" r={radius} fill="none" stroke="#E2E8F0" strokeWidth="10" className="dark:stroke-gray-700" />
          {/* Arc */}
          <circle
            cx="60" cy="60" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
            style={{ filter: `drop-shadow(0 0 6px ${color}55)`, transition: 'stroke-dashoffset 0.04s linear' }}
          />
          {/* Score */}
          <text x="60" y="54" textAnchor="middle" dominantBaseline="middle"
            fontSize="30" fontWeight="800" fill={color}
            fontFamily="ui-sans-serif, system-ui, sans-serif">
            {display}
          </text>
          <text x="60" y="76" textAnchor="middle" dominantBaseline="middle"
            fontSize="11" fill="#94A3B8"
            fontFamily="ui-sans-serif, system-ui, sans-serif">
            / 100
          </text>
        </svg>
      </div>
      <p className="text-lg font-bold text-navy dark:text-blue-300 mt-1 coach:text-xl">{clearanceLevel}</p>
    </div>
  );
}

// ── Confetti burst ────────────────────────────────────────────────────────────
const CONFETTI_COLORS = ['#4CAF82','#1E3A5F','#F5A623','#60A5FA','#F472B6','#A78BFA','#34D399','#FBBF24'];

function Confetti({ show }) {
  const pieces = useMemo(() =>
    Array.from({ length: 64 }, (_, i) => ({
      id: i,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      left: `${Math.random() * 100}%`,
      delay: `${(Math.random() * 0.9).toFixed(2)}s`,
      duration: `${(1.4 + Math.random() * 1.2).toFixed(2)}s`,
      width: `${6 + Math.floor(Math.random() * 9)}px`,
      height: `${4 + Math.floor(Math.random() * 9)}px`,
      borderRadius: Math.random() > 0.45 ? '50%' : '2px',
    })), []
  );

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            position: 'absolute',
            left: p.left,
            top: '-16px',
            width: p.width,
            height: p.height,
            backgroundColor: p.color,
            borderRadius: p.borderRadius,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}

// ── Criterion helpers ─────────────────────────────────────────────────────────
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

// ── Result display ────────────────────────────────────────────────────────────
function RTPResult({ result }) {
  return (
    <div className="mt-4 space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 overflow-hidden">
        {/* Coloured top stripe */}
        <div
          className="h-1.5 -mx-5 -mt-5 mb-5 rounded-t-2xl"
          style={{ background: READINESS_COLOR[result.readiness] ?? '#94A3B8' }}
        />
        <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 text-center">
          Readiness Assessment
        </h3>
        <AnimatedGauge
          score={result.readinessScore}
          readiness={result.readiness}
          clearanceLevel={result.clearanceLevel}
        />
        <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-5 leading-relaxed coach:text-base">
          {result.summary}
        </p>

        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 coach:text-sm">
          Evaluation Criteria
        </h4>
        <div className="space-y-2">
          {result.criteria.map((c, i) => (
            <div key={i} className={`flex items-start gap-3 border rounded-xl px-3 py-2 ${criterionBg(c.status)}`}>
              <div className="pt-0.5 flex-shrink-0">{criterionIcon(c.status)}</div>
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 coach:text-base">{c.name}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 coach:text-sm">{c.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 coach:text-base">Recommendation</h4>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4 coach:text-base">{result.recommendation}</p>

        {result.restrictions?.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 coach:text-base">Restrictions</h4>
            <ul className="space-y-1">
              {result.restrictions.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300 coach:text-base">
                  <span className="text-amber mt-0.5">&#9888;</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.nextSteps?.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 coach:text-base">Next Steps</h4>
            <ol className="space-y-1 list-decimal list-inside">
              {result.nextSteps.map((s, i) => (
                <li key={i} className="text-sm text-gray-600 dark:text-gray-300 coach:text-base">{s}</li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <Disclaimer />
    </div>
  );
}

// ── Option button group ───────────────────────────────────────────────────────
function OptionButtons({ options, selected, onSelect, cols = 2 }) {
  return (
    <div className={`grid grid-cols-${cols} gap-2`}>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onSelect(opt)}
          className={`py-2 px-3 rounded-xl text-xs font-medium transition-colors text-center coach:py-3 coach:text-sm ${
            selected === opt
              ? 'bg-navy text-white shadow-sm'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

// ── Main tab ──────────────────────────────────────────────────────────────────
export default function ReturnToSportTab() {
  const [injury, setInjury]             = useState('');
  const [daysSince, setDaysSince]       = useState(DAYS_OPTIONS[1]);
  const [painRest, setPainRest]         = useState(2);
  const [painActivity, setPainActivity] = useState(4);
  const [swelling, setSwelling]         = useState('None');
  const [rom, setRom]                   = useState('Full');
  const [strength, setStrength]         = useState('Equal to other side');
  const [balance, setBalance]           = useState('Normal');
  const [confidence, setConfidence]     = useState(7);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);
  const [result, setResult]             = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setShowConfetti(false);
    try {
      const { systemPrompt, userMessage } = getRTPPrompt({
        injury, daysSince, painRest, painActivity, swelling, rom, strength, balance, confidence,
      });
      const data = await callClaude(systemPrompt, userMessage);
      setResult(data);
      if (data.readiness === 'green') {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3800);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [injury, daysSince, painRest, painActivity, swelling, rom, strength, balance, confidence]);

  return (
    <>
      <Confetti show={showConfetti} />
      <div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 mb-4 transition-colors duration-200">
          <h2 className="text-lg font-bold text-navy dark:text-blue-300 mb-1 coach:text-2xl">Return to Sport Quiz</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-5 coach:text-sm">
            Based on evidence-based Return to Play protocols used by sports medicine clinicians.
          </p>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 coach:text-base">
              What injury are you recovering from?
            </label>
            <input
              type="text"
              value={injury}
              onChange={(e) => setInjury(e.target.value)}
              placeholder="e.g., left ankle sprain, hamstring strain..."
              className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-navy dark:focus:ring-blue-400 focus:border-transparent coach:text-base coach:py-3"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 coach:text-base">Time since injury</label>
            <OptionButtons options={DAYS_OPTIONS} selected={daysSince} onSelect={setDaysSince} cols={3} />
          </div>

          <SliderInput label="Pain at rest" value={painRest} onChange={setPainRest} min={0} />
          <SliderInput label="Pain during sport movements" value={painActivity} onChange={setPainActivity} min={0} />

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 coach:text-base">Current swelling</label>
            <OptionButtons options={SWELLING_OPTIONS} selected={swelling} onSelect={setSwelling} cols={3} />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 coach:text-base">Range of motion vs. uninjured side</label>
            <OptionButtons options={ROM_OPTIONS} selected={rom} onSelect={setRom} cols={3} />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 coach:text-base">Strength vs. uninjured side</label>
            <OptionButtons options={STRENGTH_OPTIONS} selected={strength} onSelect={setStrength} cols={1} />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 coach:text-base">Balance / proprioception</label>
            <OptionButtons options={BALANCE_OPTIONS} selected={balance} onSelect={setBalance} cols={3} />
          </div>

          <SliderInput label="Confidence to return to sport" value={confidence} onChange={setConfidence} min={0} />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-navy text-white py-3.5 rounded-xl font-semibold text-base hover:bg-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm coach:py-5 coach:text-lg"
          >
            {loading ? 'Assessing...' : 'Assess My Readiness'}
          </button>
        </div>

        {loading && <LoadingSpinner />}
        {error && <ErrorCard message={error} onRetry={handleSubmit} />}
        {result && <RTPResult result={result} />}
      </div>
    </>
  );
}
