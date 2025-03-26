import { NavigateLogo } from '../NavigateLogo/NavigateLogo';

import './Quests.css';

export const Quests = () => {
	return (
		<div>
			<NavigateLogo></NavigateLogo>

			<div id="questsContainer">
				<div className="board"></div>
			</div>
		</div>
	);
};
