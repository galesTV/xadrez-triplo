"use client";

import { useEffect, useRef } from "react";

const HEX_SIZE = 30;
const BOARD_RADIUS = 5;

export default function HexBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Ajusta o tamanho do canvas para caber o tabuleiro inteiro
    const width = 800;
    const height = 600;
    canvas.width = width;
    canvas.height = height;

    // Move o ponto de origem (0,0) para o centro do canvas
    ctx.translate(width / 2, height / 2);

    // Função matemática que converte Cúbica (q, r) para Pixel (x, y)
    const hexToPixel = (q: number, r: number) => {
      const x = HEX_SIZE * Math.sqrt(3) * (q + r / 2);
      const y = HEX_SIZE * (3 / 2) * r;
      return { x, y };
    };

    // Desenha um único hexágono
    const drawHex = (q: number, r: number) => {
      const { x, y } = hexToPixel(q, r);

      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle_deg = 60 * i - 30;
        const angle_rad = (Math.PI / 180) * angle_deg;
        const pX = x + HEX_SIZE * Math.cos(angle_rad);
        const pY = y + HEX_SIZE * Math.sin(angle_rad);

        if (i === 0) ctx.moveTo(pX, pY);
        else ctx.lineTo(pX, pY);
      }
      ctx.closePath();
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#cbd5e1";
      ctx.fill();
    };

    for (let q = -BOARD_RADIUS; q <= BOARD_RADIUS; q++) {
      const r1 = Math.max(-BOARD_RADIUS, -q - BOARD_RADIUS);
      const r2 = Math.min(BOARD_RADIUS, -q + BOARD_RADIUS);
      for (let r = r1; r <= r2; r++) {
        drawHex(q, r);
      }
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <canvas ref={canvasRef} className="bg-slate-800 rounded-xl shadow-2xl" />
    </div>
  );
}
