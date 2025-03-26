import { useState, useContext, useEffect } from 'react';
import { Profile } from '../../Components/Profile/Profile';
import { GuildMembers } from '../../Components/GuildMembers/GuildMembers';
import { GlobalContext } from '../../Context/GlobalContext';
import { Menu } from '../../Components/Menu/Menu';
import { TileMap } from '../../Components/TileMap/TileMap';
import { TileResourcesContainer } from '../../Components/TileResourcesContainer/TileResourcesContainer';

import './Home.css';

export const Home = () => {
	const globalContext = useContext(GlobalContext);
	const [isAnimated, setIsAnimated] = useState(false);
	const [titleAnimationEnd, setTitleAnimationEnd] = useState(false);
	const [canEdit, setCanEdit] = useState(false);

	useEffect(() => {
		setIsAnimated(true);
	}, []);

	const handleAnimationEnd = () => {
		setTitleAnimationEnd(true);
	};

	return (
		<div id="homeContainer">
			<div id="TitleContainer" style={isAnimated ? { animationName: 'titleAnimation' } : { animationName: 'none' }} onAnimationEnd={handleAnimationEnd}>
				<h1 id="Title" style={isAnimated ? { animationName: 'titleTextAnimation' } : { animationName: 'none' }}>
					{globalContext.guildInfo.guildname.toUpperCase()}
				</h1>
			</div>

			<Menu titleAnimationEnd={titleAnimationEnd} setCanEdit={setCanEdit}></Menu>

			<TileMap canEdit={canEdit} setCanEdit={setCanEdit} />

			<TileResourcesContainer canEdit={canEdit}></TileResourcesContainer>

			<Profile></Profile>

			<GuildMembers></GuildMembers>
		</div>
	);
};
