import { Button } from '../Button/Button';

import './PopUp.css';

export const PopUp = ({
	openPopup,
	setOpenPopup,
	children,
	handleClick = () => {
		setOpenPopup(false);
	},
}) => {
	return (
		<div id="popupContainer" style={openPopup ? { display: 'block' } : { display: 'none' }}>
			<div id="popup" className="open">
				<h4 id="popupText">{children}</h4>
				<Button text="Close" backgroundImage="/assets/Sprites/Button_Blue_3Slides.png" top="140px" left="50%" onClick={handleClick}></Button>
			</div>
		</div>
	);
};
