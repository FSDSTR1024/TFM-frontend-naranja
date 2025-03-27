import { useParams, useLocation } from 'react-router-dom';
import { NavigateLogo } from '../../Components/NavigateLogo/NavigateLogo';
import { useState, useContext, useEffect } from 'react';
import { Column } from '../../Components/Column/Column';
import { GuildMembers } from '../../Components/GuildMembers/GuildMembers';
import { Profile } from '../../Components/Profile/Profile';
import { Button } from '../../Components/Button/Button';
import { GlobalContext } from '../../Context/GlobalContext';
import { KingdomsAPI } from '../../../api/kingdoms';
import { TaskPanel } from '../../Components/TaskPanel/TaskPanel';

import './Kingdom.css';

export const Kingdom = () => {
	const globalContext = useContext(GlobalContext);
	const location = useLocation();

	const { kingdomId } = useParams();
	const [kingdomInfo, setKingdomInfo] = useState(null);

	const [tasks, setTasks] = useState([]);

	const [appear, setAppear] = useState(false);
	const [taskInfoForPanel, setTaskInfoForPanel] = useState(null);

	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		const foundKingdom = globalContext.kingdomsInfo.find((kingdom) => kingdom._id === kingdomId);
		setKingdomInfo(foundKingdom);
	}, []);

	useEffect(() => {
		if (location.pathname === '/kingdom/' + kingdomId) {
			setLoaded(true);
		}
	}, [location.pathname]);

	useEffect(() => {
		if (kingdomInfo) {
			setTasks(kingdomInfo.tasks);
		}
	}, [kingdomInfo]);

	const updateGlobalContextKingdomsInfo = (updatedTasks) => {
		globalContext.setKingdomsInfo((prev) =>
			prev.map((kingdom) => {
				if (kingdom._id === kingdomId) {
					kingdom.tasks = updatedTasks;
				}
				return kingdom;
			})
		);
	};

	const moveTask = (taskId, newState) => {
		const updatedTask = tasks.find((task) => task._id === taskId);
		updatedTask.taskState = newState;

		KingdomsAPI.updateKingdomTask(kingdomId, updatedTask).then((response) => {
			if (response.status === 200) {
				updateGlobalContextKingdomsInfo(response.data.kingdom.tasks);
				setTasks((prev) => prev.map((task) => (task.id === taskId ? updatedTask : task)));
			}
		});
	};

	const handleSaveTask = (newTask) => {
		if (!newTask._id) {
			delete newTask._id;
			KingdomsAPI.updateKingdomTasks(kingdomId, [newTask, ...tasks]).then((response) => {
				if (response.status === 200) {
					updateGlobalContextKingdomsInfo(response.data.kingdom.tasks);
					setTasks(response.data.kingdom.tasks);
				}
			});
		} else {
			KingdomsAPI.updateKingdomTask(kingdomId, newTask).then((response) => {
				if (response.status === 200) {
					updateGlobalContextKingdomsInfo(response.data.kingdom.tasks);
					setTasks(response.data.kingdom.tasks);
				}
			});
		}

		setTaskInfoForPanel(null);
		setAppear(false);
	};

	const handleDeleteTask = (taskId) => {
		const filteredTasks = tasks.filter((task) => task._id !== taskId);

		KingdomsAPI.updateKingdomTasks(kingdomId, filteredTasks).then((response) => {
			if (response.status === 200) {
				updateGlobalContextKingdomsInfo(response.data.kingdom.tasks);
				setTasks(response.data.kingdom.tasks);
			}
		});

		setTaskInfoForPanel(null);
		setAppear(false);
	};

	return (
		<div id="kingdomBody">
			<NavigateLogo></NavigateLogo>

			<GuildMembers></GuildMembers>

			<Profile></Profile>

			<div id="sprintBacklog" className={loaded ? 'open' : ''}>
				<Column title="Backlog" state="backlog" tasks={tasks} moveTask={moveTask} setTaskInfoForPanel={setTaskInfoForPanel} setAppear={setAppear} loaded={loaded} delay="2.4s"></Column>

				<Button
					text=""
					backgroundImage="/assets/Sprites/addTaskButton2.png"
					backgroundImageHover="/assets/Sprites/addTaskButtonHover.png"
					backgroundImageHoverAnimation="/assets/Sprites/menuButtonHoverAnimation2.png"
					width="64px"
					height="64px"
					widthHoverAnimation="96px"
					heightHoverAnimation="96px"
					top="30%"
					left="50%"
					onClick={() => {
						setAppear(true);
					}}
				></Button>
			</div>

			<div id="columnsContainer" className={loaded ? 'open' : ''}>
				<Column title="To Do" state="todo" tasks={tasks.filter((t) => t.taskState === 'todo')} moveTask={moveTask} setTaskInfoForPanel={setTaskInfoForPanel} setAppear={setAppear} loaded={loaded} delay="1.2s" />
				<Column title="In Progress" state="inProgress" tasks={tasks.filter((t) => t.taskState === 'inProgress')} moveTask={moveTask} setTaskInfoForPanel={setTaskInfoForPanel} setAppear={setAppear} loaded={loaded} delay="1.6s" />
				<Column title="Done" state="done" tasks={tasks.filter((t) => t.taskState === 'done')} moveTask={moveTask} setTaskInfoForPanel={setTaskInfoForPanel} setAppear={setAppear} loaded={loaded} delay="2s" />
			</div>

			<TaskPanel appear={appear} setAppear={setAppear} task={taskInfoForPanel} setTaskInfoForPanel={setTaskInfoForPanel} handleSaveTask={handleSaveTask} handleDeleteTask={handleDeleteTask}></TaskPanel>
		</div>
	);
};
