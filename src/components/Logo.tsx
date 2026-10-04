export function Logo({ width = 45, height = 45, showText = true }: { width?: number, height?: number, showText?: boolean }) {
  const isCompact = width <= 32;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: isCompact ? '9px' : '12px', userSelect: 'none', flexShrink: 0 }}>
      <svg width={width} height={height} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
        {/* Large Square Outline */}
        <rect x="12" y="22" width="40" height="40" stroke="#F4B304" strokeWidth="5" />
        {/* Small Filled Square (Top Right) */}
        <rect x="42" y="10" width="12" height="12" fill="#F4B304" />
      </svg>
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: '1', whiteSpace: 'nowrap' }}>
          <span style={{ 
            fontSize: isCompact ? '1.05rem' : '1.2rem', 
            fontWeight: 800, 
            letterSpacing: isCompact ? '1.5px' : '2px', 
            color: '#fff', 
            fontFamily: 'var(--font-outfit), sans-serif' 
          }}>
            ROBO<span style={{ color: '#F4B304' }}>BEE</span>
          </span>
          <span style={{ 
            fontSize: isCompact ? '0.62rem' : '0.7rem', 
            fontWeight: 600, 
            letterSpacing: isCompact ? '3px' : '4px', 
            color: 'rgba(255, 255, 255, 0.85)', 
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

