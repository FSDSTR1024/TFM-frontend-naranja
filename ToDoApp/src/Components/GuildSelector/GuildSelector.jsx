import { useState } from 'react';
import { InfoPanel } from '../InfoPanel/InfoPanel';
import { useSoundHandler } from '../../Utils/SoundHandler';

import './GuildSelector.css';

export const GuildSelector = () => {
	// Control de animaciones
	const [swordContainerAnimation, setSwordContainerAnimation] = useState('expand 0.7s ease 1 forwards');
	const [swordContainerAnimationIterations, setSwordContainerAnimationIterations] = useState(0);
	const [sword1Animation, setSword1Animation] = useState('swordAnimationLeftRight 1s ease 1 forwards');
	const [sword2Animation, setSword2Animation] = useState('swordAnimationRightLeft 1s ease 1 forwards');
	const [sword3Animation, setSword3Animation] = useState('swordAnimationLeftRight 1s ease 1 forwards');
	const [lastSwordHovered, setLastSwordHovered] = useState({ id: '', functionToCall: '' });
	const [openInfoPanel, setOpenInfoPanel] = useState(false);
	const [infoPanelPosition, setInfoPanelPosition] = useState({});
	const [swordClicked, setSwordClicked] = useState(false);
	const [displaySword, setDisplaySword] = useState(false);
	const { playSound } = useSoundHandler();

	const handleSwordContainerAnimationEnd = (e) => {
		if (e.target.id !== 'swordContainer') return;
		if (swordContainerAnimationIterations === 0) {
			setSwordContainerAnimation('rotate 1s ease forwards');
			setDisplaySword(true);
		}
		setSwordContainerAnimationIterations(swordContainerAnimationIterations + 1);
	};

	const handleMouseEnter = (e, functionToCall) => {
		if (swordContainerAnimationIterations > 1) {
			const target = e.target;
			let swordAnimation = '';
			switch (target.id) {
				case 'sword1':
				case 'sword3':
					swordAnimation = 'swordBounceAnimationLeftRight 1s ease infinite';
					setInfoPanelPosition({ right: '300px' });
					break;
				case 'sword2':
					swordAnimation = 'swordBounceAnimationRightLeft 1s ease infinite';
					setInfoPanelPosition({ left: '300px' });
					break;
			}

			const soundPath = '/assets/Sounds/MenuSelection.wav';
			playSound(soundPath);

			if (lastSwordHovered.id !== '' && lastSwordHovered.id !== target.id) {
				setSwordClicked(false);
				lastSwordHovered.functionToCall('none');
			}
			setLastSwordHovered({ id: target.id, functionToCall: functionToCall });
			setOpenInfoPanel(true);
			functionToCall(swordAnimation);
		}
	};

	const handleMouseLeave = (e, functionToCall) => {
		if (swordContainerAnimationIterations > 1) {
			const target = e.target;
			target.style.left = '-75px';
			if (!swordClicked) {
				setOpenInfoPanel(false);
				functionToCall('none');
			}
		}
	};

	const handleClick = () => {
		if (swordContainerAnimationIterations > 1) {
			setSwordClicked(true);
		}
	};

	return (
		<div>
			<div id="swordContainer" style={{ animation: swordContainerAnimation }} onAnimationEnd={(e) => handleSwordContainerAnimationEnd(e)}>
				<div className="sword" id="sword1" style={{ display: displaySword ? 'flex' : 'none', animation: sword1Animation }} onMouseEnter={(e) => handleMouseEnter(e, setSword1Animation)} onMouseLeave={(e) => handleMouseLeave(e, setSword1Animation)} onClick={() => handleClick()}></div>
				<div className="sword" id="sword2" style={{ display: displaySword ? 'flex' : 'none', animation: sword2Animation }} onMouseEnter={(e) => handleMouseEnter(e, setSword2Animation)} onMouseLeave={(e) => handleMouseLeave(e, setSword2Animation)} onClick={() => handleClick()}></div>
				<div className="sword" id="sword3" style={{ display: displaySword ? 'flex' : 'none', animation: sword3Animation }} onMouseEnter={(e) => handleMouseEnter(e, setSword3Animation)} onMouseLeave={(e) => handleMouseLeave(e, setSword3Animation)} onClick={() => handleClick()}></div>
			</div>
			<InfoPanel openInfoPanel={openInfoPanel} infoPanelPosition={infoPanelPosition} id={lastSwordHovered.id}></InfoPanel>
		</div>
	);
};
