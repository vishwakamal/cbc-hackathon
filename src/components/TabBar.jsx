const tabs = [
  { id: 'checkin', label: 'Daily Check-In' },
  { id: 'injury', label: 'Injury Help' },
];

export default function TabBar({ activeTab, onTabChange }) {
  return (
    <div className="flex border-b border-gray-200 bg-white">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${
            activeTab === tab.id
              ? 'text-navy border-b-3 border-navy bg-white'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
