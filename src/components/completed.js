import { tasksController } from '../models/tasksController.js';

export const completed = () => {
  const wrapper = document.createElement('div');
  wrapper.classList.add('completed-tasks');

  const tasks = tasksController().getAll();

  const completedTasks = tasks.filter(task => task.checked);

  if (completedTasks.length === 0) {
    wrapper.textContent = 'No completed tasks yet!';
    return wrapper;
  }

  completedTasks.forEach(task => {
    const taskEl = document.createElement('div');
    taskEl.classList.add('task', 'task--completed');
    taskEl.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.description || ''}</p>
      <p><strong>Due:</strong> ${task.dueDate}</p>
      <p><strong>Priority:</strong> ${task.priority}</p>
    `;
    wrapper.appendChild(taskEl);
  });

  return wrapper;
};
