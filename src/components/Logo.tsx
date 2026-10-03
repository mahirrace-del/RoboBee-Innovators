export function Logo({ width = 45, height = 45, showText = true }: { width?: number, height?: number, showText?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <svg width={width} height={height} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Large Square Outline */}
        <rect x="12" y="22" width="40" height="40" stroke="#F4B304" strokeWidth="5" />
        {/* Small Filled Square (Top Right) */}
        <rect x="42" y="10" width="12" height="12" fill="#F4B304" />
      </svg>
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: '1' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '2px', color: '#fff', fontFamily: 'sans-serif' }}>
            ROBO<span style={{ color: '#F4B304' }}>BEE</span>
          </span>
          <span style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '4px', color: '#fff', marginTop: '4px', fontFamily: 'sans-serif' }}>
            INNOVATORS
          </span>
        </div>
      )}
    </div>
  );
}
