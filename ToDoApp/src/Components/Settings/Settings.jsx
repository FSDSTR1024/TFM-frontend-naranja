import { GlobalContext } from '../../Context/GlobalContext';
import { useSoundHandler } from '../../Utils/SoundHandler';
import { VolumeSlider } from '../VolumeSlider/VolumeSlider';
import { useState, useContext } from 'react';
import { Button } from '../Button/Button';

import './Settings.css';

export const Settings = () => {
	const globalContext = useContext(GlobalContext);
	const [soundButtonImage, setSoundButtonImage] = useState({
		mute: globalContext.mute,
		backgroundImage: globalContext.mute ? '/assets/Sprites/muteButton.png' : '/assets/Sprites/soundButton.png',
		backgroundImageHover: globalContext.mute ? '/assets/Sprites/muteButtonHover.png' : '/assets/Sprites/soundButtonHover.png',
	});
	const { muteApp, unmuteApp } = useSoundHandler();

	const handleSoundButtonClick = (e) => {
		e.target.parentElement.style.backgroundImage = soundButtonImage.mute ? 'url(/assets/Sprites/soundButtonHover.png)' : 'url(/assets/Sprites/muteButtonHover.png)';
		setSoundButtonImage({ mute: !soundButtonImage.mute, backgroundImage: soundButtonImage.mute ? '/assets/Sprites/soundButton.png' : '/assets/Sprites/muteButton.png', backgroundImageHover: soundButtonImage.mute ? '/assets/Sprites/soundButtonHover.png' : '/assets/Sprites/muteButtonHover.png' });
		soundButtonImage.mute ? unmuteApp() : muteApp();
	};

	return (
		<div id="settingsContainer">
			<Button
				text=""
				backgroundImage={soundButtonImage.backgroundImage}
				backgroundImageHover={soundButtonImage.backgroundImageHover}
				backgroundImageHoverAnimation="/assets/Sprites/menuButtonHoverAnimation2.png"
				width="64px"
				height="64px"
				widthHoverAnimation="96px"
				heightHoverAnimation="96px"
				top="45px"
				left="50%"
				onClick={(e) => handleSoundButtonClick(e)}
			></Button>

			<VolumeSlider />
		</div>
	);
};
