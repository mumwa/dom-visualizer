import tokenizer from "./modules/tokenizer/index";
import parser from "./modules/parser/index";
import renderer from "./modules/renderer/index";

const submit: HTMLElement | null = document.querySelector("#submit");
const htmlText: HTMLInputElement | null = document.querySelector("#htmlText");
const wrapper: HTMLInputElement | null = document.querySelector("#wrapper");

submit?.addEventListener("click", () => {
  if (wrapper !== null) {
    if (!htmlText?.value) {
      wrapper.style.backgroundColor = "#ffffff";
      wrapper.innerHTML = `<div>no input</div>`;
    } else {
      wrapper.style.backgroundColor = "#ffffff";
      wrapper.innerHTML = `<div>loading</div>`;

      const parsedHTML = parser(tokenizer(htmlText?.value));
      if (typeof parsedHTML === "string") {
        wrapper.innerHTML = `<div>${parsedHTML}</div>`;
        wrapper.style.backgroundColor = "#e64545";
      } else {
        wrapper.style.backgroundColor = "#ffffff";
        console.log(parsedHTML);
        renderer(
          parsedHTML.maxlevel,
          parsedHTML.levelLength,
          parsedHTML.document
        );
      }
    }
  }
});
