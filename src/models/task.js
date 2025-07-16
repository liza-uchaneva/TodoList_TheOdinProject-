class Task {
  constructor(title, description, dueDate, priority, checked = false, projectTitle = null) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.checked = checked;
    this.projectTitle = projectTitle;
  }
}
export default Task;