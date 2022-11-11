import Node from "../../types/Node";
import RenderKind from "../../types/RenderKind";
import RenderToken from "../../types/RenderToken";

const wrapper: HTMLInputElement | null = document.querySelector("#wrapper");

const renderingNode = (
  level: number,
  index: number,
  top: number,
  left: number,
  kind: number,
  content: string
) => {
  let backgroundColor: string = "white";
  let color: string = "black";
  let element: string = "";
  switch (kind) {
    case RenderKind.element:
      backgroundColor = "#000000";
      color = "white";
      element = "element";
      break;
    case RenderKind.text:
      backgroundColor = "#ffffff";
      element = "text";
      break;
    case RenderKind.attribute:
      backgroundColor = "#fff6cb";
      element = "attribute";
      break;
    case RenderKind.error:
      backgroundColor = "#e64545";
      element = "error";
      break;
  }
  wrapper?.innerHTML
    ? (wrapper.innerHTML =
        wrapper?.innerHTML +
        `
    <div id="node${level}_${index}" class="element" style="top:${top}%; left:${left}%; background-color: ${backgroundColor}; color:${color};">
      <div style="font-weight: bold; font-size:5px;">${element}</div>
      <div style="font-size:3px;">${content}</div>
    </div>`)
    : "";
};

const renderingLine = (
  top: number,
  left: number,
  parentTop: number,
  parentLeft: number
) => {
  let line: string = "0 0, 100% 0, 100% 100%, 0 100%";
  let lineTop = parentTop;
  let lineLeft = left < parentLeft ? left : parentLeft;

  let width: number = Math.abs(left - parentLeft);
  let height: number = Math.abs(top - parentTop);

  if (left < parentLeft) {
    line = "98% 0, 100% 0, 2% 100%, 0 100%";
  } else if (left > parentLeft) {
    line = "0 0, 2% 0, 100% 100%, 98% 100%";
  } else {
    line = "0 0, 100% 0, 100% 100%, 0 100%";
    width = 1;
  }

  wrapper?.innerHTML
    ? (wrapper.innerHTML =
        wrapper?.innerHTML +
        `<div class="line" style="width: ${width}%; height: ${height}%; top:${lineTop}%; left:${lineLeft}%; clip-path: polygon(${line});"></div>`)
    : "";
};

function renderer(maxlevel: number, levelLength: number[], document: Node) {
  wrapper?.innerHTML ? (wrapper.innerHTML = "돔 트리") : "돔 트리";

  ++maxlevel;

  function count(node: Node) {
    const attributeNumber: number = Object.keys(node.attributes).length;
    levelLength[node.level + 1] = levelLength[node.level + 1] + attributeNumber;
    for (let i = 0; i < node.children.length; i++) {
      count(node.children[i]);
    }
    return 0;
  }

  count(document);

  const topBlock = 100 / (maxlevel + 1);
  let rowIndex: number[]; //길이보다 1 작아야함
  (rowIndex = []).length = maxlevel + 1;
  rowIndex.fill(0);

  function render(parent: any, node: Node) {
    const leftBlock = 100 / levelLength[node.level];

    const top: number = topBlock * node.level + topBlock / 2;
    const left: number = rowIndex[node.level] * leftBlock + leftBlock / 2;

    renderingNode(
      node.level,
      rowIndex[node.level],
      top,
      left,
      node.kind,
      node.element
    );

    if (parent !== null) {
      renderingLine(top, left, parent.parentTop, parent.parentLeft);
    }
    ++rowIndex[node.level];

    node.children.forEach((childnode) => {
      render({ parentTop: top, parentLeft: left }, childnode);
    });

    const attributeKeys: string[] = Object.keys(node.attributes);
    attributeKeys.forEach((key) => {
      const kind = key === "error" ? RenderKind.error : RenderKind.attribute;

      const nextBlock = 100 / levelLength[node.level + 1];
      renderingNode(
        node.level + 1,
        rowIndex[node.level + 1],
        topBlock * (node.level + 1) + topBlock / 2,
        rowIndex[node.level + 1] * nextBlock + nextBlock / 2,
        kind,
        `${key}:${node.attributes[key]}`
      );

      if (parent !== null) {
        renderingLine(
          topBlock * (node.level + 1) + topBlock / 2,
          rowIndex[node.level + 1] * nextBlock + nextBlock / 2,
          top,
          left
        );
      }
      ++rowIndex[node.level + 1];
    });
    return 0;
  }
  render(null, document);
  return 0;
}

export default renderer;
