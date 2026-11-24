/**
 * 原创虚拟向导「小策」—— 纯 SVG 手绘，无外部图片依赖。
 * 青蓝长发 + 深蓝金饰旅行装 + 全息地图，呼应「出行决策」主题。
 */
export default function GuideCharacter({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 320 440"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="虚拟向导小策"
    >
      <defs>
        <linearGradient id="gHair" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0" stopColor="#7ee8e0" />
          <stop offset="0.45" stopColor="#3fb8c4" />
          <stop offset="1" stopColor="#1c6f8e" />
        </linearGradient>
        <linearGradient id="gHairLight" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#aef6f0" />
          <stop offset="1" stopColor="#4fc6cf" />
        </linearGradient>
        <linearGradient id="gCoat" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0" stopColor="#1c2b46" />
          <stop offset="1" stopColor="#0d1729" />
        </linearGradient>
        <linearGradient id="gGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe08a" />
          <stop offset="1" stopColor="#d79a24" />
        </linearGradient>
        <linearGradient id="gSkin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe6d2" />
          <stop offset="1" stopColor="#f2c6a8" />
        </linearGradient>
        <linearGradient id="gMap" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7ef0e642" />
          <stop offset="1" stopColor="#3fb8c41a" />
        </linearGradient>
        <radialGradient id="gGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#5fe0d855" />
          <stop offset="1" stopColor="#5fe0d800" />
        </radialGradient>
        <filter id="fGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* background aura */}
      <ellipse cx="160" cy="210" rx="150" ry="180" fill="url(#gGlow)" />

      {/* ===== back hair ===== */}
      <path d="M160 44 C96 44 74 96 78 158 C80 200 62 250 58 320 C56 356 66 392 80 420
               C96 396 104 360 108 330 L212 330 C216 360 224 396 240 420
               C254 392 264 356 262 320 C258 250 240 200 242 158 C246 96 224 44 160 44 Z"
            fill="url(#gHair)" />

      {/* side long locks */}
      <path d="M92 150 C70 210 74 300 88 372 C96 344 100 300 104 262 Z" fill="url(#gHair)" />
      <path d="M228 150 C250 210 246 300 232 372 C224 344 220 300 216 262 Z" fill="url(#gHair)" />

      {/* ===== body / coat ===== */}
      <path d="M160 236 C124 236 104 250 92 278 L70 372 L112 372 L120 440 L200 440 L208 372 L250 372 L228 278 C216 250 196 236 160 236 Z"
            fill="url(#gCoat)" stroke="#2a4566" strokeWidth="2" />

      {/* coat gold trim */}
      <path d="M160 240 L160 440" stroke="url(#gGold)" strokeWidth="2.5" opacity="0.85" />
      <path d="M138 246 L120 372 M182 246 L200 372" stroke="url(#gGold)" strokeWidth="1.4" opacity="0.5" />
      <path d="M92 300 C120 316 200 316 228 300" fill="none" stroke="url(#gGold)" strokeWidth="1.6" opacity="0.6" />

      {/* collar */}
      <path d="M132 246 L160 272 L188 246 L178 238 L160 254 L142 238 Z" fill="#e8eef6" opacity="0.9" />
      <path d="M160 272 L160 300" stroke="url(#gGold)" strokeWidth="3" />
      <circle cx="160" cy="300" r="6" fill="url(#gGold)" filter="url(#fGlow)" />

      {/* compass badge */}
      <circle cx="112" cy="296" r="13" fill="#0d1729" stroke="url(#gGold)" strokeWidth="2" />
      <path d="M112 286 L115 296 L125 296 L117 302 L120 312 L112 306 L104 312 L107 302 L99 296 L109 296 Z"
            fill="url(#gGold)" transform="translate(0 0) scale(0.55) translate(92 128)" opacity="0.9" />

      {/* ===== neck & face ===== */}
      <rect x="146" y="214" width="28" height="30" rx="10" fill="url(#gSkin)" />
      <ellipse cx="160" cy="166" rx="56" ry="62" fill="url(#gSkin)" />

      {/* ears */}
      <ellipse cx="104" cy="170" rx="8" ry="14" fill="url(#gSkin)" />
      <ellipse cx="216" cy="170" rx="8" ry="14" fill="url(#gSkin)" />

      {/* ===== eyes ===== */}
      <g>
        <ellipse cx="136" cy="172" rx="13" ry="16" fill="#ffffff" />
        <ellipse cx="184" cy="172" rx="13" ry="16" fill="#ffffff" />
        <ellipse cx="137" cy="174" rx="8" ry="12" fill="#1f8c9b" />
        <ellipse cx="185" cy="174" rx="8" ry="12" fill="#1f8c9b" />
        <ellipse cx="137" cy="175" rx="4" ry="8" fill="#0d3d52" />
        <ellipse cx="185" cy="175" rx="4" ry="8" fill="#0d3d52" />
        <circle cx="133" cy="168" r="3" fill="#ffffff" opacity="0.9" />
        <circle cx="181" cy="168" r="3" fill="#ffffff" opacity="0.9" />
        {/* eyelashes */}
        <path d="M122 166 Q136 156 150 166 M170 166 Q184 156 198 166"
              fill="none" stroke="#22303f" strokeWidth="2.6" strokeLinecap="round" />
        {/* brows */}
        <path d="M124 150 Q136 145 148 150 M172 150 Q184 145 196 150"
              fill="none" stroke="#2e7d88" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* nose & smile */}
      <path d="M158 190 Q160 194 163 190" fill="none" stroke="#d9a889" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M148 200 Q160 210 172 200" fill="none" stroke="#c96b63" strokeWidth="2.2" strokeLinecap="round" />
      <ellipse cx="128" cy="196" rx="7" ry="3.5" fill="#ff9d92" opacity="0.35" />
      <ellipse cx="192" cy="196" rx="7" ry="3.5" fill="#ff9d92" opacity="0.35" />

      {/* ===== front hair / bangs ===== */}
      <path d="M160 44 C106 44 80 86 84 138 C88 120 96 108 108 102 C112 118 122 128 132 132
               C126 114 130 96 140 88 C142 108 152 122 162 128 C160 110 166 94 178 86
               C176 108 184 124 196 132 C192 116 196 104 204 98 C216 108 232 120 238 140
               C242 88 216 44 160 44 Z"
            fill="url(#gHairLight)" />
      <path d="M104 102 C96 132 92 170 96 200 L108 194 C106 166 110 130 118 112 Z" fill="url(#gHairLight)" />
      <path d="M216 102 C224 132 228 170 224 200 L212 194 C214 166 210 130 202 112 Z" fill="url(#gHairLight)" />

      {/* hair clip - compass star */}
      <g transform="translate(214 118)">
        <circle r="10" fill="#0d1729" stroke="url(#gGold)" strokeWidth="1.6" />
        <path d="M0 -7 L2 -2 L7 0 L2 2 L0 7 L-2 2 L-7 0 L-2 -2 Z" fill="url(#gGold)" filter="url(#fGlow)" />
      </g>

      {/* ===== holographic map in hand ===== */}
      <g transform="translate(196 330) rotate(-8)">
        <rect x="0" y="0" width="70" height="52" rx="5" fill="url(#gMap)" stroke="#7ef0e6" strokeWidth="1.2" opacity="0.9" />
        <path d="M8 40 L24 24 L38 34 L54 14 L64 22" fill="none" stroke="#9ff6ee" strokeWidth="1.6" opacity="0.9" />
        <circle cx="24" cy="24" r="3" fill="#f5c842" filter="url(#fGlow)" />
        <circle cx="54" cy="14" r="3" fill="#f5c842" filter="url(#fGlow)" />
        <path d="M14 12 L20 12 M14 16 L26 16" stroke="#7ef0e6" strokeWidth="1" opacity="0.6" />
      </g>

      {/* hand */}
      <ellipse cx="196" cy="332" rx="10" ry="7" fill="url(#gSkin)" transform="rotate(-18 196 332)" />

      {/* floating sparkles */}
      <g fill="#f5c842" opacity="0.85">
        <circle cx="60" cy="120" r="2.5" filter="url(#fGlow)" />
        <circle cx="268" cy="180" r="2" filter="url(#fGlow)" />
        <circle cx="72" cy="250" r="1.8" />
        <circle cx="252" cy="96" r="1.6" />
      </g>
      <g fill="#7ef0e6" opacity="0.7">
        <circle cx="90" cy="70" r="2" />
        <circle cx="240" cy="240" r="2.2" />
        <circle cx="52" cy="200" r="1.5" />
      </g>
    </svg>
  );
}
