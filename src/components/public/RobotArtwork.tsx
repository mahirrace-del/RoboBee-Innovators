import React from "react";

export function RobotArtwork() {
  return (
    <svg
      aria-hidden="true"
      className="robotFallback"
      viewBox="0 0 620 480"
      role="presentation"
    >
      <defs>
        <linearGradient id="robotShell" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#7f2335" />
          <stop offset="1" stopColor="#42121d" />
        </linearGradient>
        <linearGradient id="robotGold" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#ffd76a" />
          <stop offset="1" stopColor="#c8870a" />
        </linearGradient>
        <filter id="robotShadow" x="-30%" y="-30%" width="160%" height="180%">
          <feDropShadow dx="0" dy="20" stdDeviation="16" floodColor="#34121c" floodOpacity=".2" />
        </filter>
      </defs>
      <ellipse cx="318" cy="405" rx="206" ry="34" fill="#38121d" opacity=".12" />
      <g filter="url(#robotShadow)" stroke="#42121d" strokeLinejoin="round" strokeWidth="5">
        <path d="M174 286 220 255 411 266 456 300 425 355 202 351 164 322Z" fill="#292a30" />
        <path d="m194 300 29-18 174 8 30 23-22 32-191-3-27-20Z" fill="url(#robotShell)" />
        <path d="m220 255 56-39 148 12-30 38Z" fill="#a34442" />
        <path d="m276 216 28-51 111 9 9 54Z" fill="url(#robotShell)" />
        <path d="m304 165 14-31 74 5 23 35Z" fill="url(#robotGold)" />
        <path d="m254 242 31-16 42 3-10 31-48-2Z" fill="url(#robotGold)" />
        <path d="m375 246 20-23 38 5-18 28Z" fill="#f3bc3a" />
        <path d="m170 305-41-14-16 14 42 28ZM443 316l48-10 9 19-54 16Z" fill="#383a42" />
        <path d="m151 304 25-2 6 50-24 5-15-18ZM435 329l25-4 5 43-22 4-15-15Z" fill="#17191e" />
        <circle cx="245" cy="314" r="13" fill="#ffdc77" stroke="none" />
        <circle cx="404" cy="319" r="13" fill="#ffdc77" stroke="none" />
        <path d="m264 332 127 5" stroke="#ffd76a" strokeLinecap="round" strokeWidth="7" />
      </g>
      <g fill="none" stroke="#a93442" strokeWidth="2" opacity=".35">
        <path d="M85 361h80m-54 16h54M433 110h90m-66 17h66" />
        <circle cx="119" cy="151" r="35" />
        <circle cx="119" cy="151" r="20" />
        <path d="M119 106v90m-45-45h90" />
      </g>
      <g fill="#d39a20">
        <circle cx="478" cy="162" r="5" />
        <circle cx="490" cy="162" r="5" />
        <circle cx="502" cy="162" r="5" />
        <circle cx="124" cy="248" r="4" />
        <circle cx="140" cy="248" r="4" />
      </g>
    </svg>
  );
}
