type guard = {
  num: number;
  resolve: () => void;
};

export default class Scheduler {
  tasks = [];

  status: "stopped" | "running";
  guards: guard[];

  constructor(guards: guard[]);

  push: (task: (next: () => void) => any) => void;

  next: () => void;
}
