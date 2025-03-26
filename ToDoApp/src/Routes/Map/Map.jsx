import { useState, useRef, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigateLogo } from '../../Components/NavigateLogo/NavigateLogo';
import { Profile } from '../../Components/Profile/Profile';
import { GuildMembers } from '../../Components/GuildMembers/GuildMembers';
import { Button } from '../../Components/Button/Button';
import { KingdomsAPI } from '../../../api/kingdoms';
import { GuildsAPI } from '../../../api/guilds';
import { GlobalContext } from '../../Context/GlobalContext';
import { PopUp } from '../../Components/PopUp/PopUp';
import { MouseRight } from '../../MouseRight/MouseRight';

import './Map.css';

export const Map = () => {
	const globalContext = useContext(GlobalContext);
	const navigate = useNavigate();

	const [kingdoms, setKingdoms] = useState([]);
	const [mouseRightClick, setMouseRightClick] = useState({ top: '0px', left: '0px', display: 'none' });

	const [appear, setAppear] = useState(false);
	const kingdomName = useRef(null);
	const kingdomSelected = useRef(null);
	const [isEditing, setIsEditing] = useState(false);
	const [idKingdomToEdit, setIdKingdomToEdit] = useState('');
	const [openPopup, setOpenPopup] = useState(false);
	const [popupContent, setPopupContent] = useState(<></>);
	const [backgroundImagesToSave, setBackgroundImagesToSave] = useState({});

	useEffect(() => {
		setKingdoms([...globalContext.kingdomsInfo, 0]);
	}, []);

	const kingdomSelectionList = [
		{
			backgroundImage: "url('/assets/Sprites/redPreview.gif')",
			staticBackgroundImage: "url('/assets/Sprites/redPreview.png')",
		},
		{
			backgroundImage: "url('/assets/Sprites/bluePreview.gif')",
			staticBackgroundImage: "url('/assets/Sprites/bluePreview.png')",
		},
		{
			backgroundImage: "url('/assets/Sprites/purplePreview.gif')",
			staticBackgroundImage: "url('/assets/Sprites/purplePreview.png')",
		},
		{
			backgroundImage: "url('/assets/Sprites/yellowPreview.gif')",
			staticBackgroundImage: "url('/assets/Sprites/yellowPreview.png')",
		},
	];

	const initKingdomSelection = () => {
		setAppear(true);
		if (kingdomSelected.current !== null) {
			kingdomSelected.current.style.scale = '1';
			kingdomSelected.current = null;
		}
		kingdomName.current.value = '';
	};

	const handleKingdomClick = (e, kingdomId) => {
		if (e.target.id === 'newKingdom') {
			initKingdomSelection();
		} else {
			navigate(`/kingdom/${kingdomId}`);
		}
	};

	const handleKingdomRightClick = (e, id) => {
		e.preventDefault();
		if (e.target.id !== 'newKingdom') {
			initKingdomSelection();
			setIsEditing(true);
			setIdKingdomToEdit(id);
		}
	};

	const handleKingdomSelectionClick = (e, staticBackgroundImage) => {
		if (kingdomSelected.current !== null) {
			kingdomSelected.current.style.scale = '1';
		}
		kingdomSelected.current = e.target;
		e.target.style.scale = '1.2';

		setBackgroundImagesToSave({ backgroundImage: staticBackgroundImage, hoverBackgroundImage: e.target.style.backgroundImage });
	};

	const handleButtonClick = (type) => {
		switch (type) {
			case 'save':
				if (kingdomName.current.value !== '' && kingdomSelected.current !== null) {
					if (isEditing) {
						KingdomsAPI.updateKingdom(idKingdomToEdit, kingdomName.current.value, backgroundImagesToSave.backgroundImage, backgroundImagesToSave.hoverBackgroundImage).then((response) => {
							if (response.status === 200) {
								for (let i = 0; i < globalContext.kingdomsInfo.length; i++) {
									if (globalContext.kingdomsInfo[i]._id === idKingdomToEdit) {
										globalContext.kingdomsInfo[i].kingdomName = kingdomName.current.value;
										globalContext.kingdomsInfo[i].backgroundImage = backgroundImagesToSave.backgroundImage;
										globalContext.kingdomsInfo[i].hoverBackgroundImage = backgroundImagesToSave.hoverBackgroundImage;
									}
								}
								setKingdoms([...globalContext.kingdomsInfo, 0]);
								setIsEditing(false);
								setAppear(false);
							}
						});
					} else {
						KingdomsAPI.registerKingdom(kingdomName.current.value, backgroundImagesToSave.backgroundImage, backgroundImagesToSave.hoverBackgroundImage).then((response) => {
							if (response.status === 200) {
								let kingdom = response.data.kingdom;
								GuildsAPI.registerKingdomInGuild(globalContext.guildInfo.guildname, response.data.kingdom._id).then((response) => {
									if (response.status === 200) {
										globalContext.setKingdomsInfo([...globalContext.kingdomsInfo, { _id: kingdom._id, kingdomName: kingdomName.current.value, backgroundImage: backgroundImagesToSave.backgroundImage, hoverBackgroundImage: backgroundImagesToSave.hoverBackgroundImage, tasks: [] }]);
										setKingdoms([...globalContext.kingdomsInfo, { _id: kingdom._id, kingdomName: kingdomName.current.value, backgroundImage: backgroundImagesToSave.backgroundImage, hoverBackgroundImage: backgroundImagesToSave.hoverBackgroundImage }, 0]);
										setAppear(false);
									}
								});
							}
						});
					}
				} else {
					setOpenPopup(true);
					setPopupContent('Design and Name are required');
				}

				break;
			case 'cancel':
				if (isEditing) {
					setIsEditing(false);
				}
				setAppear(false);
				break;
			case 'delete':
				KingdomsAPI.deleteKingdom(idKingdomToEdit).then(({ response, kingdoms }) => {
					if (response.status === 200) {
						globalContext.setKingdomsInfo(kingdoms);
						setKingdoms([...kingdoms, 0]);
						GuildsAPI.deleteKingdomFromGuild(globalContext.guildInfo.guildname, idKingdomToEdit).then((response) => {
							if (response.status === 200) {
								setIsEditing(false);
								setAppear(false);
							}
						});
					}
				});
		}
	};

	return (
		<div>
			<NavigateLogo></NavigateLogo>

			<div id="mapBody">
				<div id="kingdomsContainer">
					{kingdoms.map((kingdom, index) => (
						<div key={index} className="kingdomContainer">
							<div
								className="kingdom"
								id={`${index === kingdoms.length - 1 ? 'newKingdom' : ''}`}
								style={{ backgroundImage: kingdom.backgroundImage }}
								onMouseEnter={(e) => {
									if (e.currentTarget === e.target) e.target.style.backgroundImage = kingdom.hoverBackgroundImage;
									if (index !== kingdoms.length - 1) setMouseRightClick((prev) => ({ ...prev, display: 'flex' }));
								}}
								onMouseLeave={(e) => {
									if (e.currentTarget === e.target) e.target.style.backgroundImage = kingdom.backgroundImage;
									if (index !== kingdoms.length - 1) setMouseRightClick((prev) => ({ ...prev, display: 'none' }));
								}}
								onMouseMove={(e) => {
									if (index !== kingdoms.length - 1)
										setMouseRightClick((prev) => ({
											...prev,
											top: `${e.nativeEvent.clientY - 50}px`,
											left: `${e.nativeEvent.clientX - 10}px`,
										}));
								}}
								onClick={(e) => handleKingdomClick(e, kingdom._id)}
								onContextMenu={(e) => handleKingdomRightClick(e, kingdom._id)}
							>
								{index === kingdoms.length - 1 ? '' : <input className="KingdomNameInput" type="text" maxLength={16} readOnly={true} value={kingdom.kingdomName} />}
							</div>
						</div>
					))}
				</div>
			</div>

			<MouseRight mouseRightClick={mouseRightClick} text={'EDIT'}></MouseRight>

			<div id="KingdomSelectionContainer" className={`${appear ? 'appear' : ''}`}>
				<div id="AppearContainer" className={`${appear ? 'appear' : ''}`}>
					{isEditing ? <h1 style={{ color: 'white' }}>Editing Kingdom</h1> : <h1 style={{ color: 'white' }}>Creating Kingdom</h1>}

					<div id="KingdomSelectionBg">
						{kingdomSelectionList.map((kingdom, index) => (
							<div key={index} className="KingdomItem" style={{ backgroundImage: kingdom.backgroundImage }} onClick={(e) => handleKingdomSelectionClick(e, kingdom.staticBackgroundImage)}></div>
						))}
					</div>

					<input id="KingdomNameInput" type="text" style={{ top: '120px' }} placeholder="Kingdom Name" maxLength={16} ref={kingdomName} />

					<div>
						<Button
							text=""
							backgroundImage="/assets/Sprites/saveButton.png"
							backgroundImageHover="/assets/Sprites/saveButtonHover.png"
							backgroundImageHoverAnimation="/assets/Sprites/menuButtonHoverAnimation2.png"
							width="64px"
							height="64px"
							widthHoverAnimation="96px"
							heightHoverAnimation="96px"
							top="95%"
							left="48%"
							onClick={() => handleButtonClick('save')}
						></Button>
						<Button
							text=""
							backgroundImage="/assets/Sprites/cancelButton.png"
							backgroundImageHover="/assets/Sprites/cancelButtonHover.png"
							backgroundImageHoverAnimation="/assets/Sprites/menuButtonHoverAnimation2.png"
							width="64px"
							height="64px"
							widthHoverAnimation="96px"
							heightHoverAnimation="96px"
							top="95%"
							left="52%"
							onClick={() => handleButtonClick('cancel')}
						></Button>

						{isEditing ? <Button text="Delete" backgroundImage="/assets/Sprites/Button_Red_3Slides.png" top="90%" left="90%" onClick={() => handleButtonClick('delete')}></Button> : ''}
					</div>
				</div>
			</div>

			<Profile></Profile>

			<GuildMembers></GuildMembers>

			<PopUp openPopup={openPopup} setOpenPopup={setOpenPopup}>
				{popupContent}
			</PopUp>
		</div>
	);
};
