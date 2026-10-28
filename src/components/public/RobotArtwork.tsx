import React from "react";

export function RobotArtwork() {
  return (
    <svg aria-hidden="true" className="robotFallback" viewBox="0 0 620 480" role="presentation">
      <defs>
        <linearGradient id="roverHull" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#ffd66e" />
          <stop offset=".48" stopColor="#e5a62f" />
          <stop offset="1" stopColor="#bd7626" />
        </linearGradient>
        <linearGradient id="roverFace" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#4b4640" />
          <stop offset="1" stopColor="#242524" />
        </linearGradient>
        <linearGradient id="roverTread" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#4a4a45" />
          <stop offset="1" stopColor="#222424" />
        </linearGradient>
        <radialGradient id="roverEye" cx="35%" cy="25%" r="80%">
          <stop offset="0" stopColor="#f6bd53" />
          <stop offset=".45" stopColor="#bf7430" />
          <stop offset="1" stopColor="#593b2b" />
        </radialGradient>
        <filter id="roverShadow" x="-35%" y="-35%" width="170%" height="190%">
          <feDropShadow dx="0" dy="13" stdDeviation="12" floodColor="#503a2c" floodOpacity=".2" />
        </filter>
      </defs>

      {/* A few quiet lab marks keep the illustration in the same visual language. */}
      <g fill="none" stroke="#b85e60" strokeLinecap="round" opacity=".26">
        <circle cx="130" cy="177" r="31" strokeWidth="2" />
        <circle cx="130" cy="177" r="17" strokeWidth="2" />
        <path d="M130 134v86M87 177h86" strokeWidth="2" />
        <path d="M441 132h73m-53 13h53" strokeWidth="2" />
      </g>
      <g fill="#c89532" opacity=".82">
        <circle cx="453" cy="178" r="4" /><circle cx="466" cy="178" r="4" /><circle cx="479" cy="178" r="4" />
        <circle cx="165" cy="270" r="4" /><circle cx="178" cy="270" r="4" />
        <path d="m478 263 3 8 8 3-8 3-3 8-3-8-8-3 8-3z" />
      </g>

      <ellipse cx="310" cy="390" rx="142" ry="18" fill="#6b3f39" opacity=".11" />
      <ellipse cx="310" cy="373" rx="143" ry="13" fill="none" stroke="#d6a637" strokeWidth="2" opacity=".62" />

      <g filter="url(#roverShadow)" strokeLinejoin="round">
        {/* Tank tracks with small rollers and raised tread pads. */}
        <rect x="155" y="308" width="137" height="75" rx="35" fill="url(#roverTread)" stroke="#171919" strokeWidth="5" />
        <rect x="328" y="308" width="137" height="75" rx="35" fill="url(#roverTread)" stroke="#171919" strokeWidth="5" />
        <path d="M173 315v12m19-15v12m20-12v12m20-12v12m20-9v12m-79 36v11m20-11v13m20-13v13m20-13v13m20-12v11" fill="none" stroke="#8e8c7e" strokeWidth="4" strokeLinecap="round" opacity=".72" />
        <path d="M346 315v12m20-15v12m20-12v12m20-12v12m20-9v12m-80 36v11m20-11v13m20-13v13m20-13v13m20-12v11" fill="none" stroke="#8e8c7e" strokeWidth="4" strokeLinecap="round" opacity=".72" />
        <circle cx="187" cy="346" r="17" fill="#b47832" stroke="#dba84e" strokeWidth="4" />
        <circle cx="254" cy="346" r="17" fill="#b47832" stroke="#dba84e" strokeWidth="4" />
        <circle cx="366" cy="346" r="17" fill="#b47832" stroke="#dba84e" strokeWidth="4" />
        <circle cx="433" cy="346" r="17" fill="#b47832" stroke="#dba84e" strokeWidth="4" />
        <circle cx="187" cy="346" r="6" fill="#343433" />
        <circle cx="254" cy="346" r="6" fill="#343433" />
        <circle cx="366" cy="346" r="6" fill="#343433" />
        <circle cx="433" cy="346" r="6" fill="#343433" />

        {/* Chunky rounded yellow chassis and its little service panel. */}
        <rect x="218" y="197" width="184" height="151" rx="24" fill="url(#roverHull)" stroke="#a86b25" strokeWidth="4" />
        <path d="M236 211q74-25 148 0" fill="none" stroke="#fff0b0" strokeWidth="7" strokeLinecap="round" opacity=".6" />
        <rect x="247" y="260" width="126" height="66" rx="12" fill="#8b5734" stroke="#684329" strokeWidth="3" />
        <rect x="255" y="267" width="110" height="53" rx="8" fill="#c7892c" />
        <path d="M278 277h63m-63 9h63m-63 9h63m-63 9h63" stroke="#493c32" strokeWidth="4" strokeLinecap="round" opacity=".8" />
        <rect x="236" y="229" width="34" height="13" rx="6" fill="#ffe08a" opacity=".85" />
        <rect x="350" y="229" width="34" height="13" rx="6" fill="#ffe08a" opacity=".85" />
        <circle cx="235" cy="202" r="4" fill="#ffe2a0" />
        <circle cx="385" cy="202" r="4" fill="#ffe2a0" />
        <circle cx="235" cy="339" r="4" fill="#ffe2a0" />
        <circle cx="385" cy="339" r="4" fill="#ffe2a0" />

        {/* Jointed arms; the raised gripper gives the rover a friendly wave. */}
        <path d="M221 239q-31 1-45 24l-15 27q-5 10 5 15t16-5l18-28 29-8" fill="none" stroke="#965d34" strokeWidth="15" strokeLinecap="round" />
        <path d="M220 239q-29 5-41 27l-15 25" fill="none" stroke="#e8ae48" strokeWidth="7" strokeLinecap="round" />
        <circle cx="158" cy="306" r="13" fill="#464541" stroke="#aaa28e" strokeWidth="4" />
        <path d="M399 239q28-7 45-29l16-23q6-9 15-4t4 15l-18 30q-19 28-48 34" fill="none" stroke="#965d34" strokeWidth="15" strokeLinecap="round" />
        <path d="M402 238q28-5 43-25l16-23" fill="none" stroke="#e8ae48" strokeWidth="7" strokeLinecap="round" />
        <circle cx="475" cy="181" r="13" fill="#464541" stroke="#aaa28e" strokeWidth="4" />
        <path d="M468 170l-5-10m16 8 2-12m5 18 10-4" fill="none" stroke="#464541" strokeWidth="5" strokeLinecap="round" />

        {/* Neck and head mount. */}
        <rect x="295" y="166" width="30" height="42" rx="9" fill="#51514c" stroke="#383a38" strokeWidth="3" />
        <rect x="287" y="188" width="46" height="12" rx="6" fill="#a16a3f" />
        <path d="M304 168v-22m12 22v-22" stroke="#d3a34a" strokeWidth="7" strokeLinecap="round" />

        {/* Twin brass binocular eyes with glossy pupils and warm highlights. */}
        <rect x="218" y="103" width="184" height="79" rx="34" fill="url(#roverHull)" stroke="#a86b25" strokeWidth="4" />
        <path d="M237 111q73-17 146 0" fill="none" stroke="#fff0b0" strokeWidth="5" strokeLinecap="round" opacity=".72" />
        <rect x="232" y="115" width="75" height="52" rx="23" fill="#c78d35" stroke="#8c5a2e" strokeWidth="3" />
        <rect x="313" y="115" width="75" height="52" rx="23" fill="#c78d35" stroke="#8c5a2e" strokeWidth="3" />
        <circle cx="269" cy="141" r="23" fill="#9b6736" stroke="#f3c05b" strokeWidth="5" />
        <circle cx="350" cy="141" r="23" fill="#9b6736" stroke="#f3c05b" strokeWidth="5" />
        <circle cx="269" cy="141" r="17" fill="url(#roverFace)" />
        <circle cx="350" cy="141" r="17" fill="url(#roverFace)" />
        <circle cx="275" cy="142" r="8" fill="url(#roverEye)" />
        <circle cx="356" cy="142" r="8" fill="url(#roverEye)" />
        <circle cx="277" cy="140" r="4" fill="#24211f" />
        <circle cx="358" cy="140" r="4" fill="#24211f" />
        <circle cx="271" cy="136" r="3" fill="#fff7df" />
        <circle cx="352" cy="136" r="3" fill="#fff7df" />
        <path d="M307 139h7" stroke="#82542f" strokeWidth="9" strokeLinecap="round" />
        <circle cx="227" cy="145" r="5" fill="#ffe08a" />
        <circle cx="393" cy="145" r="5" fill="#ffe08a" />
      </g>
    </svg>
  );
}
