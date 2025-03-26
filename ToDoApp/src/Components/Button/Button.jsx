import { useState } from 'react';
import { useSoundHandler } from '../../Utils/SoundHandler';

import './Button.css';

export const Button = ({
	text = '',
	backgroundImage = '/assets/Sprites/Button_Blue_3Slides.png',
	backgroundImageHover = '/assets/Sprites/Button_Hover_3Slides.png',
	backgroundImageHoverAnimation = '/assets/Sprites/menuButtonHoverAnimation.png',
	width = '178px',
	height = '56px',
	widthHoverAnimation = '256px',
	heightHoverAnimation = '128px',
	top = 'none',
	left = 'none',
	right = 'none',
	onClick,
}) => {
	const [backgroundImageButton, setBackgroundImageButton] = useState(backgroundImage);
	const { playSound } = useSoundHandler();

	const handleHover = (e, isHovered) => {
		const target = e.target;
		let buttonH = target;
		let display = 'none';
		let backgroundImageButton = backgroundImage;

		if (isHovered) {
			buttonH = target.childNodes[0];
			display = 'block';
			const soundPath = '/assets/Sounds/MenuSelection.wav';
			playSound(soundPath);
			backgroundImageButton = backgroundImageHover;
		}

		setBackgroundImageButton(backgroundImageButton);
		buttonH.style.display = display;
	};

	return (
		<div>
			<button className="Button" style={{ backgroundImage: `url(${backgroundImageButton})`, width: width, height: height, top: top, left: left, right: right }} onMouseEnter={(e) => handleHover(e, true)}>
				<div id="buttonHover" style={{ backgroundImage: `url(${backgroundImageHoverAnimation})`, width: widthHoverAnimation, height: heightHoverAnimation }} onMouseLeave={(e) => handleHover(e, false)} onClick={onClick}></div>
				{text}
			</button>
		</div>
	);
};
