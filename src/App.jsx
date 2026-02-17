import { useState } from 'react';
import Header from './components/Header';
import TabBar from './components/TabBar';
import ApiKeyInput from './components/ApiKeyInput';
import CheckInTab from './components/CheckInTab';
import InjuryTab from './components/InjuryTab';

function App() {
  const [activeTab, setActiveTab] = useState('checkin');
  const [apiKey, setApiKey] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-[480px] mx-auto px-4 py-5 pb-12">
        <ApiKeyInput apiKey={apiKey} onChange={setApiKey} />
        {activeTab === 'checkin' ? (
          <CheckInTab apiKey={apiKey} />
        ) : (
          <InjuryTab apiKey={apiKey} />
        )}
      </main>
    </div>
  );
}

export default App;
