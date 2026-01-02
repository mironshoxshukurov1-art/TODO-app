const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const totalCount = document.getElementById('total-count');
const completedCount = document.getElementById('completed-count');
const pendingCount = document.getElementById('pending-count');
const filterBtns = document.querySelectorAll('.filter-btn');

let todos = [];
let currentFilter = 'all';

// Load todos from localStorage
function loadTodos() {
    const saved = localStorage.getItem('todos');
    todos = saved ? JSON.parse(saved) : [];
    renderTodos();
}

// Save todos to localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Update statistics
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const pending = total - completed;
    
    totalCount.innerText = total;
    completedCount.innerText = completed;
    pendingCount.innerText = pending;
}

// Filter todos based on current filter
function getFilteredTodos() {
    switch(currentFilter) {
        case 'active':
            return todos.filter(t => !t.completed);
        case 'completed':
            return todos.filter(t => t.completed);
        default:
            return todos;
    }
}

// Render the list
function renderTodos() {
    todoList.innerHTML = '';
    updateStats();
    
    const filteredTodos = getFilteredTodos();
    
    // Show/hide empty state
    if (filteredTodos.length === 0) {
        emptyState.style.display = 'block';
        todoList.style.display = 'none';
        return;
    }
    
    emptyState.style.display = 'none';
    todoList.style.display = 'block';

    filteredTodos.forEach((todo, index) => {
        const actualIndex = todos.indexOf(todo);
        const li = document.createElement('li');
        
        li.className = `flex items-center justify-between p-4 rounded-xl border transition-all ${
            todo.completed 
                ? 'bg-slate-700/50 border-slate-600' 
                : 'bg-slate-700 border-slate-600 hover:border-blue-500'
        }`;
        
        li.innerHTML = `
            <div class="flex items-center gap-4 flex-1">
                <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                    onchange="toggleTodo(${actualIndex})"
                    class="w-5 h-5 rounded border-slate-500 bg-slate-600 text-blue-500 focus:ring-blue-500 cursor-pointer">
                <span class="${todo.completed 
                    ? 'line-through text-slate-400' 
                    : 'text-slate-100 font-medium'} transition-all">
                    ${escapeHtml(todo.text)}
                </span>
            </div>
            <button onclick="deleteTodo(${actualIndex})" class="ml-4 text-slate-400 hover:text-red-400 transition-colors flex-shrink-0 p-2 hover:bg-red-500/10 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
            </button>
        `;
        todoList.appendChild(li);
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add a todo
function addTodo() {
    const text = input.value.trim();
    if (text !== '') {
        todos.push({ 
            text, 
            completed: false,
            createdAt: new Date().toISOString()
        });
        input.value = '';
        input.focus();
        saveTodos();
        renderTodos();
    }
}

// Toggle completion
window.toggleTodo = (index) => {
    todos[index].completed = !todos[index].completed;
    saveTodos();
    renderTodos();
};

// Delete a todo
window.deleteTodo = (index) => {
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
};

// Set filter
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active', 'bg-blue-500', 'text-white'));
        filterBtns.forEach(b => b.classList.add('bg-slate-700', 'text-slate-300'));
        
        btn.classList.add('active', 'bg-blue-500', 'text-white');
        btn.classList.remove('bg-slate-700', 'text-slate-300');
        
        currentFilter = btn.dataset.filter;
        renderTodos();
    });
});

// Event Listeners
addBtn.addEventListener('click', addTodo);
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
});

// Initialize
loadTodos();