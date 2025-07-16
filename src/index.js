import { createTaskForm } from './components/createTask.js';
import { today } from "./components/today.js";      
import { upcoming } from './components/upcoming.js';    
import { uncompleted } from './components/uncompleted.js';    
import { completed } from './components/completed.js';
import './components/projectView.js';
import './style.css';

const todayButton = document.getElementById("today");
const upcomingButton = document.getElementById("upcoming");
const uncompletedButton = document.getElementById("uncompleted");
const completedButton = document.getElementById("completed");

const links = [todayButton, upcomingButton, 
               completedButton, uncompletedButton];

const board = document.querySelector(".board");

const switchPage = (e) => {
  e.preventDefault();
  const selection = e.target.id;
  board.innerHTML = "";

  links.forEach((btn) => btn.classList.remove("tab"));

  switch (selection) {
    case "today":
      board.appendChild(today());
      break;
    case "upcoming":
      board.appendChild(upcoming());
      break;
    case "completed":
      board.appendChild(completed());
      break;
    case "uncompleted":
      board.appendChild(uncompleted());
      break;
  }
};

links.forEach((element) => {
  element.addEventListener("click", switchPage);
});

createTaskForm();
