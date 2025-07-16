import { projectsController } from '../models/projectsController.js';
import { tasksController } from '../models/tasksController.js';

const { createProject } = projectsController();
const board = document.querySelector('.board');
const projectsContainer = document.querySelector('.projects');
const projectsToggleBtn = document.getElementById('projects-title');

let isProjectsVisible = false;

projectsToggleBtn.addEventListener('click', () => {
  isProjectsVisible = !isProjectsVisible;
  console.log("pojects toggled");
  if (isProjectsVisible) {
    renderProjectButtons();
  }
  else{
      projectsContainer.innerHTML = '';
  }
});

function renderProjectButtons() {
  projectsContainer.innerHTML = '';
  const { getProjects, removeProject } = projectsController();
  const projectTitles = getProjects();

  if (projectTitles.length === 0) return;

  projectTitles.forEach(title => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('project-item');

    // Project title button
    const btn = document.createElement('button');
    btn.classList.add('button-box', 'project-title-btn');
    btn.textContent = title;
    btn.addEventListener('click', () => {
      displayProjectTasks(title);
    });

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('button-box', 'delete-project-btn');
    deleteBtn.innerHTML = `<i class="fas fa-trash"></i>`;
    deleteBtn.title = 'Delete Project';

    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const confirmed = confirm(`Delete project "${title}" and all its tasks?`);
      if (confirmed) {
        removeProject(title);
        renderProjectButtons();
        board.innerHTML = '';
      }
    });

    wrapper.appendChild(btn);
    wrapper.appendChild(deleteBtn);
    projectsContainer.appendChild(wrapper);
  });
}


function displayProjectTasks(projectTitle) {
  const controller = tasksController();
  board.innerHTML = '';

  // Wrapper for title and add button
  const titleWrapper = document.createElement('div');
  titleWrapper.classList.add('project-board-header');

  const titleEl = document.createElement('h2');
  titleEl.textContent = projectTitle;

  // Add Task button
  const addBtn = document.createElement('button');
  addBtn.classList.add('button-box', 'add-task-to-project-btn');
  addBtn.innerHTML = `<i class="fas fa-plus"></i>`;
  addBtn.title = 'Add Task to Project';

  addBtn.addEventListener('click', () => {
    const dialog = document.getElementById('add-task');
    const form = document.getElementById('new-task-form');
    const projectInput = form.querySelector('input[name="project"]');

    projectInput.value = projectTitle;
    dialog.showModal();
  });

  titleWrapper.appendChild(titleEl);
  titleWrapper.appendChild(addBtn);
  board.appendChild(titleWrapper);

  // List tasks
  const tasks = controller.getByProject(projectTitle)
                          .filter(task => !task.checked);

  if (tasks.length === 0) {
    const msg = document.createElement('p');
    msg.textContent = 'No tasks in this project.';
    board.appendChild(msg);
    return;
  }

  tasks.forEach((task, index) => {
    const taskEl = document.createElement('div');
    taskEl.classList.add('task');

    // Checkbox styling
    const checkboxWrapper = document.createElement('div');
    checkboxWrapper.classList.add('checkbox-wrapper-18');

    const round = document.createElement('div');
    round.classList.add('round');

    const checkboxId = `checkbox-${projectTitle}-${index}`;
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

      if (!board.querySelector('.task')) {
        const msg = document.createElement('p');
        msg.textContent = 'No tasks in this project.';
        board.appendChild(msg);
      }
    });

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
    board.appendChild(taskEl);
  });
}



document.getElementById('add-project-btn').addEventListener('click', () => {
  const projectTitle = prompt('Enter project name:');
  if (projectTitle?.trim()) {
    createProject(projectTitle.trim());
  }
  renderProjectButtons();
});