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
    this.levelLength = [0];
  }

  push(node: Node) {
    this.arr.push(node);
    ++this.level;
    if (this.level > this.maxlevel) {
      this.maxlevel = this.level;
      this.levelLength[this.maxlevel - 1] = 0;
    }

    // console.log("배열", this.levelLength);

    ++this.levelLength[this.level - 1];
    // console.log(
    //   "추가 인덱스",
    //   this.level - 1,
    //   "값:",
    //   this.levelLength[this.level - 1]
    // );
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
