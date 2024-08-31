document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskList = document.getElementById("taskList");

  function createTaskItem(taskText) {
    const listItem = document.createElement("li");
    listItem.classList.add("task-item", "animate__animated", "animate__fadeIn");
    listItem.draggable = true; // Enable dragging

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("task-checkbox");

    const textNode = document.createElement("span");
    textNode.classList.add("task-text");
    textNode.textContent = taskText;

    const removeBtn = document.createElement("button");
    removeBtn.innerHTML = '<i class="fas fa-trash"></i> Remove';
    removeBtn.addEventListener("click", () => {
      listItem.classList.add("animate__fadeOut");
      setTimeout(() => taskList.removeChild(listItem), 300); // Match animation duration
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

  addTaskBtn.addEventListener("click", () => {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
      return;
    }

    const listItem = createTaskItem(taskText);
    taskList.appendChild(listItem);

    taskInput.value = "";
  });

  taskInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      addTaskBtn.click();
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
});
