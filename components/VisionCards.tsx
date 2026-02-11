import React, { useState } from 'react';

interface VisionCardsProps {
  prompts: string[];
}

export const VisionCards: React.FC<VisionCardsProps> = ({ prompts }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const safePrompts = prompts || [];

  if (safePrompts.length === 0) return null;

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="mt-16 mb-16 animate-fadeIn">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-[1px] flex-grow bg-luxury-gold-dim/30"></div>
        <h3 className="text-luxury-gold font-display tracking-[0.3em] text-sm uppercase text-center">
             Générateur de Vision
        </h3>
        <div className="h-[1px] flex-grow bg-luxury-gold-dim/30"></div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {safePrompts.map((prompt, index) => (
          <div 
            key={index} 
            className="group relative bg-luxury-black border border-luxury-gold-dim/40 p-6 hover:border-luxury-gold/60 transition-all duration-300"
          >
            {/* Decorative Corner */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-luxury-gold opacity-50"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-luxury-gold opacity-50"></div>

            <div className="flex justify-between items-start gap-4">
                <div>
                    <span className="text-[9px] text-luxury-gold/50 font-mono uppercase tracking-widest mb-2 block">
                        Prompt Sequence // 0{index + 1}
                    </span>
                    <p className="text-luxury-muted font-light text-sm italic leading-relaxed font-serif">
                        "{prompt}"
                    </p>
                </div>
                <button
                    onClick={() => handleCopy(prompt, index)}
                    className="flex-shrink-0 p-2 hover:bg-luxury-gold/10 rounded-sm transition-colors border border-transparent hover:border-luxury-gold/30"
                    title="Copier le prompt"
                >
                    {copiedIndex === index ? (
                        <svg className="w-5 h-5 text-luxury-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 text-luxury-muted group-hover:text-luxury-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    )}
                </button>
            </div>
          </div>
        ))}
      </div>
      <p className="text-center text-[10px] text-luxury-muted/40 font-mono mt-4 uppercase">
         Optimisé pour Midjourney v6 --ar 16:9 --v 6.0
      </p>
    </div>
  );
};