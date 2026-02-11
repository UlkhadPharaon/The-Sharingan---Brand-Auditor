import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { AuditResponse } from '../types';
import { RadarChart } from './RadarChart';
import { VisionCards } from './VisionCards';

interface AuditDisplayProps {
  data: AuditResponse;
}

const CopyButton = ({ text, label }: { text: string, label: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className="flex items-center gap-3 px-4 py-2 bg-luxury-black border border-luxury-gold-dim hover:border-luxury-gold transition-all duration-300 group rounded-sm no-print shadow-lg backdrop-blur-sm bg-opacity-80"
      title="Copier le contenu"
    >
        <span className={`text-[9px] font-mono tracking-[0.2em] uppercase ${copied ? 'text-white' : 'text-luxury-muted group-hover:text-luxury-gold'}`}>
            {copied ? 'COPIÉ' : label}
        </span>
        <svg className={`w-3 h-3 ${copied ? 'text-white' : 'text-luxury-muted group-hover:text-luxury-gold'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {copied ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            )}
        </svg>
    </button>
  );
};

export const AuditDisplay: React.FC<AuditDisplayProps> = ({ data }) => {
  const content = data.markdownReport;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRevealing, setIsRevealing] = useState(true);
  
  // Wave Reveal Animation Logic
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let startTime: number | null = null;
    const duration = 4000; // 4 seconds for a slow, premium wave

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / duration;
      
      const revealPercentage = progress * 125; 
      
      container.style.setProperty('--reveal-pos', `${revealPercentage}%`);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        container.style.setProperty('--reveal-pos', `200%`);
        setIsRevealing(false);
      }
    };

    setIsRevealing(true);
    requestAnimationFrame(animate);
  }, [data]);

  const handlePrint = () => {
    window.print();
  };
  
  // Custom renderer components for ReactMarkdown
  const components = {
    h2: ({node, ...props}: any) => {
      // Logic for standard part separators inside the markdown
      if (String(props.children).includes("PARTIE 2")) {
        return (
          <div className="mt-20 mb-12 border-t border-luxury-gold-dim/30 pt-12 text-center break-before-page">
             <div className="inline-block px-6 py-2 border border-luxury-gold/30 bg-luxury-black/50 backdrop-blur-sm print:bg-white print:border-black">
                <h2 className="text-xl font-display font-semibold text-luxury-gold tracking-[0.3em] uppercase print:text-black" {...props} />
             </div>
          </div>
        );
      }
      return (
        <h2 className="text-lg md:text-xl font-display text-white uppercase tracking-[0.15em] border-b border-luxury-gold-dim/30 pb-4 mb-8 mt-12 flex items-center gap-4 print:text-black print:border-black" {...props} >
            <span className="w-1.5 h-1.5 bg-luxury-gold rotate-45 print:bg-black"></span>
            {props.children}
        </h2>
      );
    },
    h3: ({node, ...props}: any) => (
      <h3 className="text-sm font-mono font-bold text-luxury-gold/80 uppercase tracking-widest mb-4 mt-8 print:text-black" {...props} />
    ),
    ul: ({node, ...props}: any) => (
      <ul className="list-none ml-0 space-y-4 text-luxury-muted mb-8 font-light print:text-black" {...props} />
    ),
    li: ({node, ...props}: any) => (
        <li className="flex gap-4 items-start" {...props}>
             <span className="text-luxury-gold/50 mt-1.5 text-[10px] print:text-black">♦</span>
             <span className="flex-1">{props.children}</span>
        </li>
    ),
    strong: ({node, ...props}: any) => (
      <strong className="text-white font-semibold font-display tracking-wide print:text-black" {...props} />
    ),
    p: ({node, ...props}: any) => (
      <p className="mb-4 text-gray-400 leading-relaxed text-sm md:text-base font-light print:text-black" {...props} />
    ),
    blockquote: ({node, ...props}: any) => (
        <blockquote className="border-l border-luxury-gold pl-6 italic text-gray-500 my-6 py-2 print:border-black print:text-black" {...props} />
    )
  };

  return (
    <div className="w-full max-w-5xl mx-auto pb-20">
      
      {/* Controls Header */}
      <div className="flex justify-between items-center mb-4 no-print animate-fadeIn">
         <div className="flex gap-2 items-center">
             <div className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${isRevealing ? 'bg-luxury-gold animate-pulse' : 'bg-green-500'}`}></div>
             <span className="text-[9px] text-luxury-gold/70 tracking-widest font-mono uppercase">
                {isRevealing ? 'DÉCRYPTAGE NEURAL...' : 'ANALYSE TERMINÉE'}
             </span>
         </div>
         <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 border border-luxury-gold/30 text-luxury-gold hover:bg-luxury-gold hover:text-black transition-all duration-300 text-[10px] tracking-widest font-mono uppercase group"
         >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export PDF
         </button>
      </div>

      <div ref={containerRef} className="reveal-container relative bg-[#050505] border border-luxury-gold-dim/20 p-8 md:p-16 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden print:shadow-none print:border-none print:p-0 print:bg-white transition-all duration-1000">
        
        {/* SCAN LINE EFFECT */}
        <div 
            className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-luxury-gold to-transparent shadow-[0_0_15px_rgba(212,175,55,0.9)] z-50 pointer-events-none no-print transition-opacity duration-500"
            style={{ 
                top: 'var(--reveal-pos)', 
                opacity: isRevealing ? 1 : 0
            }}
        ></div>
        
        <div 
             className="absolute left-0 right-0 h-20 bg-gradient-to-b from-luxury-gold/5 to-transparent z-40 pointer-events-none no-print transition-opacity duration-500"
             style={{ 
                top: 'var(--reveal-pos)', 
                transform: 'translateY(-100%)',
                opacity: isRevealing ? 1 : 0
             }}
        ></div>

        {/* Decorative Gold Frame */}
        <div className="absolute top-0 left-0 w-32 h-[1px] bg-gradient-to-r from-luxury-gold to-transparent opacity-50 no-print"></div>
        <div className="absolute top-0 left-0 h-32 w-[1px] bg-gradient-to-b from-luxury-gold to-transparent opacity-50 no-print"></div>
        <div className="absolute bottom-0 right-0 w-32 h-[1px] bg-gradient-to-l from-luxury-gold to-transparent opacity-50 no-print"></div>
        <div className="absolute bottom-0 right-0 h-32 w-[1px] bg-gradient-to-t from-luxury-gold to-transparent opacity-50 no-print"></div>

        {/* HEADER */}
        <div className="mb-16 text-center border-b border-luxury-gold-dim/10 pb-10 relative print:border-black">
          <h2 className="text-3xl md:text-5xl font-display font-medium text-white tracking-[0.1em] mb-4 print:text-black">RAPPORT STRATÉGIQUE</h2>
          <div className="flex justify-center items-center gap-3 opacity-60">
            <div className="h-[1px] w-8 bg-luxury-gold print:bg-black"></div>
            <p className="text-luxury-gold text-[10px] font-mono tracking-[0.4em] print:text-black">DOCUMENT CONFIDENTIEL</p>
            <div className="h-[1px] w-8 bg-luxury-gold print:bg-black"></div>
          </div>
        </div>

        {/* NEW FEATURE 1: RADAR CHART */}
        <div className="mb-16 flex justify-center">
             <RadarChart scores={data.scores} />
        </div>

        {/* VERSUS REPORT (If available) */}
        {data.versusReport && (
            <div className="mb-16 p-8 border border-red-900/30 bg-red-950/10 rounded-sm">
                <div className="flex items-center gap-4 mb-6">
                    <span className="text-red-500 font-bold text-xl">⚔️</span>
                    <h3 className="text-red-500 font-display tracking-[0.3em] uppercase">Rapport de Guerre (Versus)</h3>
                </div>
                <div className="prose prose-invert prose-headings:text-red-400 prose-p:text-gray-400 max-w-none">
                     <ReactMarkdown components={components}>
                        {data.versusReport}
                    </ReactMarkdown>
                </div>
            </div>
        )}

        {/* MAIN REPORT (PART 1 & 2) */}
        <div className="relative group/main">
            <div className="absolute -top-12 right-0 z-10 opacity-70 hover:opacity-100 transition-opacity duration-300 no-print">
                <CopyButton text={content} label="COPIER L'AUDIT COMPLET" />
            </div>
            <div className="prose prose-invert prose-p:text-gray-400 prose-headings:font-display prose-strong:text-white max-w-none print:prose-neutral">
                <ReactMarkdown components={components}>
                    {content}
                </ReactMarkdown>
            </div>
        </div>
        
        {/* NEW FEATURE 2: VISION PROMPTS */}
        <VisionCards prompts={data.visionPrompts} />
      
        {/* FOOTER INTELLIGENCE */}
        {data.groundingChunks && data.groundingChunks.length > 0 && (
          <div className="mt-24 pt-8 border-t border-luxury-gold-dim/20 print:border-black">
            <h3 className="text-[9px] font-bold text-luxury-gold/50 uppercase mb-8 tracking-[0.4em] text-center print:text-black">INTELLIGENCE SOURCES</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.groundingChunks.map((chunk, idx) => (
                chunk.web && (
                  <a 
                    key={idx} 
                    href={chunk.web.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center p-5 bg-luxury-card border border-luxury-gold-dim/20 hover:border-luxury-gold/50 transition-all duration-500 group print:bg-white print:border-black"
                  >
                    <span className="text-luxury-gold/50 mr-5 group-hover:text-luxury-gold transition-colors font-serif italic print:text-black">
                        {idx + 1}
                    </span>
                    <div className="overflow-hidden">
                        <p className="text-xs text-luxury-text truncate font-medium group-hover:text-luxury-gold transition-colors font-display tracking-wide print:text-black">{chunk.web.title}</p>
                        <p className="text-[10px] text-zinc-600 truncate font-mono mt-1 print:text-black">{chunk.web.uri}</p>
                    </div>
                  </a>
                )
              ))}
            </div>
          </div>
        )}
        
        <div className="hidden print:block text-center mt-12 pt-8 border-t border-black/10">
            <p className="text-[8px] font-mono text-black uppercase tracking-widest">
                Généré par The Sharingan // Brand Auditor AI
            </p>
        </div>
      </div>
    </div>
  );
};