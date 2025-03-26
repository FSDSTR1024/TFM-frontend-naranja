import { useState, useRef, useContext } from 'react';
import { GlobalContext } from '../../Context/GlobalContext';
import { UserAPI } from '../../../api/user';
import { CloudinaryAPI } from '../../../api/cloudinary';
import { Button } from '../Button/Button';
import { useNavigate } from 'react-router-dom';
import { Settings } from '../Settings/Settings';

import './Profile.css';

export const Profile = () => {
	const navigate = useNavigate();
	const [openProfilePanel, setOpenProfilePanel] = useState(false);
	const fileInputRef = useRef(null);
	const globalContext = useContext(GlobalContext);

	const handleProfileButtonClick = () => {
		setOpenProfilePanel(!openProfilePanel);
	};

	const handleProfileImageChange = (e) => {
		CloudinaryAPI.uploadImage(e.target.files[0]).then((url) => {
			UserAPI.changeProfileImage(url, globalContext.userInfo.id).then((response) => {
				if (response.status === 200) {
					globalContext.setUserInfo({ ...globalContext.userInfo, profileImage: response.data.profileImage });
				}
			});
		});
	};

	const logOut = (type) => {
		switch (type) {
			case 'user':
				globalContext.logout();
				navigate('/');
				break;
			case 'guild':
				globalContext.logOutGuild();
				navigate('/guild');
				break;
		}
	};

	return (
		<div>
			<img id="profileImageButton" src={globalContext.userInfo.profileImage} onClick={() => handleProfileButtonClick()} />

			<div id="profilePanel" className={openProfilePanel ? 'open' : ''}>
				<div className="profileImageContainer">
					<img id="profileImage" src={globalContext.userInfo.profileImage} />
					<Button text="Change" backgroundImage="/assets/Sprites/Button_Blue_3Slides.png" top="225px" left="50%" onClick={() => fileInputRef.current.click()}></Button>
					<input id="profileImageInput" type="file" accept="image/*" ref={fileInputRef} onChange={(e) => handleProfileImageChange(e)} />
				</div>
				<Button text="Logout" backgroundImage="/assets/Sprites/Button_Red_3Slides.png" top="325px" left="50%" onClick={() => logOut('user')}></Button>
				<Button text="Logout Guild" backgroundImage="/assets/Sprites/Button_Red_3Slides.png" top="400px" left="50%" onClick={() => logOut('guild')}></Button>
				<Settings></Settings>
			</div>
		</div>
	);
};
