import { tasksController } from '../models/tasksController.js';

export const uncompleted = () => {
  const wrapper = document.createElement('div');
  wrapper.classList.add('uncompleted-tasks');

  const controller = tasksController();
  const tasks = controller.getAll();
  const todayISO = new Date().toISOString().split('T')[0];

  const uncompletedTasks = tasks.filter(task =>
    !task.checked &&
    task.dueDate &&
    task.dueDate.slice(0, 10) < todayISO
  );

  if (uncompletedTasks.length === 0) {
    wrapper.textContent = 'No uncompleted tasks!';
    return wrapper;
  }

  // Select reschedule dialog and form from DOM
  const dialog = document.getElementById('reschedule-dialog');
  const form = document.getElementById('reschedule-form');
  const dateInput = form.querySelector('input[name="newDate"]');
  const cancelBtn = document.getElementById('cancel-reschedule');

  let taskToReschedule = null;

  cancelBtn.addEventListener('click', () => {
    dialog.close();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const newDate = dateInput.value;
    if (newDate && taskToReschedule) {
      controller.edit(taskToReschedule.title, { dueDate: newDate });
      dialog.close();
      wrapper.replaceWith(uncompleted()); // Refresh the list
    }
  });

  uncompletedTasks.forEach(task => {
    const taskEl = document.createElement('div');
    taskEl.classList.add('task');
    taskEl.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.description || ''}</p>
      <p><strong>Due:</strong> ${task.dueDate}</p>
      <p><strong>Priority:</strong> ${task.priority}</p>
    `;

    const rescheduleBtn = document.createElement('button');
    rescheduleBtn.textContent = 'Reschedule';
    rescheduleBtn.classList.add('reschedule-btn');

    rescheduleBtn.addEventListener('click', () => {
      taskToReschedule = task;
      dateInput.value = task.dueDate?.slice(0, 10) || '';
      dialog.showModal();
    });

    taskEl.appendChild(rescheduleBtn);
    wrapper.appendChild(taskEl);
  });

  return wrapper;
};

