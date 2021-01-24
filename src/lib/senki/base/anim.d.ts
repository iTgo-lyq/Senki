type useLinearInterpolater = (ratio: number) => number;
type useEaseInterpolater = (ratio: number) => number;
type useEaseInInterpolater = (ratio: number) => number;
type useEaseOutInterpolater = (ratio: number) => number;
type useEaseInOutInterpolater = (ratio: number) => number;

export class AnimPlayer {
  anmiStatus: "idle" | "busy";
  animProviders = {};
  animResponders = {};

  useAnimProvider(key: string, anmi: AnimProvider): void;

  removeAnimProvider(key: string): void;

  registerAnimResponder(key, fn): void;

  play: (timestamp: number) => void;
}

type AnimProviderType =
  | "linear"
  | "ease"
  | "ease-in"
  | "ease-out"
  | "ease-in-out";

export type AnimProviderConfig = {
  from: number;
  to: number;
  duration: number;
  type: AnimProviderType;
};

export class AnimProvider {
  static count = 0;
  static interpolater: {
    linear: useLinearInterpolater;
    ease: useEaseInterpolater;
    "ease-in": useEaseInInterpolater;
    "ease-out": useEaseOutInterpolater;
    "ease-in-out": useEaseInOutInterpolater;
  };

  time: [number, number]; // [ begin, duration]
  value: [number, number, number]; // [ from, to, deviation]

  type: AnimProviderType;
  hasFinished: boolean;

  onFinished?: () => {};

  constructor(config: AnimProviderConfig, onFinished = () => {});

  startTimer(): void;

  hasBegin(): boolean;

  getCurrentValue(nowT: number): number;

  copy(): AnimProvider;
}
