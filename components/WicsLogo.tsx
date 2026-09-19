import React from 'react';

interface WicsLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  sizePx?: number;
  showText?: boolean;
  bilingual?: boolean;
  customLogoUrl?: string;
  logoFrameStyle?: 'transparent' | 'white-card' | 'white-circle';
}

export default function WicsLogo({ 
  className = '', 
  size = 'md', 
  sizePx,
  showText = true,
  bilingual = true,
  customLogoUrl,
  logoFrameStyle = 'transparent'
}: WicsLogoProps) {
  const [imageError, setImageError] = React.useState(false);

  // Compute precise height in pixels
  const effectiveHeight = sizePx 
    ? Math.min(Math.max(sizePx, 28), 76) 
    : size === 'sm' ? 36 : size === 'lg' ? 64 : 48;

  const titleSize = effectiveHeight <= 38 
    ? 'text-xs' 
    : effectiveHeight >= 60 
    ? 'text-base sm:text-lg' 
    : 'text-sm sm:text-base';

  const subtitleSize = effectiveHeight <= 38
    ? 'text-[10px]'
    : effectiveHeight >= 60
    ? 'text-xs'
    : 'text-[11px]';

  const showCustom = Boolean(customLogoUrl && !imageError);

  // Frameless is completely transparent with no border, no background box, and no shadow
  const isFrameless = logoFrameStyle === 'transparent';

  const frameClasses = isFrameless
    ? 'relative flex items-center justify-center flex-shrink-0 bg-transparent border-0 shadow-none p-0 overflow-visible'
    : logoFrameStyle === 'white-circle'
    ? 'relative rounded-full bg-white border border-stone-200 flex items-center justify-center shadow-xs flex-shrink-0 p-1.5 overflow-hidden'
    : 'relative rounded-xl bg-white border border-stone-200 flex items-center justify-center shadow-xs flex-shrink-0 p-1.5 overflow-hidden';

  const emblemStyle: React.CSSProperties = {
    height: `${effectiveHeight}px`,
    width: isFrameless ? 'auto' : `${effectiveHeight}px`,
    minWidth: isFrameless ? `${effectiveHeight * 0.75}px` : `${effectiveHeight}px`,
    maxHeight: '68px',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Emblem / Logo Graphic - Frameless and scalable */}
      <div className={frameClasses} style={emblemStyle}>
        {showCustom ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={customLogoUrl}
            alt="Logo"
            className="h-full w-auto max-h-full max-w-full object-contain drop-shadow-xs transition-all duration-200"
            onError={() => setImageError(true)}
          />
        ) : (
          <svg 
            viewBox="0 0 100 100" 
            className="h-full w-full object-contain" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: `${effectiveHeight}px`, height: `${effectiveHeight}px` }}
          >
            {/* Frameless transparent emblem with crisp royal blue and gold accents */}
            <circle cx="50" cy="50" r="46" stroke="#b45309" strokeWidth="2.5" strokeDasharray="3 2" />
            <circle cx="50" cy="50" r="40" stroke="#1e3a8a" strokeWidth="2" />
            
            {/* Globe latitude / longitude grid lines */}
            <ellipse cx="50" cy="50" rx="34" ry="34" stroke="#1e40af" strokeWidth="1.2" opacity="0.85" />
            <ellipse cx="50" cy="50" rx="18" ry="34" stroke="#2563eb" strokeWidth="1.2" opacity="0.75" />
            <line x1="16" y1="50" x2="84" y2="50" stroke="#2563eb" strokeWidth="1.5" opacity="0.8" />
            <line x1="22" y1="36" x2="78" y2="36" stroke="#3b82f6" strokeWidth="1" opacity="0.6" />
            <line x1="22" y1="64" x2="78" y2="64" stroke="#3b82f6" strokeWidth="1" opacity="0.6" />
            
            {/* Crescent Moon */}
            <path 
              d="M58 24 C44 26 34 38 34 52 C34 66 44 78 58 80 C50 78 44 68 44 52 C44 36 50 26 58 24 Z" 
              fill="#d97706" 
            />
            
            {/* Star & Central Symbol */}
            <path 
              d="M56 46 L62 40 L68 46 L62 52 Z" 
              fill="#1e3a8a" 
            />
            <circle cx="62" cy="46" r="3" fill="#d97706" />
            <path 
              d="M48 48 Q 58 42 68 48 Q 58 54 48 48 Z" 
              fill="#2563eb" 
              opacity="0.9" 
            />
          </svg>
        )}
      </div>

      {showText && (
        <div className="flex flex-col justify-center leading-tight select-none">
          <span className={`font-bold text-blue-950 tracking-tight ${titleSize} font-arabic`}>
            جمعية الدعوة الإسلامية العالمية
          </span>
          {bilingual && (
            <>
              <span className={`${subtitleSize} font-bold tracking-wider text-blue-800 uppercase`}>
                World Islamic Call Society
              </span>
              <span className="text-[10px] text-stone-500 font-medium">
                Ured Sarajevo • Представништво Сарајево
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
