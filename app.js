// Go out to local storage and retrieve any todos: 
let todos = JSON.parse(localStorage.getItem("todos")) || {
  "priority": []
};


console.log('Current Todos ', todos)

// Factory html template for building out widgets
const widgetHtml = (keys) => {
  // console.log('keys ', keys)
  let html = '';

  html += `
      <ul class="sortable-list ${keys}">
  `
  if(todos[keys].length === 0) {
    html += "<p>Nothing todo here! </p>"
  }else {
    todos[keys].forEach(item => {
      // console.log('moop key ', keys)
      html += `
        <li class="item ${item.completed ? "completed" : ""}" 
          draggable="true"
          data-key = "${keys}"
          data-uid ="${item.uid}"
        > 
          <h4 class="top-row">
            <span 
              contentEditable="true"
              onblur=""
            >
              Id: ${item.id}
            </span>
            <input 
              type="checkbox"
              ${item.completed ? "checked" : ""}
            />
            <button
              class="btn2"
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
                ${item.description}
              </p>
            </div>
            <div class="col-2">
              <p class="text">
                Due: ${item.dueDate}
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

  // // Build out the priority widget and any secondary sidebar widgets if there are any in the todos list. 
  const widgetBuilder = () => {
    let html = '';
    for(let keys in todos) {
      if(keys === 'priority') { // If it's the main todo widget..
        document.querySelector('#priority-todos').innerHTML = widgetHtml(keys)
      }else { // any secondary widgets..
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
  } 

  widgetBuilder();


  // Grab all the UL's for each widget
  const sortableLists = document.querySelectorAll(".sortable-list");

  // Going through each UL's list-items.
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

      // Set the delete todo button handler: onclick on each item.
      item.querySelector('.btn2').addEventListener('click', (e) => {
        const key = e.target.closest('li').dataset.key;
        const uid = e.target.closest('li').dataset.uid;        
        deleteTodo(key, uid)
      })

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


  //  Setting the Add Todo click handler on each UL
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

const addSection = (e) => {
  const sectionName = document.getElementById('sectionName').value;
  console.log(sectionName);
  todos[sectionName] = [];
  localStorage.setItem('todos', JSON.stringify(todos))
  refreshApp();
  closeModal();
}

const addTodo = (target) => {

   const widget = document.querySelector(`ul.sortable-list.${target}`)
   
   let html = '';
   html += `
   <li class="item"> 
          <h4 class="top-row">      
            <input type="text" id="id" name="id" placeholder="Id: " style="display: block"/>
            <button
              class="btn1"
            >
              Add
            </button>
          </h4>
          <div class="bottom-row">
            <div class="col-1">        
              <textarea  id="description"  placeholder="Description: "></textarea>
            </div>
            <div class="col-2">
              <p class="text">
                Due: 
              </p>
            </div>
          </div>
        </li>        
   `

      document.getElementById('priority-new-todo-holder').innerHTML =  html
  
  // const id = document.querySelector('#id').value;
  // const description = document.querySelector('#description').value;
  // const uid = Math.floor(Math.random() * Date.now());
  // const todo = {uid, id, description, dueDate: "tbc", completed: false};
  // todos[target].push(todo);
  // localStorage.setItem("todos", JSON.stringify(todos));
  // refreshApp();
  // closeModal()
}

const toggleCompleted = (e) => {
  const li = e.target.closest("li");
  const uid = Number(li.dataset.uid);
  // key tell us which widget array the item belongs in. 
  const key = li.dataset.key;
  e.target.checked ? li.classList.add("completed") : li.classList.remove("completed");
  const toggleTodos = todos[key].map(todo => {
    if(uid === todo.uid) {
      todo.completed = !todo.completed;
      li.querySelector("input[type=checkbox]").toggleAttribute("checked")
    }
    return todo;
  })
  todos[key] = [...toggleTodos];
  localStorage.setItem('todos', JSON.stringify(todos));
  refreshApp();
}

const deleteTodo = (key, uid) => {
  const filteredTodos = todos[key].filter(todo => {
    return todo.uid !== Number(uid)
  });
  
  console.log('filteredTodos', filteredTodos)
  todos[key] = [...filteredTodos];
  localStorage.setItem("todos", JSON.stringify(todos));
  refreshApp();
}

const setNewOrder = (uid) => {
// Work in progress........

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

/*
Desciption:  Function to create a modal, pass along type and target arguments. 
@params:  type:   "string"   options: "addTodo" || "addSection"
@params   target: "string"   <this is for addTodo and dicates which section the todo should be added to>
 */
const openModal = (type, target) => {
  let modalHTML = '';

  // insert overlay first.
  modalOverlay("open");

  const modalWrapper = document.createElement("div");

  switch (type) {
    case 'add-section':
      modalHTML = addSectionModalHTML();
      break;
    
    case 'add-todo':
      modalHTML = addTodoModalHTML(type, target)
      break; 

    case 'delete-section': 
      modalHTML = deleteSectionModalHTML()
      break;

    default: modalHTML = addSectionModalHTML();
      break;
  }


  modalWrapper.innerHTML = modalHTML;
  document.body.appendChild(modalWrapper)

  document.querySelector('.close-modal').addEventListener("click", closeModal)

  if(type === "add-section") {
    document.querySelector(".btn-wrapper > .btn1.add-section").addEventListener('click', (e) => addSection(e))
  } else {
    document.querySelector(".btn-wrapper > .btn1.add-todo").addEventListener('click', () => addTodo(target));
    document.querySelector('textarea').addEventListener("focus", () => {
      document.querySelector('textarea').textContent = ""
    })
    document.getElementById("id").focus()
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

const deleteSectionModalHTML = () => {
  return `
  <div class="modal">
    <div class="top-row">
      <h2> Delete Sections</h2>
      <button class="close-modal btn2" >Close</button>
    </div>
    <div class="inputs">
      ${getSections()}
    </div>
    <div class="btn-wrapper">
      <button class="btn1 delete-section" onclick="checkSectionsToDelete()"> Update </button>
    </div>
  </div>
  `
}

// Gets called from inside deleteSectionModalHTML()
const getSections = () => {
  let sections2DeleteHTML = `
   <p> Tick to check the sections that you want to delete.</p>  
   <ul id="deleteSectionCheckboxes">
   `
  for(keys in todos) {
    // Should be able to delete all but the priority section.
    if(keys !== "priority") {
      sections2DeleteHTML += `      
       <li> ${keys}: <input type="checkbox" name="delete-section-cb" id="${keys}"/> </li>
      `
    }
  }
  sections2DeleteHTML += `</ul>`
  return sections2DeleteHTML;
}

// on click of the update button in deleteSectionModalHTML() 
// function runs to check which section checkboxes have been ticked for deletion.
const checkSectionsToDelete = () => {
  var checkedBoxes = document.querySelectorAll('input[name="delete-section-cb"]:checked');
  // Remove the section
     const toArray = [...checkedBoxes];
     const checkBoxIDs = toArray.map(el => el.id );

     // Go through the todos array and try to find a key that matches each element in the checkboxid's list and remove it from the todos.
     checkBoxIDs.forEach(id => {
      delete todos[id];
      localStorage.setItem('todos', JSON.stringify(todos))
      refreshApp();
      closeModal();
     })
}

const closeModal = () => {
  document.querySelector('.modal').parentElement.remove();
  modalOverlay('close')
}


/* ====================================================
   ==============  Global Event Handlers ==============
   ==================================================== */

// Event listener to open the nav menu dropdown onclick of the menu button
document.querySelector('#menu').addEventListener("click", () => {
  const element = document.querySelector("#menu ul");
  element.style.opacity === "0" ? element.style.opacity = "1" : element.style.opacity = "0"
})

document.querySelector(".plus-priority").addEventListener("click", () => {
  addTodo('priority')
})

//Open Modal:   Create a new section 
document.querySelector('#menu .add-section-li').addEventListener("click", () => {
  openModal("add-section");
})

// Open Modal:  Delete a section
document.querySelector('#menu .delete-section-li').addEventListener("click", () => {
  openModal("delete-section");
})

