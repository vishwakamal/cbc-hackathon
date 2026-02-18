export default function ErrorCard({ message, onRetry }) {
  return (
    <div className="bg-red-light dark:bg-red-950/40 border border-red rounded-xl p-4 text-center">
      <p className="text-red font-medium mb-2">
        {message || "Couldn't connect right now. Please try again."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm text-navy font-semibold underline"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
