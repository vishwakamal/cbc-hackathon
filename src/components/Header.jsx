export default function Header() {
  return (
    <header className="bg-navy text-white py-5 px-4 text-center shadow-md">
      <div className="flex items-center justify-center gap-2 mb-1">
        <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="13" y="6" width="6" height="20" rx="1" fill="white"/>
          <rect x="6" y="13" width="20" height="6" rx="1" fill="white"/>
          <circle cx="16" cy="16" r="15" stroke="white" strokeWidth="2" fill="none"/>
        </svg>
        <h1 className="text-2xl font-bold tracking-tight">SidelineRx</h1>
      </div>
      <p className="text-sm text-blue-200 opacity-80">Your At-Home Sports Medicine Guide</p>
    </header>
  );
}
