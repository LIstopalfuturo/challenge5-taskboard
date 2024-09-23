// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    if(nextId){
        nextId = nextId + 1
    }else{
        nextId = 1
    }

    localStorage.setItem("nextId", JSON.stringify(nextId))

    return nextId
}

// Todo: create a function to create a task card

function createtaskCard(task) {
    const taskCard = $('<div>')
      .addClass('card task-card draggable my-3')
      .attr('data-taskid', task.id);
    const cardHeader = $('<div>').addClass('card-header h4').text(task.title);
    const cardBody = $('<div>').addClass('card-body');
    const cardDescription = $('<p>').addClass('card-text').text(task.description);
    const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
    const cardDeleteBtn = $('<button>')
      .addClass('btn btn-danger delete')
      .text('Delete')
      .attr('data-taskid', task.id);
    cardDeleteBtn.on('click', handleDeleteTask);
  
  // ? Sets the card background color based on due date. Only apply the styles if the dueDate exists and the status is not done.
    if (task.dueDate && task.status !== 'done') {
      const now = dayjs();
      const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');
  
  // ? If the task is due today, make the card yellow. If it is overdue, make it red.
      if (now.isSame(taskDueDate, 'day')) {
        taskCard.addClass('bg-warning text-white');
      } else if (now.isAfter(taskDueDate)) {
        taskCard.addClass('bg-danger text-white');
        cardDeleteBtn.addClass('border-light');
      }
    }
  
// ? Gather all the elements created above and append them to the correct elements.
    cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
    taskCard.append(cardHeader, cardBody);
  
 // ? Return the card so it can be appended to the correct lane.
    return taskCard;
  }

 // Todo: create a function to render the task list and make cards draggable.
function renderTaskList() {
  
        
 // ? Empty existing project cards out of the lanes

        const todoList = $('#todo-cards');
        todoList.empty();
      
        const inProgressList = $('#in-progress-cards');
        inProgressList.empty();
      
        const doneList = $('#done-cards');
        doneList.empty();
      
  // ? Loop through projects and create project cards for each status
        for (let task of taskList) {
          if (taskt.status === 'to-do') {
            todoList.append(createTaskCard(task));
          } else if (task.status === 'in-progress') {
            inProgressList.append(createTaskCard(task));
          } else if (task.status === 'done') {
            doneList.append(createTasktCard(task));
          }
        }
      
        // ? Use JQuery UI to make task cards draggable
        $('.draggable').draggable({
          opacity: 0.7,
          zIndex: 100,
          // ? This is the function that creates the clone of the card that is dragged. This is purely visual and does not affect the data.
          helper: function (e) {
            // ? Check if the target of the drag event is the card itself or a child element. If it is the card itself, clone it, otherwise find the parent card  that is draggable and clone that.
            const original = $(e.target).hasClass('ui-draggable')
              ? $(e.target)
              : $(e.target).closest('.ui-draggable');
            // ? Return the clone with the width set to the width of the original card. This is so the clone does not take up the entire width of the lane. This is to also fix a visual bug where the card shrinks as it's dragged to the right.
            return original.clone().css({
              width: original.outerWidth(),
            });
          },
        });
      }
      
      
// Todo: create a function to handle adding a new task

 function handleAddTask(event) {
    event.preventDefault();
  
    // ? Read user input from the form
    const taskTitle = $("#title").val().trim();
    const taskDueDate = $("due-date").val();
     // don't need to trim select input
    const taskDescription = $("#description").val(); 
    // yyyy-mm-dd format

    const newTask = {
      id: generateTaskId(),
      title: taskTitle ,
      dueDate: taskDueDate ,
      description: taskDescription ,
      status: 'to-do',
    };
  

// ? Pull the projects from localStorage and push the new project to the array

taskList.push(newTask);

localStorage.setItem("tasks", JSON.stringify(taskList))

// ? Print project data back to the screen
renderTaskList();

// ? Clear the form inputs
$("#title").val('');
$("#due-date").val('');
$("#description").val('');
  }
// Todo: create a function to handle deleting a task

function handleDeleteTask(event){
  const taskId = $(this).attr('data-taskid');
  
}
// ? Remove project from the array. There is a method called 'filter()' for this that is better suited wich we will go over in later activity. For now, we will use a 'foreach()' loop to remove the project.
taskList.array.forEach((task) => {
  if(task.id === taskid){
    task.splice(task.indexOf(task),1);
  }
  
});
 // ? We will use our helper function to save the project to localStorage.
 localStorage.setItem("tasks", JSON.stringify(taskList))

 // ? Here we use our other function to print projects back to the screen.
 renderTaskList();


// Todo: create a function to handle dropping a task into a new status lane.
function handleDrop(event, ui) {

}

// ? Get the project id from the event.
const taskId = ui.draggable[0].dataset.taskid;

// ? Get the id of the lane that the card was dropped into.
const newStatus = event.target.id;

for (let task of taskList){
  // ? Find the project card by th 'id' and update the project status.
  console.log(task.id, parseInt(taskId))
  if (task.id === parseInt(taskId)){
    task.status = newStatus;
  }
}
// ? Save the update projects array to localStorage (overwriteting the previos one) and render the new project data to the screen. 
localStorage.setItem("task", JSON.stringify(taskList));
prointProjectData();

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker.
$(document).ready(function () {

  renderTaskList();

  $("#due-date").datepicker({
    changeMonth: true,
    changeYear: true,
  });

  $("#task-form").on("submit", handleAddTask )

});

$('.lane').droppable({
  accept: '.draggable',
  drop: handleDrop,
})