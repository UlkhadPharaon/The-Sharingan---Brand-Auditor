import React, { useEffect, useState } from 'react';
import { AuditScores } from '../types';

interface RadarChartProps {
  scores: AuditScores;
}

export const RadarChart: React.FC<RadarChartProps> = ({ scores }) => {
  const safeScores = scores || { aesthetics: 0, storytelling: 0, authority: 0, ux: 0, uniqueness: 0 };
  const [animatedScores, setAnimatedScores] = useState<AuditScores>({
    aesthetics: 0,
    storytelling: 0,
    authority: 0,
    ux: 0,
    uniqueness: 0
  });

  useEffect(() => {
    // Animation simple pour faire monter les stats
    const timer = setTimeout(() => {
        setAnimatedScores(safeScores);
    }, 500);
    return () => clearTimeout(timer);
  }, [safeScores]);

  const width = 300;
  const height = 300;
  const cx = width / 2;
  const cy = height / 2;
  const radius = 100;
  
  const axes = [
    { name: 'ESTHÉTIQUE', value: animatedScores.aesthetics },
    { name: 'STORYTELLING', value: animatedScores.storytelling },
    { name: 'AUTORITÉ', value: animatedScores.authority },
    { name: 'UX / FLUIDITÉ', value: animatedScores.ux },
    { name: 'UNICITÉ', value: animatedScores.uniqueness },
  ];

  const totalAxes = axes.length;
  const angleSlice = (Math.PI * 2) / totalAxes;

  // Fonction pour calculer les coordonnées
  const getCoordinates = (value: number, index: number, maxRadius: number) => {
    const angle = index * angleSlice - Math.PI / 2; // -PI/2 pour commencer en haut
    // Normaliser la valeur (0-100)
    const r = (value / 100) * maxRadius;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    return { x, y };
  };

  // Construire le chemin du polygone des scores
  const scorePoints = axes.map((axis, i) => {
    const coords = getCoordinates(axis.value, i, radius);
    return `${coords.x},${coords.y}`;
  }).join(' ');

  // Construire les niveaux de grille (25, 50, 75, 100)
  const levels = [25, 50, 75, 100];

  return (
    <div className="flex flex-col items-center justify-center animate-fadeIn">
      <h3 className="text-luxury-gold font-display tracking-[0.3em] text-sm mb-6 uppercase">Surface d'Impact</h3>
      <div className="relative">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
            {/* Grille de fond */}
            {levels.map((level, idx) => (
                <polygon
                    key={idx}
                    points={axes.map((_, i) => {
                        const { x, y } = getCoordinates(level, i, radius);
                        return `${x},${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#D4AF37"
                    strokeOpacity={0.1 + (idx * 0.05)}
                    strokeWidth={0.5}
                />
            ))}

            {/* Lignes d'axes */}
            {axes.map((axis, i) => {
                const { x, y } = getCoordinates(100, i, radius);
                return (
                    <line
                        key={i}
                        x1={cx}
                        y1={cy}
                        x2={x}
                        y2={y}
                        stroke="#D4AF37"
                        strokeOpacity={0.2}
                        strokeWidth={1}
                    />
                );
            })}

            {/* Labels */}
            {axes.map((axis, i) => {
                const { x, y } = getCoordinates(125, i, radius); // Plus loin pour le texte
                return (
                    <text
                        key={i}
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#D4AF37"
                        fontSize="8"
                        fontFamily="monospace"
                        letterSpacing="0.1em"
                        className="opacity-70"
                    >
                        {axis.name}
                    </text>
                );
            })}

            {/* Zone de Score (Remplissage) */}
            <polygon
                points={scorePoints}
                fill="rgba(212, 175, 55, 0.2)"
                stroke="#D4AF37"
                strokeWidth={2}
                className="transition-all duration-1000 ease-out drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]"
            />

            {/* Points aux sommets */}
            {axes.map((axis, i) => {
                const { x, y } = getCoordinates(axis.value, i, radius);
                return (
                    <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r={3}
                        fill="#020202"
                        stroke="#D4AF37"
                        strokeWidth={1.5}
                        className="transition-all duration-1000 ease-out"
                    />
                );
            })}
        </svg>

        {/* Score Global au centre */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
             <span className="text-2xl font-display font-bold text-white drop-shadow-md">
                {Math.round((Object.values(animatedScores) as number[]).reduce((a, b) => a + b, 0) / 5)}
             </span>
             <span className="block text-[8px] text-luxury-gold/60 font-mono">AVG</span>
        </div>
      </div>
    </div>
  );
};