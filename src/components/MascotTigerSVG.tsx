import React from 'react';

interface MascotProps {
  className?: string;
  emoji?: string;
}

export const MascotTigerSVG: React.FC<MascotProps> = ({ className = "w-full h-full", emoji }) => {
  // Girls/Default - Cute anime girl with shiny sparkles
  if (emoji === "👧") {
    return (
      <svg viewBox="0 0 200 200" className={className}>
        <circle cx="100" cy="100" r="90" fill="#fce7f3" opacity="0.6"/>
        <g className="animate-mascot-breath">
          <path d="M40,50 L43,55 L49,55 L44,59 L46,65 L40,61 L34,65 L36,59 L31,55 L37,55 Z" fill="#fef08a" className="animate-star-blink"/>
          <path d="M160,70 L162,73 L167,73 L163,76 L165,81 L160,78 L155,81 L157,76 L153,73 L158,73 Z" fill="#fef08a" style={{ animation: 'starBlink 2.5s infinite' }}/>
          
          <circle cx="50" cy="90" r="22" fill="#78350f"/>
          <circle cx="150" cy="90" r="22" fill="#78350f"/>
          <path d="M52,72 L62,76 L52,80 Z" fill="#ec4899"/>
          <path d="M148,72 L138,76 L148,80 Z" fill="#ec4899"/>
          
          <circle cx="100" cy="100" r="50" fill="#fed7aa"/>
          
          <path d="M50,90 Q100,50 150,90 Q100,75 50,90" fill="#78350f"/>
          <path d="M80,75 Q90,90 100,80 Q110,90 120,75" fill="#78350f"/>
          
          <ellipse cx="75" cy="115" rx="10" ry="6" fill="#f43f5e" opacity="0.4"/>
          <ellipse cx="125" cy="115" rx="10" ry="6" fill="#f43f5e" opacity="0.4"/>
          
          <circle cx="78" cy="105" r="9" fill="#1e293b"/>
          <circle cx="76" cy="102" r="3.5" fill="#ffffff"/>
          <circle cx="80" cy="107" r="1.5" fill="#ffffff"/>
          
          <circle cx="122" cy="105" r="9" fill="#1e293b"/>
          <circle cx="120" cy="102" r="3.5" fill="#ffffff"/>
          <circle cx="124" cy="107" r="1.5" fill="#ffffff"/>
          
          <path d="M92,118 Q100,128 108,118 Z" fill="#e11d48"/>
          
          <path d="M75,148 L125,148 L120,175 L80,175 Z" fill="#3b82f6"/>
          <path d="M75,148 L100,160 L125,148" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2"/>
          <polygon points="100,158 102,163 107,163 103,166 105,171 100,168 95,171 97,166 93,163 98,163" fill="#facc15"/>
        </g>
      </svg>
    );
  } 
  
  // Magical pastel unicorn
  if (emoji === "🦄") {
    return (
      <svg viewBox="0 0 200 200" className={className}>
        <circle cx="100" cy="100" r="90" fill="#f3e8ff" opacity="0.7"/>
        <g className="animate-mascot-breath">
          <path d="M30,130 Q100,60 170,130" fill="none" stroke="#fecdd3" strokeWidth="6" opacity="0.5"/>
          <path d="M40,135 Q100,73 160,135" fill="none" stroke="#e0f2fe" strokeWidth="6" opacity="0.5"/>
          
          <polygon points="50,45 52,50 57,50 53,53 55,58 50,55 45,58 47,53 43,50 48,50" fill="#fef08a" className="animate-star-blink"/>
          
          <path d="M70,80 Q60,40 80,55 Z" fill="#faf5ff" stroke="#ddd6fe" strokeWidth="2"/>
          <path d="M72,75 Q66,48 78,58 Z" fill="#fbcfe8"/>
          
          <path d="M110,65 Q150,70 140,120 Q120,130 110,110 Z" fill="#f472b6"/>
          <path d="M120,80 Q160,90 145,135 Q125,140 115,120 Z" fill="#38bdf8"/>
          
          <path d="M75,95 C75,70 125,70 125,95 C125,115 115,130 95,130 C75,130 75,115 75,95 Z" fill="#ffffff" stroke="#ddd6fe" strokeWidth="2"/>
          
          <path d="M85,115 C85,108 115,108 115,115 C115,126 85,126 85,115 Z" fill="#fdf2f8"/>
          <circle cx="95" cy="115" r="2" fill="#db2777"/>
          <circle cx="105" cy="115" r="2" fill="#db2777"/>
          
          <polygon points="95,65 105,65 100,25" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1.5" className="animate-ear-wiggle"/>
          <line x1="97" y1="50" x2="103" y2="54" stroke="#ffffff" strokeWidth="1.5"/>
          <line x1="98" y1="38" x2="102" y2="41" stroke="#ffffff" strokeWidth="1.5"/>
          
          <path d="M85,92 Q92,100 100,92" fill="none" stroke="#4a044e" strokeWidth="3" strokeLinecap="round"/>
          <path d="M82,90 L80,86" stroke="#4a044e" strokeWidth="2"/>
          <path d="M102,90 L104,86" stroke="#4a044e" strokeWidth="2"/>
          
          <circle cx="112" cy="102" r="8" fill="#f43f5e" opacity="0.3"/>
        </g>
      </svg>
    );
  } 

  // Boy with cute academic glasses
  if (emoji === "👦") {
    return (
      <svg viewBox="0 0 200 200" className={className}>
        <circle cx="100" cy="100" r="90" fill="#dbeafe" opacity="0.6"/>
        <g className="animate-mascot-breath">
          <circle cx="100" cy="100" r="50" fill="#ffedd5"/>
          <path d="M50,90 Q100,40 150,90 Z" fill="#1e3a8a"/>
          <circle cx="80" cy="105" r="16" fill="none" stroke="#f59e0b" strokeWidth="4"/>
          <circle cx="120" cy="105" r="16" fill="none" stroke="#f59e0b" strokeWidth="4"/>
          <line x1="96" y1="105" x2="104" y2="105" stroke="#f59e0b" strokeWidth="4"/>
          <circle cx="80" cy="105" r="4" fill="#1e293b"/>
          <circle cx="120" cy="105" r="4" fill="#1e293b"/>
          <circle cx="65" cy="118" r="6" fill="#ef4444" opacity="0.3"/>
          <circle cx="135" cy="118" r="6" fill="#ef4444" opacity="0.3"/>
          <path d="M93,120 Q100,128 107,120" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round"/>
        </g>
      </svg>
    );
  }

  // Dino reader / general default (Chú hổ default cực xinh)
  return (
    <svg viewBox="0 0 100 100" className={className}>
      {/* Ears */}
      <circle cx="32" cy="40" r="11" fill="#d97706"/>
      <circle cx="32" cy="40" r="6" fill="#ffedd5"/>
      <circle cx="68" cy="40" r="11" fill="#d97706"/>
      <circle cx="68" cy="40" r="6" fill="#ffedd5"/>
      {/* Head */}
      <circle cx="50" cy="62" r="25" fill="#f97316"/>
      {/* Cheeks/Muzzle */}
      <ellipse cx="44" cy="68" rx="8" ry="6.5" fill="#ffffff"/>
      <ellipse cx="56" cy="68" rx="8" ry="6.5" fill="#ffffff"/>
      {/* Nose */}
      <polygon points="50,64 47,60 53,60" fill="#e11d48"/>
      {/* Eyes */}
      <circle cx="41" cy="56" r="3.5" fill="#1e293b"/>
      <circle cx="39.5" cy="54.5" r="1" fill="#ffffff"/>
      <circle cx="59" cy="56" r="3.5" fill="#1e293b"/>
      <circle cx="57.5" cy="54.5" r="1" fill="#ffffff"/>
      {/* Stripes on head */}
      <path d="M50,39 L50,45" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M44,41 L46,45" stroke="#78350f" strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M56,41 L54,45" stroke="#78350f" strokeWidth="2.2" strokeLinecap="round"/>
      {/* Side whiskers/stripes */}
      <path d="M27,60 L32,61" stroke="#78350f" strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M73,60 L68,61" stroke="#78350f" strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  );
};
