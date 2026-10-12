import React, { useState, useEffect } from 'react';
import { CompanionId, CompanionAccessoryId } from '../../types';

interface InteractiveCartoonCharacterProps {
  companionId: CompanionId;
  accessory?: CompanionAccessoryId;
  mood?: 'happy' | 'peaceful' | 'sleepy' | 'cheering' | 'curious';
  isInteracting?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
  showHearts?: boolean;
}

export const InteractiveCartoonCharacter: React.FC<InteractiveCartoonCharacterProps> = ({
  companionId,
  accessory = 'crown',
  mood = 'happy',
  isInteracting = false,
  size = 'md',
  onClick,
  showHearts = false,
}) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [localJelly, setLocalJelly] = useState(false);

  // Natural eye blink timer
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
    }, 3800 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  const handleClick = () => {
    setLocalJelly(true);
    setTimeout(() => setLocalJelly(false), 600);
    if (onClick) onClick();
  };

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-28 h-28',
    lg: 'w-40 h-40',
    xl: 'w-56 h-56',
  }[size];

  // Render cartoon accessories
  const renderAccessory = () => {
    switch (accessory) {
      case 'crown':
        return (
          <g className="animate-star-shimmer origin-center">
            {/* Golden Leaf Laurel / Crown */}
            <path
              d="M 68 34 Q 100 24 132 34"
              stroke="#F59E0B"
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
            />
            {/* Leaves */}
            <path d="M 78 30 C 72 20 86 18 84 28 Z" fill="#FBBF24" />
            <path d="M 100 24 C 95 12 105 12 100 24 Z" fill="#F59E0B" />
            <path d="M 122 30 C 128 20 114 18 116 28 Z" fill="#FBBF24" />
            {/* Sparkle jewels */}
            <circle cx="100" cy="18" r="3.5" fill="#FEF08A" />
            <circle cx="82" cy="24" r="2.5" fill="#FEF08A" />
            <circle cx="118" cy="24" r="2.5" fill="#FEF08A" />
          </g>
        );
      case 'flower':
        return (
          <g transform="translate(118, 42)">
            {/* Daisy flower */}
            <circle cx="-10" cy="0" r="6" fill="#F472B6" />
            <circle cx="10" cy="0" r="6" fill="#F472B6" />
            <circle cx="0" cy="-10" r="6" fill="#F472B6" />
            <circle cx="0" cy="10" r="6" fill="#F472B6" />
            <circle cx="0" cy="0" r="6.5" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" />
          </g>
        );
      case 'scarf':
        return (
          <g>
            {/* Cozy Knitted Scarf */}
            <path
              d="M 72 135 C 85 146 115 146 128 135 C 132 144 120 152 100 152 C 80 152 68 144 72 135 Z"
              fill="#F43F5E"
            />
            {/* Scarf tail */}
            <path
              d="M 112 144 C 114 165 118 178 126 186 C 118 188 110 180 106 150 Z"
              fill="#E11D48"
            />
            <path d="M 116 182 L 126 186" stroke="#FFE4E6" strokeWidth="2" strokeDasharray="2 2" />
          </g>
        );
      case 'glasses':
        return (
          <g>
            {/* Cute round retro glasses */}
            <circle cx="80" cy="98" r="14" fill="none" stroke="#1E293B" strokeWidth="3" />
            <circle cx="120" cy="98" r="14" fill="none" stroke="#1E293B" strokeWidth="3" />
            <path d="M 94 98 Q 100 95 106 98" stroke="#1E293B" strokeWidth="3" fill="none" />
            {/* Lens reflections */}
            <path d="M 74 94 L 84 90" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
            <path d="M 114 94 L 124 90" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
          </g>
        );
      case 'wings':
        return (
          <g opacity="0.85">
            {/* Angel Wings */}
            <path
              d="M 45 95 C 15 75 10 105 35 120 C 20 130 38 145 55 130 Z"
              fill="#E0F2FE"
              stroke="#BAE6FD"
              strokeWidth="2"
            />
            <path
              d="M 155 95 C 185 75 190 105 165 120 C 180 130 162 145 145 130 Z"
              fill="#E0F2FE"
              stroke="#BAE6FD"
              strokeWidth="2"
            />
          </g>
        );
      default:
        return null;
    }
  };

  // Render cartoon body based on selected mascot companion
  const renderMascotBody = () => {
    switch (companionId) {
      case 'vyra':
        // Vyra: The Smiling Starlet Cloud
        return (
          <g>
            {/* Outer soft cloud-star puff body */}
            <path
              d="M 100 42 
                 C 118 42, 134 50, 142 66 
                 C 158 68, 172 82, 172 100 
                 C 172 118, 158 132, 142 135 
                 C 134 150, 118 160, 100 160 
                 C 82 160, 66 150, 58 135 
                 C 42 132, 28 118, 28 100 
                 C 28 82, 42 68, 58 66 
                 C 66 50, 82 42, 100 42 Z"
              fill="url(#vyraCloudGradient)"
              stroke="#38BDF8"
              strokeWidth="3.5"
            />
            {/* Subtle inner star highlight */}
            <path
              d="M 100 55 L 110 82 L 138 85 L 116 103 L 123 130 L 100 115 L 77 130 L 84 103 L 62 85 L 90 82 Z"
              fill="#FFFFFF"
              opacity="0.25"
            />

            {/* Rosy Blush Cheeks */}
            <ellipse cx="68" cy="112" rx="9" ry="5.5" fill="#F472B6" opacity="0.6" />
            <ellipse cx="132" cy="112" rx="9" ry="5.5" fill="#F472B6" opacity="0.6" />

            {/* Cartoon Eyes */}
            {isBlinking || mood === 'sleepy' ? (
              <g stroke="#0F3A57" strokeWidth="3.5" strokeLinecap="round" fill="none">
                <path d="M 72 100 Q 80 106 88 100" />
                <path d="M 112 100 Q 120 106 128 100" />
              </g>
            ) : mood === 'peaceful' ? (
              <g stroke="#0F3A57" strokeWidth="3.5" strokeLinecap="round" fill="none">
                <path d="M 72 102 Q 80 95 88 102" />
                <path d="M 112 102 Q 120 95 128 102" />
              </g>
            ) : (
              <g>
                {/* Big sparkling anime eyes */}
                <ellipse cx="80" cy="98" rx="7.5" ry="11" fill="#0F3A57" />
                <circle cx="78" cy="94" r="3.5" fill="#FFFFFF" />
                <circle cx="83" cy="103" r="1.8" fill="#FFFFFF" />

                <ellipse cx="120" cy="98" rx="7.5" ry="11" fill="#0F3A57" />
                <circle cx="118" cy="94" r="3.5" fill="#FFFFFF" />
                <circle cx="123" cy="103" r="1.8" fill="#FFFFFF" />
              </g>
            )}

            {/* Animated Happy Smile Mouth */}
            {mood === 'cheering' ? (
              <path
                d="M 91 108 Q 100 124 109 108 Z"
                fill="#F43F5E"
                stroke="#0F3A57"
                strokeWidth="2.5"
              />
            ) : (
              <path
                d="M 92 110 Q 100 119 108 110"
                stroke="#0F3A57"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
            )}

            {/* Waving Little Cloud Hands */}
            <ellipse
              cx="40"
              cy="104"
              rx="12"
              ry="7"
              fill="#BAE6FD"
              stroke="#38BDF8"
              strokeWidth="2.5"
              className="animate-cartoon-wiggle origin-right"
            />
            <ellipse
              cx="160"
              cy="104"
              rx="12"
              ry="7"
              fill="#BAE6FD"
              stroke="#38BDF8"
              strokeWidth="2.5"
              className="animate-cartoon-wiggle origin-left"
            />
          </g>
        );

      case 'pebble':
        // Pebble: The Grounded Bear-Otter
        return (
          <g>
            {/* Bear Ears */}
            <circle cx="62" cy="58" r="18" fill="#8D6E63" stroke="#5D4037" strokeWidth="3" />
            <circle cx="62" cy="58" r="10" fill="#D7CCC8" />
            <circle cx="138" cy="58" r="18" fill="#8D6E63" stroke="#5D4037" strokeWidth="3" />
            <circle cx="138" cy="58" r="10" fill="#D7CCC8" />

            {/* Head & Body */}
            <path
              d="M 52 105 C 50 65 150 65 148 105 C 152 145 48 145 52 105 Z"
              fill="#A1887F"
              stroke="#5D4037"
              strokeWidth="3.5"
            />

            {/* Cozy lighter belly patch */}
            <ellipse cx="100" cy="120" rx="30" ry="22" fill="#EFEBE9" opacity="0.9" />

            {/* Snout & Nose */}
            <ellipse cx="100" cy="105" rx="16" ry="12" fill="#D7CCC8" />
            <path d="M 94 98 Q 100 95 106 98 Q 100 106 94 98 Z" fill="#4E342E" />

            {/* Rosy Cheeks */}
            <circle cx="72" cy="108" r="7" fill="#F472B6" opacity="0.5" />
            <circle cx="128" cy="108" r="7" fill="#F472B6" opacity="0.5" />

            {/* Eyes */}
            {isBlinking || mood === 'sleepy' ? (
              <g stroke="#3E2723" strokeWidth="3" strokeLinecap="round" fill="none">
                <path d="M 76 90 Q 82 95 88 90" />
                <path d="M 112 90 Q 118 95 124 90" />
              </g>
            ) : (
              <g fill="#3E2723">
                <circle cx="80" cy="88" r="5" />
                <circle cx="120" cy="88" r="5" />
                <circle cx="82" cy="86" r="1.5" fill="#FFFFFF" />
                <circle cx="122" cy="86" r="1.5" fill="#FFFFFF" />
              </g>
            )}

            {/* Peaceful gentle smile */}
            <path
              d="M 95 110 Q 100 114 105 110"
              stroke="#3E2723"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Soft Paws */}
            <ellipse cx="60" cy="130" rx="10" ry="8" fill="#8D6E63" stroke="#5D4037" strokeWidth="2" />
            <ellipse cx="140" cy="130" rx="10" ry="8" fill="#8D6E63" stroke="#5D4037" strokeWidth="2" />
          </g>
        );

      case 'sunny':
        // Sunny: The Solar Fox Pup
        return (
          <g>
            {/* Fluffy Tail on side */}
            <path
              d="M 140 120 C 175 110 185 70 160 55 C 145 65 140 90 135 115 Z"
              fill="#F97316"
              stroke="#C2410C"
              strokeWidth="3"
            />
            {/* White tip */}
            <path d="M 160 55 C 168 62 172 75 160 80 C 155 70 152 62 160 55 Z" fill="#FFFBEB" />

            {/* Big Fox Ears */}
            <polygon points="55,80 75,32 95,78" fill="#F97316" stroke="#C2410C" strokeWidth="3" />
            <polygon points="63,74 75,44 87,74" fill="#FEE2E2" />
            <polygon points="105,78 125,32 145,80" fill="#F97316" stroke="#C2410C" strokeWidth="3" />
            <polygon points="113,74 125,44 137,74" fill="#FEE2E2" />

            {/* Fox Head & Body */}
            <ellipse cx="100" cy="105" rx="46" ry="40" fill="#FB923C" stroke="#C2410C" strokeWidth="3.5" />

            {/* White muzzle mask */}
            <path
              d="M 70 110 C 85 95 100 95 100 115 C 100 95 115 95 130 110 C 120 138 80 138 70 110 Z"
              fill="#FFFBEB"
            />

            {/* Little black button nose */}
            <polygon points="96,112 104,112 100,117" fill="#1E293B" />

            {/* Big bright fox eyes */}
            {isBlinking ? (
              <g stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none">
                <path d="M 78 96 Q 86 100 94 96" />
                <path d="M 106 96 Q 114 100 122 96" />
              </g>
            ) : (
              <g fill="#1E293B">
                <ellipse cx="84" cy="94" rx="6" ry="8" />
                <ellipse cx="116" cy="94" rx="6" ry="8" />
                <circle cx="82" cy="91" r="2.2" fill="#FFFFFF" />
                <circle cx="114" cy="91" r="2.2" fill="#FFFFFF" />
              </g>
            )}

            {/* Cheerful fox smile */}
            <path
              d="M 94 122 Q 100 128 106 122"
              stroke="#1E293B"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        );

      case 'bloom':
        // Bloom: The Forest Sproutling
        return (
          <g>
            {/* Top Leaf Sprout */}
            <g className="animate-cartoon-wiggle origin-bottom">
              <path
                d="M 100 50 C 95 30 75 25 80 45 C 85 48 95 50 100 50 Z"
                fill="#4ADE80"
                stroke="#15803D"
                strokeWidth="2.5"
              />
              <path
                d="M 100 50 C 105 30 125 25 120 45 C 115 48 105 50 100 50 Z"
                fill="#22C55E"
                stroke="#15803D"
                strokeWidth="2.5"
              />
              <path d="M 100 50 L 100 62" stroke="#15803D" strokeWidth="3" strokeLinecap="round" />
            </g>

            {/* Round Sprout Body */}
            <ellipse cx="100" cy="110" rx="44" ry="46" fill="#86EFAC" stroke="#15803D" strokeWidth="3.5" />

            {/* Flower Petal collar */}
            <path
              d="M 68 135 Q 100 152 132 135 Q 100 142 68 135 Z"
              fill="#BBF7D0"
              stroke="#15803D"
              strokeWidth="2"
            />

            {/* Rosy Peach Cheeks */}
            <circle cx="72" cy="112" r="8" fill="#F472B6" opacity="0.6" />
            <circle cx="128" cy="112" r="8" fill="#F472B6" opacity="0.6" />

            {/* Big Wide Curious Eyes */}
            {isBlinking ? (
              <g stroke="#064E3B" strokeWidth="3" strokeLinecap="round" fill="none">
                <path d="M 75 98 Q 82 103 89 98" />
                <path d="M 111 98 Q 118 103 125 98" />
              </g>
            ) : (
              <g fill="#064E3B">
                <circle cx="82" cy="98" r="8" />
                <circle cx="118" cy="98" r="8" />
                <circle cx="80" cy="95" r="3" fill="#FFFFFF" />
                <circle cx="116" cy="95" r="3" fill="#FFFFFF" />
                <circle cx="84" cy="101" r="1.5" fill="#FFFFFF" />
                <circle cx="120" cy="101" r="1.5" fill="#FFFFFF" />
              </g>
            )}

            {/* Sweet Sprout Open Smile */}
            <path
              d="M 93 114 Q 100 123 107 114"
              stroke="#064E3B"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        );

      default:
        return null;
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`relative inline-block select-none cursor-pointer transition-transform ${
        isInteracting || localJelly ? 'animate-cartoon-jelly' : 'animate-float-gentle'
      } ${sizeClasses}`}
      title="Tap me to pet or interact!"
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full filter drop-shadow-md overflow-visible"
      >
        <defs>
          <linearGradient id="vyraCloudGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#EFF9FD" />
            <stop offset="60%" stopColor="#BAE6FD" />
            <stop offset="100%" stopColor="#7DD3FC" />
          </linearGradient>
        </defs>

        {/* Mascot Body & Face */}
        {renderMascotBody()}

        {/* Mascot Accessory */}
        {renderAccessory()}
      </svg>

      {/* Floating hearts / stars particle burst on pet */}
      {(showHearts || isInteracting || localJelly) && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none flex items-center gap-1 z-20">
          <span className="animate-heart-float text-base sm:text-lg">💖</span>
          <span className="animate-heart-float text-xs sm:text-sm animation-delay-200">✨</span>
          <span className="animate-heart-float text-base sm:text-lg animation-delay-400">💕</span>
        </div>
      )}
    </div>
  );
};
