import './DropDown.css';
import { useState } from 'react';

export const DropDown = ({ titleAnimationEnd, setDeploy, setCanDisplay }) => {
	const [hovered, setHovered] = useState(false);
	const [pressed, setPressed] = useState(false);
	const [dropDownAnimationEnd, setDropDownAnimationEnd] = useState(false);
	const [canDoPressedAnimations, setCanDoPressedAnimations] = useState(false);

	const handleClick = () => {
		setCanDisplay(true);
		setDeploy(!pressed);
		setPressed(!pressed);
		setCanDoPressedAnimations(true);
	};

	const getBackgroundImage = () => {
		if (pressed) {
			return hovered ? "url('/assets/Sprites/red_scrollUp_pressed.png')" : "url('/assets/Sprites/red_scrollUp_regular.png')";
		}
		return hovered ? "url('/assets/Sprites/red_dropDown_pressed.png')" : "url('/assets/Sprites/red_dropDown_regular.png')";
	};

	const getAnimationDuration = () => {
		if (pressed) {
			return '0.68s';
		}

		return '0.55s';
	};

	const getAnimationName = () => {
		if (titleAnimationEnd && !dropDownAnimationEnd) {
			return 'dropDownAnimation';
		} else if (titleAnimationEnd && dropDownAnimationEnd && canDoPressedAnimations) {
			if (pressed) {
				return 'dropDownDeployAnimation';
			} else {
				return 'dropDownPickUpAnimation';
			}
		} else {
			return 'none';
		}
	};

	return (
		<div
			id="DropDown"
			style={{
				backgroundImage: getBackgroundImage(),
				animationName: getAnimationName(),
				animationDuration: getAnimationDuration(),
				display: titleAnimationEnd ? 'block' : 'none',
			}}
			onAnimationEnd={() => setDropDownAnimationEnd(true)}
			onClick={handleClick}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
		></div>
	);
};
