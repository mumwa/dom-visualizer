import Token from "../../types/Token";
import kind from "../../types/TokenKind";
import tagTokenizer from "./tagTokenizer";

function tokenizer(htmlText: string | undefined) {
  if (htmlText == undefined) {
    return [];
  }

  let tokenArray: Token[] = [];

  let index: number = 0;
  let lexeme: string = "";

  function addlexeme(char: string) {
    lexeme = lexeme + char;
    index++;
  }

  function resetlexeme() {
    lexeme = "";
  }

  let token: number;
  while (index < htmlText.length) {
    switch (htmlText[index]) {
      case " ":
      case "\n":
        index++;
        break;
      case "<":
        addlexeme(htmlText[index]);
        if (htmlText[index] === "/") {
          token = kind.close;
          addlexeme(htmlText[index]);
        } else {
          token = kind.open;
        }
        while (true) {
          if (htmlText[index] === ">") {
            addlexeme(htmlText[index]);
            const result = tagTokenizer(lexeme, token);
            const element = result.element;
            const attributes = result.attributes;
            tokenArray.push(new Token(token, element, attributes));
            resetlexeme();
            break;
          } else if (
            index === htmlText.length - 1 ||
            htmlText[index] === "\n" ||
            htmlText[index] === undefined
          ) {
            addlexeme(htmlText[index]);
            tokenArray.push(new Token(kind.error, lexeme, {}));
            resetlexeme();
            break;
          } else {
            addlexeme(htmlText[index]);
          }
        }
        break;
      default:
        while (true) {
          if (htmlText[index] == "<") {
            tokenArray.push(new Token(kind.text, lexeme, {}));
            resetlexeme();
            break;
          } else if (index === htmlText.length - 1) {
            addlexeme(htmlText[index]);
            tokenArray.push(new Token(kind.error, lexeme, {}));
            resetlexeme();
            break;
          } else {
            addlexeme(htmlText[index]);
          }
        }
        break;
    }
  }
  return tokenArray;
}
export default tokenizer;
