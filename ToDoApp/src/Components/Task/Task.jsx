import { useDrag } from 'react-dnd';

import './Task.css';

export const Task = ({ task, baseColor, setTaskInfoForPanel, setAppear }) => {
	const [{ isDragging }, drag] = useDrag({
		type: 'TASK',
		item: { id: task._id },
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging(),
		}),
	});

	return (
		<div ref={drag} className="task">
			<p
				className="taskText"
				style={{ opacity: isDragging ? 0.5 : 1, color: baseColor, borderColor: baseColor }}
				onClick={() => {
					setTaskInfoForPanel(task);
					setAppear(true);
				}}
			>
				{task.taskName}
			</p>
		</div>
	);
};
