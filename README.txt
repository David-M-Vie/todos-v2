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
  priority: [{id: 1, description: "Kick the Cat", dueDate:"tbc", completed: false},{id: 2, description: "Walk the Dog", dueDate:"tbc", completed: false}],
  mifCheck: [{id: 232, description: "Check Bob's MIF applied", dueDate: "tbc", completed: false}, {id: 71232, description: "Check Frank's MIF applied", dueDate: "tbc", completed: false}],
  beadyEye: [{id: 9123, description: "Perhaps Fraud", dueDate:"tbc", completed: false},{id: 12392, description: "Look into this...", dueDate:"tbc", completed: false}, {id: 11, description: "Check these out...", dueDate:"tbc", completed: false}]
}