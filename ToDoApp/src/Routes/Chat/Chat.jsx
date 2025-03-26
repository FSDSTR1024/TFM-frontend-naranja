import { useState, useEffect, useRef, useContext } from 'react';
import { Button } from '../../Components/Button/Button';
import { NavigateLogo } from '../../Components/NavigateLogo/NavigateLogo';
import { Profile } from '../../Components/Profile/Profile';
import { GuildMembers } from '../../Components/GuildMembers/GuildMembers';
import { GlobalContext } from '../../Context/GlobalContext';

import './Chat.css';

export const Chat = () => {
	const inputRef = useRef(null);
	const [messages, setMessages] = useState([]);
	const messagesEndRef = useRef(null);
	const globalContext = useContext(GlobalContext);

	useEffect(() => {
		setMessages(globalContext.guildInfo.chat);
	}, []);

	useEffect(() => {
		if (globalContext.guildInfo) {
			setMessages(globalContext.guildInfo.chat);
		}
	}, [globalContext.guildInfo.chat]);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	const handleButtonClick = () => {
		const message = inputRef.current.value;
		if (message.trim() !== '') {
			globalContext.socketRef.current.emit('message', {
				guildname: globalContext.guildInfo.guildname,
				msg: message,
				profileImage: globalContext.userInfo.profileImage ? globalContext.userInfo.profileImage : 'https://res.cloudinary.com/guild-tasks/image/upload/v1739385954/defaultProfileImage_vzujwf.png',
			});
			inputRef.current.value = '';
		}
	};

	return (
		<div>
			<NavigateLogo></NavigateLogo>
			<Profile></Profile>
			<GuildMembers></GuildMembers>

			<div id="chatContainer">
				<div id="messagesContainer">
					{messages.map((item, index) => {
						return (
							<div key={index} className="messageContainer">
								<img className="memberImage" src={item.profileImage} />
								<div className="message">{item.message}</div>
							</div>
						);
					})}
					<div ref={messagesEndRef} />
				</div>

				<div id="inputContainer">
					<input id="input" type="text" placeholder="Escribe un mensaje..." ref={inputRef}></input>
					<Button
						text=""
						backgroundImage="/assets/Sprites/sendButton.png"
						backgroundImageHover="/assets/Sprites/sendButtonHover.png"
						backgroundImageHoverAnimation="/assets/Sprites/menuButtonHoverAnimation2.png"
						width="64px"
						height="64px"
						widthHoverAnimation="96px"
						heightHoverAnimation="96px"
						top="55%"
						left="95%"
						onClick={() => handleButtonClick()}
					></Button>
				</div>
			</div>
		</div>
	);
};
