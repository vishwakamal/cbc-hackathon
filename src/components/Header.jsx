export default function Header({ darkMode, onToggleDark }) {
  return (
    <header className="bg-navy text-white py-4 px-4 shadow-md">
      <div className="max-w-[480px] sm:max-w-[600px] md:max-w-[720px] mx-auto flex items-center justify-between">
        {/* Logo + title */}
        <div className="flex items-center gap-2">
          <svg className="w-7 h-7 flex-shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="13" y="6" width="6" height="20" rx="1" fill="white"/>
            <rect x="6" y="13" width="20" height="6" rx="1" fill="white"/>
            <circle cx="16" cy="16" r="15" stroke="white" strokeWidth="2" fill="none"/>
          </svg>
          <div>
            <h1 className="text-xl font-bold tracking-tight leading-none">SidelineRx</h1>
            <p className="text-xs text-blue-200 opacity-80 leading-none mt-0.5">Your At-Home Sports Medicine Guide</p>
          </div>
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={onToggleDark}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          className="relative flex items-center w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-navy flex-shrink-0"
          style={{ backgroundColor: darkMode ? '#4CAF82' : 'rgba(255,255,255,0.25)' }}
        >
          {/* Sun icon */}
          <span className={`absolute left-1.5 text-sm transition-opacity duration-200 ${darkMode ? 'opacity-0' : 'opacity-100'}`}>
            ☀️
          </span>
          {/* Moon icon */}
          <span className={`absolute right-1.5 text-sm transition-opacity duration-200 ${darkMode ? 'opacity-100' : 'opacity-0'}`}>
            🌙
          </span>
          {/* Sliding knob */}
          <span
            className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300"
            style={{ transform: darkMode ? 'translateX(28px)' : 'translateX(0)' }}
          />
        </button>
      </div>
    </header>
  );
}
