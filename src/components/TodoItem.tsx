import styles from './TodoItem.module.css';
import { Task } from '../App';
import { useState, useEffect } from 'react';

interface TodoItemProps {
	todo: Task;
	toggleCompleted: () => void | null;
	handleDeleteTodo: () => void | null;
	editTodo: (newTodo: string, id: string | number) => void | null;
}

const TodoItem = ({
	todo,
	toggleCompleted,
	handleDeleteTodo,
	editTodo,
}: TodoItemProps) => {
	const [editing, setEditing] = useState<boolean>(false);
	const [newTodoName, setNewTodoName] = useState<string>(todo.todo);

	useEffect(() => {
		setNewTodoName(todo.todo);
	}, [todo.todo]);

	const handleEditing = () => {
		setEditing(!editing);
	};

	const handleEditingDone = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			if (newTodoName.trim()) {
				editTodo(newTodoName.trim(), todo.id);
			}
			setEditing(false);
		}
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setNewTodoName(event.target.value);
	};

	const handleBlur = () => {
		if (editing) {
			if (newTodoName.trim()) {
				editTodo(newTodoName.trim(), todo.id);
			}
			setEditing(false);
		}
	};

	/* return (
		<div className={styles.todoItem}>
			<div className={styles.checkboxAndTodo}>
				<button className={styles.todoButton} onClick={() => toggleCompleted()}>
					{todo.completed ? '✔' : ''}
				</button>

				{!editing && (
					<li
						className={`${todo.completed ? styles.todoCompleted : ''} ${todo.userId !== undefined ? styles.todoFromAPI : ''}`}
					>
						{todo.todo}
					</li>
				)}
				{editing && (
					<input
						type='text'
						value={newTodoName}
						className={`${styles.editTodo} ${todo.userId !== undefined ? styles.todoFromAPI : ''}`}
						onChange={handleChange}
						onKeyDown={handleEditingDone}
						onBlur={handleBlur}
						autoFocus
					/>
				)}
			</div>
			<div className={styles.buttonContainer}>
				<button
					className={`${styles.editButton} ${todo.completed ? styles.editCompleted : ''} `}
					disabled={todo.completed}
					onClick={handleEditing}
				></button>
				<button
					className={styles.deleteButton}
					onClick={() => handleDeleteTodo()}
				></button>
			</div>
		</div>
	); */
	return (
		<div className={styles['todo-item']}>
			<div className={styles['todo-item__content']}>
				<button
					className={styles['todo-item__checkbox']}
					onClick={() => toggleCompleted()}
				>
					{todo.completed ? '✔' : ''}
				</button>

				{!editing && (
					<li
						className={`${styles['todo-item__text']} ${
							todo.completed ? styles['todo-item__text--completed'] : ''
						} ${
							todo.userId !== undefined
								? styles['todo-item__text--from-api']
								: ''
						}`}
					>
						{todo.todo}
					</li>
				)}
				{editing && (
					<input
						type='text'
						value={newTodoName}
						className={`${styles['todo-item__edit-input']} ${
							todo.userId !== undefined
								? styles['todo-item__text--from-api']
								: ''
						}`}
						onChange={handleChange}
						onKeyDown={handleEditingDone}
						onBlur={handleBlur}
						autoFocus
					/>
				)}
			</div>
			<div className={styles['todo-item__button-container']}>
				<button
					className={`${styles['todo-item__edit-button']} ${
						todo.completed ? styles['todo-item__edit-button--completed'] : ''
					}`}
					disabled={todo.completed}
					onClick={handleEditing}
				></button>
				<button
					className={styles['todo-item__delete-button']}
					onClick={() => handleDeleteTodo()}
				></button>
			</div>
		</div>
	);
};

export default TodoItem;
