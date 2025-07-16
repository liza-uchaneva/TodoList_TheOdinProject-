import { tasksController } from '../models/tasksController.js';

export const createTaskForm = () => {
  const addTaskDialog = document.getElementById("add-task");
  const newTaskForm = document.getElementById("new-task-form");
  const cancelBtn = document.getElementById("cancel-task");
  const controller = tasksController();

  // Optional button to open the dialog
  document.getElementById("add-task-btn")?.addEventListener("click", () => {
    addTaskDialog.showModal();
  });

  cancelBtn.addEventListener("click", () => {
    addTaskDialog.close();
  });

  newTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(newTaskForm);
    const taskData = {
      title: formData.get("title"),
      description: formData.get("description"),
      dueDate: formData.get("dueDate"),
      priority: formData.get("priority"),
      checked: false,
      project: formData.get("project"),
    };

    controller.add(taskData);

    newTaskForm.reset();
    addTaskDialog.close();
  });
};
