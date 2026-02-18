const tabs = [
  { id: 'checkin', label: 'Check-In' },
  { id: 'injury',  label: 'Injury Help' },
  { id: 'rtp',     label: 'Return to Sport' },
];

export default function TabBar({ activeTab, onTabChange }) {
  return (
    <div className="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-x-auto transition-colors duration-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 py-3 px-2 text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === tab.id
              ? 'text-navy dark:text-blue-400 border-b-2 border-navy dark:border-blue-400 bg-white dark:bg-gray-800'
              : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
