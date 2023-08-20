// Go out to local storage and retrieve any todos: 
let todos = JSON.parse(localStorage.getItem("todos")) || {
  "priority": []
};

console.log('Current Todos ', todos)

// Factory html template for building out widgets
const widgetHtml = (keys) => {

  let html = '';

  html += `
      <ul class="sortable-list ${keys}">
  `
  if(todos[keys].length === 0) {
    html += "<p>Nothing todo here! </p>"
  }else {
    todos[keys].forEach(item => {

      html += `
        <li class="item ${item.completed ? "completed" : ""}" 
          draggable="true"
          data-key = "${keys}"
          data-uid ="${item.uid}"
        > 
          <h4 class="top-row">
            <span 
              contentEditable="true"
              onblur="editMode(${item.uid}, 'id', this)"
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
                onblur="editMode(${item.uid}, 'desc', this)"
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
  html += `            
            <div class="plus-sign">
              <span class="plus-${keys}" onclick="addTodo('${keys}')">+</span>
            </div>  
          `
  
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
                    <h2>${formatSectionTitle(keys)}</h2>
                  </div>
                `
        html += widgetHtml(keys)    
        html += "</section>"
      }
    } 
    document.querySelector('.widget.others').innerHTML = html;   
  } 


  const formatSectionTitle = (title) => {
    const droppedUnderscore = title.slice(1, title.length);
    // check for any hyphens and remove from display:
    const reg = droppedUnderscore.replace(/-/g, " ")
    return reg
  }


  widgetBuilder();


  // Grab all the UL's for each widget
  const sortableLists = document.querySelectorAll(".sortable-list");

  // Going through each UL's list-items abd add the drag n drop re-order evant handlers. 
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
         setNewOrder(item.dataset.uid, item.dataset.key) 
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



} // close refreshApp function

refreshApp();


/////////////////
/// FUNCTIONS ///
/////////////////

const addSection = (e) => {
  const text = `_${document.getElementById('sectionName').value}`;
  // trim any leading or traling whitespace.
  text.trim();
  // replace any white space with "-"
  const whiteSpaceRemover = text.replace(/\s/g, "-")
  console.log(whiteSpaceRemover)
  const sectionName = whiteSpaceRemover.replace(/[^a-zA-Z0-9$_-]/g, "")
  console.log(sectionName)
  
  todos[sectionName] = [];
  localStorage.setItem('todos', JSON.stringify(todos))
  refreshApp();
  closeModal();
}


// when the + sign is clicked to create a new todo
const addTodo = (target) => {
  console.log('typeof target', typeof target, 'target', target)
  const element = document.querySelector('.new-todo-holder');
  // Check to see if there is already an active todo form on the page for another widget, and if so close it before creating the new one. 
  console.log(element)
  element && element.remove();

  // Create and insert the element that will hold the add-todo inputs //
  const div = document.createElement('div');
  div.id = `${target}-new-todo-holder`;
  div.classList.add('new-todo-holder')
  console.log(typeof target, target)
  if(target === "priority") {
    const referenceEl = document.getElementById('priority-todos')
    referenceEl.insertBefore(div, referenceEl.querySelector('.plus-sign'))
  }else {
    const referenceEl = document.querySelector(`section.${target}`)
    console.log(referenceEl)
    referenceEl.insertBefore(div, referenceEl.querySelector('.plus-sign'))
  }
  
  
   const widget = document.querySelector(`ul.sortable-list.${target}`)
   
   let html = '';
   html += `
   <li class="item"> 
          <h4 class="top-row">      
            <input type="text" id="id" name="id" placeholder="Id: "/>
            <p class="text">
              Due: 
            </p>
          </h4>
          <div class="bottom-row">
            <div class="col-1">        
              <textarea  id="description"  placeholder="Description: "></textarea>
            </div>
            <div class="col-2">
              <button
                class="btn1 add-btn"
              >
                Add
             </button>
            </div>
          </div>
          <span class="back" onclick="document.querySelector('.new-todo-holder').remove()">back</span>
        </li>        
   `

      document.getElementById(`${target}-new-todo-holder`).innerHTML =  html
      document.querySelector(".add-btn").addEventListener("click", () => {
        const id = document.querySelector('#id').value;
        const description = document.querySelector('#description').value;
        const uid = Math.floor(Math.random() * Date.now());
        const todo = {uid, id, description, dueDate: "tbc", completed: false};
        todos[target].push(todo);
        localStorage.setItem("todos", JSON.stringify(todos));
        document.getElementById(`${target}-new-todo-holder`).innerHTML =  "";
        refreshApp();
      }) 

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

const setNewOrder = (id, key) => {
  let uid = Number(id)  

  // Go through the dom and reconstruct the todos array pulling the information out of each node, then compare with the current nodes array. If different send the re-order to storage and refresh the app
  const affectedUL = document.querySelector(`ul.${key}`);

  const reorderedList = [...affectedUL.querySelectorAll(".item")]
  const reorderedTodoIds = reorderedList.map((todo) => {
    return Number(todo.dataset.uid)
  })

  // Find the element that moved and where it moved to..
  // The element that moved is passed into the function (uid);
  // Where it moved to can be found using indexOf on the reorderedTodoIds

  const movedTo = reorderedTodoIds.indexOf(uid);

  // Find where the element moved from by checking where the element is in the original todo list. 
  // get the element
  const targetTodo = todos[key].find(todo => todo.uid === uid)

  // get it's original index 
  const movedFrom = todos[key].findIndex((todo) => uid === todo.uid)

  // splice out the old position
  todos[key].splice(movedFrom, 1);

  // splice in at the new position 
  todos[key].splice(movedTo, 0, targetTodo);
  // save 

  localStorage.setItem("todos", JSON.stringify(todos));
  refreshApp();
}

// When user updates ID or Description content 
// @Params:  uid   - the id of the todo in question
// @Params:  mode  -  id || desc The user is either updating an id or description
// @Params:  element  - html element acted on

const editMode = (uid, mode, element) => {
  const key = element.closest("li").dataset.key;

  if(mode === "id") {
    let text = element.textContent.split(": ")
    // the ID is being edited.
    todos[key].map(todo => {
      if(todo.uid === uid) {
        return todo.id = text[1];
      }
      return
    })
    
  }else if(mode === 'desc') {
     // The description is being edited
     let text = element.textContent.trim();
     console.log(text)
     todos[key].map(todo => {
      if(todo.uid === uid) {
        return todo.description = text;
      }
      return
     })
  }
  localStorage.setItem('todos', JSON.stringify(todos))
  refreshApp();
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
@params:  type:   "string"   options: "addSection"
@params   target: "string"   <this is for addTodo and dicates which section the todo should be added to
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


//Open Modal:   Create a new section 
document.querySelector('#menu .add-section-li').addEventListener("click", () => {
  openModal("add-section");
})

// Open Modal:  Delete a section
document.querySelector('#menu .delete-section-li').addEventListener("click", () => {
  openModal("delete-section");
})



