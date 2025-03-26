import { Button } from '../Button/Button';
import { GlobalContext } from '../../Context/GlobalContext';
import { useState, useEffect, useContext } from 'react';

import './GuildMembers.css';

export const GuildMembers = () => {
	const [openGuildMembersPanel, setOpenGuildMembersPanel] = useState(false);
	const [members, setMembers] = useState([]);
	const globalContext = useContext(GlobalContext);

	useEffect(() => {
		setMembers(globalContext.membersInfo);
	}, [globalContext.membersInfo]);

	const handleButtonClick = () => {
		setOpenGuildMembersPanel(!openGuildMembersPanel);
	};

	return (
		<div>
			<Button
				text=""
				backgroundImage="/assets/Sprites/membersButton.png"
				backgroundImageHover="/assets/Sprites/membersButtonHover.png"
				backgroundImageHoverAnimation="/assets/Sprites/menuButtonHoverAnimation2.png"
				width="64px"
				height="64px"
				widthHoverAnimation="96px"
				heightHoverAnimation="96px"
				top="95%"
				left="50px"
				onClick={() => handleButtonClick()}
			></Button>

			<div id="guildMembersPanel" className={openGuildMembersPanel ? 'open' : ''}>
				{members.map((member, index) => (
					<div key={index} className="member">
						<img className="memberImage" src={member.profileImage ? member.profileImage : 'https://res.cloudinary.com/guild-tasks/image/upload/v1739385954/defaultProfileImage_vzujwf.png'} />
						<span className={member.connect ? 'online' : 'offline'}></span>
						<div className="memberName">{member.username}</div>
					</div>
				))}
			</div>
		</div>
	);
};
