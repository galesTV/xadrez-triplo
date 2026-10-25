"use client";

import { useEffect, useRef } from "react";

export default function TriChessBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 800;
    const height = 800;
    canvas.width = width;
    canvas.height = height;

    ctx.translate(width / 2, height / 2);
    ctx.clearRect(-width / 2, -height / 2, width, height);

    const RADIUS = 300;
    const RANKS = 6;
    const FILES = 8;

    const ZONES = [
      { color: "white", angleOffset: Math.PI / 2 }, // Base
      { color: "black", angleOffset: (7 * Math.PI) / 6 }, // Topo esquerdo
      { color: "red", angleOffset: (11 * Math.PI) / 6 }, // Topo direito
    ];

    // Calcula a distância exata para formar uma aresta reta (hexágono)
    const getHexRadius = (angle: number) => {
      // Encontra o centro da aresta mais próxima (0º, 60º, 120º...)
      const sectorAngle = Math.PI / 3;
      const edgeCenterAngle = Math.round(angle / sectorAngle) * sectorAngle;

      // Diferença entre o ângulo atual e o centro da aresta
      const offset = angle - edgeCenterAngle;

      return (RADIUS * Math.cos(Math.PI / 6)) / Math.cos(offset);
    };

    const getPoint = (zoneAngle: number, rank: number, file: number) => {
      const sectorAngle = (2 * Math.PI) / 3;
      const angle = zoneAngle - sectorAngle / 2 + (file / FILES) * sectorAngle;

      const hexMaxRadius = getHexRadius(angle);
      const distance = (rank / RANKS) * hexMaxRadius;

      return {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
      };
    };

    ZONES.forEach((zone) => {
      for (let rank = 1; rank <= RANKS; rank++) {
        for (let file = 0; file < FILES; file++) {
          const p1 = getPoint(zone.angleOffset, rank - 1, file);
          const p2 = getPoint(zone.angleOffset, rank - 1, file + 1);
          const p3 = getPoint(zone.angleOffset, rank, file + 1);
          const p4 = getPoint(zone.angleOffset, rank, file);

          const isDark = (rank + file) % 2 === 1;

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.lineTo(p4.x, p4.y);
          ctx.closePath();

          ctx.fillStyle = isDark ? "#475569" : "#cbd5e1";
          ctx.fill();
          ctx.strokeStyle = "#1e293b";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }
    });
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <canvas ref={canvasRef} className="bg-slate-800 rounded-xl shadow-2xl" />
    </div>
  );
}
