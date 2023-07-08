// go out to local storage and retrieve any todos: 
// let todos = JSON.parse(localStorage.getItem("todos")) || [];
const todos = JSON.parse(localStorage.getItem("todos"));

console.log(todos)

const widgetHtml = (keys) => {
  let html = '';

  html += `
    <section class="widget ${keys}">
      <h2>${keys}</h2>
      <ul class="sortable-list ${keys}">
  `
  if(todos[keys].lengh === 0) {
    html += "Nothing todo here!"
  }else {
    todos[keys].forEach(key => {
      html += `
        <li class="item ${key.completed ? "completed" : ""}" 
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
              onclick=""
            >
              Delete
            </button>
          </h4>
          <div class="bottom-row">
            <div class="col-1">
              <p
                contentEditable="true"
                onblur=""
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
  html += `</ul></section> `
  return html;
}

const refreshApp = () => {
  // make a widget for each object in the todos array: eg, priority, mifCheck etc. 

  // function to build widgets. 
  const widgetBuilder = () => {
    let html = '';
    for(let keys in todos) {
      console.log('keys ', keys)
      if(keys === 'priority') { // If it's the main todo widget..
        document.querySelector('#priority-section').innerHTML = widgetHtml(keys)
      }else { // it must be secondary widgets
        html += widgetHtml(keys)
        document.querySelector('#other-sections').innerHTML = html;
      }
    }
    
  } // end of widgetBuilder function

  widgetBuilder();


  const sortableLists = document.querySelectorAll(".sortable-list");
  console.log('sortableLists ', sortableLists);

  sortableLists.forEach(list => {
    const items = list.querySelectorAll('.item');
    items.forEach(item => {
      console.log('list item ', item)
      item.addEventListener("dragstart", () => {
        setTimeout(() => item.classList.add("dragging"), 0)
      })

      // Removing dragging class from item on dragend event
      item.addEventListener("dragend", () => {
        item.classList.remove("dragging")
        // When drag ends, need to update the todos list with the new order
        // setNewOrder(items.dataset.uid) // WORK IN PROGRESS
      })
      item.querySelector('input').addEventListener("change", (e) => {
        toggleCompleted(e)
      })

      
    })
  })

  const initSortableList = (e) => {
    e.preventDefault();
    const draggingItem = document.querySelector(".dragging");
    // find the UL parent of the item being dragged
    const targetList = draggingItem.closest('ul');
    console.log("targetList", targetList)
  }


} // close refreshApp function

refreshApp();


/////////////////
/// FUNCTIONS ///
/////////////////

const toggleCompleted = (e) => {
  return; // WORK IN PROGRESS
}

