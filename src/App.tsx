import TodoList from './components/TodoList';
import styles from './App.module.css';
import { useState } from 'react';

export interface Task {
	id: string;
	todo: string;
	completed: boolean;
	userId?: number | null;
}

function App() {
	const [scrollBarVisible, setScrollBarVisible] = useState<boolean>(false);

	const handleScrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const handleScrollToBottom = () => {
		window.scrollTo({
			top: document.documentElement.scrollHeight,
			behavior: 'smooth',
		});
	};

	const handleScrollBarVisible = (yOffset: boolean) => {
		setScrollBarVisible(yOffset);
	};

	return (
		<>
			{scrollBarVisible && (
				<div className={styles.scrollButtons}>
					<button
						className={styles['scrollButtons__button--top']}
						onClick={handleScrollToTop}
					></button>
					<button
						className={styles['scrollButtons__button--bottom']}
						onClick={handleScrollToBottom}
					></button>
				</div>
			)}
			<TodoList handleScrollBarVisible={handleScrollBarVisible} />
		</>
	);
}

export default App;
