import Token from "../../types/Token";
import Node from "../../types/Node";
import Stack from "../../types/Stack";
function parser(tokenArray: Token[]) {
  const stack: Stack = new Stack();
  let i: number = 0;
  if (
    tokenArray[i].element === "!DOCTYPE" &&
    tokenArray[i].kind === 2 &&
    tokenArray[i].attributes.html === true
  ) {
    i++;
  }

  const createNode = (token: Token) => {
    const node: Node = new Node(
      token.kind,
      token.element,
      token.attributes,
      stack.level,
      null,
      []
    );
    return node;
  };

  const push = (token: Token) => {
    const node = createNode(token);
    node.parent = stack.top();
    stack.top().children.push(node);
    stack.push(node);
  };
  const pop = (token: Token) => {
    if (token.element === stack.top().element) {
      stack.pop();
    } else {
      return "error:wrong element depth";
    }
  };

  const document: Node = new Node(2, "document", {}, 0, null, []);
  stack.push(document);

  for (i; i < tokenArray.length; i++) {
    const token = tokenArray[i];
    switch (token.kind) {
      case 0:
        //error
        return "error:wrong element";
      case 1:
        //text
        push(token);
        pop(token);
        break;
      case 2:
        const attributes = token.attributes;
        if (
          attributes["self-closing"] ||
          token.element == "br" ||
          token.element == "meta" ||
          token.element == "link" ||
          token.element == "img" ||
          token.element == "!DOCTYPE"
        ) {
          push(token);
          pop(token);
        } else {
          push(token);
        }
        break;
      case 3:
        //close tag
        pop(token);
        break;
    }
  }

  if (stack.top() === document) {
    stack.pop(); //document pop;
  } else {
    return "error:wrong element depth";
  }
  return {
    maxlevel: stack.maxlevel,
    levelLength: stack.levelLength,
    document: document,
  };
}
export default parser;
