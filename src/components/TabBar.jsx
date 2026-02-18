const tabs = [
  { id: 'checkin', label: 'Check-In',        icon: '📊' },
  { id: 'injury',  label: 'Injury Help',     icon: '🩹' },
  { id: 'rtp',     label: 'Return to Sport', icon: '🏃' },
];

const severityColors = {
  red:   'bg-red',
  amber: 'bg-amber',
  green: 'bg-green',
};

export default function TabBar({ activeTab, onTabChange, injurySeverity }) {
  return (
    <div className="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm overflow-x-auto transition-colors duration-200">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const showBadge = tab.id === 'injury' && injurySeverity;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative flex-1 flex flex-col items-center py-2.5 px-2 text-xs font-semibold whitespace-nowrap transition-all duration-200 coach:py-4 coach:text-sm ${
              isActive
                ? 'text-navy dark:text-blue-400 border-b-2 border-navy dark:border-blue-400'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            <span className="text-base mb-0.5 coach:text-xl">{tab.icon}</span>
            <span>{tab.label}</span>
            {showBadge && (
              <span className={`absolute top-2 right-3 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-gray-900 ${severityColors[injurySeverity]}`} />
            )}
          </button>
        );
      })}
    </div>
  );
}
