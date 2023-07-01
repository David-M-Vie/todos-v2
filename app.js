// go out to local storage and retrieve any todos: 
// let todos = JSON.parse(localStorage.getItem("todos")) || [];
const todos = JSON.parse(localStorage.getItem("todos"));

console.log(todos)

// Run this on start up and any time crud changes occur on todos:
const refreshApp = () => {

  // Make a widget for each object in the todos array eg: priority, mifCheck etc.
  let html = '';

  // Function to build a todos widget
  const widgetBuilder = () => {

    for(let keys in todos) {
      html += `
        <section class="widget ${keys}">
          <h2>${keys}</h2>
        
      `
      html += `<ul class="sortable-list ${keys}">`
      if(todos[keys].lengh === 0) {
        html += "Nothing todo here!"
      }else {
        todos[keys].forEach(key => {
          html += `
           <li class="item ${key.completed ? "completed" : ""} 
            draggable="true"
            data-uid ="{key.uid}
           "> 
              <h4 class="top-row">
                <span 
                  contentEditable="true"
                  onblur=""
                >
                  Id: ${key.id}
                </span>
                <input 
                  type="checkbox"
                  ${key.completed ? "checked" : ""}
                />
                <button
                  class="btn2"
                  onclick="" // delete todo // 
                >
                  Delete
                </button>
              </h4>
              <div class="bottom-row">
                <div class="col-1">
                  <p
                    contentEditable="true"
                    onblur="" // editMode function //
                    class="text"
                  >
                    ${key.description}
                  </p>
                </div>
                <div class="col-2">
                  <p class="text">
                    Due: ${key.dueDate}
                  </p>
                </div>
              </div>
           </li>
          
          `
        })
      }
      
      html += `</section> </ul>`

    }

    document.querySelector("main").innerHTML = html

  }

  widgetBuilder();

}

refreshApp();



