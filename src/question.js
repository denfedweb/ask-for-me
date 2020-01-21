export class Question {
    static create(question){
        return fetch("https://questions-for-me.firebaseio.com/questions.json", {
            method: "POST",
            body: JSON.stringify(question),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(res => {
                question.id = res.name;
                return question
            })
            .then(addToLocalStorage)
            .then(Question.renderList)
    }
    static fetch(token){
        if(!token){
            return Promise.resolve("<p class='error'>Произошла ошибка...</p>")
        }
        return fetch(`https://questions-for-me.firebaseio.com/questions.json?auth=${token}`)
            .then(res => res.json())
            .then(res => {
                if(res && res.error){
                    return `<p class='error'>Произошла ошибка: ${res.error}</p>`
                }
                return res ? Object.keys(res).map(key => ({
                    ...res[key],
                    id: key
                })) : []
            })
    }
    static renderList() {
        const questions = getQuestionsFromLocalStorage();

        const html = questions.length ? questions.map(toCard).join("") : `<div class="mui--text-headline">Нет вопросов...</div>`

        const list = document.querySelector("#list");

        list.innerHTML = html;
    }
    static listToHtml(questions){
        return questions.length ? `<ol>${questions.map(q => `<li>${q.text}</li>`).join("")}</ol>` : `<p>Вопросов нет!</p>`
    }
}

function addToLocalStorage(question) {
    const all = getQuestionsFromLocalStorage();
    all.push(question);
    localStorage.setItem("questions", JSON.stringify(all))
}

function getQuestionsFromLocalStorage() {
    return JSON.parse(localStorage.getItem("questions") || "[]");
}

function toCard(question) {
    return `
        <div class="mui--text-black-54">
        ${new Date(question.date).toLocaleDateString()}
        ${new Date(question.date).toLocaleTimeString()}
        </div>
        <div>${question.text}</div>
        <br>
    `
}
