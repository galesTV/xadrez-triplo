export type PlayerColor = 'white' | 'black' | 'red';
export type PieceType =
  'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';

export interface Piece {
  type: PieceType;
  color: PlayerColor;
  isObstacle?: boolean;
}

// Representa uma coordenada cúbica no tabuleiro hexagonal
export class Hex {
  constructor(
    public q: number,
    public r: number,
    public s: number,
  ) {
    if (Math.round(q + r + s) !== 0) {
      throw new Error('Coordenadas inválidas: q + r + s deve ser igual a 0');
    }
  }

  // Soma vetores (útil para calcular para onde uma peça está indo)
  add(b: Hex): Hex {
    return new Hex(this.q + b.q, this.r + b.r, this.s + b.s);
  }

  // Multiplica vetores (útil para calcular até onde uma Torre ou Rainha pode ir)
  scale(k: number): Hex {
    return new Hex(this.q * k, this.r * k, this.s * k);
  }

  // Compara se duas casas são a mesma (útil para verificar capturas)
  equals(b: Hex): boolean {
    return this.q === b.q && this.r === b.r && this.s === b.s;
  }

  // Gira a coordenada 120 graus no sentido horário
  rotate120(): Hex {
    return new Hex(-this.s, -this.q, -this.r);
  }

  // Gira a coordenada 240 graus no sentido horário
  rotate240(): Hex {
    return new Hex(-this.r, -this.s, -this.q);
  }
}

// O estado do tabuleiro
export class HexBoard {
  // Mapa onde a chave é a coordenada em string "q,r,s" e o valor é a peça
  public tiles: Map<string, Piece | null> = new Map();
  public radius: number;

  constructor(radius: number = 5) {
    this.radius = radius;
    this.generateBoard();
  }

  // Gera o grid hexagonal baseado no raio (Raio 5 gera 91 casas no total)
  private generateBoard() {
    for (let q = -this.radius; q <= this.radius; q++) {
      const r1 = Math.max(-this.radius, -q - this.radius);
      const r2 = Math.min(this.radius, -q + this.radius);

      for (let r = r1; r <= r2; r++) {
        const s = -q - r;
        const hex = new Hex(q, r, s);
        this.setPieceAt(hex, null);
      }
    }
  }

  public setupInitialPieces() {
    // Desenhamos apenas a formação do exército Branco (Base do mapa, onde r = 5 e r = 4)
    const baseArmy = [
      // Linha de trás (Oficiais)
      { q: 0, r: 5, s: -5, type: 'rook' },
      { q: -1, r: 5, s: -4, type: 'knight' },
      { q: -2, r: 5, s: -3, type: 'king' },
      { q: -3, r: 5, s: -2, type: 'queen' },
      { q: -4, r: 5, s: -1, type: 'bishop' },
      { q: -5, r: 5, s: 0, type: 'rook' },

      // Linha de frente (Peões)
      { q: 0, r: 4, s: -4, type: 'pawn' },
      { q: -1, r: 4, s: -3, type: 'pawn' },
      { q: -2, r: 4, s: -2, type: 'pawn' },
      { q: -3, r: 4, s: -1, type: 'pawn' },
      { q: -4, r: 4, s: 0, type: 'pawn' },
    ];

    // Posiciona as Brancas
    baseArmy.forEach((p) => {
      this.setPieceAt(new Hex(p.q, p.r, p.s), {
        type: p.type as PieceType,
        color: 'white',
        isObstacle: false,
      });
    });

    // Posiciona as Pretas
    baseArmy.forEach((p) => {
      const hex = new Hex(p.q, p.r, p.s).rotate120();
      this.setPieceAt(hex, {
        type: p.type as PieceType,
        color: 'black',
        isObstacle: false,
      });
    });

    // Posiciona as Vermelhas
    baseArmy.forEach((p) => {
      const hex = new Hex(p.q, p.r, p.s).rotate240();
      this.setPieceAt(hex, {
        type: p.type as PieceType,
        color: 'red',
        isObstacle: false,
      });
    });
  }

  // Converte o objeto Hex numa chave de string para o Map
  public getKey(hex: Hex): string {
    return `${hex.q},${hex.r},${hex.s}`;
  }

  public getPieceAt(hex: Hex): Piece | null | undefined {
    return this.tiles.get(this.getKey(hex));
  }

  public setPieceAt(hex: Hex, piece: Piece | null) {
    this.tiles.set(this.getKey(hex), piece);
  }
}
