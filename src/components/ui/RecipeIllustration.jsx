/**
 * Hand-crafted SVG illustrations per recipe. Each is a small component
 * rendering a stylized scene of the dish. Uses viewBox 0 0 400 300 (4:3);
 * outer SVG uses preserveAspectRatio="xMidYMid slice" so it fills any
 * container ratio (card thumbnails, 16:9 heroes, picker swatches).
 */

function Wrap({ bg, children, ...rest }) {
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full block"
      aria-hidden
      {...rest}
    >
      <defs>
        <linearGradient id={`bg-${rest.id ?? Math.random()}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={bg[0]} />
          <stop offset="100%" stopColor={bg[1]} />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#bg-${rest.id ?? ''})`} />
      {/* Soft noise-like stipples */}
      {children}
    </svg>
  )
}

/* ═══════════════════════ 1. Bolognese ═══════════════════════ */
export function IllBolognese() {
  return (
    <Wrap id="bolo" bg={['#F4C1A4', '#C87D5A']}>
      {/* Plate */}
      <ellipse cx="200" cy="170" rx="150" ry="90" fill="#F5EDD8" opacity="0.95" />
      <ellipse cx="200" cy="168" rx="135" ry="78" fill="#FFF8EA" />
      {/* Sauce pool */}
      <ellipse cx="200" cy="172" rx="105" ry="55" fill="#9B2C2C" opacity="0.75" />
      {/* Pasta strands */}
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          d={`M ${120 + i * 30} ${130 + i * 10} Q ${200 + i * 5} ${100 + i * 8}, ${260 + i * 20} ${150 + i * 5}`}
          stroke="#F2D792"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
          opacity="0.95"
        />
      ))}
      {/* Parmesan dots */}
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx={160 + i * 35} cy={150 + (i % 2) * 15} r="3" fill="#F5EDD8" />
      ))}
      {/* Basil */}
      <ellipse cx="230" cy="140" rx="12" ry="6" fill="#3E5A3C" transform="rotate(-20 230 140)" />
      <ellipse cx="175" cy="145" rx="10" ry="5" fill="#5A7A47" transform="rotate(15 175 145)" />
      {/* Steam */}
      <path d="M 170 90 Q 180 70 175 50" stroke="#fff" strokeWidth="3" fill="none" opacity="0.4" strokeLinecap="round" />
      <path d="M 220 90 Q 215 65 225 45" stroke="#fff" strokeWidth="3" fill="none" opacity="0.4" strokeLinecap="round" />
    </Wrap>
  )
}

/* ═══════════════════════ 2. Aglio e Olio ═══════════════════════ */
export function IllAglio() {
  return (
    <Wrap id="aglio" bg={['#F4E4C1', '#E89B6B']}>
      {/* Plate */}
      <ellipse cx="200" cy="170" rx="145" ry="85" fill="#FFF8EA" />
      <ellipse cx="200" cy="168" rx="130" ry="72" fill="#FFFCF0" />
      {/* Spaghetti nest */}
      {[...Array(14)].map((_, i) => {
        const angle = (i / 14) * Math.PI * 2
        const r1 = 50 + (i % 3) * 15
        const r2 = 70 + (i % 2) * 10
        const x1 = 200 + Math.cos(angle) * r1
        const y1 = 165 + Math.sin(angle) * r1 * 0.55
        const x2 = 200 + Math.cos(angle + 1.2) * r2
        const y2 = 165 + Math.sin(angle + 1.2) * r2 * 0.55
        return (
          <path
            key={i}
            d={`M ${x1} ${y1} Q ${200 + Math.cos(angle) * 20} ${165 - 15}, ${x2} ${y2}`}
            stroke="#F2D077"
            strokeWidth="3.5"
            fill="none"
            opacity="0.9"
            strokeLinecap="round"
          />
        )
      })}
      {/* Garlic cloves */}
      <ellipse cx="150" cy="195" rx="14" ry="18" fill="#FAF0D4" stroke="#D4BC7C" strokeWidth="1" />
      <ellipse cx="248" cy="200" rx="13" ry="17" fill="#FAF0D4" stroke="#D4BC7C" strokeWidth="1" />
      {/* Red chili */}
      <path d="M 260 135 Q 285 125, 300 145 Q 295 155, 270 150 Z" fill="#C44735" />
      <path d="M 258 135 L 252 128" stroke="#5A7A47" strokeWidth="3" strokeLinecap="round" />
      {/* Parsley specks */}
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={150 + i * 28} cy={155 + (i % 2) * 12} r="2.5" fill="#3E5A3C" />
      ))}
    </Wrap>
  )
}

/* ═══════════════════════ 3. Shakshuka ═══════════════════════ */
export function IllShakshuka() {
  return (
    <Wrap id="shak" bg={['#E89735', '#C44735']}>
      {/* Cast iron pan */}
      <circle cx="200" cy="165" r="125" fill="#1A1A1A" />
      <circle cx="200" cy="165" r="115" fill="#2A1F1A" />
      {/* Handle */}
      <rect x="320" y="155" width="80" height="22" rx="11" fill="#1A1A1A" />
      {/* Tomato sauce */}
      <circle cx="200" cy="165" r="100" fill="#C44735" />
      <circle cx="195" cy="160" r="95" fill="#E15A42" />
      {/* Texture dots */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <circle key={i} cx={160 + i * 25} cy={140 + (i % 3) * 25} r="4" fill="#8B2C2C" opacity="0.5" />
      ))}
      {/* Eggs */}
      <circle cx="165" cy="140" r="28" fill="#FFF8EA" />
      <circle cx="165" cy="140" r="11" fill="#E8A835" />
      <circle cx="235" cy="145" r="28" fill="#FFF8EA" />
      <circle cx="235" cy="145" r="11" fill="#E8A835" />
      <circle cx="200" cy="200" r="28" fill="#FFF8EA" />
      <circle cx="200" cy="200" r="11" fill="#E8A835" />
      {/* Feta crumbs */}
      <rect x="130" y="175" width="8" height="6" rx="1" fill="#FFF" opacity="0.9" />
      <rect x="255" y="185" width="7" height="6" rx="1" fill="#FFF" opacity="0.9" />
      <rect x="200" y="140" width="6" height="5" rx="1" fill="#FFF" opacity="0.9" />
      {/* Parsley */}
      <ellipse cx="175" cy="185" rx="6" ry="3" fill="#3E5A3C" transform="rotate(30 175 185)" />
      <ellipse cx="245" cy="170" rx="6" ry="3" fill="#5A7A47" transform="rotate(-20 245 170)" />
    </Wrap>
  )
}

/* ═══════════════════════ 4. Thai-Erdnussnudeln ═══════════════════════ */
export function IllPeanutNoodles() {
  return (
    <Wrap id="peanut" bg={['#E8C197', '#C8A070']}>
      {/* Bowl */}
      <ellipse cx="200" cy="200" rx="160" ry="55" fill="#2A1F1A" />
      <ellipse cx="200" cy="185" rx="155" ry="48" fill="#3E2D20" />
      <ellipse cx="200" cy="180" rx="148" ry="44" fill="#A66C3A" />
      {/* Noodle nest */}
      {[...Array(12)].map((_, i) => (
        <path
          key={i}
          d={`M ${80 + i * 22} ${155 + (i % 3) * 8} Q ${180 + i * 5} ${140 + (i % 2) * 12}, ${280 - i * 10} ${165 + (i % 3) * 5}`}
          stroke="#D4A87C"
          strokeWidth="4"
          fill="none"
          opacity="0.95"
          strokeLinecap="round"
        />
      ))}
      {/* Peanuts */}
      {[[110, 150], [290, 155], [180, 140], [230, 165], [150, 175], [260, 180]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="7" ry="5" fill="#C4A05A" transform={`rotate(${i * 30} ${x} ${y})`} />
      ))}
      {/* Lime wedge */}
      <path d="M 330 160 Q 360 150, 360 180 Q 345 175, 330 170 Z" fill="#C8D47C" />
      <path d="M 338 162 L 352 175" stroke="#F5EDD8" strokeWidth="1" />
      {/* Scallion */}
      <rect x="180" y="140" width="30" height="3" rx="1.5" fill="#7DB56E" />
      <rect x="150" y="150" width="20" height="3" rx="1.5" fill="#7DB56E" />
    </Wrap>
  )
}

/* ═══════════════════════ 5. Teriyaki-Hähnchen-Bowl ═══════════════════════ */
export function IllTeriyaki() {
  return (
    <Wrap id="teri" bg={['#F5E9D5', '#D4BC7C']}>
      {/* Bowl */}
      <ellipse cx="200" cy="200" rx="155" ry="55" fill="#1A1614" />
      <ellipse cx="200" cy="190" rx="150" ry="48" fill="#2A211A" />
      <ellipse cx="200" cy="183" rx="142" ry="42" fill="#F5EDD8" />
      {/* Rice texture */}
      {[...Array(20)].map((_, i) => (
        <circle key={i} cx={85 + (i % 7) * 35} cy={170 + Math.floor(i / 7) * 12} r="3" fill="#FFFCF0" />
      ))}
      {/* Teriyaki chicken strips */}
      <path d="M 140 160 Q 170 150, 195 162 L 190 180 Q 165 185, 138 178 Z" fill="#7A3E2F" />
      <path d="M 195 172 Q 230 160, 265 170 L 260 190 Q 225 195, 192 185 Z" fill="#8B4A30" />
      {/* Shiny glaze highlights */}
      <path d="M 150 162 Q 175 157, 188 167" stroke="#E8A835" strokeWidth="2" fill="none" opacity="0.7" />
      <path d="M 205 172 Q 235 168, 258 178" stroke="#E8A835" strokeWidth="2" fill="none" opacity="0.7" />
      {/* Edamame */}
      {[[90, 170], [310, 180], [100, 195], [300, 160]].map(([x, y], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y} rx="9" ry="5" fill="#5A7A47" />
          <circle cx={x - 2} cy={y} r="2" fill="#7DB56E" />
          <circle cx={x + 2} cy={y} r="2" fill="#7DB56E" />
        </g>
      ))}
      {/* Sesame */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <ellipse key={i} cx={140 + i * 30} cy={155 + (i % 2) * 8} rx="2" ry="1" fill="#F5EDD8" />
      ))}
    </Wrap>
  )
}

/* ═══════════════════════ 6. Korean Beef Bowl ═══════════════════════ */
export function IllKoreanBeef() {
  return (
    <Wrap id="korean" bg={['#E8C197', '#D4564F']}>
      {/* Bowl */}
      <ellipse cx="200" cy="200" rx="155" ry="55" fill="#1A1A1A" />
      <ellipse cx="200" cy="188" rx="148" ry="46" fill="#F5EDD8" />
      {/* Sections */}
      {/* Rice left */}
      <path d="M 70 180 Q 95 160, 130 170 Q 150 175, 155 200 Z" fill="#FFFCF0" />
      {/* Beef center */}
      <path d="M 140 160 Q 185 150, 240 160 Q 255 180, 240 200 Q 185 215, 140 200 Z" fill="#7A3E2F" />
      <path d="M 150 165 Q 180 158, 230 168" stroke="#5A2E20" strokeWidth="2" fill="none" opacity="0.6" />
      <path d="M 155 185 Q 200 178, 235 188" stroke="#5A2E20" strokeWidth="2" fill="none" opacity="0.6" />
      {/* Kimchi */}
      <path d="M 250 170 Q 290 160, 320 175 Q 325 190, 300 205 Q 270 210, 250 200 Z" fill="#C44735" />
      <path d="M 260 175 Q 280 170, 310 180" stroke="#E8A835" strokeWidth="1.5" fill="none" />
      {/* Carrot shreds */}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={85 + i * 12} y={195} width="14" height="3" rx="1" fill="#E89735" transform={`rotate(${i * 15 - 20} ${90 + i * 12} 196)`} />
      ))}
      {/* Scallions */}
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx={170 + i * 25} cy={160} r="3" fill="#7DB56E" />
      ))}
      {/* Sesame */}
      {[0, 1, 2, 3, 4].map((i) => (
        <ellipse key={i} cx={170 + i * 20} cy={180} rx="1.5" ry="1" fill="#F5EDD8" />
      ))}
    </Wrap>
  )
}

/* ═══════════════════════ 7. Linsen-Dal ═══════════════════════ */
export function IllDal() {
  return (
    <Wrap id="dal" bg={['#E8A835', '#C44735']}>
      {/* Bowl */}
      <ellipse cx="200" cy="175" rx="150" ry="95" fill="#FFF8EA" />
      <ellipse cx="200" cy="172" rx="140" ry="85" fill="#FFFCF0" />
      {/* Dal */}
      <ellipse cx="200" cy="175" rx="125" ry="70" fill="#E89735" />
      <ellipse cx="195" cy="170" rx="115" ry="60" fill="#F2AC4A" opacity="0.85" />
      {/* Lentil texture */}
      {[...Array(30)].map((_, i) => (
        <circle
          key={i}
          cx={100 + (i % 10) * 22}
          cy={140 + Math.floor(i / 10) * 20}
          r="3"
          fill="#C87D35"
          opacity="0.7"
        />
      ))}
      {/* Coriander dust */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <circle key={i} cx={130 + i * 30} cy={155 + (i % 2) * 30} r="2.5" fill="#3E5A3C" />
      ))}
      {/* Coriander leaf */}
      <path d="M 220 145 Q 235 135, 245 150 Q 235 160, 220 155 Z" fill="#5A7A47" />
      <path d="M 232 145 L 232 158" stroke="#3E5A3C" strokeWidth="1" />
      {/* Cream swirl */}
      <path d="M 155 175 Q 175 165, 195 175 Q 215 185, 245 175" stroke="#FFF8EA" strokeWidth="3" fill="none" opacity="0.75" strokeLinecap="round" />
      {/* Steam */}
      <path d="M 170 95 Q 180 75, 175 55" stroke="#fff" strokeWidth="3" fill="none" opacity="0.4" strokeLinecap="round" />
      <path d="M 225 95 Q 220 70, 230 50" stroke="#fff" strokeWidth="3" fill="none" opacity="0.4" strokeLinecap="round" />
    </Wrap>
  )
}

/* ═══════════════════════ 8. Miso-Lachs ═══════════════════════ */
export function IllMisoLachs() {
  return (
    <Wrap id="miso" bg={['#F5E9D5', '#C94F4F']}>
      {/* Plate */}
      <rect x="40" y="80" width="320" height="180" rx="12" fill="#F5EDD8" />
      <rect x="50" y="90" width="300" height="160" rx="8" fill="#FFFCF0" />
      {/* Lachs */}
      <path d="M 120 130 L 260 125 L 280 175 L 140 185 Z" fill="#E8946B" />
      {/* Lachs-Textur-Streifen */}
      <path d="M 130 140 L 270 132" stroke="#F2A783" strokeWidth="2" opacity="0.6" />
      <path d="M 135 155 L 275 148" stroke="#F2A783" strokeWidth="2" opacity="0.6" />
      <path d="M 138 170 L 278 163" stroke="#F2A783" strokeWidth="2" opacity="0.6" />
      {/* Glaze sheen */}
      <path d="M 135 132 Q 200 125, 265 130" stroke="#D4564F" strokeWidth="5" fill="none" opacity="0.75" />
      <path d="M 150 180 Q 200 172, 270 178" stroke="#8B3E2F" strokeWidth="3" fill="none" opacity="0.5" />
      {/* Reis-Ecke */}
      <rect x="65" y="195" width="80" height="50" rx="6" fill="#FFF8EA" />
      {[...Array(12)].map((_, i) => (
        <circle key={i} cx={75 + (i % 4) * 20} cy={205 + Math.floor(i / 4) * 12} r="2.5" fill="#E8DFC1" />
      ))}
      {/* Pak Choi */}
      <ellipse cx="310" cy="215" rx="35" ry="18" fill="#5A7A47" transform="rotate(-15 310 215)" />
      <ellipse cx="310" cy="212" rx="28" ry="14" fill="#7DB56E" transform="rotate(-15 310 212)" />
      <rect x="295" y="222" width="30" height="8" rx="2" fill="#F5EDD8" transform="rotate(-15 310 226)" />
      {/* Sesame */}
      {[0, 1, 2, 3, 4].map((i) => (
        <ellipse key={i} cx={160 + i * 25} cy={155} rx="1.5" ry="1" fill="#FFF8EA" />
      ))}
    </Wrap>
  )
}

/* ═══════════════════════ 9. Caprese-Quinoa-Bowl ═══════════════════════ */
export function IllCaprese() {
  return (
    <Wrap id="caprese" bg={['#F5EDD8', '#A3B18A']}>
      {/* Bowl */}
      <ellipse cx="200" cy="185" rx="155" ry="60" fill="#1F3A2E" />
      <ellipse cx="200" cy="175" rx="150" ry="50" fill="#F5EDD8" />
      <ellipse cx="200" cy="170" rx="140" ry="42" fill="#FFFCF0" />
      {/* Quinoa */}
      {[...Array(40)].map((_, i) => (
        <circle
          key={i}
          cx={75 + (i % 10) * 25}
          cy={150 + Math.floor(i / 10) * 12}
          r="2"
          fill="#D4C87C"
          opacity="0.8"
        />
      ))}
      {/* Mozzarella */}
      <circle cx="150" cy="160" r="18" fill="#FFFFFF" />
      <circle cx="240" cy="170" r="16" fill="#FFFFFF" />
      <circle cx="195" cy="185" r="14" fill="#FFFFFF" />
      {/* Tomato */}
      <circle cx="175" cy="180" r="15" fill="#C44735" />
      <circle cx="215" cy="155" r="14" fill="#D4564F" />
      <circle cx="260" cy="155" r="13" fill="#C44735" />
      {/* Tomato stems */}
      <path d="M 175 168 L 177 162" stroke="#3E5A3C" strokeWidth="1.5" />
      <path d="M 215 143 L 217 137" stroke="#3E5A3C" strokeWidth="1.5" />
      {/* Basil leaves */}
      <path d="M 130 175 Q 110 170, 115 190 Q 130 192, 140 185 Z" fill="#3E5A3C" />
      <path d="M 290 160 Q 310 155, 305 175 Q 290 178, 280 170 Z" fill="#5A7A47" />
      <path d="M 220 195 Q 230 200, 240 192 Q 235 185, 225 190 Z" fill="#3E5A3C" />
      {/* Olive oil drops */}
      <circle cx="165" cy="145" r="4" fill="#E8D56B" opacity="0.7" />
      <circle cx="245" cy="190" r="3" fill="#E8D56B" opacity="0.7" />
    </Wrap>
  )
}

/* ═══════════════════════ 10. Hummus-Bowl mit Falafel ═══════════════════════ */
export function IllHummusFalafel() {
  return (
    <Wrap id="hummus" bg={['#F4E4C1', '#C4A05A']}>
      {/* Plate */}
      <ellipse cx="200" cy="175" rx="160" ry="95" fill="#F5EDD8" />
      <ellipse cx="200" cy="172" rx="150" ry="85" fill="#FFFCF0" />
      {/* Hummus spread */}
      <ellipse cx="195" cy="175" rx="130" ry="65" fill="#E8D56B" />
      <ellipse cx="195" cy="170" rx="120" ry="55" fill="#F2DF80" />
      {/* Paprika swirl on hummus */}
      <path d="M 150 170 Q 195 140, 240 170 Q 210 180, 195 175 Z" fill="#C44735" opacity="0.6" />
      {/* Falafel balls */}
      {[[140, 150], [180, 135], [230, 145], [255, 175], [210, 195], [160, 200]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="14" fill="#5A7A47" />
          <circle cx={x - 3} cy={y - 3} r="3" fill="#7DB56E" opacity="0.6" />
          <circle cx={x + 4} cy={y + 2} r="2" fill="#3E5A3C" />
        </g>
      ))}
      {/* Cucumber sticks */}
      <rect x="100" y="170" width="28" height="5" rx="2" fill="#7DB56E" />
      <rect x="100" y="180" width="24" height="5" rx="2" fill="#7DB56E" />
      {/* Tomato dices */}
      <rect x="280" y="180" width="8" height="8" rx="1" fill="#C44735" />
      <rect x="290" y="190" width="7" height="7" rx="1" fill="#D4564F" />
      <rect x="275" y="195" width="8" height="8" rx="1" fill="#C44735" />
      {/* Pita */}
      <path d="M 300 135 Q 350 125, 360 155 Q 330 165, 295 155 Z" fill="#D4BC7C" />
      <path d="M 308 140 Q 340 135, 352 152" stroke="#C4A05A" strokeWidth="1.5" fill="none" />
      {/* Parsley */}
      <circle cx="175" cy="170" r="2" fill="#3E5A3C" />
      <circle cx="220" cy="165" r="2" fill="#3E5A3C" />
      <circle cx="200" cy="180" r="2" fill="#5A7A47" />
    </Wrap>
  )
}

/* ═══════════════════════ 11. Overnight Oats ═══════════════════════ */
export function IllOvernightOats() {
  return (
    <Wrap id="oats" bg={['#E8D5AB', '#C4B087']}>
      {/* Jar */}
      <rect x="130" y="55" width="140" height="35" rx="6" fill="#3E3A52" />
      <rect x="135" y="85" width="130" height="190" rx="8" fill="#FFF8EA" opacity="0.4" stroke="#FFF" strokeWidth="2" />
      {/* Layered contents */}
      {/* Oats base */}
      <rect x="138" y="200" width="124" height="72" rx="0 0 8 8" fill="#F2D792" />
      {/* Oat texture */}
      {[...Array(15)].map((_, i) => (
        <ellipse
          key={i}
          cx={145 + (i % 5) * 25}
          cy={215 + Math.floor(i / 5) * 18}
          rx="4"
          ry="2"
          fill="#E8C197"
          opacity="0.7"
        />
      ))}
      {/* Chia */}
      {[...Array(20)].map((_, i) => (
        <circle
          key={i}
          cx={140 + (i * 13) % 120}
          cy={225 + (i * 7) % 45}
          r="1.5"
          fill="#3E3A52"
        />
      ))}
      {/* Yogurt layer */}
      <rect x="138" y="170" width="124" height="32" fill="#FFFCF0" />
      {/* Berries on top */}
      <rect x="138" y="140" width="124" height="32" fill="#FAF0D4" />
      <circle cx="160" cy="155" r="8" fill="#6B2E3E" />
      <circle cx="180" cy="150" r="7" fill="#8B3E4A" />
      <circle cx="205" cy="158" r="9" fill="#6B2E3E" />
      <circle cx="230" cy="150" r="7" fill="#4A3E52" />
      <circle cx="248" cy="160" r="6" fill="#8B3E4A" />
      {/* Banana slices */}
      <circle cx="170" cy="145" r="5" fill="#F2DF80" />
      <circle cx="220" cy="145" r="5" fill="#F2DF80" />
      {/* Nuts */}
      <path d="M 190 165 Q 200 160, 210 170 Q 205 175, 195 172 Z" fill="#A66C3A" />
      <path d="M 150 170 Q 160 165, 165 175 Q 158 178, 150 175 Z" fill="#A66C3A" />
      {/* Sparkle */}
      <circle cx="180" cy="138" r="2" fill="#fff" />
      <circle cx="240" cy="142" r="1.5" fill="#fff" />
    </Wrap>
  )
}

/* ═══════════════════════ 12. Maki-Rollen ═══════════════════════ */
export function IllMaki() {
  return (
    <Wrap id="maki" bg={['#F5E9D5', '#3E5A3C']}>
      {/* Slate board */}
      <rect x="30" y="170" width="340" height="100" rx="8" fill="#2A2A2A" />
      <rect x="30" y="170" width="340" height="10" fill="#3E3A3A" />
      {/* Maki pieces (6 circles) */}
      {[[90, 200], [155, 195], [220, 200], [285, 195], [120, 240], [250, 240]].map(([x, y], i) => (
        <g key={i}>
          {/* Nori outside */}
          <circle cx={x} cy={y} r="28" fill="#1F3A2E" />
          <circle cx={x} cy={y} r="25" fill="#2A3E35" />
          {/* Rice */}
          <circle cx={x} cy={y} r="22" fill="#FFFCF0" />
          {/* Fillings center */}
          <circle cx={x - 3} cy={y - 3} r="5" fill="#E89B6B" />
          <rect x={x + 2} y={y - 2} width="8" height="4" rx="1" fill="#7DB56E" />
          {/* Rice texture grains */}
          <circle cx={x - 10} cy={y} r="1.5" fill="#E8DFC1" />
          <circle cx={x + 8} cy={y + 6} r="1.5" fill="#E8DFC1" />
          <circle cx={x + 5} cy={y - 10} r="1.5" fill="#E8DFC1" />
        </g>
      ))}
      {/* Soy sauce dish */}
      <ellipse cx="340" cy="110" rx="35" ry="25" fill="#1A1A1A" />
      <ellipse cx="340" cy="107" rx="30" ry="21" fill="#3E3A3A" />
      <ellipse cx="340" cy="107" rx="25" ry="17" fill="#5A2E20" />
      {/* Wasabi dot */}
      <circle cx="45" cy="115" r="10" fill="#5A7A47" />
      <circle cx="42" cy="113" r="3" fill="#7DB56E" />
      {/* Chopsticks */}
      <rect x="80" y="85" width="150" height="4" rx="2" fill="#A66C3A" transform="rotate(-15 155 87)" />
      <rect x="80" y="95" width="150" height="4" rx="2" fill="#A66C3A" transform="rotate(-18 155 97)" />
    </Wrap>
  )
}

/* ═══════════════════════ 13. Rotes Thai Curry ═══════════════════════ */
export function IllThaiCurry() {
  return (
    <Wrap id="thai" bg={['#E8A835', '#C44735']}>
      {/* Bowl */}
      <ellipse cx="200" cy="185" rx="155" ry="65" fill="#1A1A1A" />
      <ellipse cx="200" cy="175" rx="145" ry="55" fill="#2A211A" />
      <ellipse cx="200" cy="168" rx="135" ry="45" fill="#D4564F" />
      {/* Curry liquid */}
      <ellipse cx="198" cy="165" rx="128" ry="40" fill="#E15A42" />
      {/* Coconut cream swirl */}
      <path d="M 130 165 Q 165 155, 200 165 Q 235 175, 270 165" stroke="#FFF8EA" strokeWidth="4" fill="none" opacity="0.7" strokeLinecap="round" />
      {/* Chicken pieces */}
      {[[140, 155], [175, 170], [225, 158], [260, 172], [200, 180]].map(([x, y], i) => (
        <rect
          key={i}
          x={x - 8}
          y={y - 6}
          width="16"
          height="12"
          rx="2"
          fill="#F2CFA3"
          transform={`rotate(${i * 20} ${x} ${y})`}
        />
      ))}
      {/* Paprika slices */}
      <path d="M 150 145 Q 165 148, 158 160" stroke="#D4564F" strokeWidth="3" fill="none" />
      <path d="M 240 145 Q 230 148, 235 160" stroke="#C44735" strokeWidth="3" fill="none" />
      {/* Bamboo shoots */}
      <rect x="115" y="172" width="18" height="4" rx="1" fill="#E8D56B" />
      <rect x="267" y="172" width="18" height="4" rx="1" fill="#E8D56B" />
      {/* Kaffir lime leaves */}
      <path d="M 175 145 Q 170 130, 185 130 Q 190 145, 175 145 Z" fill="#3E5A3C" />
      <path d="M 225 150 Q 235 140, 240 152 Q 230 160, 225 150 Z" fill="#5A7A47" />
      {/* Thai basil */}
      <circle cx="165" cy="180" r="2.5" fill="#3E5A3C" />
      <circle cx="250" cy="155" r="2.5" fill="#3E5A3C" />
    </Wrap>
  )
}

/* ═══════════════════════ 14. Hähnchen-Shawarma-Bowl ═══════════════════════ */
export function IllShawarma() {
  return (
    <Wrap id="shawarma" bg={['#F4E4C1', '#E8A835']}>
      {/* Bowl */}
      <ellipse cx="200" cy="185" rx="160" ry="65" fill="#2A211A" />
      <ellipse cx="200" cy="175" rx="152" ry="55" fill="#F5EDD8" />
      {/* Rice section */}
      <path d="M 65 170 Q 100 155, 145 165 Q 160 195, 120 220 Q 80 210, 65 170 Z" fill="#F2DF80" />
      {[...Array(12)].map((_, i) => (
        <circle
          key={i}
          cx={80 + (i % 4) * 18}
          cy={175 + Math.floor(i / 4) * 12}
          r="1.8"
          fill="#E8D56B"
        />
      ))}
      {/* Chicken shawarma strips */}
      {[[165, 160], [195, 172], [225, 160], [255, 172], [185, 195], [235, 198]].map(([x, y], i) => (
        <path
          key={i}
          d={`M ${x - 15} ${y - 3} Q ${x} ${y - 10}, ${x + 15} ${y - 3} L ${x + 15} ${y + 5} Q ${x} ${y + 10}, ${x - 15} ${y + 5} Z`}
          fill="#8B4A30"
          transform={`rotate(${i * 15} ${x} ${y})`}
        />
      ))}
      {/* Chicken glaze highlights */}
      <path d="M 170 160 Q 185 155, 200 162" stroke="#E8A835" strokeWidth="1.5" fill="none" opacity="0.7" />
      <path d="M 220 175 Q 240 170, 255 178" stroke="#E8A835" strokeWidth="1.5" fill="none" opacity="0.7" />
      {/* Cucumber slices */}
      {[[290, 160], [308, 175], [292, 195]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="9" fill="#7DB56E" />
          <circle cx={x} cy={y} r="6" fill="#A3C490" />
        </g>
      ))}
      {/* Tomato */}
      <circle cx="295" cy="215" r="10" fill="#D4564F" />
      {/* Parsley */}
      <circle cx="180" cy="150" r="2" fill="#3E5A3C" />
      <circle cx="225" cy="148" r="2" fill="#3E5A3C" />
      <circle cx="265" cy="155" r="2" fill="#3E5A3C" />
      {/* Tahini drizzle */}
      <path d="M 155 190 Q 185 200, 215 195 Q 245 190, 270 200" stroke="#FFFCF0" strokeWidth="3" fill="none" opacity="0.75" strokeLinecap="round" />
    </Wrap>
  )
}

/* ═══════════════════════ 15. Gemüse-Lasagne ═══════════════════════ */
export function IllLasagne() {
  return (
    <Wrap id="lasagne" bg={['#F5EDD8', '#C44735']}>
      {/* Baking dish */}
      <rect x="40" y="80" width="320" height="180" rx="14" fill="#3E3A3A" />
      <rect x="50" y="90" width="300" height="160" rx="10" fill="#5A2E20" />
      {/* Lasagne slice cross-section */}
      {/* Bottom layer - pasta */}
      <rect x="60" y="220" width="280" height="18" fill="#F2D792" />
      {/* Sauce red */}
      <rect x="60" y="200" width="280" height="20" fill="#C44735" />
      {/* Pasta */}
      <rect x="60" y="183" width="280" height="17" fill="#F2D792" />
      {/* Ricotta + spinach */}
      <rect x="60" y="162" width="280" height="21" fill="#FFFCF0" />
      {[[90, 172], [150, 170], [210, 175], [270, 170], [320, 172]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="12" ry="5" fill="#5A7A47" />
      ))}
      {/* Pasta */}
      <rect x="60" y="145" width="280" height="17" fill="#F2D792" />
      {/* Sauce */}
      <rect x="60" y="125" width="280" height="20" fill="#D4564F" />
      {/* Pasta top */}
      <rect x="60" y="108" width="280" height="17" fill="#F2D792" />
      {/* Béchamel/cheese top bubbling */}
      <path d="M 60 108 Q 100 95, 150 105 Q 200 95, 250 105 Q 300 98, 340 108 L 340 115 L 60 115 Z" fill="#F5EDD8" />
      <path d="M 60 103 Q 100 92, 150 100 Q 200 90, 250 100 Q 300 93, 340 103" stroke="#E8C197" strokeWidth="2" fill="none" />
      {/* Cheese browning */}
      <ellipse cx="110" cy="100" rx="8" ry="3" fill="#C4A05A" opacity="0.7" />
      <ellipse cx="200" cy="96" rx="10" ry="3" fill="#A66C3A" opacity="0.6" />
      <ellipse cx="290" cy="100" rx="9" ry="3" fill="#C4A05A" opacity="0.7" />
      {/* Steam */}
      <path d="M 150 75 Q 160 55, 155 35" stroke="#fff" strokeWidth="3" fill="none" opacity="0.35" strokeLinecap="round" />
      <path d="M 250 75 Q 245 50, 255 30" stroke="#fff" strokeWidth="3" fill="none" opacity="0.35" strokeLinecap="round" />
    </Wrap>
  )
}

/* ═══════════════════════ 16. Chicken Katsu ═══════════════════════ */
export function IllKatsu() {
  return (
    <Wrap id="katsu" bg={['#F5E9D5', '#D4BC7C']}>
      {/* Plate */}
      <rect x="30" y="100" width="340" height="170" rx="10" fill="#1A1A1A" />
      <rect x="40" y="110" width="320" height="150" rx="6" fill="#F5EDD8" />
      {/* Rice mound */}
      <path d="M 60 170 Q 80 145, 120 150 Q 155 160, 145 205 Q 95 210, 60 195 Z" fill="#FFFCF0" />
      {[...Array(14)].map((_, i) => (
        <circle
          key={i}
          cx={70 + (i % 5) * 17}
          cy={170 + Math.floor(i / 5) * 13}
          r="2"
          fill="#E8DFC1"
        />
      ))}
      {/* Katsu slices (golden breaded) */}
      {[[175, 160], [205, 170], [235, 175], [265, 180], [295, 175]].map(([x, y], i) => (
        <g key={i}>
          <rect x={x - 18} y={y - 12} width="36" height="48" rx="4" fill="#D4A76A" transform={`rotate(${-30 + i * 15} ${x} ${y + 12})`} />
          <rect x={x - 16} y={y - 10} width="32" height="44" rx="3" fill="#E8C197" transform={`rotate(${-30 + i * 15} ${x} ${y + 12})`} />
          {/* Panko texture dots */}
          {[0, 1, 2, 3].map((j) => (
            <circle key={j} cx={x - 10 + j * 7} cy={y + j * 8} r="1.5" fill="#C4A05A" />
          ))}
        </g>
      ))}
      {/* Cabbage shred */}
      {[...Array(12)].map((_, i) => (
        <rect
          key={i}
          x={60 + (i % 6) * 12}
          y={220 + Math.floor(i / 6) * 6}
          width="20"
          height="2"
          rx="1"
          fill="#A3C490"
          opacity="0.85"
        />
      ))}
      {/* Tonkatsu sauce puddle */}
      <ellipse cx="310" cy="225" rx="30" ry="12" fill="#5A2E20" />
      <ellipse cx="305" cy="222" rx="20" ry="7" fill="#7A3E2F" />
      {/* Lemon wedge */}
      <path d="M 50 225 Q 35 230, 35 245 Q 55 248, 65 240 Z" fill="#F2DF80" />
    </Wrap>
  )
}

/* ═══════════════════════ 17. Chana Masala ═══════════════════════ */
export function IllChanaMasala() {
  return (
    <Wrap id="chana" bg={['#E8A835', '#8B3E2F']}>
      {/* Bowl */}
      <ellipse cx="200" cy="175" rx="150" ry="95" fill="#2A1F1A" />
      <ellipse cx="200" cy="172" rx="142" ry="85" fill="#5A2E20" />
      {/* Masala sauce */}
      <ellipse cx="200" cy="175" rx="130" ry="70" fill="#C87D35" />
      <ellipse cx="195" cy="170" rx="120" ry="60" fill="#D48A40" opacity="0.85" />
      {/* Chickpeas */}
      {[...Array(18)].map((_, i) => (
        <circle
          key={i}
          cx={110 + (i % 6) * 30}
          cy={140 + Math.floor(i / 6) * 22}
          r="7"
          fill="#E8C197"
        />
      ))}
      {[...Array(18)].map((_, i) => (
        <circle
          key={`h-${i}`}
          cx={113 + (i % 6) * 30}
          cy={138 + Math.floor(i / 6) * 22}
          r="2"
          fill="#F5EDD8"
        />
      ))}
      {/* Spice oil dots */}
      {[[170, 150], [225, 160], [190, 185]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="#E89735" opacity="0.8" />
      ))}
      {/* Coriander leaves */}
      <path d="M 160 130 Q 170 125, 175 135 Q 168 142, 160 138 Z" fill="#5A7A47" />
      <path d="M 240 140 Q 250 135, 253 147 Q 243 152, 238 145 Z" fill="#3E5A3C" />
      <path d="M 205 200 Q 215 197, 220 208 Q 210 212, 205 205 Z" fill="#5A7A47" />
      {/* Steam */}
      <path d="M 170 90 Q 180 70, 175 50" stroke="#fff" strokeWidth="3" fill="none" opacity="0.35" strokeLinecap="round" />
      <path d="M 225 90 Q 220 65, 230 45" stroke="#fff" strokeWidth="3" fill="none" opacity="0.35" strokeLinecap="round" />
    </Wrap>
  )
}

/* ═══════════════════════ 18. Pad Thai ═══════════════════════ */
export function IllPadThai() {
  return (
    <Wrap id="padthai" bg={['#E8C197', '#D4564F']}>
      {/* Plate */}
      <ellipse cx="200" cy="175" rx="160" ry="95" fill="#FFFCF0" />
      <ellipse cx="200" cy="172" rx="150" ry="85" fill="#FFF8EA" />
      {/* Noodles */}
      {[...Array(18)].map((_, i) => (
        <path
          key={i}
          d={`M ${60 + i * 16} ${150 + (i % 4) * 8} Q ${200 + (i % 3) * 10} ${120 + (i % 5) * 15}, ${330 - i * 12} ${175 + (i % 4) * 12}`}
          stroke="#E89B6B"
          strokeWidth="4"
          fill="none"
          opacity="0.85"
          strokeLinecap="round"
        />
      ))}
      {/* Shrimps */}
      {[[140, 170], [220, 155], [290, 180]].map(([x, y], i) => (
        <g key={i}>
          <path d={`M ${x} ${y} Q ${x + 15} ${y - 10}, ${x + 30} ${y} Q ${x + 25} ${y + 8}, ${x + 15} ${y + 5} Q ${x + 5} ${y + 8}, ${x} ${y} Z`} fill="#E8946B" />
          <circle cx={x + 2} cy={y} r="2" fill="#1A1A1A" />
          <path d={`M ${x + 30} ${y} L ${x + 38} ${y - 3} L ${x + 36} ${y + 3} Z`} fill="#E8946B" />
        </g>
      ))}
      {/* Egg chunks */}
      <rect x="110" y="180" width="12" height="12" rx="2" fill="#F2DF80" />
      <rect x="170" y="195" width="10" height="10" rx="2" fill="#F2DF80" />
      <rect x="245" y="200" width="11" height="11" rx="2" fill="#F2DF80" />
      {/* Peanuts */}
      {[[130, 155], [195, 140], [260, 160], [300, 195]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="5" ry="4" fill="#A66C3A" transform={`rotate(${i * 30} ${x} ${y})`} />
      ))}
      {/* Bean sprouts */}
      <path d="M 80 210 Q 90 208, 100 215" stroke="#E8D5AB" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 310 215 Q 320 213, 330 220" stroke="#E8D5AB" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Lime wedge */}
      <path d="M 50 200 Q 30 195, 28 220 Q 50 225, 60 215 Z" fill="#C8D47C" />
      <path d="M 38 200 L 48 218" stroke="#F5EDD8" strokeWidth="1" />
      {/* Scallions */}
      <rect x="140" y="140" width="18" height="2.5" rx="1" fill="#5A7A47" />
      <rect x="230" y="145" width="16" height="2.5" rx="1" fill="#5A7A47" />
    </Wrap>
  )
}

/* ═══════════════════════ 19. Tom Kha Gai ═══════════════════════ */
export function IllTomKha() {
  return (
    <Wrap id="tomkha" bg={['#F5EDD8', '#E8C197']}>
      {/* Bowl */}
      <ellipse cx="200" cy="180" rx="158" ry="70" fill="#1A1A1A" />
      <ellipse cx="200" cy="172" rx="150" ry="60" fill="#2A211A" />
      {/* Creamy soup */}
      <ellipse cx="200" cy="165" rx="140" ry="50" fill="#FAF0D4" />
      <ellipse cx="200" cy="163" rx="135" ry="47" fill="#FFFCF0" />
      {/* Oil slicks */}
      <circle cx="160" cy="155" r="12" fill="#E8C197" opacity="0.5" />
      <circle cx="235" cy="170" r="10" fill="#E8C197" opacity="0.5" />
      <circle cx="200" cy="148" r="8" fill="#E8C197" opacity="0.5" />
      {/* Chicken pieces */}
      {[[145, 165], [180, 150], [225, 160], [265, 175]].map(([x, y], i) => (
        <rect key={i} x={x - 8} y={y - 5} width="16" height="10" rx="2" fill="#E8D5AB" transform={`rotate(${i * 20} ${x} ${y})`} />
      ))}
      {/* Mushroom slices */}
      {[[160, 180], [210, 180], [260, 160]].map(([x, y], i) => (
        <g key={i}>
          <path d={`M ${x - 12} ${y} Q ${x} ${y - 8}, ${x + 12} ${y} L ${x + 8} ${y + 5} L ${x - 8} ${y + 5} Z`} fill="#D4A76A" />
          <path d={`M ${x - 8} ${y + 5} L ${x + 8} ${y + 5} L ${x + 5} ${y + 9} L ${x - 5} ${y + 9} Z`} fill="#A66C3A" />
        </g>
      ))}
      {/* Galangal/ginger slice */}
      <path d="M 130 195 Q 125 190, 130 185 L 145 185 Q 150 190, 145 195 Z" fill="#F2CFA3" />
      <path d="M 280 195 Q 275 190, 280 185 L 295 185 Q 300 190, 295 195 Z" fill="#F2CFA3" />
      {/* Red chili */}
      <path d="M 175 150 Q 190 145, 198 160" stroke="#C44735" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M 240 155 Q 255 150, 263 165" stroke="#D4564F" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Kaffir lime leaves */}
      <path d="M 170 140 Q 165 130, 180 130 Q 180 140, 170 140 Z" fill="#3E5A3C" />
      <path d="M 225 140 Q 235 133, 240 145 Q 230 148, 225 140 Z" fill="#5A7A47" />
      {/* Cilantro */}
      <circle cx="195" cy="155" r="2" fill="#3E5A3C" />
      <circle cx="215" cy="168" r="2" fill="#3E5A3C" />
      {/* Steam */}
      <path d="M 170 95 Q 180 75, 175 55" stroke="#fff" strokeWidth="2.5" fill="none" opacity="0.4" strokeLinecap="round" />
      <path d="M 225 95 Q 220 70, 230 50" stroke="#fff" strokeWidth="2.5" fill="none" opacity="0.4" strokeLinecap="round" />
    </Wrap>
  )
}

/* ═══════════════════════ 20. Mapo Tofu ═══════════════════════ */
export function IllMapoTofu() {
  return (
    <Wrap id="mapo" bg={['#E8A835', '#B73939']}>
      {/* Bowl */}
      <ellipse cx="200" cy="180" rx="155" ry="65" fill="#1A1614" />
      <ellipse cx="200" cy="170" rx="148" ry="55" fill="#2A1614" />
      {/* Red spicy oil */}
      <ellipse cx="200" cy="168" rx="140" ry="47" fill="#B73939" />
      <ellipse cx="195" cy="163" rx="132" ry="40" fill="#C84339" />
      {/* Oil pools (characteristic shine) */}
      <ellipse cx="160" cy="155" rx="18" ry="8" fill="#E89735" opacity="0.7" />
      <ellipse cx="235" cy="170" rx="15" ry="7" fill="#E89735" opacity="0.7" />
      {/* Tofu cubes */}
      {[[135, 155], [170, 170], [205, 160], [245, 175], [175, 190], [225, 185], [265, 155]].map(([x, y], i) => (
        <rect key={i} x={x - 10} y={y - 10} width="20" height="20" rx="2" fill="#FFF8EA" transform={`rotate(${i * 12} ${x} ${y})`} />
      ))}
      {/* Ground pork bits */}
      {[...Array(12)].map((_, i) => (
        <circle
          key={i}
          cx={130 + (i % 6) * 25}
          cy={150 + Math.floor(i / 6) * 25}
          r="3"
          fill="#5A2E20"
          opacity="0.85"
        />
      ))}
      {/* Green onions */}
      {[[150, 185], [200, 145], [255, 195], [280, 165]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="#7DB56E" />
      ))}
      {/* Sichuan peppercorn specks */}
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={140 + i * 30} cy={135 + (i % 2) * 8} r="2" fill="#5A2E20" />
      ))}
      {/* Steam */}
      <path d="M 175 95 Q 180 75, 175 55" stroke="#fff" strokeWidth="3" fill="none" opacity="0.4" strokeLinecap="round" />
      <path d="M 225 95 Q 220 70, 225 50" stroke="#fff" strokeWidth="3" fill="none" opacity="0.4" strokeLinecap="round" />
    </Wrap>
  )
}

/* ═══════════════════════ 21. Caponata ═══════════════════════ */
export function IllCaponata() {
  return (
    <Wrap id="caponata" bg={['#F5E9D5', '#8B1E3F']}>
      {/* Bowl */}
      <ellipse cx="200" cy="175" rx="155" ry="95" fill="#F5EDD8" />
      <ellipse cx="200" cy="172" rx="145" ry="85" fill="#FFFCF0" />
      {/* Sauce base */}
      <ellipse cx="200" cy="175" rx="130" ry="70" fill="#C44735" opacity="0.75" />
      <ellipse cx="200" cy="170" rx="122" ry="60" fill="#D4564F" opacity="0.7" />
      {/* Aubergine chunks (purple/brown) */}
      {[[140, 150], [180, 165], [220, 150], [260, 165], [170, 195], [230, 190]].map(([x, y], i) => (
        <g key={i}>
          <path d={`M ${x - 12} ${y - 8} L ${x + 10} ${y - 10} L ${x + 14} ${y + 6} L ${x - 10} ${y + 8} Z`} fill="#4A2E3E" transform={`rotate(${i * 20} ${x} ${y})`} />
          <path d={`M ${x - 10} ${y - 6} L ${x + 8} ${y - 8}`} stroke="#6B2E3E" strokeWidth="1.5" transform={`rotate(${i * 20} ${x} ${y})`} />
        </g>
      ))}
      {/* Green olives */}
      {[[155, 170], [205, 180], [255, 175], [190, 145]].map(([x, y], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y} rx="8" ry="6" fill="#5A7A47" />
          <ellipse cx={x} cy={y} rx="4" ry="2" fill="#8B1E3F" />
        </g>
      ))}
      {/* Capers (small green-grey dots) */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <circle key={i} cx={130 + i * 35} cy={175 + (i % 2) * 15} r="3" fill="#7A7A5A" />
      ))}
      {/* Pine nuts */}
      {[[148, 188], [215, 160], [278, 190]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="3.5" ry="2" fill="#F2DF80" transform={`rotate(${i * 30} ${x} ${y})`} />
      ))}
      {/* Basil */}
      <path d="M 145 160 Q 135 155, 138 170 Q 150 172, 155 165 Z" fill="#3E5A3C" />
      <path d="M 280 150 Q 295 155, 290 170 Q 275 168, 275 158 Z" fill="#5A7A47" />
    </Wrap>
  )
}

/* ═══════════════════════ 22. Baba Ganoush + Kofta ═══════════════════════ */
export function IllBabaKofta() {
  return (
    <Wrap id="babaganoush" bg={['#F4E4C1', '#3E3A3A']}>
      {/* Plate */}
      <ellipse cx="200" cy="180" rx="160" ry="95" fill="#F5EDD8" />
      <ellipse cx="200" cy="175" rx="150" ry="85" fill="#FFFCF0" />
      {/* Baba Ganoush spread (smoky grey-beige) */}
      <ellipse cx="130" cy="175" rx="75" ry="55" fill="#C4B087" />
      <ellipse cx="125" cy="170" rx="65" ry="45" fill="#D4BC7C" />
      {/* Smoky striations */}
      <path d="M 85 170 Q 125 155, 170 175" stroke="#7A7A5A" strokeWidth="2" fill="none" opacity="0.4" />
      <path d="M 95 190 Q 130 182, 165 195" stroke="#5A5A3E" strokeWidth="2" fill="none" opacity="0.4" />
      {/* Olive oil swirl */}
      <circle cx="115" cy="165" r="3" fill="#7A7A3E" />
      <circle cx="135" cy="175" r="3" fill="#7A7A3E" />
      {/* Pomegranate seeds */}
      <circle cx="105" cy="180" r="2.5" fill="#C44735" />
      <circle cx="150" cy="170" r="2.5" fill="#C44735" />
      <circle cx="140" cy="200" r="2.5" fill="#C44735" />
      {/* Kofta skewer (right side) */}
      <rect x="220" y="155" width="120" height="5" rx="2" fill="#A66C3A" transform="rotate(-8 280 157)" />
      {/* Kofta pieces */}
      {[[250, 152], [280, 147], [310, 142]].map(([x, y], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y} rx="18" ry="9" fill="#5A2E20" />
          <ellipse cx={x} cy={y - 2} rx="15" ry="6" fill="#7A3E2F" />
          {/* Char marks */}
          <path d={`M ${x - 10} ${y - 4} L ${x + 10} ${y - 4}`} stroke="#2A1614" strokeWidth="1.5" opacity="0.6" />
          <path d={`M ${x - 12} ${y + 2} L ${x + 12} ${y + 2}`} stroke="#2A1614" strokeWidth="1.5" opacity="0.6" />
        </g>
      ))}
      {/* Parsley */}
      <circle cx="260" cy="180" r="2" fill="#3E5A3C" />
      <circle cx="290" cy="175" r="2" fill="#5A7A47" />
      <circle cx="320" cy="170" r="2" fill="#3E5A3C" />
      {/* Lemon wedge */}
      <path d="M 220 220 Q 200 215, 195 235 Q 220 240, 232 230 Z" fill="#F2DF80" />
      <path d="M 210 220 L 220 235" stroke="#F5EDD8" strokeWidth="1" />
    </Wrap>
  )
}

/* ═══════════════════════ 23. Bun Bo Nam Bo ═══════════════════════ */
export function IllBunBoNamBo() {
  return (
    <Wrap id="bunbo" bg={['#E8D5AB', '#7DB56E']}>
      {/* Bowl */}
      <ellipse cx="200" cy="185" rx="160" ry="70" fill="#3E3A3A" />
      <ellipse cx="200" cy="178" rx="152" ry="60" fill="#FFFCF0" />
      {/* Lettuce leaves (bottom layer) */}
      <path d="M 70 200 Q 100 185, 130 200 Q 150 210, 140 225 Q 110 228, 70 218 Z" fill="#7DB56E" />
      <path d="M 260 200 Q 290 185, 330 200 Q 335 215, 315 225 Q 280 228, 258 218 Z" fill="#A3C490" />
      {/* Vermicelli nest */}
      {[...Array(15)].map((_, i) => (
        <path
          key={i}
          d={`M ${90 + i * 15} ${155 + (i % 3) * 8} Q ${200 + (i % 2) * 10} ${140}, ${320 - i * 10} ${170 + (i % 3) * 6}`}
          stroke="#FAF0D4"
          strokeWidth="2.5"
          fill="none"
          opacity="0.95"
          strokeLinecap="round"
        />
      ))}
      {/* Beef strips (lemongrass marinated) */}
      {[[150, 160], [195, 155], [240, 165]].map(([x, y], i) => (
        <path
          key={i}
          d={`M ${x - 20} ${y} Q ${x} ${y - 8}, ${x + 20} ${y} Q ${x + 15} ${y + 5}, ${x} ${y + 3} Q ${x - 15} ${y + 5}, ${x - 20} ${y} Z`}
          fill="#5A2E20"
          transform={`rotate(${i * 12} ${x} ${y})`}
        />
      ))}
      {/* Carrot julienne */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={100 + i * 15} y={185 + (i % 2) * 5} width="22" height="2" rx="1" fill="#E89735" transform={`rotate(${-15 + i * 5} ${111 + i * 15} 186)`} />
      ))}
      {/* Cucumber julienne */}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={220 + i * 14} y={185 + (i % 2) * 5} width="22" height="2" rx="1" fill="#7DB56E" transform={`rotate(${-5 + i * 5} ${231 + i * 14} 186)`} />
      ))}
      {/* Crushed peanuts */}
      {[0, 1, 2, 3, 4].map((i) => (
        <ellipse key={i} cx={145 + i * 28} cy={145 + (i % 2) * 12} rx="3" ry="2" fill="#A66C3A" />
      ))}
      {/* Mint leaves */}
      <path d="M 170 175 Q 165 170, 175 168 Q 180 175, 170 175 Z" fill="#3E5A3C" />
      <path d="M 230 175 Q 240 172, 238 180 Q 228 183, 230 175 Z" fill="#5A7A47" />
    </Wrap>
  )
}

/* ═══════════════════════ 24. Gemüse-Ofen-Gratin ═══════════════════════ */
export function IllGratin() {
  return (
    <Wrap id="gratin" bg={['#F5E9D5', '#E8C197']}>
      {/* Baking dish */}
      <ellipse cx="200" cy="180" rx="165" ry="95" fill="#3E3A3A" />
      <ellipse cx="200" cy="175" rx="155" ry="85" fill="#5A2E20" />
      {/* Layers of potatoes/zucchini/tomato rings */}
      {[
        [90, 155], [130, 158], [170, 156], [210, 159], [250, 157], [290, 158], [310, 160],
        [105, 175], [150, 178], [195, 176], [240, 179], [280, 178], [305, 180],
        [95, 195], [140, 198], [185, 197], [230, 199], [270, 198], [305, 200],
      ].map(([x, y], i) => (
        <ellipse
          key={i}
          cx={x}
          cy={y}
          rx="18"
          ry="10"
          fill={
            i % 3 === 0 ? '#F2DF80' :   // potato (yellow)
            i % 3 === 1 ? '#7DB56E' :   // zucchini (green)
            '#D4564F'                    // tomato (red)
          }
          transform={`rotate(${i * 7 - 30} ${x} ${y})`}
        />
      ))}
      {/* Golden cheese overlay */}
      <ellipse cx="200" cy="175" rx="150" ry="85" fill="#F2CFA3" opacity="0.5" />
      {/* Browning bubbles */}
      {[[140, 155], [220, 162], [280, 170], [170, 200], [260, 205]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="7" ry="3" fill="#A66C3A" opacity="0.75" />
      ))}
      {/* Extra cheese drips */}
      <path d="M 130 230 Q 140 245, 135 265" stroke="#F2CFA3" strokeWidth="4" fill="none" opacity="0.85" />
      <path d="M 280 230 Q 285 245, 290 263" stroke="#F2CFA3" strokeWidth="4" fill="none" opacity="0.85" />
      {/* Thyme sprig */}
      <path d="M 200 145 L 200 135" stroke="#5A7A47" strokeWidth="1.5" />
      <circle cx="196" cy="140" r="1.5" fill="#5A7A47" />
      <circle cx="204" cy="138" r="1.5" fill="#5A7A47" />
      <circle cx="198" cy="135" r="1.5" fill="#5A7A47" />
      {/* Steam */}
      <path d="M 160 95 Q 170 75, 165 55" stroke="#fff" strokeWidth="2.5" fill="none" opacity="0.4" strokeLinecap="round" />
      <path d="M 235 95 Q 230 70, 240 50" stroke="#fff" strokeWidth="2.5" fill="none" opacity="0.4" strokeLinecap="round" />
    </Wrap>
  )
}

/* ═══════════════════════ 25. Pho Bo ═══════════════════════ */
export function IllPhoBo() {
  return (
    <Wrap id="pho" bg={['#E8C197', '#5A2E20']}>
      {/* Bowl */}
      <ellipse cx="200" cy="185" rx="160" ry="70" fill="#2A1F1A" />
      <ellipse cx="200" cy="175" rx="150" ry="60" fill="#F5EDD8" />
      {/* Broth */}
      <ellipse cx="200" cy="170" rx="140" ry="50" fill="#5A2E20" />
      <ellipse cx="200" cy="168" rx="135" ry="47" fill="#7A3E2F" opacity="0.85" />
      {/* Oil slicks */}
      {[[155, 155], [225, 170], [265, 158]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="10" fill="#E89735" opacity="0.55" />
      ))}
      {/* Rice noodles (flat pho noodles) */}
      {[...Array(10)].map((_, i) => (
        <path
          key={i}
          d={`M ${90 + i * 22} ${165 + (i % 3) * 4} Q ${200 + (i % 2) * 5} ${150}, ${310 - i * 15} ${170 + (i % 3) * 5}`}
          stroke="#FFFCF0"
          strokeWidth="3"
          fill="none"
          opacity="0.9"
          strokeLinecap="round"
        />
      ))}
      {/* Beef slices (thinly sliced rare) */}
      {[[150, 155], [200, 160], [245, 158]].map(([x, y], i) => (
        <path
          key={i}
          d={`M ${x - 18} ${y} Q ${x} ${y - 6}, ${x + 18} ${y} Q ${x + 12} ${y + 4}, ${x} ${y + 2} Q ${x - 12} ${y + 4}, ${x - 18} ${y} Z`}
          fill="#C44735"
          transform={`rotate(${i * 15} ${x} ${y})`}
        />
      ))}
      {/* Green herbs - basil, cilantro */}
      <path d="M 110 165 Q 100 160, 105 175 Q 115 178, 120 170 Z" fill="#3E5A3C" />
      <path d="M 290 170 Q 300 165, 300 180 Q 290 182, 285 175 Z" fill="#5A7A47" />
      <circle cx="165" cy="180" r="2" fill="#3E5A3C" />
      <circle cx="240" cy="150" r="2" fill="#3E5A3C" />
      <circle cx="205" cy="145" r="2" fill="#5A7A47" />
      {/* Bean sprouts */}
      <path d="M 130 195 Q 140 192, 150 198" stroke="#E8D5AB" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 260 195 Q 270 192, 280 198" stroke="#E8D5AB" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Lime wedge */}
      <path d="M 55 165 Q 35 160, 30 185 Q 55 190, 65 180 Z" fill="#C8D47C" />
      <path d="M 45 165 L 55 185" stroke="#F5EDD8" strokeWidth="1" />
      {/* Red chili */}
      <path d="M 340 160 Q 355 155, 360 175" stroke="#C44735" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Steam */}
      <path d="M 155 95 Q 165 70, 160 50" stroke="#fff" strokeWidth="3" fill="none" opacity="0.5" strokeLinecap="round" />
      <path d="M 215 95 Q 210 70, 220 50" stroke="#fff" strokeWidth="3" fill="none" opacity="0.5" strokeLinecap="round" />
      <path d="M 260 95 Q 270 75, 265 55" stroke="#fff" strokeWidth="3" fill="none" opacity="0.4" strokeLinecap="round" />
    </Wrap>
  )
}

/* ═══════════════════════ 26. Pulled Pork ═══════════════════════ */
export function IllPulledPork() {
  return (
    <Wrap id="pulled" bg={['#C4B087', '#2A1614']}>
      {/* Wooden board */}
      <rect x="30" y="170" width="340" height="100" rx="6" fill="#5A3A20" />
      <rect x="30" y="170" width="340" height="8" fill="#7A4A28" opacity="0.85" />
      {/* Burger bun (bottom) */}
      <ellipse cx="200" cy="215" rx="110" ry="20" fill="#D4A76A" />
      {/* Pulled pork pile */}
      <path d="M 100 210 Q 130 175, 170 185 Q 200 170, 230 185 Q 270 175, 300 210 Q 280 220, 200 225 Q 120 220, 100 210 Z" fill="#7A3E2F" />
      {/* Strand texture */}
      {[...Array(10)].map((_, i) => (
        <path
          key={i}
          d={`M ${110 + i * 18} ${200 - (i % 3) * 5} Q ${200 + i * 2} ${180 + (i % 2) * 8}, ${280 - i * 15} ${195 - (i % 3) * 4}`}
          stroke="#5A2E20"
          strokeWidth="2"
          fill="none"
          opacity="0.75"
          strokeLinecap="round"
        />
      ))}
      {/* BBQ sauce drizzle */}
      <path d="M 150 190 Q 200 200, 250 195" stroke="#4A1A14" strokeWidth="4" fill="none" opacity="0.85" />
      <path d="M 130 210 Q 200 218, 270 210" stroke="#4A1A14" strokeWidth="3" fill="none" opacity="0.7" />
      {/* Coleslaw on top */}
      <ellipse cx="200" cy="175" rx="65" ry="12" fill="#F5EDD8" />
      {[...Array(10)].map((_, i) => (
        <rect
          key={i}
          x={140 + i * 12}
          y={172}
          width="15"
          height="2"
          rx="1"
          fill={i % 2 ? '#A3C490' : '#E8A77C'}
          transform={`rotate(${i * 8 - 30} ${147 + i * 12} 173)`}
        />
      ))}
      {/* Bun top */}
      <ellipse cx="200" cy="150" rx="100" ry="18" fill="#D4A76A" />
      <ellipse cx="200" cy="147" rx="95" ry="14" fill="#E8C197" />
      {/* Sesame on top */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <ellipse key={i} cx={140 + i * 20} cy={145} rx="2" ry="1.2" fill="#FAF0D4" />
      ))}
      {/* Smoke (hickory BBQ) */}
      <path d="M 150 80 Q 140 60, 155 40 Q 145 25, 155 10" stroke="#A8A8A8" strokeWidth="3" fill="none" opacity="0.55" strokeLinecap="round" />
      <path d="M 250 85 Q 265 65, 255 45 Q 265 30, 250 15" stroke="#A8A8A8" strokeWidth="3" fill="none" opacity="0.55" strokeLinecap="round" />
    </Wrap>
  )
}

/* ═══════════════════════ 27. Rotisserie-Hähnchen ═══════════════════════ */
export function IllRotisserie() {
  return (
    <Wrap id="rotisserie" bg={['#F5E9D5', '#A66C3A']}>
      {/* Board */}
      <ellipse cx="200" cy="220" rx="175" ry="35" fill="#5A3A20" />
      <ellipse cx="200" cy="215" rx="170" ry="30" fill="#7A4A28" opacity="0.8" />
      {/* Whole roasted chicken - golden crispy */}
      <ellipse cx="200" cy="170" rx="110" ry="72" fill="#A66C3A" />
      <ellipse cx="200" cy="160" rx="105" ry="65" fill="#D4A76A" />
      {/* Skin highlights */}
      <ellipse cx="180" cy="140" rx="40" ry="25" fill="#E8C197" opacity="0.7" />
      <ellipse cx="230" cy="155" rx="30" ry="18" fill="#F2CFA3" opacity="0.6" />
      {/* Drumstick bones sticking out */}
      <path d="M 110 175 L 80 190 L 78 195 L 105 185 Z" fill="#F5EDD8" />
      <path d="M 290 175 L 320 190 L 322 195 L 295 185 Z" fill="#F5EDD8" />
      {/* Wing */}
      <ellipse cx="128" cy="155" rx="18" ry="12" fill="#A66C3A" />
      <ellipse cx="272" cy="155" rx="18" ry="12" fill="#A66C3A" />
      {/* Char spots */}
      <ellipse cx="170" cy="130" rx="5" ry="3" fill="#5A2E20" opacity="0.85" />
      <ellipse cx="220" cy="140" rx="6" ry="3" fill="#5A2E20" opacity="0.85" />
      <ellipse cx="195" cy="190" rx="7" ry="3" fill="#5A2E20" opacity="0.85" />
      {/* Herbs on top */}
      <path d="M 185 110 L 200 105 L 215 110 Q 205 115, 200 112 Q 190 115, 185 110 Z" fill="#5A7A47" />
      {/* Rosemary sprig */}
      <path d="M 200 105 L 200 90" stroke="#5A7A47" strokeWidth="2" />
      {[[197, 98], [203, 96], [199, 93]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.2" fill="#5A7A47" />
      ))}
      {/* Lemon wedges beside */}
      <path d="M 55 220 Q 30 215, 30 240 Q 55 245, 70 235 Z" fill="#F2DF80" />
      <path d="M 330 220 Q 355 215, 358 240 Q 335 245, 325 235 Z" fill="#F2DF80" />
      {/* Garlic cloves */}
      <ellipse cx="125" cy="230" rx="10" ry="14" fill="#FAF0D4" stroke="#D4BC7C" strokeWidth="1" />
      <ellipse cx="275" cy="232" rx="10" ry="14" fill="#FAF0D4" stroke="#D4BC7C" strokeWidth="1" />
      {/* Steam */}
      <path d="M 170 80 Q 180 60, 175 40" stroke="#fff" strokeWidth="3" fill="none" opacity="0.45" strokeLinecap="round" />
      <path d="M 225 80 Q 220 55, 230 35" stroke="#fff" strokeWidth="3" fill="none" opacity="0.45" strokeLinecap="round" />
    </Wrap>
  )
}

/* ═══════════════════════ 28. Boeuf Bourguignon ═══════════════════════ */
export function IllBourguignon() {
  return (
    <Wrap id="bourg" bg={['#E8C197', '#6B2E3E']}>
      {/* Dutch oven (cast iron) */}
      <ellipse cx="200" cy="190" rx="165" ry="75" fill="#1A1614" />
      <ellipse cx="200" cy="180" rx="155" ry="65" fill="#2A1614" />
      {/* Wine-dark stew */}
      <ellipse cx="200" cy="175" rx="145" ry="55" fill="#4A1A2E" />
      <ellipse cx="200" cy="170" rx="138" ry="48" fill="#6B2E3E" />
      <ellipse cx="198" cy="165" rx="130" ry="42" fill="#8B3E4A" opacity="0.75" />
      {/* Beef chunks */}
      {[[140, 160], [180, 170], [225, 155], [260, 170], [195, 185]].map(([x, y], i) => (
        <g key={i}>
          <rect x={x - 12} y={y - 10} width="24" height="20" rx="3" fill="#5A2E20" transform={`rotate(${i * 20} ${x} ${y})`} />
          <rect x={x - 10} y={y - 8} width="20" height="16" rx="2" fill="#7A3E2F" transform={`rotate(${i * 20} ${x} ${y})`} />
        </g>
      ))}
      {/* Pearl onions */}
      {[[110, 175], [310, 170], [155, 195], [280, 190]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="10" fill="#FAF0D4" />
          <circle cx={x} cy={y - 3} r="7" fill="#FFFCF0" />
          <path d={`M ${x - 4} ${y - 8} Q ${x} ${y - 11}, ${x + 4} ${y - 8}`} stroke="#D4BC7C" strokeWidth="1" fill="none" />
        </g>
      ))}
      {/* Mushrooms */}
      {[[145, 180], [220, 190], [275, 175]].map(([x, y], i) => (
        <g key={i}>
          <path d={`M ${x - 10} ${y} Q ${x} ${y - 8}, ${x + 10} ${y} L ${x + 8} ${y + 6} L ${x - 8} ${y + 6} Z`} fill="#D4A76A" />
          <rect x={x - 5} y={y + 5} width="10" height="5" rx="1" fill="#FAF0D4" />
        </g>
      ))}
      {/* Carrots */}
      <path d="M 120 155 Q 115 150, 125 150 L 150 158 Q 147 162, 120 160 Z" fill="#E89735" />
      <path d="M 270 200 Q 280 200, 285 205 L 300 210 Q 295 215, 270 205 Z" fill="#E89735" />
      {/* Herb sprig */}
      <path d="M 195 145 L 200 130" stroke="#3E5A3C" strokeWidth="1.5" />
      {[[197, 140], [202, 135], [200, 132]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.5" fill="#3E5A3C" />
      ))}
      {/* Bay leaf */}
      <path d="M 240 145 Q 255 140, 260 155 Q 245 160, 240 145 Z" fill="#5A7A47" />
      {/* Steam */}
      <path d="M 165 95 Q 175 70, 170 50" stroke="#fff" strokeWidth="3" fill="none" opacity="0.4" strokeLinecap="round" />
      <path d="M 230 95 Q 225 65, 235 45" stroke="#fff" strokeWidth="3" fill="none" opacity="0.4" strokeLinecap="round" />
    </Wrap>
  )
}

/* ═══════════════════════ 29. Moussaka ═══════════════════════ */
export function IllMoussaka() {
  return (
    <Wrap id="moussaka" bg={['#F5E9D5', '#5A8FBA']}>
      {/* Baking dish */}
      <rect x="40" y="85" width="320" height="185" rx="12" fill="#3E3A3A" />
      <rect x="50" y="95" width="300" height="165" rx="8" fill="#5A2E20" />
      {/* Layered cross-section */}
      {/* Potatoes bottom */}
      <rect x="60" y="225" width="280" height="25" fill="#F2DF80" />
      <path d="M 60 225 Q 100 220, 150 225 Q 200 222, 250 225 Q 300 222, 340 225" stroke="#D4A76A" strokeWidth="2" fill="none" />
      {/* Aubergine layer (purple) */}
      <rect x="60" y="200" width="280" height="25" fill="#4A2E3E" />
      {[[90, 212], [140, 210], [195, 213], [250, 210], [305, 213]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="20" ry="6" fill="#6B2E3E" opacity="0.85" />
      ))}
      {/* Ragù (fleischsauce) */}
      <rect x="60" y="175" width="280" height="25" fill="#C44735" />
      {[...Array(15)].map((_, i) => (
        <circle
          key={i}
          cx={70 + (i * 19) % 270}
          cy={183 + (i * 5) % 15}
          r="2.5"
          fill="#5A2E20"
        />
      ))}
      {/* Aubergine second layer */}
      <rect x="60" y="150" width="280" height="25" fill="#4A2E3E" />
      {[[95, 162], [150, 160], [205, 163], [260, 160], [315, 162]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="20" ry="6" fill="#6B2E3E" opacity="0.85" />
      ))}
      {/* Béchamel top (golden brown) */}
      <rect x="60" y="115" width="280" height="35" fill="#FAF0D4" />
      <path d="M 60 115 Q 100 108, 140 115 Q 190 105, 240 115 Q 290 108, 340 115" stroke="#E8C197" strokeWidth="2" fill="none" />
      {/* Browning spots */}
      <ellipse cx="100" cy="125" rx="10" ry="4" fill="#C4A05A" opacity="0.7" />
      <ellipse cx="175" cy="122" rx="12" ry="4" fill="#A66C3A" opacity="0.65" />
      <ellipse cx="260" cy="125" rx="11" ry="4" fill="#C4A05A" opacity="0.7" />
      <ellipse cx="320" cy="122" rx="9" ry="4" fill="#A66C3A" opacity="0.65" />
      {/* Cheese bubbles */}
      <circle cx="135" cy="120" r="4" fill="#E8C197" />
      <circle cx="215" cy="128" r="4" fill="#E8C197" />
      <circle cx="290" cy="120" r="3" fill="#E8C197" />
      {/* Oregano */}
      <circle cx="120" cy="108" r="1.5" fill="#5A7A47" />
      <circle cx="200" cy="106" r="1.5" fill="#5A7A47" />
      <circle cx="280" cy="108" r="1.5" fill="#5A7A47" />
      {/* Steam */}
      <path d="M 170 80 Q 180 60, 175 40" stroke="#fff" strokeWidth="2.5" fill="none" opacity="0.4" strokeLinecap="round" />
      <path d="M 230 80 Q 225 55, 235 35" stroke="#fff" strokeWidth="2.5" fill="none" opacity="0.4" strokeLinecap="round" />
    </Wrap>
  )
}

/* ═══════════════════════ 30. Ramen ═══════════════════════ */
export function IllRamen() {
  return (
    <Wrap id="ramen" bg={['#F4E4C1', '#C94F4F']}>
      {/* Ramen bowl (wide dark) */}
      <ellipse cx="200" cy="190" rx="165" ry="70" fill="#1A1614" />
      <ellipse cx="200" cy="180" rx="155" ry="60" fill="#2A1614" />
      <ellipse cx="200" cy="175" rx="148" ry="55" fill="#C94F4F" />
      {/* Broth shoyu color */}
      <ellipse cx="200" cy="172" rx="140" ry="48" fill="#8B3E2F" />
      <ellipse cx="200" cy="170" rx="135" ry="45" fill="#A66C3A" opacity="0.9" />
      {/* Oil slicks characteristic */}
      {[[150, 155], [220, 170], [260, 158]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="10" fill="#E8A835" opacity="0.55" />
      ))}
      {/* Noodles (curled wavy) */}
      {[...Array(11)].map((_, i) => (
        <path
          key={i}
          d={`M ${85 + i * 22} ${150 + (i % 3) * 6} Q ${130 + i * 10} ${135 + (i % 4) * 5}, ${190 + i * 5} ${148 + (i % 3) * 4} Q ${260 + i * 3} ${138 + (i % 2) * 8}, ${315 - i * 10} ${162 + (i % 4) * 4}`}
          stroke="#F2DF80"
          strokeWidth="3"
          fill="none"
          opacity="0.95"
          strokeLinecap="round"
        />
      ))}
      {/* Chashu (pork belly slice) */}
      <ellipse cx="155" cy="170" rx="28" ry="15" fill="#D4946A" />
      <path d="M 130 168 Q 155 162, 180 172" stroke="#7A3E2F" strokeWidth="3" fill="none" />
      <path d="M 135 175 Q 155 178, 178 180" stroke="#7A3E2F" strokeWidth="2" fill="none" />
      {/* Ajitsuke Tamago (marinated egg half) */}
      <ellipse cx="250" cy="160" rx="22" ry="25" fill="#FFF8EA" />
      <ellipse cx="250" cy="158" rx="12" ry="14" fill="#E8A835" />
      {/* Nori strip (standing up) */}
      <rect x="285" y="120" width="8" height="55" fill="#1F3A2E" />
      <rect x="285" y="120" width="8" height="55" fill="#2A3E35" opacity="0.6" />
      {/* Green onions */}
      {[[180, 155], [215, 148], [270, 180], [130, 185]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="3.5" fill="#7DB56E" />
          <circle cx={x} cy={y} r="2" fill="#5A7A47" />
        </g>
      ))}
      {/* Sesame */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <ellipse key={i} cx={160 + i * 25} cy={185 + (i % 2) * 8} rx="1.5" ry="1" fill="#F5EDD8" />
      ))}
      {/* Corn kernels */}
      <circle cx="190" cy="195" r="3" fill="#F2DF80" />
      <circle cx="200" cy="195" r="3" fill="#F2DF80" />
      <circle cx="210" cy="195" r="3" fill="#F2DF80" />
      {/* Bamboo (menma) */}
      <rect x="118" y="162" width="22" height="4" rx="1" fill="#E8D56B" />
      <rect x="120" y="170" width="20" height="4" rx="1" fill="#C4A05A" />
      {/* Chopsticks */}
      <rect x="50" y="100" width="190" height="4" rx="2" fill="#A66C3A" transform="rotate(-20 145 102)" />
      <rect x="60" y="115" width="185" height="4" rx="2" fill="#A66C3A" transform="rotate(-22 152 117)" />
      {/* Steam */}
      <path d="M 160 90 Q 170 65, 165 45" stroke="#fff" strokeWidth="3" fill="none" opacity="0.45" strokeLinecap="round" />
      <path d="M 215 90 Q 210 60, 220 40" stroke="#fff" strokeWidth="3" fill="none" opacity="0.45" strokeLinecap="round" />
      <path d="M 260 90 Q 270 70, 265 50" stroke="#fff" strokeWidth="3" fill="none" opacity="0.4" strokeLinecap="round" />
    </Wrap>
  )
}

/* ═══════════════════════ Registry ═══════════════════════ */
export const ILLUSTRATIONS = {
  'bolognese-basis':       IllBolognese,
  'aglio-e-olio':          IllAglio,
  'shakshuka':             IllShakshuka,
  'thai-erdnussnudeln':    IllPeanutNoodles,
  'teriyaki-bowl':         IllTeriyaki,
  'korean-beef-bowl':      IllKoreanBeef,
  'linsen-dal':            IllDal,
  'miso-lachs':            IllMisoLachs,
  'caprese-quinoa-bowl':   IllCaprese,
  'hummus-falafel':        IllHummusFalafel,
  'overnight-oats':        IllOvernightOats,
  'maki-rollen':           IllMaki,
  'rotes-thai-curry':      IllThaiCurry,
  'haehnchen-shawarma':    IllShawarma,
  'gemuese-lasagne':       IllLasagne,
  'chicken-katsu':         IllKatsu,
  'chana-masala':          IllChanaMasala,
  'pad-thai':              IllPadThai,
  'tom-kha-gai':           IllTomKha,
  'mapo-tofu':             IllMapoTofu,
  'caponata':              IllCaponata,
  'baba-ganoush-kofta':    IllBabaKofta,
  'bun-bo-nam-bo':         IllBunBoNamBo,
  'gemuese-ofen-gratin':   IllGratin,
  'pho-bo':                IllPhoBo,
  'pulled-pork-bge':       IllPulledPork,
  'rotisserie-huhn-bge':   IllRotisserie,
  'boeuf-bourguignon':     IllBourguignon,
  'moussaka':              IllMoussaka,
  'ramen-shoyu':           IllRamen,
}

export function illustrationFor(recipeId) {
  return ILLUSTRATIONS[recipeId] ?? null
}
