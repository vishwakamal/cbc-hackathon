import { useState } from 'react';
import Header from './components/Header';
import TabBar from './components/TabBar';
import CheckInTab from './components/CheckInTab';
import InjuryTab from './components/InjuryTab';
import ReturnToSportTab from './components/ReturnToSportTab';

function App() {
  const [activeTab, setActiveTab] = useState('checkin');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-[480px] mx-auto px-4 py-5 pb-12">
        {activeTab === 'checkin' && <CheckInTab />}
        {activeTab === 'injury'  && <InjuryTab />}
        {activeTab === 'rtp'     && <ReturnToSportTab />}
      </main>
    </div>
  );
}

export default App;
