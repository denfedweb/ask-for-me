export function isValid(val) {
    return val.length >= 10
}

export function createModel(title, content) {
    const model = document.createElement("div");
    model.classList.add("model");

    const html = `
    <h1>${title}</h1>
    <div class="modal-content">${content}</div>
`;

    model.innerHTML = html;

    mui.overlay("on", model);
}
