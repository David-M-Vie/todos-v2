// go out to local storage and retrieve any todos: 
const todos = JSON.parse(localStorage.getItem("todos")) || {
  "priority": []
};



console.log(todos)

const widgetHtml = (keys) => {
  let html = '';

  html += `
      <ul class="sortable-list ${keys}">
  `
  if(todos[keys].length === 0) {
    html += "<p>Nothing todo here! </p>"
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
  html += `</ul> `
  return html;
}

const refreshApp = () => {
  // make a widget for each object in the todos array: eg, priority, mifCheck etc. 

  // function to build widgets. 
  const widgetBuilder = () => {
    let html = '';
    for(let keys in todos) {
      // console.log('keys ', keys)
      if(keys === 'priority') { // If it's the main todo widget..
        document.querySelector('#priority-todos').innerHTML = widgetHtml(keys)
      }else { // it must be secondary widgets
        html += `<section class="${keys}">
                  <div class="${keys}" style="display:flex; justify-content: space-between">
                    <h2>${keys}</h2>
                    <button class="btn1 ${keys} open-modal" id="${keys}">Add </button>
                  </div>
                `
        html += widgetHtml(keys)    
        html += "</section>"
      }
    } 
    document.querySelector('.widget.others').innerHTML = html;   

  } // end of widgetBuilder function


  widgetBuilder();

  const sortableLists = document.querySelectorAll(".sortable-list");
  console.log('sortableLists ', sortableLists);

  sortableLists.forEach(list => {
    const items = list.querySelectorAll('.item');
    items.forEach(item => {
      item.addEventListener("dragstart", () => {
        setTimeout(() => item.classList.add("dragging"), 0)
      });
      // Removing dragging class from item on dragend event
      item.addEventListener("dragend", () => {
        item.classList.remove("dragging")
        // When drag ends, need to update the todos list with the new order
        // setNewOrder(items.dataset.uid) // WORK IN PROGRESS
      });
      item.querySelector('input').addEventListener("change", (e) => {
        toggleCompleted(e)
      });

      
    })
  })

  const initSortableLists = (e) => {
    console.log(e)
    const draggingItem = document.querySelector(".dragging");
    // find the UL parent of the item being dragged
    const targetList = draggingItem.closest('ul');
    const siblings = [...targetList.querySelectorAll(".item:not(.dragging)")]
    let nextSibling = siblings.find(sibling => {
      return e.pageY <= sibling.offsetTop + sibling.offsetHeight / 2
    })
    targetList.insertBefore(draggingItem, nextSibling);

  }

  sortableLists.forEach(ul => {
    ul.addEventListener("dragover", (e) => {
      initSortableLists(e)
    });
    ul.addEventListener("dragenter", (e) => e.preventDefault());
  })


  //  Setting the Add todo event on the other widget add buttons. 
   for(let keys in todos) {
    if(keys !== 'priority'){
      document.querySelector(`#${keys}`).addEventListener("click", () => {
      openModal("add-todo", `${keys}`)
    })}
   }



} // close refreshApp function

refreshApp();


/////////////////
/// FUNCTIONS ///
/////////////////

const addSection = () => {
  console.log(' Adding a new section!! ')
}

const addTodo = (target) => {
  
  const id = document.querySelector('#id').value;
  const description = document.querySelector('#description').value;
  const uid = Math.floor(Math.random() * Date.now());

  const todo = {uid, id, description, dueDate: "tbc", completed: false};
  console.log("todo", todo)
  console.log('target ', target)
  todos[target].push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
  refreshApp();
  closeModal()
}

const toggleCompleted = (e) => {
  return; // WORK IN PROGRESS
}



/* =====================
     A Modal Window
   ===================== */
// An Overlay for the modal to sit on top of:
const modalOverlay = (status) => {
  if(status === 'open') {
    const createOverlay = document.createElement('div');
    createOverlay.className = "modal-overlay";
    document.body.appendChild(createOverlay)
    document.body.style.overflow = "hidden"
  }else {
    // must be removing the overlay
    document.querySelector(".modal-overlay").remove();
    document.body.style.overflow = "scroll"
  }
}

// Modal HTML Template for adding a todo // 
const addTodoModalHTML = (type, target) => {
  return `
  <div class="modal">
    <div class="top-row">
      <h2> Add a Todo </h2>
      <button class="close-modal btn2" >Close</button>
    </div>
    <div class="inputs">
      <input type="text" placeholder="enter id" id="id" />
    </div>
    <div class="inputs">
      <textarea id="description">enter description</textarea>
    </div>
    <div class="btn-wrapper">
      <button class="btn1 add-todo"> Add </button>
    </div>
  </div>
  `
}

// Modal HTML Template for adding a new section (widget) // 
const addSectionModalHTML = () => {
  return `
  <div class="modal">
    <div class="top-row">
      <h2> Create a new Section </h2>
      <button class="close-modal btn2" >Close</button>
    </div>
    <div class="inputs">
      <input type="text" placeholder="enter section name" id="sectionName" />
    </div>
    <div class="btn-wrapper">
      <button class="btn1 add-section"> Add Section </button>
    </div>
  </div>
  `
}
/*
Desciption:  Function to create a modal, pass along type and target arguments. 
@params:  type:   "string"   options: "addTodo" || "addSection"
@params   target: "string"   <this is for addTodo and dicates which section the todo should be added to>
 */
const openModal = (type, target) => {
  let modalHTML = '';
  console.log(type, target)
  // insert overlay first.
  modalOverlay("open");

  const modalWrapper = document.createElement("div");
  if(type === "add-section") {
    addSectionModalHTML(type)
  }else {
    modalHTML = addTodoModalHTML(type, target)
    console.log(modalHTML)
  }
  modalWrapper.innerHTML = modalHTML;
  document.body.appendChild(modalWrapper)

  document.querySelector('.close-modal').addEventListener("click", closeModal)
  if(type === "add-section") {
    document.querySelector(".btn-wrapper > .btn1.add-section").addEventListener('click', () => addSection())
  } else {
    document.querySelector(".btn-wrapper > .btn1.add-todo").addEventListener('click', () => addTodo(target))
  }
  document.querySelector('textarea').addEventListener("focus", () => {
    document.querySelector('textarea').textContent = ""
  })
  document.getElementById("id").focus()
}

const closeModal = () => {
  document.querySelector('.modal').parentElement.remove();
  modalOverlay('close')
}




// Event listener to open the nav menu dropdown onclick of the menu button
document.querySelector('#menu').addEventListener("click", () => {
  const element = document.querySelector("#menu ul");
  element.style.opacity === "0" ? element.style.opacity = "1" : element.style.opacity = "0"
})

// Event listener to open a modal for creating a new section on click of the add section li
document.querySelector('#menu .add-section').addEventListener("click", () => {
  openModal("add-section");
})

// Event listener to open a modal for creating a new todo 
 document.querySelector('#priority').addEventListener("click", () => {
  openModal("add-todo", "priority")
 })
