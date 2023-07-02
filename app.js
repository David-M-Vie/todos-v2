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
    }

    document.querySelector("main").innerHTML = html;

    const sortableLists = document.querySelectorAll(".sortable-list"); // array
    console.log("SortableLists: ", sortableLists)
    sortableLists.forEach(list => {
      const items = list.querySelectorAll(".item");
      items.forEach(item => {
        //console.log(item)
        item.addEventListener("dragstart", () => {
          setTimeout(() => item.classList.add("dragging"), 0)
        })
        // Removing dragging class from item on dragend event
        item.addEventListener("dragend", () => {
          item.classList.remove("dragging")
          //when drag ends, need to update teh todos list with the new order
         // setNewOrder(items.dataset.uid); // WORK IN PROGRESS
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
      console.log('draggingItem', draggingItem)
      const sortableList = draggingItem.closest("ul");
      console.log("sortableList", sortableList);
      let siblings = [...sortableList.querySelectorAll(".item:not(.dragging)")]
      let nextSibling = siblings.find(sibling => {
        return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2
      })
      sortableList.insertBefore(draggingItem, nextSibling);
    }

    sortableLists.forEach(list => {
      list.addEventListener("dragover", initSortableList);
      list.addEventListener("dragenter", e => e.preventDefault());
    })
  }

  widgetBuilder();





}

/* ==================
 ===== FUNCTIONS ====
=================== */


/* ============
    Add a todo
=============== */
const addTodo = () => {
  return;  // work in progress
}


/* ===============================
  Toggle a todos completed status
================================== */
const toggleCompleted = (e) => {
   return; // work in progress...
}

/* ==============================
  When order of todos is changed
================================= */
const setNewOrder = (uid) => {
  return;  // work in progress...
}



refreshApp();



