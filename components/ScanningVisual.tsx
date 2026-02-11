import React from 'react';

export const ScanningVisual: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Outer Ring - Gold */}
        <div className="absolute inset-0 border-[1px] border-luxury-gold/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
        <div className="absolute inset-0 border-t-[1px] border-luxury-gold/50 rounded-full animate-[spin_3s_linear_infinite_reverse]"></div>
        
        {/* Pulse Effect */}
        <div className="absolute inset-8 border-[1px] border-luxury-gold/10 rounded-full animate-ping opacity-20"></div>
        
        {/* The Eye */}
        <div className="relative w-32 h-32 bg-luxury-black rounded-full border border-luxury-gold/40 flex items-center justify-center shadow-[0_0_60px_rgba(212,175,55,0.15)]">
           {/* Center Pupil */}
           <div className="w-3 h-3 bg-luxury-gold rounded-full shadow-[0_0_15px_rgba(212,175,55,0.8)] z-10"></div>
           
           {/* Geometric Iris Pattern */}
           <div className="absolute inset-0 animate-spin-slow">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[1px] h-6 bg-luxury-gold/50"></div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[1px] h-6 bg-luxury-gold/50"></div>
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-[1px] bg-luxury-gold/50"></div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-[1px] bg-luxury-gold/50"></div>
           </div>
           
           {/* Inner Ring */}
           <div className="absolute inset-4 rounded-full border border-luxury-gold/30 opacity-60"></div>
        </div>
      </div>
      <p className="mt-12 text-luxury-gold font-display tracking-[0.4em] animate-pulse text-xs font-semibold">
        ACQUISITION DES DONNÉES
      </p>
      <div className="mt-4 flex gap-1">
        <div className="w-1 h-1 bg-luxury-gold/30 animate-bounce delay-75"></div>
        <div className="w-1 h-1 bg-luxury-gold/60 animate-bounce delay-150"></div>
        <div className="w-1 h-1 bg-luxury-gold animate-bounce delay-300"></div>
      </div>
    </div>
  );
};