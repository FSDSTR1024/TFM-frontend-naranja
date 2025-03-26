import { Button } from '../Button/Button';
import { UserAPI } from '../../../api/user';
import { GlobalContext } from '../../Context/GlobalContext';
import { useContext, useState, useRef, useEffect } from 'react';
import { PopUp } from '../PopUp/PopUp';
import { isValidEmail } from '../../Utils/helper';

import './LoginForm.css';

export const LoginForm = ({ navigate, formData, loginFormState, loginFormAnimationEndType, handleAnimationEnd, handleChange }) => {
	const globalContext = useContext(GlobalContext);
	const [openPopup, setOpenPopup] = useState(false);
	const [popupContent, setPopupContent] = useState('');
	const emailInput = useRef(null);
	const passwordInput = useRef(null);

	const handleFormButtonClick = (e) => {
		e.preventDefault();

		if (formData.email === '' || formData.password === '') {
			setOpenPopup(true);
			setPopupContent('All fields are required');
		} else if (!isValidEmail(formData.email)) {
			setOpenPopup(true);
			setPopupContent('Invalid email format');
		} else {
			UserAPI.login(formData)
				.then((response) => {
					if (response.status === 200) {
						globalContext.setUserInfo({
							id: response.data.id,
							guilds: response.data.guilds,
							username: response.data.username,
							profileImage: response.data.profileImage ? response.data.profileImage : 'https://res.cloudinary.com/guild-tasks/image/upload/v1739385954/defaultProfileImage_vzujwf.png',
						});

						navigate('/guild');
					}
				})
				.catch(() => {
					setOpenPopup(true);
					setPopupContent('Wrong email or password');
				});
		}
	};

	useEffect(() => {
		emailInput.current.focus();
		emailInput.current.value = '';
		passwordInput.current.value = '';
	}, [loginFormState]);

	return (
		<div>
			<form style={loginFormState} className="form" id="loginForm" onAnimationEnd={() => handleAnimationEnd(loginFormAnimationEndType)}>
				<div className="inputContainer" id="loginInputContainer">
					<div className="InputBackground LoginInputBackground">
						<input type="text" spellCheck="false" name="email" id="emailLogin" placeholder="Email" ref={emailInput} className="Input" onChange={(event) => handleChange(event)} />
					</div>
					<div className="InputBackground LoginInputBackground">
						<input type="password" spellCheck="false" name="password" id="passwordLogin" placeholder="Password" ref={passwordInput} className="Input" required={true} onChange={(event) => handleChange(event)} />
					</div>
					<Button text="Login" backgroundImage="/assets/Sprites/Button_Blue_3Slides.png" top="470px" left="50%" onClick={(e) => handleFormButtonClick(e)}></Button>
				</div>
			</form>

			<PopUp openPopup={openPopup} setOpenPopup={setOpenPopup}>
				{popupContent}
			</PopUp>
		</div>
	);
};
