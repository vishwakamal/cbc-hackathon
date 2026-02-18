import { useState } from 'react';
import SliderInput from './SliderInput';
import LoadingSpinner from './LoadingSpinner';
import ErrorCard from './ErrorCard';
import Disclaimer from './Disclaimer';
import IcingTimer from './IcingTimer';
import BodyMap from './BodyMap';
import { callClaude, getInjuryPrompt } from '../api';

const TIMING_OPTIONS = ['Just now', 'Today', 'A few days ago'];

// ── Recent injuries session log ───────────────────────────────────────────────
function RecentInjuriesBanner({ injuries }) {
  if (!injuries.length) return null;

  return (
    <div className="mb-4">
      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">
        This Session
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {injuries.map((inj) => (
          <div
            key={inj.id}
            className={`flex-shrink-0 rounded-xl px-3 py-2 border text-xs min-w-[100px] ${
              inj.urgentFlag
                ? 'bg-red-light dark:bg-red-950/40 border-red'
                : 'bg-green-light dark:bg-green-900/20 border-green'
            }`}
          >
            <p className={`font-bold truncate ${inj.urgentFlag ? 'text-red' : 'text-green'}`}>
              {inj.bodyPart}
            </p>
            <p className="text-gray-500 dark:text-gray-400 mt-0.5 truncate">{inj.recoveryDays}</p>
            {inj.urgentFlag && (
              <span className="inline-block mt-1 text-[10px] font-bold text-red uppercase tracking-wide">Urgent</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── RICE treatment cards ──────────────────────────────────────────────────────
function RiceCards({ riceSummary }) {
  const cards = [
    { key: 'rest',        label: 'Rest',        icon: '🛌' },
    { key: 'ice',         label: 'Ice',         icon: '🧊' },
    { key: 'compression', label: 'Compression', icon: '🩹' },
    { key: 'elevation',   label: 'Elevation',   icon: '⬆️' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      {cards.map(({ key, label, icon }) => (
        <div key={key} className="bg-gray-50 dark:bg-gray-700/60 rounded-xl p-4 text-center border border-gray-100 dark:border-gray-600">
          <span className="text-2xl mb-2 block">{icon}</span>
          <h5 className="text-sm font-bold text-navy dark:text-blue-300 mb-1 coach:text-base">{label}</h5>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed coach:text-sm">{riceSummary[key]}</p>
        </div>
      ))}
    </div>
  );
}

function RecoveryTimeline({ days }) {
  return (
    <div className="mb-4">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 coach:text-base">Recovery Timeline</h4>
      <div className="bg-gray-50 dark:bg-gray-700/60 rounded-xl p-3 flex items-center gap-3 border border-gray-100 dark:border-gray-600">
        <div className="w-10 h-10 bg-green rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
          <span className="text-white text-lg">&#128337;</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-navy dark:text-blue-300 coach:text-base">Estimated: {days}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 coach:text-sm">With proper rest and treatment</p>
        </div>
      </div>
    </div>
  );
}

function InjuryResult({ result }) {
  return (
    <div className="mt-4 space-y-4">
      {result.urgentFlag && (
        <div className="bg-red-light dark:bg-red-950/40 border-2 border-red rounded-2xl p-4 flex items-start gap-3">
          <span className="text-red text-2xl flex-shrink-0">&#9888;</span>
          <div>
            <p className="text-red font-bold coach:text-lg">Seek Immediate Medical Attention</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 coach:text-base">
              Based on your description, this injury may require professional medical evaluation.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 overflow-hidden">
        <div className="h-1 -mx-5 -mt-5 mb-5 bg-gradient-to-r from-blue-400 to-navy rounded-t-2xl" />
        <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 text-center">
          RICE Treatment Plan
        </h3>
        <RiceCards riceSummary={result.riceSummary} />
      </div>

      <IcingTimer intervalMinutes={result.icingIntervalMinutes || 20} />

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5">
        <RecoveryTimeline days={result.recoveryTimelineDays} />

        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 coach:text-base">What to Avoid</h4>
          <ul className="space-y-1.5">
            {result.avoid.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300 coach:text-base">
                <span className="text-red mt-0.5 flex-shrink-0">&#10007;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-red-light dark:bg-red-950/40 border border-red rounded-xl p-4">
          <h4 className="text-sm font-bold text-red mb-2 flex items-center gap-2 coach:text-base">
            <span>&#9888;</span> When to See a Doctor
          </h4>
          <ul className="space-y-1.5">
            {result.seeDoctorConditions.map((cond, i) => (
              <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2 coach:text-base">
                <span className="text-red flex-shrink-0">&#8226;</span>
                <span>{cond}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Disclaimer />
    </div>
  );
}

// ── Main tab ──────────────────────────────────────────────────────────────────
export default function InjuryTab({ recentInjuries = [], onNewInjury }) {
  const [bodyPart, setBodyPart] = useState('');
  const [mechanism, setMechanism] = useState('');
  const [pain, setPain] = useState(5);
  const [swelling, setSwelling] = useState('No');
  const [timing, setTiming] = useState('Just now');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    if (!bodyPart) { setError('Please tap a body part on the map above.'); return; }
    if (!mechanism.trim()) { setError('Please describe how the injury happened.'); return; }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const { systemPrompt, userMessage } = getInjuryPrompt({ bodyPart, mechanism, pain, swelling, timing });
      const data = await callClaude(systemPrompt, userMessage);
      setResult(data);
      onNewInjury?.(bodyPart, data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Session injury log */}
      <RecentInjuriesBanner injuries={recentInjuries} />

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 mb-4 transition-colors duration-200">
        <h2 className="text-lg font-bold text-navy dark:text-blue-300 mb-4 coach:text-2xl">What happened?</h2>

        {/* SVG Body map */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 coach:text-base">
            Where does it hurt?
          </label>
          <BodyMap selected={bodyPart} onSelect={setBodyPart} />
        </div>

        {/* How it happened */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 coach:text-base">
            How did it happen?
          </label>
          <input
            type="text"
            value={mechanism}
            onChange={(e) => setMechanism(e.target.value)}
            placeholder="e.g., twisted landing, overuse, collision..."
            className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-navy dark:focus:ring-blue-400 focus:border-transparent coach:text-base coach:py-3"
          />
        </div>

        <SliderInput label="Pain Level" value={pain} onChange={setPain} />

        {/* Swelling */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 coach:text-base">
            Swelling Present?
          </label>
          <div className="flex gap-3">
            {['Yes', 'No'].map((option) => (
              <button
                key={option}
                onClick={() => setSwelling(option)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors coach:py-3 coach:text-base ${
                  swelling === option
                    ? 'bg-navy text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Timing */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 coach:text-base">
            When did it happen?
          </label>
          <div className="grid grid-cols-3 gap-2">
            {TIMING_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => setTiming(option)}
                className={`py-2 px-3 rounded-xl text-xs font-medium transition-colors coach:py-3 coach:text-sm ${
                  timing === option
                    ? 'bg-navy text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-navy text-white py-3.5 rounded-xl font-semibold text-base hover:bg-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm coach:py-5 coach:text-lg"
        >
          {loading ? 'Analyzing...' : 'Get My Treatment Plan'}
        </button>
      </div>

      {loading && <LoadingSpinner />}
      {error && <ErrorCard message={error} onRetry={handleSubmit} />}
      {result && <InjuryResult result={result} />}
    </div>
  );
}
