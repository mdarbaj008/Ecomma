import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  inverted?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showTagline = true,
  inverted = false,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7 text-sm',
    md: 'w-9 h-9 text-base',
    lg: 'w-11 h-11 text-xl',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <Link to="/" className="group inline-flex items-center gap-2.5 select-none">
      {/* Distinctive stylized 'E' with shopping bag notch and handle */}
      <div
        className={`relative ${iconSizes[size]} flex items-center justify-center rounded-xl bg-gradient-to-br from-[#0F1B2D] via-[#1E293B] to-[#0F1B2D] text-white font-editorial font-bold shadow-md shadow-amber-900/10 transition-transform duration-300 group-hover:scale-105 border border-amber-500/20`}
      >
        {/* Shopping bag handle notch */}
        <div className="absolute -top-1 w-3.5 h-2 rounded-t-full border-2 border-amber-400/90 border-b-0" />
        
        {/* The 'E' glyph with subtle bag notch */}
        <span className="relative text-amber-400 font-serif font-extrabold tracking-tight translate-y-0.5">
          E
        </span>

        {/* Small saffron delivery dot */}
        <span className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-[#F59E0B] ring-1 ring-white/50" />
      </div>

      <div className="flex flex-col">
        <span
          className={`font-editorial font-bold tracking-tight leading-none ${textSizes[size]} ${
            inverted ? 'text-white' : 'text-[#0F1B2D]'
          }`}
        >
          Ecomma
          <span className="text-[#F59E0B]">.</span>
        </span>
        {showTagline && (
          <span
            className={`text-[9px] uppercase tracking-widest font-semibold mt-0.5 ${
              inverted ? 'text-slate-300' : 'text-slate-500'
            }`}
          >
            List · Sell · Deliver
          </span>
        )}
      </div>
    </Link>
  );
};
