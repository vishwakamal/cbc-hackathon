export default function ApiKeyInput({ apiKey, onChange }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Anthropic API Key
      </label>
      <input
        type="password"
        value={apiKey}
        onChange={(e) => onChange(e.target.value)}
        placeholder="sk-ant-..."
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
      />
      <p className="text-xs text-gray-400 mt-1">Your key is used client-side only and never stored.</p>
    </div>
  );
}
