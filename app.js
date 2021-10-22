//Storage Controller
const StorageController = (function(){

  return {
    storeTodo: function(todo){
      if(localStorage.getItem('todos')===null){
        todos = [];
        todos.push(todo);
      }else{
        todos = JSON.parse(localStorage.getItem('todos'))
        todos.push(todo);
      }
      localStorage.setItem('todos',JSON.stringify(todos))
    },
    getTodos: function(){
      let todos;
      if(localStorage.getItem('todos')==null){
        todos = [];
      }else{
        todos = JSON.parse(localStorage.getItem('todos'));
      }
      return todos
    },
    updateTodo: function(todo){
      let todos = JSON.parse(localStorage.getItem('todos'));

      todos.forEach(function(td,index){
        if(todo.id == td,index){
          todos.splice(index,1,todo);
        }
      });
      localStorage.setItem('todos', JSON.stringify(todos));
    },
    deleteProduct: function(id){
      let todos = JSON.parse(localStorage.getItem('todos'));
      todos.forEach(function(td,index){
        if(id == td,index){
          todos.splice(index,1);
        }
      });
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }
})();
//Todos Controller
const TodosController = (function(){
  //private
  const Todos = function(id, todo, category, check){
    this.id = id;
    this.todo = todo;
    this.category = category;
    this.check = check;
  }
  const data = {
    todos: StorageController.getTodos(),
    selectedToDo: null
  }

  return {
    getTodos: function(){
      return data.todos;
    },
    getData: function(){
      return data
    },
    getTodoById: function(id){
      let product = null;
      data.todos.forEach(function(todo){
        if(todo.id==id){
          product = todo;
        }
      })
      return product;
    },
    setCurrentTodo: function(todo){
      data.selectedToDo = todo
    },
    getCurrentTodo: function(){
      return data.selectedToDo;
    },
    addTodo: function(todo, category){
      let id;
      let check = false;
      if (data.todos.length > 0) {
        id = data.todos[data.todos.length - 1].id + 1;
      } else {
        id = 0;
      }
      const newTodo = new Todos(id, todo, category, check);
      data.todos.push(newTodo);
      return newTodo;
    },
    updateTodo: function(todo, category){
      let toDo = null;
      data.todos.forEach(function(td){
        if(td.id == data.selectedToDo.id){
          td.name = todo;
          td.category = category;
          toDo = td
        }
      })
      return toDo;
    },
    deleteTodo: function (todo) {
      data.todos.forEach(function (td, index) {
        if (td.id == todo.id) {
          data.todos.splice(index, 1);
        }
      });
    },
  }
})();

//UI Controller
const UIController = (function(){
  const Selectors = {
    todoList: "#item-list",
    addButton: ".addBtn",
    todoListItems: "#item-list tr",
    updateButton: ".updateBtn",
    deleteButton: ".deleteBtn",
    cancelButton: ".cancelBtn",
    todo: "#todo",
    category: "#category",
    todoCard: "#todoCard",
  };

  return {
    createTodosList: function(todos){
      let html=''
      todos.forEach(todo => {
        html += `
        <tr>
           <td>${todo.id}</td>
           <td>${todo.todo}</td>
           <td>${todo.category}</td>
           <td class="text-right">
              <i class="far fa-edit edit-todo"></i>
          </td>
        </tr>   
        `;
        });
      document.querySelector(Selectors.todoList).innerHTML = html;
    },
    getSelectors: function(){
      return Selectors;
    },
    addTodo: function(todo){
      document.querySelector(Selectors.todoCard).style.display='block';
      let item= `
        <tr>
          <td>${todo.id}</td>
          <td>${todo.todo}</td>
          <td>${todo.category}</td>
          <td class="text-right">
            <i class="far fa-edit edit-todo"></i>
          </td>
        </tr> 
      `;
        document.querySelector(Selectors.todoList).innerHTML += item
    },
    clearInputs: function(){
      document.querySelector(Selectors.todo).value = ''
      document.querySelector(Selectors.category).value = ''
    },
    clearWarnings: function () {
      const items = document.querySelectorAll(Selectors.todoListItems);
      items.forEach(function (item) {
        if (item.classList.contains("bg-warning")) {
          item.classList.remove("bg-warning");
        }
      });
    },
    hideCard: function(){
      document.querySelector(Selectors.todoCard).style.display='none'
    },
    addTodoToForm: function(){
      const selectedTodo = TodosController.getCurrentTodo();
      document.querySelector(Selectors.todo).value = selectedTodo.todo;
      document.querySelector(Selectors.category).value = selectedTodo.category;
    },
    addingState: function (item) {
      UIController.clearWarnings();
      UIController.clearInputs();
      document.querySelector(Selectors.addButton).style.display = "inline";
      document.querySelector(Selectors.updateButton).style.display = "none";
      document.querySelector(Selectors.deleteButton).style.display = "none";
      document.querySelector(Selectors.cancelButton).style.display = "none";
    },
    editState: function(tr){
      tr.classList.add('bg-warning')
      document.querySelector(Selectors.addButton).style.display = "none";
      document.querySelector(Selectors.updateButton).style.display = "inline";
      document.querySelector(Selectors.deleteButton).style.display = "inline";
      document.querySelector(Selectors.cancelButton).style.display = "inline";
    },
    updateTodo: function(todo){
      let updatedItem = null;
      let items = document.querySelectorAll(Selectors.todoListItems);
      items.forEach(function(item){
        if(item.classList.contains('bg-warning')){
          item.children[1].textContent = todo.name;
          item.children[2].textContent = todo.category;
          updatedItem = item
        }
      });
      return updatedItem;
    },
    deleteTodo: function () {
      let items = document.querySelectorAll(Selectors.todoListItems);
      items.forEach(function (item) {
        if (item.classList.contains("bg-warning")) {
          item.remove();
        }
      });
    },
  }
})();

//App Controller
const App = (function(TodosCtrl, UICtrl, StorageCtrl){

  const UISelectors = UIController.getSelectors();

  //Load Event Listeners
  const loadEventListeners = function(){
  
  //Add todo event
  document.querySelector(UISelectors.addButton).addEventListener('click', todoAddSubmit);

  //edit todo click
  document.querySelector(UISelectors.todoList).addEventListener('click', todoEditClick);

  //edit todo submit
  document.querySelector(UISelectors.updateButton).addEventListener('click', editTodoSubmit);

  //cancel button click
  document.querySelector(UISelectors.cancelButton).addEventListener('click',cancelUpdate);

  //delete button
  document.querySelector(UISelectors.deleteButton).addEventListener("click", deleteTodoSubmit);
  }
  const todoAddSubmit = function(e){

    const todo = document.querySelector(UISelectors.todo).value;
    const category = document.querySelector(UISelectors.category).value;
    
    if(todo!=='' && category!==''){
      const newTodo = TodosCtrl.addTodo(todo,category);
      
      UIController.addTodo(newTodo);

      //Storage
      StorageCtrl.storeTodo(newTodo)

      UIController.clearInputs();
    }
    e.preventDefault();
  }
  const todoEditClick = function(e){
    if (e.target.classList.contains("edit-todo")) {
      const id =
        e.target.parentNode.previousElementSibling.previousElementSibling
          .previousElementSibling.textContent;
      console.log(id)
      //get selected todo
      const todo = TodosCtrl.getTodoById(id);

      //set current todo
      TodosCtrl.setCurrentTodo(todo);

      UICtrl.clearWarnings();

      //add product to UI
      UICtrl.addTodoToForm();

      //edittingState
      UICtrl.editState(e.target.parentNode.parentNode);
    }
    e.preventDefault();
  }
  const editTodoSubmit = function(e){
    const todo = document.querySelector(UISelectors.todo).value;
    const category = document.querySelector(UISelectors.category).value;

    if(todo!=='' && category!==''){
      const updatedTodo = TodosCtrl.updateTodo(todo,category);

      //update ui
      let item = UICtrl.updateTodo(updatedTodo)

      //update storage
      StorageCtrl.updateTodo(updatedTodo)
    }
    e.preventDefault();
  }
  const cancelUpdate = function(e){
    UICtrl.addingState()
    UICtrl.clearWarnings();
    e.preventDefault()
  }
  const deleteTodoSubmit = function(e){
    // get selected todo
    const selectedToDo = TodosCtrl.getCurrentTodo();

    //delete product
    TodosCtrl.deleteTodo(selectedToDo);
    
    //delete Ui
    UICtrl.deleteTodo();

    //delete from storage
    StorageCtrl.deleteProduct(selectedToDo.id)

    UICtrl.addingState();

    e.preventDefault();
  }
  return {
    init: function(){
      UICtrl.addingState();
      const todos = TodosCtrl.getTodos();

      if(todos.length==0){
        UIController.hideCard();
      }else{
        UICtrl.createTodosList(todos);
      }
      loadEventListeners()
    }
  }
})(TodosController, UIController, StorageController);

App.init();