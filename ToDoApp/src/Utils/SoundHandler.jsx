import { useRef, useContext } from 'react';
import { GlobalContext } from '../Context/GlobalContext';

export function useSoundHandler() {
	const globalContext = useContext(GlobalContext);
	const soundRef = useRef(new Audio()); // Referencia para el audio

	const playSound = (soundPath) => {
		if (soundRef.current) {
			soundRef.current.pause();
			soundRef.current.currentTime = 0;
			soundRef.current.src = soundPath;
			soundRef.current.volume = globalContext.mute ? 0 : globalContext.volume;
			soundRef.current.play();
		}
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

	return { playSound, muteApp, unmuteApp, changeVolume, soundRef };
}
