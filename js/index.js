const input = document.querySelector("input");
const addButton = document.querySelector(".add-button");
const todosHtml = document.querySelector(".todos");
const emptyImage = document.querySelector(".empty-image");
const quote = document.querySelector(".quote-container");
const counter = document.querySelector(".counter");


let todosJson = JSON.parse(localStorage.getItem("todos")) || [];
showTodos();

function getTodoHtml(todo, index) {
    let checked = todo.status === "completed" ? "checked" : "";
    return `
    <li class="todo">
        <label for="${index}">
            <input id="${index}" onclick="updateStatus(this)" type="checkbox" ${checked}>
            <span class="${checked}">${todo.name}</span>
        </label>     
        <button class="edit-btn" data-index="${index}" onclick="edit(this)">
        <i class='bx bxs-pencil'></i>
        </button> 
        <button class="delete-btn" data-index="${index}" onclick="remove(this)">
        <i class="fa fa-times"></i>
        </button>
    </li>
    `;
}

function showTodos() { 
    if (todosJson.length === 0) {
        todosHtml.innerHTML = '';
        emptyImage.style.display = 'block';
        quote.style.display = 'block';
    } else {
        todosHtml.innerHTML = todosJson.map(getTodoHtml).join('');
        emptyImage.style.display = 'none';
        quote.style.display = 'none';
    }
    counter.textContent = todosJson.length;
    
    //persist task status even after the browser is closed
    todosJson.forEach((todo, index) => {
        let checkbox = document.getElementById(index);
        if (todo.status === "completed") {
            checkbox.checked = true;
            checkbox.parentElement.lastElementChild.classList.add("checked");
        } else {
            checkbox.checked = false;
            checkbox.parentElement.lastElementChild.classList.remove("checked");
        }
    });
}

function addTodo(todo) {
    input.value = "";
    todosJson.unshift({ name: todo, status: "pending" });
    localStorage.setItem("todos", JSON.stringify(todosJson));
    showTodos();
}

input.addEventListener("keyup", e => {
    let todo = input.value.trim();
    if (!todo || e.key !== "Enter") {
        return;
    }
    addTodo(todo);
});

addButton.addEventListener("click", () => {
    let todo = input.value.trim();
    if (!todo) {
        return;
    }
    addTodo(todo);
});

function updateStatus(todo) {
    let todoName = todo.parentElement.lastElementChild;
    if (todo.checked) {         
        todoName.classList.add("checked");
        todosJson[todo.id].status = "completed";
    } else {
        todoName.classList.remove("checked");
        todosJson[todo.id].status = "pending";
    }
    localStorage.setItem("todos", JSON.stringify(todosJson));
}

function remove(todo) {
    const index = todo.dataset.index;
    todosJson.splice(index, 1); 
    showTodos();     
    localStorage.setItem("todos", JSON.stringify(todosJson));

}

function edit(todo) {
    const index = todo.dataset.index;  
    const todoItem = todo.parentElement.querySelector('span');
    const saveTaskContent = todosJson[index].name;
    
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.value = todosJson[index].name;
    
    inputField.style.width = '320px'; 
    inputField.style.background = 'transparent'; 
    inputField.style.border = 'none'; 
    inputField.style.color = 'white'; 
    inputField.maxLength = 50; 
    
    todoItem.innerHTML = ''; 
    todoItem.appendChild(inputField);
    
    inputField.focus();
    
    inputField.addEventListener('blur', () => {
        const editedTodo = inputField.value.trim();
        if (editedTodo !== "") { 
            todosJson[index].name = editedTodo;
            showTodos();
            localStorage.setItem("todos", JSON.stringify(todosJson)); 
        } else {
            alert("Please enter a valid task.");
            inputField.focus(); 
        } 
    });
    
    inputField.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            inputField.blur(); 
        }
    });
}