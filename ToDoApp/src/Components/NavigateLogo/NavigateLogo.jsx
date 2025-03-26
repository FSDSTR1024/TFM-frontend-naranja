import './NavigateLogo.css';

export const NavigateLogo = () => {
	let sound = null;

	const handleHover = (isHovered) => {
		if (isHovered) {
			if (!sound) {
				sound = new Audio('/assets/Sounds/shiny.mp3');
				sound.volume = 0.4;
				sound.play().catch((error) => {
					console.error('Error al reproducir el sonido:', error);
				});
			}
		} else {
			if (sound) {
				sound.pause();
				sound.currentTime = 0;
				sound = null;
			}
		}
	};

	return <a id="logo2" href="/home" onMouseEnter={() => handleHover(true)} onMouseLeave={() => handleHover(false)}></a>;
};
