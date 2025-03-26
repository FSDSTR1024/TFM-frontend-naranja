import { Button } from '../Button/Button';
import { useNavigate } from 'react-router-dom';

import './Menu.css';

export const Menu = ({ titleAnimationEnd, setCanEdit }) => {
	const navigate = useNavigate();
	const buttons = [
		{ name: 'MAP', link: '/map', backgroundImage: '/assets/Sprites/Button_Blue_3Slides.png', top: '60%', left: '25%' },
		{ name: 'CHAT', link: '/chat', backgroundImage: '/assets/Sprites/Button_Green_3Slides.png', top: '60%', left: '50%' },
		{ name: 'EDIT MAP', link: '', backgroundImage: '/assets/Sprites/Button_Purple_3Slides.png', top: '60%', left: '75%' },
	];

	const handleButtonClick = (link) => {
		if (link === '') setCanEdit(true);
		else navigate(link);
	};

	return (
		<div id="menuContainer" className={`${titleAnimationEnd ? 'open' : ''}`}>
			{buttons.map((button) => (
				<Button key={button.name} text={button.name} backgroundImage={button.backgroundImage} top={button.top} left={button.left} onClick={() => handleButtonClick(button.link)}></Button>
			))}
		</div>
	);
};
