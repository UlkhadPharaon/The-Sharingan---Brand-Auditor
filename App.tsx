import React, { useState, useCallback, useEffect } from 'react';
import { SharinganInput } from './components/SharinganInput';
import { AuditDisplay } from './components/AuditDisplay';
import { ScanningVisual } from './components/ScanningVisual';
import { performAudit } from './services/gemini';
import { AuditState, ScanMode, HistoryItem } from './types';

const IntroAnimation: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 500),
      setTimeout(() => setStep(2), 1500),
      setTimeout(() => setStep(3), 2500),
      setTimeout(() => onComplete(), 3200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-luxury-black flex flex-col items-center justify-center font-display text-luxury-gold">
      <div className={`transition-opacity duration-1000 tracking-[0.2em] font-light text-white/50 text-sm ${step >= 0 ? 'opacity-100' : 'opacity-0'}`}>
        INITIALISATION DU PROTOCOLE
      </div>
      <div className={`mt-6 text-4xl md:text-5xl tracking-[0.3em] font-bold text-transparent bg-clip-text bg-gold-gradient transition-all duration-1000 transform ${step >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        THE SHARINGAN
      </div>
      <div className={`mt-3 text-[10px] text-luxury-gold/70 font-mono tracking-[0.5em] uppercase transition-opacity duration-1000 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}>
        Gold Edition // v2.0
      </div>
       <div className={`mt-12 w-32 h-[1px] bg-luxury-card relative overflow-hidden transition-opacity duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute top-0 left-0 h-full bg-luxury-gold animate-[width_2s_ease-in-out_forwards]" style={{width: step >= 2 ? '100%' : '0%'}}></div>
       </div>
    </div>
  );
};

// History Drawer Component
const HistoryDrawer: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  history: HistoryItem[]; 
  onSelect: (item: HistoryItem) => void; 
}> = ({ isOpen, onClose, history, onSelect }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex justify-end">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-md bg-luxury-card border-l border-luxury-gold/20 h-full p-8 shadow-2xl overflow-y-auto animate-fadeIn">
                <div className="flex justify-between items-center mb-10 border-b border-luxury-gold/10 pb-6">
                    <h2 className="text-xl font-display text-luxury-gold tracking-[0.2em]">ARCHIVES</h2>
                    <button onClick={onClose} className="text-luxury-muted hover:text-white">✕</button>
                </div>
                
                {history.length === 0 ? (
                    <p className="text-luxury-muted font-mono text-xs text-center">AUCUNE ARCHIVE DISPONIBLE</p>
                ) : (
                    <div className="space-y-4">
                        {history.map((item) => (
                            <div 
                                key={item.id}
                                onClick={() => onSelect(item)}
                                className="group p-4 border border-luxury-gold/10 hover:border-luxury-gold/40 bg-luxury-black cursor-pointer transition-all duration-300 relative overflow-hidden"
                            >
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-luxury-gold opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <h3 className="text-white font-display text-lg mb-1 group-hover:text-luxury-gold transition-colors">{item.company}</h3>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-mono text-luxury-muted uppercase">{new Date(item.timestamp).toLocaleDateString()}</span>
                                    <span className={`text-[9px] px-2 py-0.5 border ${item.mode === ScanMode.MANGEKYOU ? 'border-red-900/50 text-red-500' : 'border-luxury-gold/20 text-luxury-gold/50'} rounded-full`}>
                                        {item.mode === ScanMode.MANGEKYOU ? 'MANGEKYOU' : 'STANDARD'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const App: React.FC = () => {
  const [introComplete, setIntroComplete] = useState(false);
  const [auditState, setAuditState] = useState<AuditState>({
    status: 'idle',
    data: null,
  });
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sharingan_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history");
      }
    }
  }, []);

  const saveToHistory = (company: string, mode: ScanMode, data: any) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      company,
      mode,
      data
    };
    
    // Keep only last 5
    const newHistory = [newItem, ...history].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('sharingan_history', JSON.stringify(newHistory));
  };

  const handleScan = useCallback(async (company: string, mode: ScanMode, competitor?: string, imageBase64?: string) => {
    setAuditState({ status: 'scanning', data: null });
    
    try {
      const result = await performAudit(company, mode, competitor, imageBase64);
      setAuditState({ status: 'complete', data: result });
      saveToHistory(company, mode, result);
    } catch (error: any) {
      setAuditState({ status: 'error', data: null, error: error.message || 'Erreur inconnue survenue' });
    }
  }, [history]);

  const handleReset = () => {
    setAuditState({ status: 'idle', data: null });
  };

  const handleLoadHistory = (item: HistoryItem) => {
    setAuditState({ status: 'complete', data: item.data });
    setShowHistory(false);
  };

  if (!introComplete) {
    return <IntroAnimation onComplete={() => setIntroComplete(true)} />;
  }

  return (
    <div className="min-h-screen bg-luxury-black text-luxury-text selection:bg-luxury-gold selection:text-black pb-20 overflow-x-hidden font-sans">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-luxury-gold/5 blur-[150px] rounded-full opacity-30"></div>
         <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black via-transparent to-transparent"></div>
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] z-0"></div>
      </div>

      <HistoryDrawer 
        isOpen={showHistory} 
        onClose={() => setShowHistory(false)} 
        history={history}
        onSelect={handleLoadHistory}
      />

      <header className="relative z-10 pt-20 pb-16 text-center px-4">
        {/* History Toggle Button */}
        <div className="absolute top-6 right-6 z-20">
            <button 
                onClick={() => setShowHistory(true)}
                className="flex items-center gap-2 px-4 py-2 bg-luxury-card/80 border border-luxury-gold/20 hover:border-luxury-gold text-luxury-muted hover:text-luxury-gold transition-all duration-300 text-[10px] tracking-widest font-mono uppercase"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ARCHIVES ({history.length})
            </button>
        </div>

        <div className="inline-block mb-6 relative cursor-pointer group" onClick={handleReset}>
            <div className="w-20 h-20 mx-auto mb-6 relative transition-transform duration-700 group-hover:rotate-180">
                <div className="absolute inset-0 bg-luxury-gold rounded-full blur-[40px] opacity-10 group-hover:opacity-30 transition-opacity duration-500"></div>
                 <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 drop-shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                    {/* Outer Ring */}
                    <circle cx="50" cy="50" r="48" stroke="#D4AF37" strokeWidth="0.5" fill="none" className="opacity-60" />
                    <circle cx="50" cy="50" r="44" stroke="#D4AF37" strokeWidth="1" fill="none" className="opacity-100" />
                    
                    {/* Inner Content */}
                    <circle cx="50" cy="50" r="3" fill="#D4AF37" />
                    
                    {/* Geometric decorative lines */}
                    <path d="M50 6 A44 44 0 0 1 94 50" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" className="opacity-80" />
                    <circle cx="50" cy="6" r="2" fill="#D4AF37" />
                    <circle cx="94" cy="50" r="2" fill="#D4AF37" />

                    <path d="M50 94 A44 44 0 0 1 6 50" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" className="opacity-80" />
                </svg>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-[-0.02em] text-white drop-shadow-2xl">
              THE <span className="text-gold-gradient relative inline-block">SHARINGAN</span>
            </h1>
            
            <div className="flex items-center justify-center gap-3 mt-4 opacity-70">
                <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-luxury-gold"></div>
                <p className="text-luxury-gold font-mono text-[10px] tracking-[0.4em] uppercase">
                  Auditeur de Marque Élite
                </p>
                <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-luxury-gold"></div>
            </div>
        </div>
      </header>

      <main className="relative z-10 px-4 md:px-8">
        {auditState.status === 'idle' && (
          <div className="animate-fadeIn max-w-4xl mx-auto text-center">
            <p className="text-luxury-muted mb-16 max-w-lg mx-auto leading-relaxed font-light text-sm md:text-base border-l border-r border-luxury-gold/10 px-8 py-4">
              La médiocrité est coûteuse. <span className="text-luxury-text font-normal">Identifiez les failles.</span> Exigez l'excellence.
              <br/><span className="text-luxury-gold/60 text-xs mt-4 block tracking-widest uppercase">Initialisez l'audit ci-dessous</span>
            </p>
            <SharinganInput onScan={handleScan} isLoading={false} />
          </div>
        )}

        {auditState.status === 'scanning' && (
          <ScanningVisual />
        )}

        {auditState.status === 'error' && (
          <div className="max-w-xl mx-auto text-center mt-10 p-12 border border-luxury-gold/20 bg-luxury-card/90 backdrop-blur-md relative shadow-2xl">
            <h3 className="text-luxury-gold font-display text-2xl mb-4 tracking-widest">ÉCHEC DU SCAN</h3>
            <p className="text-luxury-muted mb-8 font-mono text-xs">{auditState.error}</p>
            <button 
                onClick={handleReset}
                className="px-8 py-3 bg-transparent hover:bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/50 hover:border-luxury-gold font-mono text-[10px] uppercase tracking-[0.2em] transition-all duration-300"
            >
                Réessayer
            </button>
          </div>
        )}

        {auditState.status === 'complete' && auditState.data && (
          <div className="space-y-16">
            <AuditDisplay data={auditState.data} />
            <div className="text-center pb-12 print:hidden">
                <button 
                    onClick={handleReset}
                    className="group relative inline-flex items-center justify-center px-12 py-5 overflow-hidden font-display font-semibold tracking-widest text-luxury-black bg-luxury-gold rounded-sm hover:bg-white transition-colors duration-500 shadow-[0_0_30px_rgba(212,175,55,0.2)]"
                >
                    <span className="relative z-10 flex items-center gap-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                      NOUVELLE CIBLE
                    </span>
                </button>
            </div>
          </div>
        )}
      </main>
      
      <footer className="fixed bottom-8 right-8 z-50 mix-blend-difference print:hidden">
        <div className="flex items-center gap-3 text-[9px] text-white/50 font-mono tracking-widest">
           <div className="w-1 h-1 bg-luxury-gold rounded-full animate-pulse"></div>
           SYSTEM: GEMINI 2.0 // LUXE_MODE
        </div>
      </footer>
    </div>
  );
};

export default App;