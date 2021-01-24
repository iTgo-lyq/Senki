import { AnimPlayer, AnimProvider } from "./anim";

export class SenkiNode extends AnimPlayer {
  readonly pivot: { readonly x: number; readonly y: number };
  readonly position: { readonly x: number; readonly y: number };
  readonly abs: { readonly x: number; readonly y: number };

  name?: string;

  constructor(x = 0, y = 0);

  render(api: { ctx: CanvasRenderingContext2D }): void;

  setPositon(x: number, y: number): void;

  setPivot(x: number, y: number): void;

  _updateCoord(): void;

  moveX(
    timestamp: number,
    provider: { key: string; anmi: AnimProvider },
    rm
  ): void;

  moveY(
    timestamp: number,
    provider: { key: string; anmi: AnimProvider },
    rm
  ): void;
}

export class Group extends SenkiNode {
  children: SenkiNode[];

  add(n: SenkiNode): void;

  removeChild(n: SenkiNode): void;

  render(args) {
    for (let n of this.children) n.render(args);
  }

  setPositon: (x: number, y: number) => void;

  setPivot: (x: number, y: number) => void;

  findChildByName(name: string): SenkiNode;

  _updateChildPivot(): void;
}

export class Scene extends Group {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;

  constructor(canvas: HTMLCanvasElement);

  render: () => void;

  onResize: () => void;

  clear(): void;
}
