import "./styles.css";
import {createModel, isValid} from "./utils";
import {Question} from "./question";
import {authWithEmailAndPassword, getAuthForm} from "./auth";

const form = document.querySelector("#form");
const modelBtn = document.querySelector("#model-btn");
const submitBtn = form.querySelector("#submit");
const input = form.querySelector("#question-input");

window.addEventListener("load", Question.renderList);
form.addEventListener("submit", submitFormHandler);
modelBtn.addEventListener("click", openModel);
input.addEventListener("input", ()=>{
   submitBtn.disabled = !isValid(input.value);
});


function submitFormHandler(e) {
    e.preventDefault();
    if(isValid(input.value)){
        const question = {
            text: input.value.trim(),
            date: new Date().toJSON()
        };
        submitBtn.disabled = true;
    //    async req
        Question.create(question).then(()=>{
            input.value = "";
            input.className = "";
            submitBtn.disabled = false;
        });
        console.log("question", question);
    }
}

function openModel() {
    createModel("Авторизация", getAuthForm());
    document.getElementById("auth-form").addEventListener("submit", authFormHandler, {once: true})
}

function authFormHandler(e) {
    e.preventDefault();

    const btn = e.target.querySelector('button');
    const email = e.target.querySelector("#email").value;
    const password = e.target.querySelector("#password").value;

    btn.disabled = true;
    authWithEmailAndPassword(email, password).then(Question.fetch).then(renderModalAfterAuth).then(()=> {
        btn.disabled = false;
    });
}

function renderModalAfterAuth(content) {
    if(typeof content === "string"){
        createModel("Ошибка", content);
    }   else {
        createModel("Cписок вопросов: ", Question.listToHtml(content));
    }
}
