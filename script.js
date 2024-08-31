document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskList = document.getElementById("taskList");

  function createTaskItem(taskText, checked = false) {
    const listItem = document.createElement("li");
    listItem.classList.add("task-item", "animate__animated", "animate__fadeIn");
    listItem.draggable = true; // Enable dragging

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("task-checkbox");
    checkbox.checked = checked; // Set checkbox state based on saved status

    const textNode = document.createElement("span");
    textNode.classList.add("task-text");
    textNode.textContent = taskText;

    const removeBtn = document.createElement("button");
    removeBtn.innerHTML = '<i class="fas fa-trash"></i> Remove';
    removeBtn.addEventListener("click", () => {
      listItem.classList.add("animate__fadeOut");
      setTimeout(() => {
        taskList.removeChild(listItem);
        saveTasks(); // Save tasks after removal
      }, 300); // Match animation duration
    });

    listItem.appendChild(checkbox);
    listItem.appendChild(textNode);
    listItem.appendChild(removeBtn);

    listItem.addEventListener("dragstart", () => {
      listItem.classList.add("dragging");
    });

    listItem.addEventListener("dragend", () => {
      listItem.classList.remove("dragging");
    });

    return listItem;
  }

  function saveTasks() {
    const tasks = [];
    document.querySelectorAll(".task-item").forEach((item) => {
      const taskText = item.querySelector(".task-text").textContent;
      const isChecked = item.querySelector(".task-checkbox").checked;
      tasks.push({ text: taskText, checked: isChecked });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach((task) => {
      const listItem = createTaskItem(task.text, task.checked);
      taskList.appendChild(listItem);
    });
  }

  addTaskBtn.addEventListener("click", () => {
    const taskText = taskInput.value.trim();
    if (taskText === "") {
      return;
    }

    const listItem = createTaskItem(taskText);
    taskList.appendChild(listItem);
    taskInput.value = "";
    saveTasks(); // Save tasks after adding a new one
  });

  taskInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      addTaskBtn.click();
    }
  });

  taskList.addEventListener("change", (event) => {
    if (event.target.classList.contains("task-checkbox")) {
      saveTasks(); // Save tasks when checkbox state changes
    }
  });

  taskList.addEventListener("dragover", (event) => {
    event.preventDefault();
    const draggingItem = document.querySelector(".dragging");
    const afterElement = getDragAfterElement(taskList, event.clientY);
    if (afterElement == null) {
      taskList.appendChild(draggingItem);
    } else {
      taskList.insertBefore(draggingItem, afterElement);
    }
    saveTasks(); // Save tasks after drag and drop
  });

  function getDragAfterElement(container, y) {
    const draggableElements = [
      ...container.querySelectorAll(".task-item:not(.dragging)"),
    ];

    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }

  // Load tasks on page load
  loadTasks();
});
