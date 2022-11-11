import attributeTokenizer from "./attributeTokenizer";

interface tagToken {
  element: string;
  attributes: object;
}

function tagTokenizer(tag: string, type: number) {
  let index: number = type - 1;
  const tagTokenResult: tagToken = { element: "", attributes: {} };

  let lexeme: string = "";

  function addlexeme(char: string) {
    lexeme = lexeme + char;
    index++;
  }
  function resetlexeme() {
    lexeme = "";
  }

  if (tag[index] === null || tag[index] === undefined || tag[index] === " ") {
    return { element: "error", attributes: "error" };
  }

  let isAttribute: boolean = false;
  while (index < tag.length) {
    // if (!isLetter(tag[index])) {
    //   tagTokenResult["element"] = "error";
    //   tagTokenResult["attributes"] = {};
    //   break;
    // }
    if (tag[index] === " ") {
      tagTokenResult["element"] = lexeme;
      tagTokenResult["attributes"] = attributeTokenizer(
        tag.substring(index, tag.length - 1)
      );
      resetlexeme();
      isAttribute = true;
      break;
    } else if (tag[index] === ">") {
      tagTokenResult["element"] = lexeme;
      tagTokenResult["attributes"] = {};
      resetlexeme();
      break;
    } else if (tag[index] === "\n" || tag[index] === undefined) {
      tagTokenResult["element"] = "error";
      tagTokenResult["attributes"] = {};
      break;
    }
    addlexeme(tag[index]);
  }

  return tagTokenResult;
}

export default tagTokenizer;
