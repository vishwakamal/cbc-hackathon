import { useState, useEffect } from 'react';
import Header from './components/Header';
import TabBar from './components/TabBar';
import CheckInTab from './components/CheckInTab';
import InjuryTab from './components/InjuryTab';
import ReturnToSportTab from './components/ReturnToSportTab';

function App() {
  const [activeTab, setActiveTab] = useState('checkin');
  const [darkMode, setDarkMode] = useState(false);

  // Apply/remove the `dark` class on <html> so Tailwind dark: variants work globally
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header darkMode={darkMode} onToggleDark={() => setDarkMode((d) => !d)} />
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      {/* Responsive: phone full-width, tablet/iPad wider, desktop comfortable */}
      <main className="max-w-[480px] sm:max-w-[600px] md:max-w-[720px] mx-auto px-4 sm:px-6 py-5 pb-safe">
        {activeTab === 'checkin' && <CheckInTab />}
        {activeTab === 'injury'  && <InjuryTab />}
        {activeTab === 'rtp'     && <ReturnToSportTab />}
      </main>
    </div>
  );
}

export default App;
