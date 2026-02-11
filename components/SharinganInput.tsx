import React, { useState, useEffect, useRef } from 'react';
import { ScanMode } from '../types';

interface SharinganInputProps {
  onScan: (company: string, mode: ScanMode, competitor?: string, imageBase64?: string) => void;
  isLoading: boolean;
}

export const SharinganInput: React.FC<SharinganInputProps> = ({ onScan, isLoading }) => {
  const [company, setCompany] = useState('');
  const [competitor, setCompetitor] = useState('');
  const [isMangekyou, setIsMangekyou] = useState(false);
  const [flash, setFlash] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger flash effect when Mangekyou is activated
  useEffect(() => {
    if (isMangekyou) {
      setFlash(true);
      const timer = setTimeout(() => setFlash(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isMangekyou]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim()) return;
    
    onScan(
      company, 
      isMangekyou ? ScanMode.MANGEKYOU : ScanMode.STANDARD, 
      competitor.trim() || undefined,
      selectedImage || undefined
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto relative">
      {/* Full screen flash overlay for Mangekyou activation - Gold Tint */}
      <div className={`fixed inset-0 bg-luxury-gold pointer-events-none z-[100] transition-opacity duration-700 mix-blend-soft-light ${flash ? 'opacity-30' : 'opacity-0'}`}></div>

      <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-4">
        
        {/* Main Input Group */}
        <div className="relative group">
            {/* Ambient Gold Glow */}
            <div className={`absolute -inset-0.5 bg-gradient-to-r from-luxury-gold/50 via-luxury-gold-light/50 to-luxury-gold/50 rounded-sm blur opacity-20 group-hover:opacity-60 transition duration-1000 ${isLoading ? 'opacity-0' : ''}`}></div>
            
            <div className="relative bg-luxury-card border border-luxury-gold-dim p-2 flex flex-col md:flex-row items-stretch shadow-2xl">
                <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="ENTREZ LE NOM DE LA MARQUE..."
                    disabled={isLoading}
                    className="flex-grow bg-luxury-black/50 text-white px-8 py-5 outline-none placeholder-luxury-muted font-display tracking-widest disabled:opacity-50 text-sm md:text-lg focus:bg-luxury-black transition-colors border-r border-transparent md:border-luxury-gold-dim/30"
                />
                
                {/* Image Upload Trigger */}
                <div className="flex items-center justify-center px-4 bg-luxury-black/50 md:border-l border-luxury-gold-dim/30 min-w-[60px] border-b md:border-b-0 border-luxury-gold-dim/20 py-2 md:py-0">
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                    {selectedImage ? (
                        <div className="relative group/image">
                            <div className="absolute inset-0 bg-luxury-gold blur opacity-20"></div>
                            <img src={selectedImage} alt="Preview" className="w-10 h-10 object-cover rounded-sm border border-luxury-gold relative z-10" />
                            <button 
                                type="button"
                                onClick={clearImage}
                                className="absolute -top-3 -right-3 bg-luxury-card border border-luxury-gold text-luxury-gold rounded-full w-5 h-5 flex items-center justify-center text-[10px] hover:bg-luxury-gold hover:text-black transition-colors z-20"
                            >
                                ×
                            </button>
                        </div>
                    ) : (
                        <button 
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-3 text-luxury-gold/50 hover:text-luxury-gold transition-colors duration-300"
                            title="Ajouter une preuve visuelle (Screenshot)"
                            disabled={isLoading}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </button>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading || !company.trim()}
                    className={`px-10 py-5 font-display uppercase tracking-[0.2em] font-bold transition-all duration-500 md:w-auto w-full ${
                        isLoading 
                        ? 'bg-luxury-dim text-luxury-muted cursor-not-allowed' 
                        : 'bg-luxury-gold text-luxury-black hover:bg-white hover:text-black shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]'
                    }`}
                >
                    {isLoading ? '...' : 'AUDIT'}
                </button>
            </div>
        </div>

        {/* Competitor Input (Versus Mode) */}
        <div className="relative group/competitor">
            <input
                type="text"
                value={competitor}
                onChange={(e) => setCompetitor(e.target.value)}
                placeholder="CONCURRENT (OPTIONNEL - MODE VERSUS)"
                disabled={isLoading}
                className="w-full bg-luxury-card/50 border border-luxury-gold-dim/50 text-luxury-gold/80 px-8 py-3 outline-none placeholder-luxury-muted/50 font-display tracking-widest text-xs focus:bg-luxury-black/80 focus:border-luxury-gold/50 transition-colors text-center uppercase"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-luxury-gold/20 text-[10px] pointer-events-none">VS</div>
        </div>

        {/* Controls Row */}
        <div className="mt-6 flex items-center justify-center">
            <label className={`flex items-center gap-6 cursor-pointer group px-6 py-4 rounded-sm border transition-all duration-500 bg-luxury-card/50 ${isMangekyou ? 'border-luxury-gold/30 shadow-[0_0_20px_rgba(212,175,55,0.05)]' : 'border-transparent hover:border-luxury-gold/10'}`}>
                <div className="relative">
                    <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={isMangekyou} 
                        onChange={() => setIsMangekyou(!isMangekyou)}
                        disabled={isLoading}
                    />
                    <div className={`w-12 h-1 bg-luxury-gold-dim/50 rounded-full transition-colors duration-500`}></div>
                    <div className={`absolute -top-2.5 w-6 h-6 rounded-full border border-luxury-gold shadow-lg transition-transform duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) transform flex items-center justify-center ${isMangekyou ? 'translate-x-6 bg-luxury-gold' : 'translate-x-0 bg-luxury-black'}`}>
                         {/* Toggle Indicator */}
                         <div className={`w-1.5 h-1.5 rounded-full ${isMangekyou ? 'bg-black' : 'bg-luxury-gold'}`}></div>
                    </div>
                </div>
                <div className="flex flex-col text-left">
                    <span className={`text-xs font-display font-semibold tracking-[0.2em] transition-colors duration-300 ${isMangekyou ? 'text-luxury-gold' : 'text-luxury-muted'}`}>
                        DEEP SCAN
                    </span>
                    <span className="text-[9px] text-luxury-muted/60 font-mono uppercase tracking-widest mt-1">
                        {isMangekyou ? 'Analyse Psychologique Active' : 'Mode Standard'}
                    </span>
                </div>
            </label>
        </div>
      </form>
    </div>
  );
};