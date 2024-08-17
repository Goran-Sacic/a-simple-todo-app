import styles from './DeletedTodoItem.module.css';
import { Task } from '../App';

interface DeletedTodoItemProps {
	todo: Task;
	returnTodoToTodoList: () => void | null;
}

const DeletedTodoItem = ({
	todo,
	returnTodoToTodoList,
}: DeletedTodoItemProps) => {
	return (
		<div className={styles.todoItem}>
			<div className={styles.todoItem__content}>
				<li
					className={`${styles.todoItem__text} ${
						todo.completed ? styles['todoItem__text--completed'] : ''
					} ${todo.userId !== undefined ? styles['todoItem__text--fromAPI'] : ''}`}
				>
					{todo.todo}
				</li>
			</div>
			<div className={styles.todoItem__actions}>
				<button
					className={styles.todoItem__undoButton}
					onClick={() => returnTodoToTodoList()}
				></button>
			</div>
		</div>
	);
};

export default DeletedTodoItem;
