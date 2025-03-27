import { useContext } from 'react';
import { GlobalContext } from '../Context/GlobalContext';

export function useSoundHandler() {
	const globalContext = useContext(GlobalContext);

	const playSound = (soundPath) => {
		const audio = new Audio(soundPath);
		audio.volume = globalContext.mute ? 0 : globalContext.volume;
		audio.play();
	};

	const muteApp = () => {
		globalContext.setMute(true);
		localStorage.setItem('mute', JSON.stringify(true));
	};

	const unmuteApp = () => {
		globalContext.setMute(false);
		localStorage.setItem('mute', JSON.stringify(false));
	};

	const changeVolume = (volume) => {
		globalContext.setVolume(volume);
		localStorage.setItem('volume', volume);
	};

	return { playSound, muteApp, unmuteApp, changeVolume };
}
