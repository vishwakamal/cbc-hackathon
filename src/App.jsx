import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import TabBar from './components/TabBar';
import CheckInTab from './components/CheckInTab';
import InjuryTab from './components/InjuryTab';
import ReturnToSportTab from './components/ReturnToSportTab';

function App() {
  const [activeTab, setActiveTab] = useState('checkin');
  const [darkMode, setDarkMode]   = useState(false);
  const [coachMode, setCoachMode] = useState(false);

  // In-session injury log (last 3) + severity badge for the Injury tab
  const [recentInjuries, setRecentInjuries] = useState([]);
  const [injurySeverity, setInjurySeverity] = useState(null); // 'green' | 'amber' | 'red'

  // Apply dark / coach classes to <html> so Tailwind variants fire everywhere
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    document.documentElement.classList.toggle('coach', coachMode);
  }, [darkMode, coachMode]);

  const handleNewInjury = useCallback((bodyPart, result) => {
    const severity = result.urgentFlag ? 'red'
      : (result.seeDoctorConditions?.length > 2) ? 'amber'
      : 'green';
    setInjurySeverity(severity);
    setRecentInjuries(prev => [
      { id: Date.now(), bodyPart, urgentFlag: result.urgentFlag, recoveryDays: result.recoveryTimelineDays },
      ...prev.slice(0, 2),
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-[#EEF2F7] dark:bg-[#0F172A] transition-colors duration-200">
      <Header
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(d => !d)}
        coachMode={coachMode}
        onToggleCoach={() => setCoachMode(c => !c)}
      />
      <TabBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        injurySeverity={injurySeverity}
      />
      <main className="max-w-[480px] sm:max-w-[600px] md:max-w-[720px] mx-auto px-4 sm:px-6 py-5 pb-safe">
        {activeTab === 'checkin' && <CheckInTab />}
        {activeTab === 'injury'  && (
          <InjuryTab recentInjuries={recentInjuries} onNewInjury={handleNewInjury} />
        )}
        {activeTab === 'rtp' && <ReturnToSportTab />}
      </main>
    </div>
  );
}

export default App;
