/* Todos Data Structure 
  
   todos: {
    priority: [],
    mifCheck: [],
    beadyEye: []
   }

*/

// The todos are broken up into separate widgets with each being named.  Then there should be a corresponding todo array to populate each widget, contained within the todos object and brought in from localstorage 

This way when the page loads each widget can be filled with todos from it's corresponding todos array.

Any time any of the todos are changed, this will need to trigger a refresh of the whole app :(


  E.g of starter seed data to populate local storage:

  // Starter 
let todos = {
  priority: [{id: 1, description: "Kick the Cat", dueDate:"tbc", completed: false, uid: 1},{id: 2, description: "Walk the Dog", dueDate:"tbc", completed: false, uid: 2}],
  mifCheck: [{id: 232, description: "Check Bob's MIF applied", dueDate: "tbc", completed: false, uid:3}, {id: 71232, description: "Check Frank's MIF applied", dueDate: "tbc", completed: false, uid: 4}],
  beadyEye: [{id: 9123, description: "Perhaps Fraud", dueDate:"tbc", completed: false, uid: 5},{id: 12392, description: "Look into this...", dueDate:"tbc", completed: false, uid: 6}, {id: 11, description: "Check these out...", dueDate:"tbc", completed: false, uid: 7}]
}


Things To Work On:

* Be able to create a section title that's more than one word ( currently breaks the code if you do that )
* Adding a section title that's a number breaks the code,  need validation
* clicking Add from scrolled down in the page breaks the overlay
* If there are no secondary sections,  then clicking to delete a section shouldn't be available from the menu bar. 
* Preserve the re-ordering of todos on page refresh..

Major rejig: 
* a + sign below each todo when clicked upon,  builds a new todo using contentEditable ( this would replace the modal window for adding a todo)
