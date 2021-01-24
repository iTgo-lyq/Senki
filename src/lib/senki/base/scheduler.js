export default class Scheduler {
  tasks = [];

  status = "stopped"; // running

  constructor(guards) {
    guards.sort((g1, g2) => g2.num - g1.num);
    this.guards = guards;
  }

  push = (task) => {
    this.tasks.push(task);
    if (this.tasks.length === 1 && this.status === "stopped") {
      this.status = "running";
      this.next();
    }
    for (const guard of this.guards) {
      if (this.tasks.length > guard.num) {
        return guard.resolve();
      }
    }
  };

  next = () => {
    const task = this.tasks.shift();
    if (task !== undefined) task(this.next);
    else this.status = "stopped"
  };
}