import Node from "./Node";
class Stack {
  public arr: Node[];
  public level: number;
  public maxlevel: number;
  public levelLength: number[];

  constructor() {
    this.arr = [];
    this.level = 0;
    this.maxlevel = 0;
    this.levelLength = [];
  }

  push(node: Node) {
    this.arr.push(node);
    ++this.level;
    if (this.level > this.maxlevel) {
      this.maxlevel = this.level;
    }
    if (!this.levelLength[this.level - 1]) {
      this.levelLength[this.level - 1] = 0;
    }
    ++this.levelLength[this.level - 1];
  }
  pop() {
    if (this.level <= 0) return null;
    const popedToken = this.arr.pop();
    --this.level;
    return popedToken;
  }
  top() {
    return this.arr[this.level - 1];
  }
}
export default Stack;
