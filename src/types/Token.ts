import TokenKind from "./TokenKind";
class Token {
  public kind: TokenKind;
  public element: string;
  public attributes: any;

  constructor(kind: number, element: string, attributes: any) {
    this.kind = kind;
    this.element = element;
    this.attributes = attributes;
  }
}

export default Token;
