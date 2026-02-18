export default function Header({ darkMode, onToggleDark, coachMode, onToggleCoach }) {
  return (
    <header className="bg-gradient-to-r from-[#152C48] to-[#1E3A5F] text-white shadow-lg">
      <div className="max-w-[480px] sm:max-w-[600px] md:max-w-[720px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">

        {/* Logo + title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <svg className="w-8 h-8 flex-shrink-0 drop-shadow-sm" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="13" y="6" width="6" height="20" rx="1.5" fill="white"/>
            <rect x="6" y="13" width="20" height="6" rx="1.5" fill="white"/>
            <circle cx="16" cy="16" r="14.5" stroke="white" strokeWidth="2" fill="none" opacity="0.8"/>
          </svg>
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight leading-tight">SidelineRx</h1>
            <p className="text-xs text-blue-200/80 leading-tight hidden xs:block sm:block">Your At-Home Sports Medicine Guide</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 flex-shrink-0">

          {/* Coach mode toggle */}
          <button
            onClick={onToggleCoach}
            aria-label={coachMode ? 'Exit coach mode' : 'Enter coach mode'}
            title={coachMode ? 'Exit coach mode' : 'Coach mode: larger text for sideline use'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
              coachMode
                ? 'bg-amber text-white border-amber shadow-md shadow-amber/30'
                : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20'
            }`}
          >
            <span className="text-sm">📋</span>
            <span className="hidden sm:inline">{coachMode ? 'Coach ON' : 'Coach'}</span>
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={onToggleDark}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="relative flex items-center w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 flex-shrink-0"
            style={{ backgroundColor: darkMode ? '#4CAF82' : 'rgba(255,255,255,0.2)' }}
          >
            <span className={`absolute left-1.5 text-sm transition-opacity duration-200 ${darkMode ? 'opacity-0' : 'opacity-100'}`}>☀️</span>
            <span className={`absolute right-1.5 text-sm transition-opacity duration-200 ${darkMode ? 'opacity-100' : 'opacity-0'}`}>🌙</span>
            <span
              className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300"
              style={{ transform: darkMode ? 'translateX(28px)' : 'translateX(0)' }}
            />
          </button>
        </div>
      </div>
    </header>
  );
}
