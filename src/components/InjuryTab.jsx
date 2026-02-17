import { useState } from 'react';
import SliderInput from './SliderInput';
import LoadingSpinner from './LoadingSpinner';
import ErrorCard from './ErrorCard';
import Disclaimer from './Disclaimer';
import IcingTimer from './IcingTimer';
import { callClaude, getInjuryPrompt } from '../api';

const BODY_PARTS = ['Ankle', 'Knee', 'Shoulder', 'Wrist', 'Back', 'Hip', 'Other'];
const TIMING_OPTIONS = ['Just now', 'Today', 'A few days ago'];

const BODY_PART_ICONS = {
  Ankle: '🦶',
  Knee: '🦵',
  Shoulder: '💪',
  Wrist: '🤚',
  Back: '🔙',
  Hip: '🏃',
  Other: '🩹',
};

function RiceCards({ riceSummary }) {
  const cards = [
    { key: 'rest', label: 'Rest', icon: '🛌' },
    { key: 'ice', label: 'Ice', icon: '🧊' },
    { key: 'compression', label: 'Compression', icon: '🩹' },
    { key: 'elevation', label: 'Elevation', icon: '⬆️' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      {cards.map(({ key, label, icon }) => (
        <div key={key} className="bg-gray-50 rounded-xl p-4 text-center">
          <span className="text-2xl mb-2 block">{icon}</span>
          <h5 className="text-sm font-bold text-navy mb-1">{label}</h5>
          <p className="text-xs text-gray-600 leading-relaxed">{riceSummary[key]}</p>
        </div>
      ))}
    </div>
  );
}

function RecoveryTimeline({ days }) {
  return (
    <div className="mb-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-2">Recovery Timeline</h4>
      <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
        <div className="w-10 h-10 bg-green rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-lg">&#128337;</span>
        </div>
        <div>
          <p className="text-sm font-medium text-navy">Estimated: {days}</p>
          <p className="text-xs text-gray-500">With proper rest and treatment</p>
        </div>
      </div>
    </div>
  );
}

function InjuryResult({ result }) {
  return (
    <div className="mt-4 space-y-4 animate-in">
      {result.urgentFlag && (
        <div className="bg-red-light border-2 border-red rounded-xl p-4 flex items-start gap-3">
          <span className="text-red text-2xl">&#9888;</span>
          <div>
            <p className="text-red font-bold">Seek Immediate Medical Attention</p>
            <p className="text-sm text-gray-700 mt-1">
              Based on your description, this injury may require professional medical evaluation.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 text-center">
          RICE Treatment Plan
        </h3>
        <RiceCards riceSummary={result.riceSummary} />
      </div>

      <IcingTimer intervalMinutes={result.icingIntervalMinutes || 20} />

      <div className="bg-white rounded-xl shadow-sm p-5">
        <RecoveryTimeline days={result.recoveryTimelineDays} />

        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">What to Avoid</h4>
          <ul className="space-y-1">
            {result.avoid.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-red mt-0.5">&#10007;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-red-light border border-red rounded-lg p-4">
          <h4 className="text-sm font-bold text-red mb-2 flex items-center gap-2">
            <span>&#9888;</span> When to See a Doctor
          </h4>
          <ul className="space-y-1">
            {result.seeDoctorConditions.map((cond, i) => (
              <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-red">&#8226;</span>
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

export default function InjuryTab({ apiKey }) {
  const [bodyPart, setBodyPart] = useState('');
  const [mechanism, setMechanism] = useState('');
  const [pain, setPain] = useState(5);
  const [swelling, setSwelling] = useState('No');
  const [timing, setTiming] = useState('Just now');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    if (!apiKey) {
      setError('Please enter your Anthropic API key above.');
      return;
    }
    if (!bodyPart) {
      setError('Please select a body part.');
      return;
    }
    if (!mechanism.trim()) {
      setError('Please describe how the injury happened.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const { systemPrompt, userMessage } = getInjuryPrompt({
        bodyPart,
        mechanism,
        pain,
        swelling,
        timing,
      });
      const data = await callClaude(systemPrompt, userMessage, apiKey);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="bg-white rounded-xl shadow-sm p-5 mb-4">
        <h2 className="text-lg font-bold text-navy mb-4">What happened?</h2>

        {/* Body part selector */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">Body Part Injured</label>
          <div className="grid grid-cols-4 gap-2">
            {BODY_PARTS.map((part) => (
              <button
                key={part}
                onClick={() => setBodyPart(part)}
                className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl text-xs font-medium transition-all ${
                  bodyPart === part
                    ? 'bg-navy text-white shadow-md scale-105'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">{BODY_PART_ICONS[part]}</span>
                <span>{part}</span>
              </button>
            ))}
          </div>
        </div>

        {/* How it happened */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">How did it happen?</label>
          <input
            type="text"
            value={mechanism}
            onChange={(e) => setMechanism(e.target.value)}
            placeholder="e.g., twisted landing, overuse, collision..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
          />
        </div>

        {/* Pain slider */}
        <SliderInput label="Pain Level" value={pain} onChange={setPain} />

        {/* Swelling toggle */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">Swelling Present?</label>
          <div className="flex gap-3">
            {['Yes', 'No'].map((option) => (
              <button
                key={option}
                onClick={() => setSwelling(option)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  swelling === option
                    ? 'bg-navy text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* When did it happen */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">When did it happen?</label>
          <div className="grid grid-cols-3 gap-2">
            {TIMING_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => setTiming(option)}
                className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                  timing === option
                    ? 'bg-navy text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
          className="w-full bg-navy text-white py-3 rounded-xl font-semibold text-base hover:bg-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
