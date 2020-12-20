'use strict';

class ToDo {
	constructor(form, input, toDoList, toDoCompleted) { // эти аргументы перечислены в new ToDo()
		this.form = document.querySelector(form);
		this.input = document.querySelector(input);
		this.toDoList = document.querySelector(toDoList);
		this.toDoCompleted = document.querySelector(toDoCompleted);
		this.toDoData = new Map(JSON.parse(localStorage.getItem('toDoListItems'))); // создаем коллекцию для храниения данных и получаем из localStorage
	}

	addToStorage() {
		localStorage.setItem('toDoListItems', JSON.stringify([...this.toDoData])); // передаем данные в localStorage
	}
	render() {
		this.toDoList.textContent = ''; // очищает строки для нового ввода
		this.toDoCompleted.textContent = ''; // очищает строки для нового ввода
		this.toDoData.forEach(this.createItem, this); // второй this передан потому что createItem(toDo) не имеет своего this
		this.addToStorage();
	}
	createItem(toDo) {
		const li = document.createElement('li');
		li.classList.add('todo-item');
		li.key = toDo.key;
		li.insertAdjacentHTML('beforeend', `
			<span class="text-todo">${toDo.value}</span>
			<div class="todo-buttons">
				<button class="todo-remove"></button>
				<button class="todo-complete"></button>
			</div>
		`);

		if (toDo.completed) {
			this.toDoCompleted.append(li);
		} else {
			this.toDoList.append(li);
		}
	}
	addToDo(e) { // е - элемене -elem
		e.preventDefault();
		if (this.input.value.trim()) {
			const newToDo = {
				value: this.input.value,
				completed: false,
				key: this.generateKey(),
			};
			this.toDoData.set(newToDo.key, newToDo);
			this.render();
		} else {
			alert('Пустое дело добавить нельзя!');
		}
		this.input.value = '';
	}
	generateKey() {
		return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
	}

	deleteItem(key) {
		for (const keyToDoData of this.toDoData.keys()) {
			if (keyToDoData === key) {
				this.toDoData.delete(key);
			}
		}

		this.addToStorage();
		this.render();
	}

	completedItem(keyC) {
		this.toDoData.forEach(key => {
			if (`${key}` === keyC) {
				this.toDoData.value.completed = true;
			}
		});
		/* for (const keyToDoData of this.toDoData.keys()) {
			if (keyToDoData === key) {
				this.toDoData.keys().value.completed = true;
			}
		} */

		this.addToStorage();
		this.render();
	}

	handler() {
		const todoContainer = document.querySelector('.todo-container');

		todoContainer.addEventListener('click', () => {
			const target = event.target;
			if (target.classList.contains('todo-remove')) {
				this.deleteItem(target.closest('.todo-item').key);
			}
			if (target.classList.contains('todo-complete')) {
				this.completedItem(target.closest('.todo-item').key);
			}
			/* this.elem.completed = !this.elem.completed; */
		});
	}
	init() {
		this.form.addEventListener('submit', this.addToDo.bind(this));
		this.render();
		this.deleteItem();
		this.completedItem();
		this.handler();
	}
}

const toDo = new ToDo('.todo-control', '.header-input', '.todo-list', '.todo-completed');
toDo.init();

