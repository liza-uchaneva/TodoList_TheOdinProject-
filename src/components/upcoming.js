import { tasksController } from '../models/tasksController.js';

export const upcoming = () => {
  const wrapper = document.createElement('div');
  wrapper.classList.add('upcoming-tasks');

  const controller = tasksController();
  const tasks = controller.getAll();
  const todayISO = new Date().toISOString().split('T')[0];

  const upcomingTasks = tasks.filter(task =>
    !task.checked &&
    task.dueDate &&
    task.dueDate.slice(0, 10) > todayISO
  );

  if (upcomingTasks.length === 0) {
    wrapper.textContent = 'No upcoming tasks!';
    return wrapper;
  }

  upcomingTasks.forEach((task, index) => {
    const taskEl = document.createElement('div');
    taskEl.classList.add('task');

    // Styled checkbox
    const checkboxWrapper = document.createElement('div');
    checkboxWrapper.classList.add('checkbox-wrapper-18');

    const round = document.createElement('div');
    round.classList.add('round');

    const checkboxId = `upcoming-checkbox-${index}`;

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
        msg.textContent = 'No upcoming tasks!';
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

    // Reschedule button
    const rescheduleBtn = document.createElement('button');
    rescheduleBtn.textContent = 'Reschedule';
    rescheduleBtn.classList.add('reschedule-btn');
    rescheduleBtn.addEventListener('click', () => {
      const newDate = prompt('Enter new due date (YYYY-MM-DD):', task.dueDate?.slice(0, 10));
      if (newDate && /^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
        controller.edit(task.title, { dueDate: newDate });
        wrapper.replaceWith(upcoming()); // Refresh the view
      }
    });

    taskEl.appendChild(checkboxWrapper);
    taskEl.appendChild(content);
    taskEl.appendChild(rescheduleBtn);
    wrapper.appendChild(taskEl);
  });

  return wrapper;
};

