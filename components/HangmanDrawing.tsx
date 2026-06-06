interface HangmanDrawingProps {
  stage: number;
  maxStages: number;
}

export default function HangmanDrawing({ stage, maxStages }: HangmanDrawingProps) {
  const progress = stage / maxStages;

  return (
    <div className="relative w-full aspect-square max-w-[220px] mx-auto">
      <svg viewBox="0 0 250 280" className="w-full h-full drop-shadow-lg">
        {/* Base */}
        <line x1="40" y1="260" x2="210" y2="260" stroke="#4a5568" strokeWidth="6" strokeLinecap="round" />
        <line x1="170" y1="260" x2="170" y2="30" stroke="#4a5568" strokeWidth="6" strokeLinecap="round" />
        <line x1="170" y1="30" x2="70" y2="30" stroke="#4a5568" strokeWidth="6" strokeLinecap="round" />
        <line x1="70" y1="30" x2="70" y2="60" stroke="#4a5568" strokeWidth="6" strokeLinecap="round" />

        {/* Rope */}
        {stage >= 1 && (
          <line x1="70" y1="60" x2="70" y2="90" stroke="#718096" strokeWidth="3" strokeLinecap="round" className="animate-fadeIn" />
        )}

        {/* Head */}
        {stage >= 2 && (
          <circle cx="70" cy="110" r="20" fill="none" stroke="#e2e8f0" strokeWidth="4" className="animate-fadeIn" />
        )}

        {/* Eyes */}
        {stage >= 3 && (
          <>
            <circle cx="63" cy="107" r="2.5" fill="#e2e8f0" className="animate-fadeIn" />
            <circle cx="77" cy="107" r="2.5" fill="#e2e8f0" className="animate-fadeIn" />
            <line x1="58" y1="117" x2="82" y2="117" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" className="animate-fadeIn" />
          </>
        )}

        {/* Body */}
        {stage >= 4 && (
          <line x1="70" y1="130" x2="70" y2="190" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" className="animate-fadeIn" />
        )}

        {/* Left arm */}
        {stage >= 5 && (
          <line x1="70" y1="145" x2="40" y2="170" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" className="animate-fadeIn" />
        )}

        {/* Right arm */}
        {stage >= 6 && (
          <line x1="70" y1="145" x2="100" y2="170" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" className="animate-fadeIn" />
        )}

        {/* Left leg */}
        {stage >= 7 && (
          <line x1="70" y1="190" x2="45" y2="230" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" className="animate-fadeIn" />
        )}

        {/* Right leg */}
        {stage >= 8 && (
          <line x1="70" y1="190" x2="95" y2="230" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" className="animate-fadeIn" />
        )}

        {/* Danger indicator */}
        {stage > 0 && (
          <>
            <rect x="15" y="5" width="40" height="18" rx="4" fill={progress > 0.66 ? '#ef4444' : progress > 0.33 ? '#f59e0b' : '#22c55e'} />
            <text x="35" y="18" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
              {stage}/{maxStages}
            </text>
          </>
        )}
      </svg>
    </div>
  );
}
