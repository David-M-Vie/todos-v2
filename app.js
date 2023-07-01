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
    console.log('hello')
    for(let keys in todos) {
      html += `
        <section class="widget class=${keys}">
          <h2>${keys}</h2>
        </section>
      `
      html += `<ul class="sortable-list ${keys}">`
      if(todos[keys].lengh === 0) {
        html += "Nothing todo here!"
      }else {
        todos[keys].forEach(key => {
          html += `
           <p> ${key.description} </p>
          `
        })
      }

      html += `</ul>`

    }

    document.querySelector("main").innerHTML = html

  }

  widgetBuilder();

}

refreshApp();



