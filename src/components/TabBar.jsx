const tabs = [
  { id: 'checkin', label: 'Check-In' },
  { id: 'injury',  label: 'Injury Help' },
  { id: 'rtp',     label: 'Return to Sport' },
];

export default function TabBar({ activeTab, onTabChange }) {
  return (
    <div className="flex border-b border-gray-200 bg-white overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 py-3 px-2 text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === tab.id
              ? 'text-navy border-b-2 border-navy bg-white'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
