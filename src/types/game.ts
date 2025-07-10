export interface GameItem {
  id: number;
  x: number;
  y: number;
  size: number;
  type: 'heart' | 'blueStar' | 'star' | 'stone' | 'blindBox';
}

export interface DebugInfo {
  hookTipRect: DOMRect | null;
  collisionDetected: GameItem | null;
  itemRects: Array<{ id: number; rect: DOMRect; type: string }>;
}

export interface GameBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}
