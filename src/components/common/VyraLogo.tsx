import React, { useState } from 'react';

interface VyraLogoProps {
  variant?: 'full' | 'horizontal' | 'icon' | 'badge';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
}

export const VyraLogo: React.FC<VyraLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  showSubtitle = true,
  className = '',
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  // Fallback SVG Icon if image fails to load in an offline or headless environment
  const renderSvgFallback = (dimension: number) => (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform hover:scale-105 duration-300"
    >
      <defs>
        <linearGradient id="vyraFallbackGrad" x1="40" y1="30" x2="160" y2="170" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0F3A57" />
          <stop offset="40%" stopColor="#234C68" />
          <stop offset="75%" stopColor="#4A88AC" />
          <stop offset="100%" stopColor="#7FB7D6" />
        </linearGradient>
        <radialGradient id="vyraInnerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#EFF9FD" stopOpacity="0.95" />
          <stop offset="70%" stopColor="#B2CBD8" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0F3A57" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="100" rx="36" ry="46" fill="url(#vyraInnerGlow)" />
      <path
        d="M100 152C88 146 62 128 54 106C44 80 52 50 78 40C96 32 116 38 126 52C136 66 142 86 138 106C132 130 114 148 100 152Z"
        stroke="url(#vyraFallbackGrad)"
        strokeWidth="15"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M86 52C72 62 68 84 76 102C82 116 94 126 100 128C106 126 118 116 124 102C132 84 128 62 114 52C106 46 94 46 86 52Z"
        stroke="url(#vyraFallbackGrad)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );

  // Variant 1: FULL OFFICIAL EMBLEM (Displays uploaded vyra.jpeg directly)
  if (variant === 'full') {
    const sizeMap = {
      xs: { width: 140, maxH: 80, badgeH: 120 },
      sm: { width: 200, maxH: 110, badgeH: 160 },
      md: { width: 280, maxH: 160, badgeH: 220 },
      lg: { width: 340, maxH: 190, badgeH: 260 },
      xl: { width: 420, maxH: 230, badgeH: 320 },
    }[size];

    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <div className="relative group transition-transform hover:scale-[1.02] duration-300">
          {!imageFailed ? (
            <div className="rounded-3xl p-2.5 bg-white shadow-xl border-2 border-[#0F3A57]/30 flex flex-col items-center">
              <img
                src="/vyra.jpeg"
                alt="VYRA - Mental Health + Technology"
                style={{ maxWidth: sizeMap.width }}
                className="w-full h-auto object-contain rounded-2xl"
                onError={() => setImageFailed(true)}
              />
            </div>
          ) : (
            <div
              style={{ width: sizeMap.badgeH, height: sizeMap.badgeH }}
              className="rounded-full border-[5px] border-[#0F3A57] bg-white flex flex-col items-center justify-center p-4 shadow-xl"
            >
              <div className="mt-1">{renderSvgFallback(sizeMap.badgeH * 0.45)}</div>
              <span className="font-black tracking-[0.25em] text-[#0F3A57] text-2xl mt-2 select-none">
                VYRA
              </span>
              {showSubtitle && (
                <span className="font-medium tracking-wider text-[#234C68] text-[10px] select-none whitespace-nowrap mt-0.5">
                  Mental Health + Technology
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Variant 2: ICON ONLY
  if (variant === 'icon') {
    const iconDim = { xs: 26, sm: 34, md: 44, lg: 56, xl: 72 }[size];
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {!imageFailed ? (
          <img
            src="/vyra.jpeg"
            alt="VYRA"
            style={{ width: iconDim, height: iconDim }}
            className="rounded-full object-cover border border-[#0F3A57]/30 shadow-xs"
            onError={() => setImageFailed(true)}
          />
        ) : (
          renderSvgFallback(iconDim)
        )}
      </div>
    );
  }

  // Variant 3: BADGE (Circular mini-badge)
  if (variant === 'badge') {
    const badgeSizes = {
      xs: { dim: 32 },
      sm: { dim: 40 },
      md: { dim: 48 },
      lg: { dim: 60 },
      xl: { dim: 76 },
    }[size];

    return (
      <div
        style={{ width: badgeSizes.dim, height: badgeSizes.dim }}
        className={`rounded-full border-2 border-[#0F3A57] bg-white flex items-center justify-center shadow-xs overflow-hidden shrink-0 ${className}`}
      >
        {!imageFailed ? (
          <img
            src="/vyra.jpeg"
            alt="VYRA"
            className="w-full h-full object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          renderSvgFallback(badgeSizes.dim * 0.7)
        )}
      </div>
    );
  }

  // Variant 4: HORIZONTAL LOCKUP (for Top Navbar / Headers)
  const horizSizes = {
    xs: { icon: 26, text: 'text-base', sub: 'text-[9px]' },
    sm: { icon: 34, text: 'text-lg', sub: 'text-[10px]' },
    md: { icon: 40, text: 'text-xl', sub: 'text-[11px]' },
    lg: { icon: 50, text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 62, text: 'text-3xl', sub: 'text-sm' },
  }[size];

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 ${className}`}>
      <div className="p-0.5 rounded-full border border-[#0F3A57]/40 bg-white shadow-xs overflow-hidden shrink-0">
        {!imageFailed ? (
          <img
            src="/vyra.jpeg"
            alt="VYRA Logo"
            style={{ width: horizSizes.icon, height: horizSizes.icon }}
            className="object-cover rounded-full"
            onError={() => setImageFailed(true)}
          />
        ) : (
          renderSvgFallback(horizSizes.icon)
        )}
      </div>
      <div className="flex flex-col text-left">
        <span className={`font-black tracking-[0.2em] text-[#0F3A57] leading-none ${horizSizes.text}`}>
          VYRA
        </span>
        {showSubtitle && (
          <span className={`font-medium tracking-wider text-[#547489] leading-tight mt-0.5 ${horizSizes.sub}`}>
            Mental Health + Technology
          </span>
        )}
      </div>
    </div>
  );
};
