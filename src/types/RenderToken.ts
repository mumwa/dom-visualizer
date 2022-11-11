import RenderKind from "./RenderKind";
class Token {
  public kind: RenderKind;
  public element: string;
  public content: string;

  public level: number;

  public top: number;
  public left: number;

  public parentTop: number;
  public parentLeft: number;

  constructor(
    kind: RenderKind,
    element: string,
    content: string,
    level: number,
    top: number,
    left: number,
    parentTop: number,
    parentLeft: number
  ) {
    this.kind = kind;
    this.element = element;
    this.content = content;
    this.level = level;
    this.top = top;
    this.left = left;
    this.parentTop = parentTop;
    this.parentLeft = parentLeft;
  }
}

export default Token;
