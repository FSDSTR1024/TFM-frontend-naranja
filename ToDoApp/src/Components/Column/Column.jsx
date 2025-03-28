import { useDrop } from 'react-dnd';
import { Task } from '../Task/Task';

import './Column.css';

export const Column = ({ title, state, tasks, moveTask, setTaskInfoForPanel, setAppear, loaded, delay }) => {
	const color = state === 'todo' ? 'RGB(56, 126, 148)' : state === 'inProgress' ? 'RGB(180, 169, 69)' : state === 'done' ? 'RGB(121, 168, 99)' : 'RGB(213, 134, 98)';

	const [{ isOver }, drop] = useDrop({
		accept: 'TASK',
		drop: (task) => moveTask(task.id, state),
		collect: (monitor) => ({
			isOver: !!monitor.isOver(),
		}),
	});

	return (
		<div ref={drop} className={`column ${loaded ? 'open' : ''}`} style={{ transition: loaded ? `transform 0.3s ease-in ${delay}` : '' }}>
			<h2 className="columnTitle" style={{ color: color, borderColor: color }}>
				{title}
			</h2>
			<div className={state !== 'backlog' ? 'tasksContainer' : 'backlogTasksContainer'}>
				{tasks.map((task) => (
					<Task key={task._id} task={task} baseColor={color} setTaskInfoForPanel={setTaskInfoForPanel} setAppear={setAppear}></Task>
				))}
			</div>
		</div>
	);
};
