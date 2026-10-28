export function Logo({
  width = 36,
  height = 36,
  showText = true,
  variant = "light",
}: {
  width?: number;
  height?: number;
  showText?: boolean;
  variant?: "light" | "dark" | "default";
}) {
  const isCompact = width <= 32;
  const isLight = variant === "light";

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: isCompact ? '9px' : '11px', userSelect: 'none', flexShrink: 0 }}>
      {/* Official RoboBee Golden Bee Emblem */}
      <svg width={width} height={height} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
        {/* Antennae */}
        <path d="M43 20C39 13 32 12 30 13" stroke="#C99225" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M57 20C61 13 68 12 70 13" stroke="#C99225" strokeWidth="4.5" strokeLinecap="round" />
        {/* Head */}
        <circle cx="50" cy="25" r="9" fill="#C99225" />
        {/* Upper Left Wing */}
        <path d="M43 36C26 24 10 34 16 50C21 61 38 51 45 46Z" fill="#C99225" fillOpacity="0.25" stroke="#C99225" strokeWidth="3.5" strokeLinejoin="round" />
        {/* Lower Left Wing */}
        <path d="M41 49C24 45 13 57 21 69C27 77 40 63 43 56Z" fill="#C99225" fillOpacity="0.18" stroke="#C99225" strokeWidth="3" strokeLinejoin="round" />
        {/* Upper Right Wing */}
        <path d="M57 36C74 24 90 34 84 50C79 61 62 51 55 46Z" fill="#C99225" fillOpacity="0.25" stroke="#C99225" strokeWidth="3.5" strokeLinejoin="round" />
        {/* Lower Right Wing */}
        <path d="M59 49C76 45 87 57 79 69C73 77 60 63 57 56Z" fill="#C99225" fillOpacity="0.18" stroke="#C99225" strokeWidth="3" strokeLinejoin="round" />
        {/* Body Segments (Gold & Charcoal Striped) */}
        <rect x="42" y="36" width="16" height="10" rx="5" fill="#C99225" />
        <rect x="40" y="48" width="20" height="9" rx="4.5" fill={isLight ? "#1F1C19" : "#302B24"} />
        <rect x="42" y="59" width="16" height="9" rx="4.5" fill="#C99225" />
        <path d="M44 70L50 82L56 70Z" fill={isLight ? "#1F1C19" : "#302B24"} />
      </svg>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: '1', whiteSpace: 'nowrap' }}>
          <span style={{ 
            fontSize: isCompact ? '1.05rem' : '1.18rem', 
            fontWeight: 850, 
            letterSpacing: '1.8px', 
            color: isLight ? '#1F1C19' : '#fff', 
            fontFamily: 'var(--font-outfit), sans-serif' 
          }}>
            ROBO<span style={{ color: '#C99225' }}>BEE</span>
          </span>
          <span style={{ 
            fontSize: isCompact ? '0.62rem' : '0.68rem', 
            fontWeight: 750, 
            letterSpacing: '3.5px', 
            color: '#C99225', 
            marginTop: '3px', 
            fontFamily: 'var(--font-outfit), sans-serif' 
          }}>
            INNOVATORS
          </span>
        </div>
      )}
    </div>
  );
}
