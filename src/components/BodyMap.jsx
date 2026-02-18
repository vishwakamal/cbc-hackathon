import { useState } from 'react';

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

// selected is now string[] — a zone is highlighted if its id is in the array
function BodyZone({ region, selected, onToggle }) {
  const [hovered, setHovered] = useState(false);
  const isSelected = selected.includes(region.id);

  const fill    = isSelected ? '#E53E3E' : hovered ? '#93C5FD' : 'transparent';
  const opacity = isSelected ? 0.65      : hovered ? 0.4       : 0;
  const stroke  = isSelected ? '#C53030' : '#94A3B8';

  const sharedProps = {
    fill,
    fillOpacity: opacity,
    stroke,
    strokeWidth: isSelected ? 2 : 1,
    strokeDasharray: isSelected ? 'none' : '3 2',
    style: { cursor: 'pointer', transition: 'fill-opacity 0.12s, fill 0.12s' },
    onClick: () => onToggle(region.id),
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  };

  if (region.type === 'ellipse') {
    return <ellipse cx={region.cx} cy={region.cy} rx={region.rx} ry={region.ry} {...sharedProps} />;
  }
  return <rect x={region.x} y={region.y} width={region.width} height={region.height} rx={region.rx || 0} {...sharedProps} />;
}

function BodySilhouette() {
  const f  = 'var(--body-fill)';
  const s  = 'var(--body-stroke)';
  const sw = 1.2;

  return (
    <g pointerEvents="none">
      <ellipse cx="80" cy="27" rx="21" ry="23" fill={f} stroke={s} strokeWidth={sw} />
      <polygon points="75,49 85,49 87,62 73,62" fill={f} stroke={s} strokeWidth={sw} />
      <polygon points="73,62 87,62 115,68 111,104 108,132 110,168 50,168 52,132 49,104 45,68" fill={f} stroke={s} strokeWidth={sw} />
      <polygon points="30,66 46,66 43,128 31,128" fill={f} stroke={s} strokeWidth={sw} />
      <polygon points="114,66 130,66 129,128 117,128" fill={f} stroke={s} strokeWidth={sw} />
      <polygon points="30,130 43,130 41,174 28,174" fill={f} stroke={s} strokeWidth={sw} />
      <polygon points="117,130 130,130 132,174 119,174" fill={f} stroke={s} strokeWidth={sw} />
      <ellipse cx="34" cy="183" rx="12" ry="13" fill={f} stroke={s} strokeWidth={sw} />
      <ellipse cx="126" cy="183" rx="12" ry="13" fill={f} stroke={s} strokeWidth={sw} />
      <polygon points="51,170 79,170 77,242 53,242" fill={f} stroke={s} strokeWidth={sw} />
      <polygon points="81,170 109,170 107,242 83,242" fill={f} stroke={s} strokeWidth={sw} />
      <polygon points="52,244 76,244 72,316 56,316" fill={f} stroke={s} strokeWidth={sw} />
      <polygon points="84,244 108,244 104,316 88,316" fill={f} stroke={s} strokeWidth={sw} />
      <ellipse cx="63" cy="322" rx="18" ry="10" fill={f} stroke={s} strokeWidth={sw} />
      <ellipse cx="97" cy="322" rx="18" ry="10" fill={f} stroke={s} strokeWidth={sw} />
    </g>
  );
}

// selected: string[]  onToggle(id): adds if absent, removes if present  onClearAll(): clears all
export default function BodyMap({ selected, onToggle, onClearAll }) {
  const [view, setView] = useState('front');
  const regions = view === 'front' ? FRONT_REGIONS : BACK_REGIONS;

  const handleViewChange = (v) => {
    setView(v);
    onClearAll();
  };

  return (
    <div>
      {/* Front / Back toggle */}
      <div className="flex gap-2 mb-3">
        {['front', 'back'].map((v) => (
          <button
            key={v}
            onClick={() => handleViewChange(v)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors capitalize coach:py-2.5 coach:text-sm ${
              view === v
                ? 'bg-navy text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
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
          className="w-[160px] sm:w-[190px]"
          style={{ height: 'auto', display: 'block' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <BodySilhouette />
          {regions.map((region) => (
            <BodyZone
              key={region.id + view}
              region={region}
              selected={selected}
              onToggle={onToggle}
            />
          ))}
        </svg>
      </div>

      {/* Selected parts chips + clear button */}
      <div className="mt-3 min-h-[2rem]">
        {selected.length === 0 ? (
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center coach:text-sm">
            Tap one or more body parts above
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5 justify-center items-center">
            {selected.map((id) => (
              <button
                key={id}
                onClick={() => onToggle(id)}
                className="inline-flex items-center gap-1 bg-red text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm hover:bg-red/80 transition-colors coach:text-sm coach:px-3 coach:py-1.5"
                title={`Tap to deselect ${id}`}
              >
                {id}
                <span className="opacity-75 font-normal text-[10px]">✕</span>
              </button>
            ))}
            {selected.length > 1 && (
              <button
                onClick={onClearAll}
                className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 underline ml-1 coach:text-sm"
              >
                Clear all
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
