import { GlobalContext } from '../../Context/GlobalContext';
import { useNavigate } from 'react-router-dom';
import { useContext, useRef, useState, useEffect } from 'react';
import { Button } from '../Button/Button';
import { UserAPI } from '../../../api/user';
import { GuildsAPI } from '../../../api/guilds';
import { KingdomsAPI } from '../../../api/kingdoms';
import { PopUp } from '../PopUp/PopUp';

import './InfoPanel.css';

export const InfoPanel = ({ openInfoPanel, infoPanelPosition, id }) => {
	const globalContext = useContext(GlobalContext);
	const newGuildName = useRef(null);
	const guildSearchedName = useRef(null);
	const [guildFound, setGuildFound] = useState(<></>);
	const [openPopup, setOpenPopup] = useState(false);
	const [popupContent, setPopupContent] = useState(<></>);
	const navigate = useNavigate();

	const getJoinPanelGuilds = () => {
		if (globalContext.userInfo.guilds.length === 0) {
			return (
				<div>
					<h4 className="infoPanelHeader">You are not in any guild</h4>
					<img src="/assets/Sprites/sadKnight.png"></img>
				</div>
			);
		}

		return (
			<ul className="guildList">
				{globalContext.userInfo.guilds.map((guild) => {
					return (
						<li
							className="guildItem"
							key={guild}
							onClick={() => {
								GuildsAPI.getSearchedGuild(guild, true).then((response) => {
									if (response.status === 200) {
										const guildInfo = { guildname: response.data.guildname, tilemap: response.data.tilemap, userIds: response.data.userIds, chat: response.data.chat };
										const kingdomIds = response.data.kingdomIds;
										UserAPI.getMembersInfo(response.data.userIds).then((response) => {
											if (response.status === 200) {
												globalContext.updateMembers(response.data.membersInfo);
												globalContext.setGuildInfo(guildInfo);
												KingdomsAPI.getKingdoms(kingdomIds).then((response) => {
													if (response.status === 200) {
														globalContext.setKingdomsInfo(response.data.kingdoms);
														navigate(`/home`);
													}
												});
											}
										});
									}
								});
							}}
						>
							<h3 className="guildName">{guild}</h3>
						</li>
					);
				})}
			</ul>
		);
	};

	const handleClick = (action) => {
		switch (action) {
			case 'create':
				setOpenPopup(true);

				if (newGuildName.current.value === '') {
					setPopupContent('Guild name cannot be empty');
				} else {
					GuildsAPI.registerGuild(newGuildName.current.value, globalContext.userInfo.id)
						.then((response) => {
							if (response.status === 201) {
								UserAPI.registerGuildInUser(newGuildName.current.value, globalContext.userInfo.id).then((response) => {
									if (response.status === 200) {
										globalContext.setUserInfo({ ...globalContext.userInfo, guilds: response.data.guilds });
										setPopupContent('Guild added to JOIN');
									}
								});
							}
						})
						.catch((error) => {
							if (error.response.status === 400) {
								setPopupContent('Guild already exists');
							}
						});
				}
				break;
			case 'search':
				GuildsAPI.getSearchedGuild(guildSearchedName.current.value)
					.then((response) => {
						if (response.status === 200) {
							setGuildFound(
								<div className="guildSearched">
									<div className="guildItem" key={response.data.guildname} onClick={() => handleClick('joinToSearched')}>
										<h3 className="guildName">{response.data.guildname}</h3>
									</div>
								</div>
							);
						}
					})
					.catch((error) => {
						if (error.response.status === 404) {
							setGuildFound(
								<div className="guildSearched">
									<h4 className="infoPanelHeader">Guild Not Found</h4>
								</div>
							);
						}
					});
				break;
			case 'joinToSearched':
				setOpenPopup(true);

				if (globalContext.userInfo.guilds.includes(guildSearchedName.current.value)) {
					setPopupContent('You are already in this guild');
				} else {
					GuildsAPI.registerUserInGuild(guildSearchedName.current.value, globalContext.userInfo.id).then((response) => {
						if (response.status === 200) {
							globalContext.userRegisterInGuild(guildSearchedName.current.value);
							UserAPI.registerGuildInUser(guildSearchedName.current.value, globalContext.userInfo.id).then((response) => {
								if (response.status === 200) {
									globalContext.setUserInfo({ ...globalContext.userInfo, guilds: response.data.guilds });
									setPopupContent('Guild added to JOIN');
								}
							});
						}
					});
				}
				break;
		}
	};

	const infoPanelContent = () => {
		switch (id) {
			case 'sword1':
				return (
					<div>
						<h4 className="infoPanelHeader">JOIN A GUILD YOU BELONG TO</h4>
						{getJoinPanelGuilds()}
					</div>
				);
			case 'sword2':
				return (
					<div>
						<h4 className="infoPanelHeader">CREATE A NEW GUILD</h4>
						<input className="infoPanelInput" type="text" style={{ top: '120px' }} placeholder="Create Guild" ref={newGuildName} maxLength={16} />
						<div className="infoPanelImagesContainer">
							<div id="construction"></div>
							<div id="carry"></div>
						</div>
						<Button text="Create" backgroundImage="/assets/Sprites/Button_Blue_3Slides.png" top="300px" left="50%" onClick={() => handleClick('create')}></Button>
					</div>
				);
			case 'sword3':
				return (
					<div>
						<h4 className="infoPanelHeader">JOIN A NEW GUILD</h4>
						<input className="infoPanelInput" type="text" placeholder="Search Guild" ref={guildSearchedName} maxLength={16} />
						<button className="Loupe" onClick={() => handleClick('search')}></button>
						{guildFound}
					</div>
				);
		}
	};

	useEffect(() => {
		if (id === 'sword2') newGuildName.current.value = '';
		if (id === 'sword3') {
			guildSearchedName.current.value = '';
			setGuildFound(<></>);
		}
	}, [id]);

	return (
		<div>
			<div className={`infoPanel ${openInfoPanel ? 'open' : ''}`} style={infoPanelPosition}>
				{infoPanelContent()}
			</div>

			<PopUp openPopup={openPopup} setOpenPopup={setOpenPopup}>
				{popupContent}
			</PopUp>
		</div>
	);
};
