import styles from './TodoList.module.css';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import TodoItem from './TodoItem';
import { PlaceInitialTodosInLocalStorage } from '../helpers/LocalStorage';
import DeletedTodoItem from './DeletedTodoItem';

export interface Task {
	id: string;
	todo: string;
	completed: boolean;
	userId?: number | null;
}

const TodoList = ({ handleScrollBarVisible }: any) => {
	const [todoList, setTodoList] = useState<Task[]>([]);
	const [showTodoList, setShowTodoList] = useState<boolean>(true);
	const [todoName, setTodoName] = useState<string>('');
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [numberOfCompletedTodos, setNumberOfCompletedTodos] =
		useState<number>(0);
	const [numberOfTodosToFetch, setNumberOfTodosToFetch] = useState<string>('');
	const [deletedTodoList, setDeletedTodoList] = useState<Task[]>([]);
	const [showDeletedTodos, setShowDeletedTodos] = useState<boolean>(false);
	const [showInfo, setShowInfo] = useState<boolean>(false);

	useEffect(() => {
		const storedTodos = localStorage.getItem('todoer-todos');
		const storedDeletedTodos = localStorage.getItem('todoer-deletedtodos');
		if (storedTodos) {
			const parsedTodos = JSON.parse(storedTodos);
			setTodoList(parsedTodos);
		}
		if (storedDeletedTodos) {
			const parsedDeletedTodos = JSON.parse(storedDeletedTodos);
			setDeletedTodoList(parsedDeletedTodos);
		}
		if (!storedTodos && !storedDeletedTodos) {
			PlaceInitialTodosInLocalStorage();
		}
	}, []);

	const handleTodoItemEntry = (
		event: React.FormEvent<HTMLInputElement>
	): void => {
		setTodoName(event.currentTarget.value);
	};

	const [statusMessage, setStatusMessage] = useState<string>('');

	const handleAddTodoToList = (
		event: React.FormEvent<HTMLFormElement>
	): void => {
		event.preventDefault();
		const removeAllSpaces = todoName.replaceAll(' ', '');
		const trimmedTodo = todoName.trim();
		if (removeAllSpaces.length > 2) {
			const newTodo: Task = {
				id: uuidv4(),
				todo: trimmedTodo,
				completed: false,
			};
			const newTodoList = [...todoList, newTodo];
			setTodoList(newTodoList);
			/* setTodoList([...todoList, newTodo]); */
			localStorage.setItem('todoer-todos', JSON.stringify(newTodoList));
			setTodoName('');
			setErrorMessage('');
			/* setShowDeletedTodos(false);
			setShowTodoList(true); */
		} else {
			setErrorMessage('Atleast 3 characters required.');
		}
	};

	const toggleCompleted = (id: string) => {
		const markTodoCompleted = todoList.map((todo) => {
			if (todo.id === id) {
				return { ...todo, completed: !todo.completed };
			} else return todo;
		});
		setTodoList(markTodoCompleted);
		localStorage.setItem('todoer-todos', JSON.stringify(markTodoCompleted));
		const completedTodos = markTodoCompleted.filter(
			(todo) => todo.completed
		).length;
		setNumberOfCompletedTodos(completedTodos);
	};

	const fetchTodosFromAPI = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setStatusMessage('Fetching data...');
		if (
			Number(numberOfTodosToFetch) <= 0 ||
			Number(numberOfTodosToFetch) > 10
		) {
			setStatusMessage('Please enter a number beween 1 and 10.');
			return;
		}
		try {
			const response = await fetch(
				`https://dummyjson.com/todos/random/${numberOfTodosToFetch}`
			);
			if (!response.ok) {
				setStatusMessage(response.status.toString());
				/* throw new Error(`Response status: ${response.status}`); */
			}
			const data = await response.json();
			if (data) {
				setStatusMessage('Data succesfuly received!');
			}
			const updatedTodos = data.map((newTodo: Task) => {
				const existingTodo = todoList.find((todo) => todo.id === newTodo.id);
				const existingDeletedTodo = deletedTodoList.find(
					(todo) => todo.id === newTodo.id
				);
				if (existingTodo || existingDeletedTodo) {
					return { ...newTodo, id: uuidv4() };
				} else {
					return newTodo;
				}
			});
			const newTodoList = todoList.concat(updatedTodos);
			setTodoList(newTodoList);
			localStorage.setItem('todoer-todos', JSON.stringify(newTodoList));
		} catch (error: any) {
			console.error(error);
			setStatusMessage(error.toString());
		}
		setNumberOfTodosToFetch('');
	};

	const handleNumberOfAPITodos = (
		event: React.FormEvent<HTMLInputElement>
	): void => {
		setNumberOfTodosToFetch(event.currentTarget.value);
	};

	const handleDeleteTodo = (id: string) => {
		const filteredTodos = todoList.filter((todo) => todo.id !== id);
		const newlyDeletedTodos = todoList.filter((todo) => todo.id === id);
		setTodoList(filteredTodos);
		setDeletedTodoList(deletedTodoList.concat(newlyDeletedTodos));
		localStorage.setItem('todoer-todos', JSON.stringify(filteredTodos));
		localStorage.setItem(
			'todoer-deletedtodos',
			JSON.stringify(deletedTodoList.concat(newlyDeletedTodos))
		);
	};

	const handleDeleteAllAPITodos = () => {
		const newTodoList = todoList.filter(
			(todo) => todo.userId === undefined || todo.userId === null
		);
		setTodoList(newTodoList);
		localStorage.setItem('todoer-todos', JSON.stringify(newTodoList));
		const newlyDeletedTodos = todoList.filter(
			(todo) => todo.userId !== undefined || todo.userId !== null
		);
		setDeletedTodoList(deletedTodoList.concat(newlyDeletedTodos));
		localStorage.setItem(
			'todoer-deletedtodos',
			JSON.stringify(deletedTodoList.concat(newlyDeletedTodos))
		);
	};

	const handleDeleteAllCustomTodos = () => {
		const newTodoList = todoList.filter((todo) => typeof todo.id !== 'string');
		setTodoList(newTodoList);
		const newlyDeletedTodos = todoList.filter(
			(todo) => typeof todo.id === 'string'
		);
		setDeletedTodoList(deletedTodoList.concat(newlyDeletedTodos));
		localStorage.setItem('todoer-todos', JSON.stringify(newTodoList));
		localStorage.setItem(
			'todoer-deletedtodos',
			JSON.stringify(deletedTodoList.concat(newlyDeletedTodos))
		);
	};

	const handleDeleteAllTodos = () => {
		setDeletedTodoList(deletedTodoList.concat(todoList));
		localStorage.setItem(
			'todoer-deletedtodos',
			JSON.stringify(deletedTodoList)
		);
		setTodoList([]);
		localStorage.removeItem('todoer-todos');
		/* PlaceInitialTodosInLocalStorage(); */
	};

	const returnTodoToTodoList = (id: string) => {
		const deletedTodo = deletedTodoList.filter((todo) => todo.id === id);
		setTodoList(todoList.concat(deletedTodo));
		const remainingTodos = deletedTodoList.filter((todo) => todo.id !== id);
		setDeletedTodoList(remainingTodos);
		localStorage.setItem(
			'todoer-todos',
			JSON.stringify(todoList.concat(deletedTodo))
		);
		localStorage.setItem('todoer-deletedtodos', JSON.stringify(remainingTodos));
	};

	useEffect(() => {
		const completedTodos = todoList.filter((todo) => todo.completed).length;
		setNumberOfCompletedTodos(completedTodos);
	}, [todoList]);

	const handleDeleteStatusMessage = () => {
		setStatusMessage('');
	};

	const handleResetApp = () => {
		setTodoList([]);
		setDeletedTodoList([]);
		localStorage.removeItem('todoer-todos');
		localStorage.removeItem('todoer-deletedtodos');
		PlaceInitialTodosInLocalStorage();
		const storedTodos = localStorage.getItem('todoer-todos');
		if (storedTodos) {
			const parsedTodos = JSON.parse(storedTodos);
			setTodoList(parsedTodos);
		}
	};

	const handleClearDeletedTodos = () => {
		setDeletedTodoList([]);
		setShowDeletedTodos(true);
		localStorage.removeItem('todoer-deletedtodos');
	};

	const handleShowTodoList = () => {
		setShowTodoList(true);
		setShowDeletedTodos(false);
	};

	const handleShowDeletedTodos = () => {
		setShowTodoList(false);
		setShowDeletedTodos(true);
	};

	const handleShowTodosOrDeletedTodos = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		const value = event.currentTarget.value;
		if (value === 'tasks') {
			handleShowTodoList();
		} else if (value === 'deleted-tasks') {
			handleShowDeletedTodos();
		}
	};

	const handleInfo = () => {
		document.body.style.overflow = 'hidden';
		setShowInfo(!showInfo);
	};

	const handleCloseInfo = () => {
		document.body.style.overflow = 'unset';
		setShowInfo(false);
	};

	const handleOutsideClick = (event: React.MouseEvent) => {
		if (event.target === event.currentTarget) {
			document.body.style.overflow = 'unset';
			handleCloseInfo();
		}
	};

	useEffect(() => {
		if (statusMessage === 'Data succesfuly received!') {
			setTimeout(() => {
				setStatusMessage('');
			}, 5000);
		}
	}, [statusMessage]);

	const editTodo = (newTodoName: string, id: string | number) => {
		const newTodoList = todoList.map((todo) => {
			if (todo.id === id) {
				return { ...todo, todo: newTodoName /* , id: uuidv4() */ };
			}
			return todo;
		});
		setTodoList(newTodoList);
		localStorage.setItem('todoer-todos', JSON.stringify(newTodoList));
	};

	useEffect(() => {
		let hasVScroll = window.innerWidth > document.documentElement.clientWidth;
		if (hasVScroll) {
			handleScrollBarVisible(true);
		}
		if (!hasVScroll) {
			handleScrollBarVisible(false);
		}
	}, [todoList, deletedTodoList, handleShowTodosOrDeletedTodos]);

	return (
		<div className={styles.app}>
			<div className={styles.app__header}>
				<div className={styles.app__header__invisible}>
					<button></button>
				</div>
				<h1 className={styles.app__title}>My To-Do List</h1>
				<div className={styles.app__header__info}>
					<button onClick={handleInfo}></button>
				</div>
			</div>

			<form className={styles.form} onSubmit={handleAddTodoToList}>
				<label htmlFor='input' className={styles.form__label}>
					What needs to be done?
				</label>
				<input
					id='input'
					className={styles.form__input}
					value={todoName}
					onChange={handleTodoItemEntry}
				/>
				<button className={styles.form__button}>Add</button>
				<div className={styles.form__error}>{errorMessage}</div>
			</form>

			<div className={styles.taskDisplay}>
				<div className={styles.taskDisplay__options}>
					<select onChange={handleShowTodosOrDeletedTodos}>
						<option value='tasks'>Tasks</option>
						<option value='deleted-tasks'>Deleted tasks</option>
					</select>
				</div>
			</div>

			<div className={styles.todos}>
				{todoList.length === 0 && showTodoList && (
					<div className={styles.todos__emptyMessage}>
						You have no tasks yet! Try adding some.
					</div>
				)}
				{showTodoList && (
					<div className={styles.todos__list}>
						{todoList.map((todo) => (
							<TodoItem
								key={todo.id}
								todo={todo}
								toggleCompleted={() => toggleCompleted(todo.id)}
								handleDeleteTodo={() => handleDeleteTodo(todo.id)}
								editTodo={editTodo}
							/>
						))}
					</div>
				)}
			</div>

			<div className={styles.deletedTodos}>
				<div>
					{deletedTodoList.length === 0 && showDeletedTodos && (
						<div className={styles.deletedTodos__emptyMessage}>
							You have no deleted tasks yet!
						</div>
					)}
				</div>
				{showDeletedTodos && (
					<div className={styles.deletedTodos__list}>
						{deletedTodoList.map((todo) => (
							<DeletedTodoItem
								key={todo.id}
								todo={todo}
								returnTodoToTodoList={() => returnTodoToTodoList(todo.id)}
							/>
						))}
						{deletedTodoList.length > 0 && (
							<button
								className={styles.deletedTodos__clearButton}
								onClick={handleClearDeletedTodos}
							>
								Clear list
							</button>
						)}
					</div>
				)}
			</div>

			{todoList.length > 0 && showTodoList && (
				<div className={styles.completedTasks}>
					<p>Completed tasks: {numberOfCompletedTodos}</p>
				</div>
			)}

			{showTodoList && todoList.length > 0 && (
				<div className={styles.optionsContainer}>
					<button onClick={handleDeleteAllTodos}>Clear list</button>
					<button onClick={handleResetApp}>Reset</button>
					<button onClick={handleDeleteAllAPITodos}>Clear random tasks</button>
					<button onClick={handleDeleteAllCustomTodos}>
						Clear custom tasks
					</button>
				</div>
			)}

			{showTodoList && (
				<form className={styles.apiForm} onSubmit={fetchTodosFromAPI}>
					<div>Got no inspiration? Add some dummy todos!</div>
					<div>
						<label className={styles.apiForm__label}>
							Add (max 10):
							<input
								type='text'
								className={styles.apiForm__input}
								value={numberOfTodosToFetch}
								pattern='^[0-9\b]+$'
								required
								onChange={handleNumberOfAPITodos}
							/>
						</label>
						<button
							className={styles.apiForm__button}
							disabled={statusMessage === 'Fetching data...'}
						>
							Find tasks
						</button>
					</div>
				</form>
			)}
			{statusMessage && showTodoList && (
				<div className={styles.statusMessage}>
					<p>{statusMessage}</p>
					{statusMessage === 'Data succesfuly received!' && (
						<button onClick={handleDeleteStatusMessage}>OK</button>
					)}
				</div>
			)}
			{showInfo && (
				<div className={styles.infoModalOverlay} onClick={handleOutsideClick}>
					<div className={styles.infoModal}>
						<p>Welcome to a simple ToDo app! Here are some tips:</p>
						<ul>
							<li>
								On first app start,{' '}
								<span style={{ color: 'blue' }}>three default tasks</span> are
								always displayed. By pressing{' '}
								<span style={{ fontWeight: 'bold' }}>'Reset'</span> button app
								reverts to default state.
							</li>
							<li>
								You can add a new task by inputting value inside of a{' '}
								<span style={{ color: 'blue' }}>"What needs to be done?"</span>{' '}
								field, and then pressing Enter or clicking{' '}
								<span style={{ fontWeight: 'bold' }}>'Add'</span> button. Tasks
								added in this way are colored{' '}
								<span style={{ fontWeight: 'bold' }}>black</span>.
							</li>
							<li>
								Alternatively, you can add a random number of tasks from an{' '}
								<a href='https://dummyjson.com/'>outside source!</a> Whole
								numbers 1-10 are allowed. Tasks added in this way are colored{' '}
								<span style={{ color: 'blue' }}>blue</span>.
							</li>
							<li>
								Completed tasks are{' '}
								<span style={{ textDecoration: 'line-through' }}>
									striked-through
								</span>{' '}
								with lowered <span style={{ opacity: '50%' }}>visibility</span>.
							</li>
							<li>
								<span style={{ fontWeight: 'bold' }}>'Clear list'</span> button
								deletes all tasks.
							</li>
							<li>
								<span style={{ fontWeight: 'bold' }}>
									'Delete random tasks'
								</span>{' '}
								button deletes only random tasks added from an outside source.
							</li>
							<li>
								<span style={{ fontWeight: 'bold' }}>
									'Delete custom tasks'
								</span>{' '}
								deletes custom added tasks.
							</li>
							<li>
								<span style={{ fontWeight: 'bold' }}>'Reset'</span> button
								reverts entire app to default settings.
							</li>
							<li>
								<span style={{ textDecoration: 'underline' }}>
									App utilizes local storage, so there is no backing of data if
									you lose your local items!
								</span>{' '}
								This will be fixed in a future update.
							</li>
						</ul>
						<p>Upcoming (by priority): </p>
						<ul>
							<li>
								Authentication and backend integration (ETA: end of August,
								2024)
							</li>
							<li>Todo tracking per month (ETA: September, 2024)</li>
							<li>
								Better color palette and responsiveness (ETA: September, 2024)
							</li>
						</ul>
						<p>Additional info:</p>
						<ul>
							<li>
								Project{' '}
								<a href='https://github.com/Goran-Sacic/a-simple-todo-app.git'>
									Github page
								</a>{' '}
							</li>
							<li>
								Contact developer at:{' '}
								<a href='mailto:goran.sacic@gmail.com'>goran.sacic@gmail.com</a>
							</li>
						</ul>
						<div className={styles.infoModal__buttonContainer}>
							<button onClick={handleCloseInfo}>Close</button>
							<button
								onClick={() => {
									handleResetApp();
									handleCloseInfo();
								}}
							>
								Reset
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default TodoList;
