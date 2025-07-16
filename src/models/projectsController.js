import { tasksController } from './tasksController.js';

export const projectsController = () => {
  const loadProjects = () => JSON.parse(localStorage.getItem('projects')) || [];
  const saveProjects = (projects) => localStorage.setItem('projects', JSON.stringify(projects));
  const tasks = tasksController();

  const getProjects = () => loadProjects();

  const createProject = (title) => {
    if (!title) return;
    const projects = loadProjects();
    if (!projects.includes(title)) {
      projects.push(title);
      saveProjects(projects);
    }
  };

  const removeProject = (title) => {
    // Remove project from project list
    const updatedProjects = loadProjects().filter(p => p !== title);
    saveProjects(updatedProjects);

    // Remove all tasks with that project
    const allTasks = tasks.getAll().filter(t => t.project !== title);
    localStorage.setItem('tasks', JSON.stringify(allTasks));
  };

  const editProjectTitle = (oldTitle, newTitle) => {
    if (!newTitle) return;

    const projects = loadProjects();
    if (projects.includes(newTitle)) {
      throw new Error("A project with this title already exists.");
    }

    const updatedProjects = projects.map(p => (p === oldTitle ? newTitle : p));
    saveProjects(updatedProjects);

    // Rename project title in associated tasks
    const updatedTasks = tasks.getAll().map(task => {
      if (task.project === oldTitle) {
        return { ...task, project: newTitle };
      }
      return task;
    });
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const getProjectTasks = (title) => {
    return tasks.getByProject(title);
  };

  const addTaskToProject = (projectTitle, taskData) => {
    const newTask = { ...taskData, project: projectTitle };
    tasks.add(newTask);
  };

  const deleteTaskFromProject = (projectTitle, taskTitle) => {
    const task = tasks.getByProject(projectTitle).find(t => t.title === taskTitle);
    if (task) tasks.remove(task.title);
  };

  const getTaskFromProject = (projectTitle, taskTitle) => {
    return tasks.getByProject(projectTitle).find(task => task.title === taskTitle);
  };

  const getProgressPercentage = (projectTitle) => {
    const projectTasks = tasks.getByProject(projectTitle);
    if (projectTasks.length === 0) return 0;
    const checked = projectTasks.filter(task => task.checked).length;
    return Math.round((checked / projectTasks.length) * 100);
  };

  return {
    getProjects,
    createProject,
    removeProject,
    editProjectTitle,
    getProjectTasks,
    addTaskToProject,
    deleteTaskFromProject,
    getTaskFromProject,
    getProgressPercentage
  };
};