import { useState, useContext } from 'react';
import { GlobalContext } from '../../Context/GlobalContext';
import { useSoundHandler } from '../../Utils/SoundHandler';

import './VolumeSlider.css';

export const VolumeSlider = () => {
	const globalContext = useContext(GlobalContext);
	const [volume, setVolume] = useState(parseFloat(globalContext.volume));
	const { changeVolume } = useSoundHandler();

	const handleVolumeChange = (event) => {
		changeVolume(event.target.value);
		setVolume(event.target.value);
	};

	const volumePercentage = (volume * 100).toFixed(0);

	return (
		<div id="volumeSliderContainer">
			<input
				type="range"
				id="volumeSlider"
				min="0"
				max="1"
				step="0.01"
				value={volume}
				onChange={handleVolumeChange}
				style={{
					background: `linear-gradient(to right, RGB(140, 195, 196) ${volumePercentage}%, RGB(22, 28, 46) ${volumePercentage}%)`,
				}}
			/>
			<span id="volumeValue">{(volume * 100).toFixed(0)}%</span>
		</div>
	);
};
