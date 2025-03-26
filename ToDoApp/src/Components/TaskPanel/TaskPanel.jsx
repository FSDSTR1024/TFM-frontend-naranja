import { useState, useEffect, useRef, useContext } from 'react';
import { Button } from '../Button/Button';
import { GlobalContext } from '../../Context/GlobalContext';
import { useDrag, useDrop } from 'react-dnd';
import { MouseRight } from '../../MouseRight/MouseRight';
import { PopUp } from '../../Components/PopUp/PopUp';

import './TaskPanel.css';

export const TaskPanel = ({ appear, setAppear, task = null, setTaskInfoForPanel, handleSaveTask, handleDeleteTask }) => {
	const globalContext = useContext(GlobalContext);

	const [openPopup, setOpenPopup] = useState(false);
	const [popupContent, setPopupContent] = useState(<></>);
	const [openGuildMembersPanel, setOpenGuildMembersPanel] = useState(false);
	const [members, setMembers] = useState([]);
	const [mouseRightClick, setMouseRightClick] = useState({ top: '0px', left: '0px', display: 'none' });

	const createdTaskName = useRef(null);
	const [taskOwners, setTaskOwners] = useState([]);
	const createdTaskDescription = useRef(null);
	const [points, setPoints] = useState([]);

	const [{ isDragging }, drag] = useDrag({
		type: 'OWNER',
		item: { id: globalContext.userInfo.id, profileImage: globalContext.userInfo.profileImage },
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging(),
		}),
	});

	const [{ isOver }, drop] = useDrop({
		accept: 'OWNER',
		drop: (owner) => addOwner(owner.id, owner.profileImage),
		collect: (monitor) => ({
			isOver: !!monitor.isOver(),
		}),
	});

	const pointsPositions = [
		{ src: '/assets/Sprites/addPointAnimation.gif', top: '45px', left: '70%' },
		{ src: '/assets/Sprites/addPointAnimation.gif', top: '30px', left: '70%' },
		{ src: '/assets/Sprites/addPointAnimation.gif', top: '15px', left: '70%' },
		{ src: '/assets/Sprites/addPointAnimation.gif', top: '0px', left: '70%' },
		{ src: '/assets/Sprites/addPointAnimation.gif', top: '45px', left: '87%' },
		{ src: '/assets/Sprites/addPointAnimation.gif', top: '30px', left: '87%' },
		{ src: '/assets/Sprites/addPointAnimation.gif', top: '15px', left: '87%' },
		{ src: '/assets/Sprites/addPointAnimation.gif', top: '0px', left: '87%' },
	];

	useEffect(() => {
		if (task) {
			createdTaskName.current.value = task.taskName;
			createdTaskDescription.current.value = task.taskDescription;
			setTaskOwners(task.taskOwners);
			const taskPoints = [];
			for (let i = 0; i < task.taskPoints; i++) {
				taskPoints.push(pointsPositions[i]);
			}
			setPoints(taskPoints);
		}
	}, [task]);

	useEffect(() => {
		setMembers(globalContext.membersInfo);
	}, [globalContext.membersInfo]);

	useEffect(() => {
		if (!appear) {
			createdTaskName.current.value = '';
			createdTaskDescription.current.value = '';
			setOpenGuildMembersPanel(false);
			setTaskOwners([]);
			setPoints([]);
			setTaskInfoForPanel(null);
		}
	}, [appear]);

	const addOwner = (ownerId, ownerProfileImage) => {
		if (taskOwners.find((owner) => owner.id === ownerId)) return;

		setTaskOwners((prev) => [...prev, { id: ownerId, profileImage: ownerProfileImage }]);
	};

	const handleButtonClick = (action) => {
		switch (action) {
			case 'appear':
				setAppear(true);
				break;
			case 'openAddOwnerPanel':
				setOpenGuildMembersPanel(true);
				break;
			case 'closeAddOwnerPanel':
				setOpenGuildMembersPanel(false);
				break;
			case 'addPoint':
				{
					if (points.length >= pointsPositions.length) return;

					const amounts = [1, 1, 2, 2, 4, 4];
					const amountToAdd = amounts[Math.min(points.length, amounts.length - 1)];

					const newPoints = pointsPositions.slice(points.length, points.length + amountToAdd).map((point, index) => ({ ...point, id: Date.now() + index }));

					setPoints((prev) => [...prev, ...newPoints]);
				}
				break;
			case 'removePoint':
				{
					if (points.length === 0) return;

					let amountToRemove = 1;
					if (points.length >= 4 && points.length < 8) {
						amountToRemove = 2;
					} else if (points.length >= 8) {
						amountToRemove = 4;
					}

					const updatedPoints = points.map((point, index) => {
						if (index >= points.length - amountToRemove) {
							return { ...point, src: '/assets/Sprites/quitPointAnimation.gif' };
						}
						return point;
					});

					setPoints(updatedPoints);

					setTimeout(() => {
						setPoints((prev) => prev.slice(0, -amountToRemove));
					}, 1000);
				}
				break;
			case 'save':
				if (createdTaskName.current.value === '') {
					setOpenPopup(true);
					setPopupContent('The task name is required');
				} else {
					const newTask = { taskName: createdTaskName.current.value, taskDescription: createdTaskDescription.current.value, taskOwners: taskOwners, taskPoints: points.length, taskState: task ? task.taskState : 'backlog', _id: task ? task._id : '' };
					handleSaveTask(newTask);
				}
				break;
			case 'cancel':
				setAppear(false);
				break;
		}
	};

	const handleMouseRightClick = (e, ownerId) => {
		e.preventDefault();
		setTaskOwners((prev) => prev.filter((owner) => owner.id !== ownerId));
		setMouseRightClick((prev) => ({ ...prev, display: 'none' }));
	};

	return (
		<div id="createTaskContainer" className={appear ? 'appear' : ''}>
			<div id="createTask" className={appear ? 'appear' : ''}>
				<input type="text" placeholder="Task Name" id="taskName" ref={createdTaskName} defaultValue={task ? task.taskName : ''} />
				<Button text="Add Owner" backgroundImage="/assets/Sprites/Button_Blue_3Slides.png" top="30%" left="27%" onClick={() => handleButtonClick('openAddOwnerPanel')}></Button>
				<div ref={drop} id="ownersContainer">
					<div id="owners">
						{taskOwners.map((owner) => (
							<img
								draggable={false}
								key={owner.id}
								className="memberImage"
								src={owner.profileImage ? owner.profileImage : 'https://res.cloudinary.com/guild-tasks/image/upload/v1739385954/defaultProfileImage_vzujwf.png'}
								onMouseEnter={() => setMouseRightClick((prev) => ({ ...prev, display: 'flex' }))}
								onMouseLeave={() => setMouseRightClick((prev) => ({ ...prev, display: 'none' }))}
								onMouseMove={(e) => {
									setMouseRightClick((prev) => ({
										...prev,
										top: `${e.nativeEvent.clientY - 50}px`,
										left: `${e.nativeEvent.clientX - 10}px`,
									}));
								}}
								onContextMenu={(e) => handleMouseRightClick(e, owner.id)}
							/>
						))}
					</div>
				</div>
				<div id="taskDescriptionContainer">
					<textarea ref={createdTaskDescription} type="text" placeholder="Task Description" id="taskDescription" />
				</div>
				<div id="pointsContainer">
					<Button
						text=""
						backgroundImage="/assets/Sprites/addTaskButton.png"
						backgroundImageHover="/assets/Sprites/addTaskButtonHover.png"
						backgroundImageHoverAnimation="/assets/Sprites/menuButtonHoverAnimation2.png"
						width="64px"
						height="64px"
						widthHoverAnimation="96px"
						heightHoverAnimation="96px"
						top="50%"
						left="32px"
						onClick={() => handleButtonClick('addPoint')}
					></Button>
					<Button
						text=""
						backgroundImage="/assets/Sprites/subtractButton.png"
						backgroundImageHover="/assets/Sprites/subtractButtonHover.png"
						backgroundImageHoverAnimation="/assets/Sprites/menuButtonHoverAnimation2.png"
						width="64px"
						height="64px"
						widthHoverAnimation="96px"
						heightHoverAnimation="96px"
						top="50%"
						left="128px"
						onClick={() => handleButtonClick('removePoint')}
					></Button>
					<h3 style={{ position: 'absolute', top: '50%', left: '40%', transform: 'translateY(-50%)' }}>Points:</h3>
					{points.map((point, index) => (
						<img key={index} src={`${point.src}?t=${point.id}`} style={{ position: 'absolute', top: `${point.top}`, left: `${point.left}` }} />
					))}
				</div>
				<Button
					text=""
					backgroundImage="/assets/Sprites/saveButton.png"
					backgroundImageHover="/assets/Sprites/saveButtonHover.png"
					backgroundImageHoverAnimation="/assets/Sprites/menuButtonHoverAnimation2.png"
					width="64px"
					height="64px"
					widthHoverAnimation="96px"
					heightHoverAnimation="96px"
					top="40px"
					left="30px"
					onClick={() => handleButtonClick('save')}
				></Button>
				<Button
					text=""
					backgroundImage="/assets/Sprites/cancelButton.png"
					backgroundImageHover="/assets/Sprites/cancelButtonHover.png"
					backgroundImageHoverAnimation="/assets/Sprites/menuButtonHoverAnimation2.png"
					width="64px"
					height="64px"
					widthHoverAnimation="96px"
					heightHoverAnimation="96px"
					top="40px"
					left="590px"
					onClick={() => handleButtonClick('cancel')}
				></Button>
			</div>

			<div id="ownersPanelContainer" className={openGuildMembersPanel ? 'open' : ''}>
				<div id="ownersPanel">
					{members.map((member, index) => (
						<div key={index} ref={drag} className="member">
							<img className="memberImage" src={member.profileImage ? member.profileImage : 'https://res.cloudinary.com/guild-tasks/image/upload/v1739385954/defaultProfileImage_vzujwf.png'} />
							<div className="memberName">{member.username}</div>
						</div>
					))}
				</div>
				<Button
					text=""
					backgroundImage="/assets/Sprites/cancelButton.png"
					backgroundImageHover="/assets/Sprites/cancelButtonHover.png"
					backgroundImageHoverAnimation="/assets/Sprites/menuButtonHoverAnimation2.png"
					width="64px"
					height="64px"
					widthHoverAnimation="96px"
					heightHoverAnimation="96px"
					top="10px"
					left="98%"
					onClick={() => handleButtonClick('closeAddOwnerPanel')}
				></Button>
			</div>

			{task ? <Button text="Delete" backgroundImage="/assets/Sprites/Button_Red_3Slides.png" top="90%" left="90%" onClick={() => handleDeleteTask(task._id)}></Button> : ''}

			<MouseRight mouseRightClick={mouseRightClick} text={'DELETE'}></MouseRight>

			<PopUp openPopup={openPopup} setOpenPopup={setOpenPopup}>
				{popupContent}
			</PopUp>
		</div>
	);
};
