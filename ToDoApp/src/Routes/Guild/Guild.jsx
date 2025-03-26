import { GuildSelector } from '../../Components/GuildSelector/GuildSelector';
import { Profile } from '../../Components/Profile/Profile';

import './Guild.css';

export const Guild = () => {
	return (
		<div id="guildContainer">
			<GuildSelector></GuildSelector>
			<Profile></Profile>
		</div>
	);
};
