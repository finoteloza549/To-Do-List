// Task management app with localStorage
class TodoApp {
    constructor() {
        this.tasks = this.loadTasks();
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        // Get DOM elements
        this.taskInput = document.getElementById('taskInput');
        this.addBtn = document.getElementById('addBtn');
        this.taskList = document.getElementById('taskList');
        this.taskCount = document.getElementById('taskCount');
        this.clearCompletedBtn = document.getElementById('clearCompleted');
        this.filterBtns = document.querySelectorAll('.filter-btn');

        // Event listeners
        this.addBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTask();
            }
        });
        this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
        
        // Filter buttons
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.renderTasks();
            });
        });

        // Initial render
        this.renderTasks();
    }

    addTask() {
        const taskText = this.taskInput.value.trim();
        
        if (taskText === '') {
            this.taskInput.focus();
            return;
        }

        const task = {
            id: Date.now(),
            text: taskText,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.push(task);
        this.saveTasks();
        this.taskInput.value = '';
        this.taskInput.focus();
        this.renderTasks();
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.renderTasks();
    }

    toggleTask(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
        }
    }

    clearCompleted() {
        this.tasks = this.tasks.filter(task => !task.completed);
        this.saveTasks();
        this.renderTasks();
    }

    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'active':
                return this.tasks.filter(task => !task.completed);
            case 'completed':
                return this.tasks.filter(task => task.completed);
            default:
                return this.tasks;
        }
    }

    renderTasks() {
        const filteredTasks = this.getFilteredTasks();
        
        if (filteredTasks.length === 0) {
            const emptyMessage = this.currentFilter === 'all' 
                ? 'No tasks yet. Add one above! ✨'
                : this.currentFilter === 'active'
                ? 'No active tasks! 🎉'
                : 'No completed tasks yet.';
            this.taskList.innerHTML = `<li class="empty-state">${emptyMessage}</li>`;
        } else {
            this.taskList.innerHTML = filteredTasks.map(task => `
                <li class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
                           onchange="todoApp.toggleTask(${task.id})">
                    <span class="task-text">${this.escapeHtml(task.text)}</span>
                    <button class="delete-btn" onclick="todoApp.deleteTask(${task.id})">Delete</button>
                </li>
            `).join('');
        }

        this.updateTaskCount();
    }

    updateTaskCount() {
        const activeTasks = this.tasks.filter(task => !task.completed).length;
        this.taskCount.textContent = `${activeTasks} ${activeTasks === 1 ? 'task' : 'tasks'} remaining`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveTasks() {
        localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const savedTasks = localStorage.getItem('todoTasks');
        return savedTasks ? JSON.parse(savedTasks) : [];
    }
}

// Initialize the app when DOM is loaded
let todoApp;
document.addEventListener('DOMContentLoaded', () => {
    todoApp = new TodoApp();
});
