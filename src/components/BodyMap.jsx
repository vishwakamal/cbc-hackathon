import { useState } from 'react';

// Each region: id, label, type (ellipse|rect), and shape coords
const FRONT_REGIONS = [
  { id: 'Head',          label: 'Head',         type: 'ellipse', cx: 80,  cy: 27,  rx: 24, ry: 26 },
  { id: 'L. Shoulder',   label: 'L. Shoulder',  type: 'ellipse', cx: 44,  cy: 67,  rx: 20, ry: 16 },
  { id: 'R. Shoulder',   label: 'R. Shoulder',  type: 'ellipse', cx: 116, cy: 67,  rx: 20, ry: 16 },
  { id: 'Chest',         label: 'Chest',        type: 'rect',    x: 54,   y: 58,   width: 52, height: 44, rx: 6 },
  { id: 'Abdomen',       label: 'Abdomen',      type: 'rect',    x: 54,   y: 102,  width: 52, height: 38, rx: 6 },
  { id: 'Hip/Groin',     label: 'Hip / Groin',  type: 'rect',    x: 54,   y: 140,  width: 52, height: 28, rx: 6 },
  { id: 'L. Elbow',      label: 'L. Elbow',     type: 'ellipse', cx: 34,  cy: 124, rx: 16, ry: 16 },
  { id: 'R. Elbow',      label: 'R. Elbow',     type: 'ellipse', cx: 126, cy: 124, rx: 16, ry: 16 },
  { id: 'L. Wrist',      label: 'L. Wrist',     type: 'ellipse', cx: 31,  cy: 173, rx: 15, ry: 16 },
  { id: 'R. Wrist',      label: 'R. Wrist',     type: 'ellipse', cx: 129, cy: 173, rx: 15, ry: 16 },
  { id: 'L. Knee',       label: 'L. Knee',      type: 'ellipse', cx: 64,  cy: 253, rx: 19, ry: 18 },
  { id: 'R. Knee',       label: 'R. Knee',      type: 'ellipse', cx: 96,  cy: 253, rx: 19, ry: 18 },
  { id: 'L. Ankle',      label: 'L. Ankle',     type: 'ellipse', cx: 61,  cy: 322, rx: 18, ry: 14 },
  { id: 'R. Ankle',      label: 'R. Ankle',     type: 'ellipse', cx: 99,  cy: 322, rx: 18, ry: 14 },
];

const BACK_REGIONS = [
  { id: 'L. Shoulder',   label: 'L. Shoulder',  type: 'ellipse', cx: 44,  cy: 67,  rx: 20, ry: 16 },
  { id: 'R. Shoulder',   label: 'R. Shoulder',  type: 'ellipse', cx: 116, cy: 67,  rx: 20, ry: 16 },
  { id: 'Upper Back',    label: 'Upper Back',   type: 'rect',    x: 54,   y: 58,   width: 52, height: 44, rx: 6 },
  { id: 'Lower Back',    label: 'Lower Back',   type: 'rect',    x: 54,   y: 102,  width: 52, height: 38, rx: 6 },
  { id: 'Glutes',        label: 'Glutes',       type: 'rect',    x: 54,   y: 140,  width: 52, height: 28, rx: 6 },
  { id: 'L. Hamstring',  label: 'L. Hamstring', type: 'rect',    x: 53,   y: 168,  width: 22, height: 64, rx: 6 },
  { id: 'R. Hamstring',  label: 'R. Hamstring', type: 'rect',    x: 85,   y: 168,  width: 22, height: 64, rx: 6 },
  { id: 'L. Calf',       label: 'L. Calf',      type: 'rect',    x: 51,   y: 240,  width: 20, height: 66, rx: 6 },
  { id: 'R. Calf',       label: 'R. Calf',      type: 'rect',    x: 83,   y: 240,  width: 20, height: 66, rx: 6 },
  { id: 'L. Elbow',      label: 'L. Elbow',     type: 'ellipse', cx: 34,  cy: 124, rx: 16, ry: 16 },
  { id: 'R. Elbow',      label: 'R. Elbow',     type: 'ellipse', cx: 126, cy: 124, rx: 16, ry: 16 },
];

function BodyZone({ region, selected, onClick }) {
  const [hovered, setHovered] = useState(false);
  const isSelected = selected === region.id;
  const fill = isSelected ? '#1E3A5F' : hovered ? '#93C5FD' : 'transparent';
  const opacity = isSelected ? 0.75 : hovered ? 0.5 : 0;
  const sharedProps = {
    fill,
    fillOpacity: opacity,
    stroke: isSelected ? '#1E3A5F' : '#94A3B8',
    strokeWidth: isSelected ? 2 : 1,
    strokeDasharray: isSelected ? 'none' : '3 2',
    style: { cursor: 'pointer', transition: 'fill-opacity 0.15s' },
    onClick: () => onClick(region.id),
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  };

  if (region.type === 'ellipse') {
    return <ellipse cx={region.cx} cy={region.cy} rx={region.rx} ry={region.ry} {...sharedProps} />;
  }
  return <rect x={region.x} y={region.y} width={region.width} height={region.height} rx={region.rx || 0} {...sharedProps} />;
}

// Simple humanoid silhouette paths (fill with light gray, no interaction)
function BodySilhouette() {
  const fill = '#E2E8F0';
  const stroke = '#CBD5E0';
  const sw = 1;
  return (
    <g pointerEvents="none">
      {/* Head */}
      <ellipse cx="80" cy="27" rx="22" ry="24" fill={fill} stroke={stroke} strokeWidth={sw} />
      {/* Neck */}
      <rect x="73" y="49" width="14" height="12" rx="3" fill={fill} stroke={stroke} strokeWidth={sw} />
      {/* Left shoulder */}
      <ellipse cx="47" cy="67" rx="17" ry="12" fill={fill} stroke={stroke} strokeWidth={sw} />
      {/* Right shoulder */}
      <ellipse cx="113" cy="67" rx="17" ry="12" fill={fill} stroke={stroke} strokeWidth={sw} />
      {/* Torso */}
      <rect x="55" y="60" width="50" height="108" rx="6" fill={fill} stroke={stroke} strokeWidth={sw} />
      {/* Left upper arm */}
      <rect x="29" y="62" width="17" height="52" rx="6" fill={fill} stroke={stroke} strokeWidth={sw} />
      {/* Right upper arm */}
      <rect x="114" y="62" width="17" height="52" rx="6" fill={fill} stroke={stroke} strokeWidth={sw} />
      {/* Left forearm */}
      <rect x="27" y="116" width="14" height="50" rx="6" fill={fill} stroke={stroke} strokeWidth={sw} />
      {/* Right forearm */}
      <rect x="119" y="116" width="14" height="50" rx="6" fill={fill} stroke={stroke} strokeWidth={sw} />
      {/* Left hand */}
      <ellipse cx="32" cy="173" rx="11" ry="14" fill={fill} stroke={stroke} strokeWidth={sw} />
      {/* Right hand */}
      <ellipse cx="128" cy="173" rx="11" ry="14" fill={fill} stroke={stroke} strokeWidth={sw} />
      {/* Left thigh */}
      <rect x="55" y="168" width="22" height="72" rx="6" fill={fill} stroke={stroke} strokeWidth={sw} />
      {/* Right thigh */}
      <rect x="83" y="168" width="22" height="72" rx="6" fill={fill} stroke={stroke} strokeWidth={sw} />
      {/* Left shin */}
      <rect x="53" y="242" width="20" height="72" rx="6" fill={fill} stroke={stroke} strokeWidth={sw} />
      {/* Right shin */}
      <rect x="81" y="242" width="20" height="72" rx="6" fill={fill} stroke={stroke} strokeWidth={sw} />
      {/* Left foot */}
      <ellipse cx="60" cy="320" rx="16" ry="10" fill={fill} stroke={stroke} strokeWidth={sw} />
      {/* Right foot */}
      <ellipse cx="88" cy="320" rx="16" ry="10" fill={fill} stroke={stroke} strokeWidth={sw} />
    </g>
  );
}

export default function BodyMap({ selected, onSelect }) {
  const [view, setView] = useState('front');
  const regions = view === 'front' ? FRONT_REGIONS : BACK_REGIONS;

  return (
    <div>
      {/* Front / Back toggle */}
      <div className="flex gap-2 mb-3">
        {['front', 'back'].map((v) => (
          <button
            key={v}
            onClick={() => { setView(v); onSelect(''); }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors capitalize ${
              view === v ? 'bg-navy text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {v === 'front' ? '⬆ Front' : '⬇ Back'}
          </button>
        ))}
      </div>

      {/* SVG body map */}
      <div className="flex justify-center">
        <svg
          viewBox="0 0 160 340"
          width="180"
          height="382"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block' }}
        >
          <BodySilhouette />
          {regions.map((region) => (
            <BodyZone
              key={region.id + view}
              region={region}
              selected={selected}
              onClick={onSelect}
            />
          ))}
        </svg>
      </div>

      {/* Selected label */}
      <div className="text-center mt-2 min-h-[1.5rem]">
        {selected ? (
          <span className="inline-block bg-navy text-white text-xs font-semibold px-3 py-1 rounded-full">
            {selected}
          </span>
        ) : (
          <span className="text-xs text-gray-400">Tap a body part above</span>
        )}
      </div>
    </div>
  );
}
