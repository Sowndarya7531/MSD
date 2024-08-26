let array = [];


window.onload = () => {
    loadTasks();
};

document.getElementById("btn").addEventListener("click", () => {
    let text = document.getElementById("task").value;
    if (text) {
        array.push(text);
        saveTasks();
        appendDeleteBtn();
        document.getElementById("task").value = ""; 
    }
});

function appendDeleteBtn() {
    let display = document.getElementById("tt");
    display.innerHTML = ""; 

    array.forEach((task, index) => {
        let list = document.createElement("li");
        list.innerHTML = task;

        let delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.style.marginLeft = "20px";
        delBtn.classList.add("btn");
        delBtn.addEventListener("click", () => {
            deleteTask(index);
        });

        list.appendChild(delBtn); 
        list.classList.add("li");
        display.appendChild(list); 
    });
}

function deleteTask(index) {
    array.splice(index, 1);
    saveTasks();
    appendDeleteBtn(); 
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(array)); 
}

function loadTasks() {
    let savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) {
        array = savedTasks;
        appendDeleteBtn(); 
    }
}
