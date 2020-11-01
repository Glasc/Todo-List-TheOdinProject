const newProjectForm = document.querySelector('#newProject-form');
const projectListUl = document.querySelector('.project-list > ul');
const taskWrapper = document.querySelector('.task-wrapper');
const btnAddProject = document.querySelector('.btn-add-project');
const formAddTask = document.querySelector('#form-add');

const btnErase = document.querySelector('#btn-erase');
const btnEdit = document.querySelector('#btn-edit');
const editForm = document.querySelector('#edit-form');
const editContainer = document.querySelector('.edit-container');

let currentProjectInView;

class Project {
  constructor(name) {
    this.name = name;
    this.taskList = [];
  }
  getTaskID(taskTitle, taskDescription) {
    let taskID = this.taskList.findIndex((curr) => {
      return curr.title === taskTitle && curr.description === taskDescription;
    });
    return taskID;
  }

  addTask(title, description) {
    this.taskList.push({ title, description });
  }
  deleteTask(taskTitle, taskDescription) {
    this.taskList.splice(this.getTaskID(taskTitle, taskDescription), 1);
  }
  editTask(taskTitle, taskDescription, newTaskTitle, newTaskDescription) {
    let taskObj = this.taskList[this.getTaskID(taskTitle, taskDescription)];
    taskObj.title = newTaskTitle;
    taskObj.description = newTaskDescription;
  }

  getTasks() {
    return this.taskList;
  }
  getProjectName() {
    return this.name;
  }
}

newProjectForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let projectName = e.target.projectName.value;
  const tempProject = new Project(projectName);
  controller.addProject(tempProject);
  e.target.reset();
});

formAddTask.addEventListener('submit', (e) => {
  e.preventDefault();
  let taskTitle = formAddTask.title.value;
  let taskDescription = formAddTask.description.value;

  if (currentProjectInView) {
    let projectSelected = controller.getProject(currentProjectInView);
    controller
      .getProject(projectSelected.name)
      .addTask(taskTitle, taskDescription);
    controller.showTasks(projectSelected);
  }
  e.target.reset();
});

projectListUl.addEventListener('click', (e) => {
  e.preventDefault();
  if (e.target !== projectListUl) {
    taskWrapper.innerHTML = '';
    let projectSelected = controller.getProject(e.target.textContent);
    controller.showTasks(projectSelected);
    currentProjectInView = projectSelected.name;
  }
});

taskWrapper.addEventListener('click', (e) => {
  e.preventDefault();
  if (e.target.getAttribute('id') === 'btn-erase') {
    let title = e.target.parentNode.querySelector('h3').innerText;
    let description = e.target.parentNode.querySelector('p').innerText;
    controller.deleteTask(
      controller.getProject(currentProjectInView),
      title,
      description
    );
  }
  if (e.target.getAttribute('id') === 'btn-edit') {
    editContainer.classList.toggle('displayNone');

    editForm.addEventListener(
      'submit',
      (ev) => {
        ev.preventDefault();

        let title = e.target.parentNode.querySelector('h3').innerText;
        let description = e.target.parentNode.querySelector('p').innerText;
        let newTitle = editForm.title.value;
        let newDescription = editForm.description.value;
        controller.editTask(
          controller.getProject(currentProjectInView),
          title,
          description,
          newTitle,
          newDescription
        );
        controller.showTasks(controller.getProject(currentProjectInView));
        editForm.reset();
        editContainer.classList.toggle('displayNone');
        document.removeEventListener('click', editForm);
      },
      { once: true }
    );
  }
});

btnAddProject.addEventListener('click', (e) => {
  e.preventDefault();
  newProjectForm.classList.toggle('showInputAddProject');
});

const view = {
  renderProjectList(projectList) {
    projectListUl.innerHTML = '';
    projectList.map((currProject) => {
      projectListUl.insertAdjacentHTML(
        'beforeend',
        `
      <li>${currProject.getProjectName()}</li>
      `
      );
    });
  },
  renderTaskList(project) {
    taskWrapper.innerHTML = '';
    project.getTasks().map((currTask) => {
      taskWrapper.insertAdjacentHTML(
        'beforeend',
        `
      <div class="task">
      <img src="./images/icons8_edit_1.ico" alt="" srcset="" id="btn-edit">
       <img src="./images/icons8_trash.ico" alt="" srcset="" id="btn-erase">
       <h3>${currTask.title}</h3>
       <p>${currTask.description}</p>
      </div>
      `
      );
    });
  },
  renderTaskListEmpty() {
    taskWrapper.innerHTML = '';
  },
};

const model = {
  projectList: [],
};

const controller = {
  addProject(Project) {
    let result = model.projectList.find(
      (curr) => curr.getProjectName() === Project.getProjectName()
    );
    if (!result) {
      model.projectList.push(Project);
      view.renderProjectList(model.projectList);
    } else {
      alert('Already exists. ');
    }
  },
  deleteProject(Project) {
    const projectID = model.projectList.find((currProject) => {
      return currProject.name === Project.name;
    });
    model.projectList.splice(projectID, 1);
    view.renderProjectList(model.projectList);
    view.renderTaskListEmpty();
  },
  getProject(name) {
    let project = model.projectList.find((currProject) => {
      return currProject.getProjectName() === name;
    });
    return project;
  },
  deleteTask(Project, title, description) {
    Project.deleteTask(title, description);
    view.renderTaskList(Project);
  },
  showTasks(Project) {
    view.renderTaskList(Project);
  },
  editTask(Project, title, description, ntitle, ndescription) {
    Project.editTask(title, description, ntitle, ndescription);
  },
};
