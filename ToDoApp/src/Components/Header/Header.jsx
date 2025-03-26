import { DropDown } from '../Drop-down/DropDown';
import { useState } from 'react';
import { useRef } from 'react';
import './Header.css';

export const Header = ({ titleAnimationEnd }) => {
	const [deploy, setDeploy] = useState(false);
	const [canDisplay, setCanDisplay] = useState(false);
	const soundRef = useRef(null);
	const buttons = [
		{ name: 'MAP', link: '/map' },
		{ name: 'GUILD', link: '/guild' },
		{ name: 'GUILD BOARD', link: '/guildboard' },
	];

	const sounds = {
		deploy: 'deploy',
		menuButtonHover: 'menuButtonHover',
	};

	const handleSound = (actionSound) => {
		switch (actionSound) {
			case 'deploy':
				if (soundRef.current) {
					let sound = deploy ? '/assets/Sounds/leather_inventory.wav' : '/assets/Sounds/cloth-inventory.wav';
					soundRef.current.src = sound;
					soundRef.current.volume = 0.4;
					soundRef.current.play();
				}
				break;
			case 'menuButtonHover':
				if (soundRef.current) {
					let sound = '/assets/Sounds/MenuSelection.wav';
					soundRef.current.src = sound;
					soundRef.current.volume = 1;
					soundRef.current.play();
				}
		}
	};

	const handleMouseEnter = (event) => {
		const target = event.target;
		target.childNodes[1].style.display = 'block';
		handleSound(sounds.menuButtonHover);
	};

	const handleMouseLeave = (event) => {
		const target = event.target;
		target.style.display = 'none';
	};

	const handleAnimationStart = (actionSound, event) => {
		if (event.target.id === 'headerContainer') {
			handleSound(actionSound);
		}
	};

	return (
		<div className="d-flex justify-content-center position-relative">
			<div id="headerContainer" style={{ animationName: deploy ? 'headerDeployAnimation' : 'headerPickUpAnimation', display: titleAnimationEnd && canDisplay ? 'block' : 'none' }} onAnimationStart={(event) => handleAnimationStart(sounds.deploy, event)}>
				<div id="headerButtonsContainer">
					{buttons.map((button, index) => (
						<a key={index} className="headerButton" href={button.link} onMouseEnter={(event) => handleMouseEnter(event)}>
							{button.name}
							<div className="menuButtonHover" onMouseLeave={(event) => handleMouseLeave(event)}></div>
						</a>
					))}
				</div>
			</div>
			<DropDown titleAnimationEnd={titleAnimationEnd} setDeploy={setDeploy} setCanDisplay={setCanDisplay}></DropDown>
			<audio ref={soundRef}></audio>
		</div>
	);
};
