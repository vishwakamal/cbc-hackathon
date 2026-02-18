export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 border-t-navy rounded-full animate-spin mb-3"></div>
      <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse-slow">Analyzing your symptoms...</p>
    </div>
  );
}
