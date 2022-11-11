import Token from "./Token";

class Node extends Token {
  public level: number;
  public children: Node[];
  public parent: Node | null;

  constructor(
    kind: number,
    element: string,
    attributes: any,
    level: number,
    parent: Node | null,
    children: Node[]
  ) {
    super(kind, element, attributes);
    this.level = level;
    this.children = children;
    this.parent = parent;
  }
}
export default Node;
