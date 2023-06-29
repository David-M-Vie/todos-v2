// go out to local storage and retrieve any todos: 
// let todos = JSON.parse(localStorage.getItem("todos")) || [];

const todos = JSON.parse(localStorage.getItem("todos"));

console.log(todos)




// Run this on start up and any time crud changes occur on todos:
const refreshApp = () => {

  // Make a widget for each object in the todos array eg: priority, mifCheck etc.
  let html = '';

  const widgetBuilder = () => {
    todos.forEach(widget => {
      html += `
        
      `
    });

  }

}



