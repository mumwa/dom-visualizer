import { isLetter } from "../util";

function attributesTokenizer(attributesText: string) {
  let attributes: any = {};
  attributes.length = 0;
  attributesText = attributesText.trim();
  if (attributesText[attributesText.length - 1] === "/") {
    attributesText = attributesText.substring(0, attributesText.length - 1);
    attributes["self-close"] = true;
  } else {
    attributes["self-close"] = false;
  }
  let index: number = 0;

  function addKey(char: string) {
    key = key + char;
    index++;
  }

  function addValue(char: string) {
    value = value + char;
    index++;
  }

  function resetKey() {
    key = "";
  }

  function resetValue() {
    value = "";
  }

  let key: string = "";
  let value: string = "";

  let isValue: boolean = true;

  while (index < attributesText.length) {
    //key
    while (true) {
      if (attributesText[index] === undefined) {
        attributes[key] = true;
        return attributes;
      } else if (attributesText[index] === " ") {
        attributes[key] = true;
        isValue = false;
        index++;
        continue;
      } else if (attributesText[index] === "=") {
        isValue = true;
        index++;
        break;
      } else if (
        !isLetter(attributesText[index]) &&
        attributesText[index] !== "-"
      ) {
        return { error: "wrong key attributes: only letter or -" };
      }
      addKey(attributesText[index]);
    }

    if (isValue) {
      let Quote: string;

      if (attributesText[index] == '"') {
        Quote = '"';
        index++;
      } else if (attributesText[index] == "'") {
        Quote = "'";
        index++;
      } else {
        return { error: "wrong value attributes: qoute not close" };
      }

      //value
      while (attributesText[index] !== Quote) {
        if (
          attributesText[index] === undefined ||
          attributesText[index] === null
        ) {
          return { error: "wrong value attributes: qoute not close" };
        }
        addValue(attributesText[index]);
      }
      index++; //" ' 이거 넘기기
      if (
        attributesText[index] === " " ||
        index === attributesText.length - 1 ||
        attributesText[index] === undefined
      ) {
        index++; //space 이거 넘기기
      } else {
        return { error: "wrong value attributes: wrong space after attribute" };
      }

      //추가
      if (key === "" || key === null || key === undefined) {
        return { error: "wrong key attributes: empty key" };
      } else if (value === "" || value === null || value === undefined) {
        return { error: "wrong value attributes: empty value" };
      } else if (typeof attributes[key] !== "undefined") {
        return { error: "wrong key attributes: duplicate key" };
      } else {
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
export default attributesTokenizer;
