function LoaderCharacter() {
  return (
    <svg
      className="loader-char"
      viewBox="0 0 220 220"
      width="140"
      height="140"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Floating code symbols */}
      <text className="loader-char-float loader-char-float1" x="18" y="60" fontSize="20" fill="#21E024">{'</>'}</text>
      <text className="loader-char-float loader-char-float2" x="170" y="50" fontSize="18" fill="#21E024">{'{ }'}</text>
      <text className="loader-char-float loader-char-float3" x="150" y="185" fontSize="16" fill="#21E024">;</text>

      <g className="loader-char-bob">
        {/* Antenna */}
        <line x1="110" y1="48" x2="110" y2="30" stroke="#21E024" strokeWidth="3" />
        <circle className="loader-char-pulse" cx="110" cy="24" r="6" fill="#21E024" />

        {/* Head */}
        <rect x="70" y="48" width="80" height="60" rx="18" fill="#0d0d0d" stroke="#21E024" strokeWidth="3" />
        <rect className="loader-char-eye" x="88" y="72" width="10" height="14" rx="4" fill="#21E024" />
        <rect className="loader-char-eye" x="122" y="72" width="10" height="14" rx="4" fill="#21E024" />

        {/* Body */}
        <rect x="60" y="112" width="100" height="60" rx="16" fill="#0d0d0d" stroke="#21E024" strokeWidth="3" />

        {/* Arms typing */}
        <rect className="loader-char-arm loader-char-arm-left" x="38" y="128" width="26" height="10" rx="5" fill="#21E024" />
        <rect className="loader-char-arm loader-char-arm-right" x="156" y="128" width="26" height="10" rx="5" fill="#21E024" />

        {/* Laptop */}
        <rect x="78" y="150" width="64" height="8" rx="2" fill="#21E024" />
        <rect x="86" y="130" width="48" height="24" rx="3" fill="#0d0d0d" stroke="#21E024" strokeWidth="2" />
        <rect className="loader-char-screen" x="90" y="134" width="40" height="16" rx="2" fill="#21E024" />
      </g>
    </svg>
  );
}

export default LoaderCharacter;
