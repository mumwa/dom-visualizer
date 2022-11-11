(function () {
  'use strict';

  class Token {
      constructor(kind, element, attributes) {
          this.kind = kind;
          this.element = element;
          this.attributes = attributes;
      }
  }

  var TokenKind;
  (function (TokenKind) {
      TokenKind[TokenKind["text"] = 1] = "text";
      TokenKind[TokenKind["open"] = 2] = "open";
      TokenKind[TokenKind["close"] = 3] = "close";
      TokenKind[TokenKind["error"] = 0] = "error";
  })(TokenKind || (TokenKind = {}));
  var kind = TokenKind;

  const isLetter = (char) => {
      return char && char.toLowerCase() !== char.toUpperCase();
  };

  function attributesTokenizer(attributesText) {
      let attributes = {};
      attributes.length = 0;
      attributesText = attributesText.trim();
      if (attributesText[attributesText.length - 1] === "/") {
          attributesText = attributesText.substring(0, attributesText.length - 1);
          attributes["self-close"] = true;
      }
      else {
          attributes["self-close"] = false;
      }
      let index = 0;
      function addKey(char) {
          key = key + char;
          index++;
      }
      function addValue(char) {
          value = value + char;
          index++;
      }
      function resetKey() {
          key = "";
      }
      function resetValue() {
          value = "";
      }
      let key = "";
      let value = "";
      let isValue = true;
      while (index < attributesText.length) {
          //key
          while (true) {
              if (attributesText[index] === undefined) {
                  attributes[key] = true;
                  return attributes;
              }
              else if (attributesText[index] === " ") {
                  attributes[key] = true;
                  isValue = false;
                  index++;
                  continue;
              }
              else if (attributesText[index] === "=") {
                  isValue = true;
                  index++;
                  break;
              }
              else if (!isLetter(attributesText[index]) &&
                  attributesText[index] !== "-") {
                  return { error: "wrong key attributes: only letter or -" };
              }
              addKey(attributesText[index]);
          }
          if (isValue) {
              let Quote;
              if (attributesText[index] == '"') {
                  Quote = '"';
                  index++;
              }
              else if (attributesText[index] == "'") {
                  Quote = "'";
                  index++;
              }
              else {
                  return { error: "wrong value attributes: qoute not close" };
              }
              //value
              while (attributesText[index] !== Quote) {
                  if (attributesText[index] === undefined ||
                      attributesText[index] === null) {
                      return { error: "wrong value attributes: qoute not close" };
                  }
                  addValue(attributesText[index]);
              }
              index++; //" ' 이거 넘기기
              if (attributesText[index] === " " ||
                  index === attributesText.length - 1 ||
                  attributesText[index] === undefined) {
                  index++; //space 이거 넘기기
              }
              else {
                  return { error: "wrong value attributes: wrong space after attribute" };
              }
              //추가
              if (key === "" || key === null || key === undefined) {
                  return { error: "wrong key attributes: empty key" };
              }
              else if (value === "" || value === null || value === undefined) {
                  return { error: "wrong value attributes: empty value" };
              }
              else if (typeof attributes[key] !== "undefined") {
                  return { error: "wrong key attributes: duplicate key" };
              }
              else {
                  attributes[key] = value;
                  ++attributes.length;
              }
              //리셋
              resetKey();
              resetValue();
          }
      }
      return attributes;
  }

  function tagTokenizer(tag, type) {
      let index = type - 1;
      const tagTokenResult = { element: "", attributes: {} };
      let lexeme = "";
      function addlexeme(char) {
          lexeme = lexeme + char;
          index++;
      }
      function resetlexeme() {
          lexeme = "";
      }
      if (tag[index] === null || tag[index] === undefined || tag[index] === " ") {
          return { element: "error", attributes: "error" };
      }
      while (index < tag.length) {
          // if (!isLetter(tag[index])) {
          //   tagTokenResult["element"] = "error";
          //   tagTokenResult["attributes"] = {};
          //   break;
          // }
          if (tag[index] === " ") {
              tagTokenResult["element"] = lexeme;
              tagTokenResult["attributes"] = attributesTokenizer(tag.substring(index, tag.length - 1));
              resetlexeme();
              break;
          }
          else if (tag[index] === ">") {
              tagTokenResult["element"] = lexeme;
              tagTokenResult["attributes"] = {};
              resetlexeme();
              break;
          }
          else if (tag[index] === "\n" || tag[index] === undefined) {
              tagTokenResult["element"] = "error";
              tagTokenResult["attributes"] = {};
              break;
          }
          addlexeme(tag[index]);
      }
      return tagTokenResult;
  }

  function tokenizer(htmlText) {
      if (htmlText == undefined) {
          return [];
      }
      let tokenArray = [];
      let index = 0;
      let lexeme = "";
      function addlexeme(char) {
          lexeme = lexeme + char;
          index++;
      }
      function resetlexeme() {
          lexeme = "";
      }
      let token;
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
                  }
                  else {
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
                      }
                      else if (index === htmlText.length - 1 ||
                          htmlText[index] === "\n" ||
                          htmlText[index] === undefined) {
                          addlexeme(htmlText[index]);
                          tokenArray.push(new Token(kind.error, lexeme, {}));
                          resetlexeme();
                          break;
                      }
                      else {
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
                      }
                      else if (index === htmlText.length - 1) {
                          addlexeme(htmlText[index]);
                          tokenArray.push(new Token(kind.error, lexeme, {}));
                          resetlexeme();
                          break;
                      }
                      else {
                          addlexeme(htmlText[index]);
                      }
                  }
                  break;
          }
      }
      return tokenArray;
  }

  class Node extends Token {
      constructor(kind, element, attributes, level, parent, children) {
          super(kind, element, attributes);
          this.level = level;
          this.children = children;
          this.parent = parent;
      }
  }

  class Stack {
      constructor() {
          this.arr = [];
          this.level = 0;
          this.maxlevel = 0;
          this.levelLength = [];
      }
      push(node) {
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
          if (this.level <= 0)
              return null;
          const popedToken = this.arr.pop();
          --this.level;
          return popedToken;
      }
      top() {
          return this.arr[this.level - 1];
      }
  }

  function parser(tokenArray) {
      const stack = new Stack();
      let i = 0;
      if (tokenArray[i].element === "!DOCTYPE" &&
          tokenArray[i].kind === 2 &&
          tokenArray[i].attributes.html === true) {
          i++;
      }
      const createNode = (token) => {
          const node = new Node(token.kind, token.element, token.attributes, stack.level, null, []);
          return node;
      };
      const push = (token) => {
          const node = createNode(token);
          node.parent = stack.top();
          stack.top().children.push(node);
          stack.push(node);
      };
      const pop = (token) => {
          if (token.element === stack.top().element) {
              stack.pop();
          }
          else {
              return "error:wrong element depth";
          }
      };
      const document = new Node(2, "document", {}, 0, null, []);
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
                  if (attributes["self-closing"] ||
                      token.element == "br" ||
                      token.element == "meta" ||
                      token.element == "link" ||
                      token.element == "img" ||
                      token.element == "!DOCTYPE") {
                      push(token);
                      pop(token);
                  }
                  else {
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
      }
      else {
          return "error:wrong element depth";
      }
      return {
          maxlevel: stack.maxlevel,
          levelLength: stack.levelLength,
          document: document,
      };
  }

  var RenderKind;
  (function (RenderKind) {
      RenderKind[RenderKind["text"] = 1] = "text";
      RenderKind[RenderKind["element"] = 2] = "element";
      RenderKind[RenderKind["attribute"] = 3] = "attribute";
      RenderKind[RenderKind["error"] = 0] = "error";
  })(RenderKind || (RenderKind = {}));
  var RenderKind$1 = RenderKind;

  const wrapper$1 = document.querySelector("#wrapper");
  const renderingNode = (level, index, top, left, kind, content) => {
      let backgroundColor = "white";
      let color = "black";
      let element = "";
      switch (kind) {
          case RenderKind$1.element:
              backgroundColor = "#000000";
              color = "white";
              element = "element";
              break;
          case RenderKind$1.text:
              backgroundColor = "#ffffff";
              element = "text";
              break;
          case RenderKind$1.attribute:
              backgroundColor = "#fff6cb";
              element = "attribute";
              break;
          case RenderKind$1.error:
              backgroundColor = "#e64545";
              element = "error";
              break;
      }
      (wrapper$1 === null || wrapper$1 === void 0 ? void 0 : wrapper$1.innerHTML)
          ? (wrapper$1.innerHTML =
              (wrapper$1 === null || wrapper$1 === void 0 ? void 0 : wrapper$1.innerHTML) +
                  `
    <div id="node${level}_${index}" class="element" style="top:${top}%; left:${left}%; background-color: ${backgroundColor}; color:${color};">
      <div style="font-weight: bold; font-size:5px;">${element}</div>
      <div style="font-size:3px;">${content}</div>
    </div>`)
          : "";
  };
  const renderingLine = (top, left, parentTop, parentLeft) => {
      let line = "0 0, 100% 0, 100% 100%, 0 100%";
      let lineTop = parentTop;
      let lineLeft = left < parentLeft ? left : parentLeft;
      let width = Math.abs(left - parentLeft);
      let height = Math.abs(top - parentTop);
      if (left < parentLeft) {
          line = "98% 0, 100% 0, 2% 100%, 0 100%";
      }
      else if (left > parentLeft) {
          line = "0 0, 2% 0, 100% 100%, 98% 100%";
      }
      else {
          line = "0 0, 100% 0, 100% 100%, 0 100%";
          width = 1;
      }
      (wrapper$1 === null || wrapper$1 === void 0 ? void 0 : wrapper$1.innerHTML)
          ? (wrapper$1.innerHTML =
              (wrapper$1 === null || wrapper$1 === void 0 ? void 0 : wrapper$1.innerHTML) +
                  `<div class="line" style="width: ${width}%; height: ${height}%; top:${lineTop}%; left:${lineLeft}%; clip-path: polygon(${line});"></div>`)
          : "";
  };
  function renderer(maxlevel, levelLength, document) {
      (wrapper$1 === null || wrapper$1 === void 0 ? void 0 : wrapper$1.innerHTML) ? (wrapper$1.innerHTML = "돔 트리") : "돔 트리";
      ++maxlevel;
      function count(node) {
          const attributeNumber = Object.keys(node.attributes).length;
          levelLength[node.level + 1] = levelLength[node.level + 1] + attributeNumber;
          for (let i = 0; i < node.children.length; i++) {
              count(node.children[i]);
          }
          return 0;
      }
      count(document);
      const topBlock = 100 / (maxlevel + 1);
      let rowIndex; //길이보다 1 작아야함
      (rowIndex = []).length = maxlevel + 1;
      rowIndex.fill(0);
      function render(parent, node) {
          const leftBlock = 100 / levelLength[node.level];
          const top = topBlock * node.level + topBlock / 2;
          const left = rowIndex[node.level] * leftBlock + leftBlock / 2;
          renderingNode(node.level, rowIndex[node.level], top, left, node.kind, node.element);
          if (parent !== null) {
              renderingLine(top, left, parent.parentTop, parent.parentLeft);
          }
          ++rowIndex[node.level];
          node.children.forEach((childnode) => {
              render({ parentTop: top, parentLeft: left }, childnode);
          });
          const attributeKeys = Object.keys(node.attributes);
          attributeKeys.forEach((key) => {
              const kind = key === "error" ? RenderKind$1.error : RenderKind$1.attribute;
              const nextBlock = 100 / levelLength[node.level + 1];
              renderingNode(node.level + 1, rowIndex[node.level + 1], topBlock * (node.level + 1) + topBlock / 2, rowIndex[node.level + 1] * nextBlock + nextBlock / 2, kind, `${key}:${node.attributes[key]}`);
              if (parent !== null) {
                  renderingLine(topBlock * (node.level + 1) + topBlock / 2, rowIndex[node.level + 1] * nextBlock + nextBlock / 2, top, left);
              }
              ++rowIndex[node.level + 1];
          });
          return 0;
      }
      render(null, document);
      return 0;
  }

  const submit = document.querySelector("#submit");
  const htmlText = document.querySelector("#htmlText");
  const wrapper = document.querySelector("#wrapper");
  submit === null || submit === void 0 ? void 0 : submit.addEventListener("click", () => {
      if (wrapper !== null) {
          if (!(htmlText === null || htmlText === void 0 ? void 0 : htmlText.value)) {
              wrapper.style.backgroundColor = "#ffffff";
              wrapper.innerHTML = `<div>no input</div>`;
          }
          else {
              wrapper.style.backgroundColor = "#ffffff";
              wrapper.innerHTML = `<div>loading</div>`;
              const parsedHTML = parser(tokenizer(htmlText === null || htmlText === void 0 ? void 0 : htmlText.value));
              if (typeof parsedHTML === "string") {
                  wrapper.innerHTML = `<div>${parsedHTML}</div>`;
                  wrapper.style.backgroundColor = "#e64545";
              }
              else {
                  wrapper.style.backgroundColor = "#ffffff";
                  renderer(parsedHTML.maxlevel, parsedHTML.levelLength, parsedHTML.document);
              }
          }
      }
  });

})();
