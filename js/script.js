// grab all elements 
const form = document.querySelector("[data-form]");
const lists = document.querySelector("[data-lists]");
const input = document.querySelector("[data-input]");
const removeAll = document.querySelector("[data-removeAll]")

//local Storage
class Storage {
    static addTodStorage(todoArr){
        let storage = localStorage.setItem("todo", JSON.stringify(todoArr));
        return storage;
    }

    static getStorage(){
        let storage = localStorage.getItem("todo") === null ? 
        [] : JSON.parse(localStorage.getItem("todo"));
        return storage
    }
}

// empty array 
let todoArr = Storage.getStorage();

// form part 
form.addEventListener("submit", (e) => {
    e.preventDefault();
    let id = Math.random() * 1000000;
    const todo = new Todo(id, input.value);
    todoArr = [...todoArr, todo];
    UI.displayData();
    UI.clearInput();
    //add to storage
    Storage.addTodStorage(todoArr);
    UI.removeBtn();
});
// make object instance 
class Todo {
    constructor(id, todo){
        this.id = id;
        this.todo = todo;
    }
}

// display the todo in the DOM;
class UI{
    static displayData(){
        let displayData = todoArr.map((item) => {
            //add a new class to span tag.
            return `
                <div class="todo">
                    <p class="todo__text">${item.todo}</p>
                <div class="icons">
                    <span class="remove" data-id = ${item.id}>🗑️</span>
                    <span class="editMe" data-id = ${item.id}>🖋️</span>
                </div>
                </div>
            `
        });
        lists.innerHTML = (displayData).join(" ");
    }
    static clearInput(){
        input.value = "";
    }
    static removeTodo(){
        lists.addEventListener("click", (e) => {
            if(e.target.classList.contains("remove")){
                e.target.parentElement.parentElement.remove();
                let btnId = e.target.dataset.id;
                //remove from array.
                UI.removeArrayTodo(btnId);
            }
        });
    }
    static removeArrayTodo(id){
        todoArr = todoArr.filter((item) => item.id !== +id);
        Storage.addTodStorage(todoArr);
        UI.removeBtn();
    }

    static editTodo(){
        let iconChange = true;
        lists.addEventListener("click", (e) => {
            if(e.target.classList.contains("editMe")){
                let span = e.target.parentElement.parentElement.firstElementChild;
                const btnId = e.target.dataset.id;
                if(iconChange){
                    span.setAttribute("contenteditable", "true");
                    span.focus();
                    e.target.textContent = "Save";
                    span.style.color = "blue";
                    Storage.addTodStorage(todoArr);
                }else{
                    e.target.textContent = "🖋️";
                    span.removeAttribute("contenteditable");
                    const newArr = todoArr.findIndex((item)=> item.id === +btnId);
                    todoArr[newArr].todo = span.textContent;
                    Storage.addTodStorage(todoArr);
                    span.style.color = "#000"
                }
                iconChange = !iconChange;
            }
        });
    }

    static removeAll(){
        removeAll.addEventListener("click", () => {
            todoArr.length = 0;
            localStorage.clear();
            UI.displayData();
            UI.removeBtn();
        })
    }

    static removeBtn(){
        if(todoArr.length <= 0){
            removeAll.style.display = "none";
        } else{
            removeAll.style.display = "flex";
        }
    }
}

//once the browser is loaded
window.addEventListener("DOMContentLoaded", () => {
    UI.displayData();
    //remove from the dom
    UI.removeTodo();
    // new edits 
    UI.editTodo();
    UI.removeAll();
    UI.removeBtn();
});