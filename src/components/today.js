import { tasksController } from '../models/tasksController.js';

export const today = () => {
  const controller = tasksController();
  const wrapper = document.createElement('div');
  wrapper.classList.add('today-tasks');

  // Section title
  const title = document.createElement('h2');
  title.textContent = 'Today';
  wrapper.appendChild(title);

  const tasks = controller.getAll();
  const todayISO = new Date().toISOString().split('T', 1)[0];
  console.log(todayISO);

  const todayTasks = tasks.filter(task =>
    !task.checked && task.dueDate?.slice(0, 10) === todayISO
  );

  if (todayTasks.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = 'No tasks for today!';
    wrapper.appendChild(empty);
    return wrapper;
  }

  todayTasks.forEach((task, index) => {
    const taskEl = document.createElement('div');
    taskEl.classList.add('task');

    // Create styled checkbox
    const checkboxWrapper = document.createElement('div');
    checkboxWrapper.classList.add('checkbox-wrapper-18');

    const round = document.createElement('div');
    round.classList.add('round');

    const checkboxId = `checkbox-${index + 1}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = checkboxId;
    checkbox.checked = task.checked;

    const label = document.createElement('label');
    label.setAttribute('for', checkboxId);

    round.appendChild(checkbox);
    round.appendChild(label);
    checkboxWrapper.appendChild(round);

    checkbox.addEventListener('change', () => {
      controller.edit(task.title, { checked: checkbox.checked });
      taskEl.remove();

      if (!wrapper.querySelector('.task')) {
        const msg = document.createElement('p');
        msg.textContent = 'No tasks for today!';
        wrapper.appendChild(msg);
      }
    });

    // Task content
    const content = document.createElement('div');
    content.classList.add('task-content');
    content.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.description || ''}</p>
      <p><strong>Due:</strong> ${task.dueDate}</p>
      <p><strong>Priority:</strong> ${task.priority}</p>
    `;

    taskEl.appendChild(checkboxWrapper);
    taskEl.appendChild(content);
    wrapper.appendChild(taskEl);
  });

  return wrapper;
};
