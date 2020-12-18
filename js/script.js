'use strict';

class ToDo {
	constructor(form, input, toDoList, toDoComleted) { // эти аргументы перечислены в new ToDo()
		this.form = document.querySelector(form);
		this.input = document.querySelector(input);
		this.toDoList = document.querySelector(toDoList);
		this.toDoComleted = document.querySelector(toDoComleted);
		this.toDoData = new Map(JSON.parse(localStorage.getItem('toDoListItems'))); // создаем коллекцию для храниения данных и получаем из localStorage
	}

	addToStorage() {
		localStorage.setItem('toDoListItems', JSON.stringify([...this.toDoData])); // передаем данные в localStorage
	}
	render() {
		this.toDoList.textContent = ''; // очищает строки для нового ввода
		this.toDoComleted.textContent = ''; // очищает строки для нового ввода
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

		if (toDo.comleted) {
			this.toDoComleted.append(li);
		} else {
			this.toDoList.append(li);
		}
	}
	addToDo(e) { // е - элемене -elem
		e.preventDefault();
		if (this.input.value.trim()) {
			const newToDo = {
				value: this.input.value,
				comleted: false,
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

	deleteItem() {
		const todoRemove = document.querySelector('.todo-remove');
		const todoItem = document.querySelector("#todo > li");
		/* todoRemove.forEach(() => { */
		todoRemove.addEventListener('click', () => {
			todoItem.style.display = 'none';
		});
		/* }); */
	}

	comletedItem() {
		const todoComplete = document.querySelector('.todo-complete');
		todoComplete.addEventListener('click', () => {
			this.newToDo = {
				comleted: true,
			};
		});
	}

	handler() {
		// делегирование
	}
	init() {
		this.form.addEventListener('submit', this.addToDo.bind(this));
		this.render();
		this.deleteItem();
		this.comletedItem();
	}
}

const toDo = new ToDo('.todo-control', '.header-input', '.todo-list', '.todo-completed');
toDo.init();

