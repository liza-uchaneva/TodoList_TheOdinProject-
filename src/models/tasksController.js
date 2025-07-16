import Task from './task.js';

export const tasksController = () => {
  const load = () => JSON.parse(localStorage.getItem('tasks')) || [];
  const save = (tasks) => localStorage.setItem('tasks', JSON.stringify(tasks));

  const getAll = () => load();

  const add = (taskData) => {
  const tasks = load();
  const task = new Task(
    taskData.title,
    taskData.description,
    taskData.dueDate,
    taskData.priority,
    false, 
    taskData.project,
  );

  if (taskData.projectTitle) {
    const { getProjects, createProject } = projectsList();
    const existingProjects = getProjects();

    if (!existingProjects.includes(taskData.projectTitle)) {
      createProject(taskData.projectTitle);
    }
  }

  tasks.push(task);
  save(tasks);
};

  const remove = (title) => {
    const tasks = load().filter(task => task.title !== title);
    save(tasks);
  };

  const edit = (title, updates) => {
    const tasks = load().map(task =>
      task.title === title ? { ...task, ...updates } : task
    );
    save(tasks);
  };

  const getByProject = (title) => {
    console.log(title);
    const l = load();
    console.log("all elements:");
    l.forEach(element => {
      console.log(element.title);
      console.log("");
      console.log(element.projectTitle);
    });
    const f = l.filter(task => task.projectTitle !== null 
                            && task.projectTitle === title);
    console.log("filtered:");
    f.forEach(e=>{
      console.log(e.title);
    });
    return f;
  };

  const get = (title) => load().find(task => task.title === title);

  return {
    getAll,
    add,
    remove,
    edit,
    getByProject,
    get,
  };
};