import { v4 as uuidv4 } from 'uuid';

export interface Task {
	id: string;
	todo: string;
	completed: boolean;
	userId?: number | null;
}

const dummyTodos = [
	{
		id: Math.random() * 1000,
		todo: 'Take vitamins',
		completed: false,
		userId: 9999,
	},
	{ id: uuidv4(), todo: 'Wash clothes', completed: true },
	{ id: uuidv4(), todo: 'Go to gym', completed: false },
];

const PlaceInitialTodosInLocalStorage = () => {
	const storedTodos = localStorage.getItem('todoer-todos');
	if (!storedTodos || JSON.parse(storedTodos).length === 0) {
		localStorage.setItem('todoer-todos', JSON.stringify(dummyTodos));
		/* localStorage.removeItem('todoer-deletedtodos'); */
	} else return;
};

export { PlaceInitialTodosInLocalStorage };
